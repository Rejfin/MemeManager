import FileRoll from '../components/files_page/FileRoll';
import SearchComponent from '../components/files_page/SearchComponent';
import useFetch from '../hooks/useFetch';
import noMemesImg from '../assets/no-memes.webp';
import logo from '../assets/logo.webp';
import UploadMemeDialog from '../components/files_page/UploadMemeDialog';
import { Meme } from '../models/meme.model';
import { useEffect, useRef, useState } from 'react';
import { useModal } from '../utils/ModalProvider';
import { useTranslation } from 'react-i18next';
import EditMemeDialog from '../components/files_page/EditMemeDialog';
import useSearchTag from '../hooks/useSearchTag';
import { Tag } from '../models/tag.model';

const FilesPage = () => {
  const [listOfFiles, setListOfFiles] = useState<Map<string, Meme[]>>(new Map());
  const [page, setPage] = useState(0);
  const { t } = useTranslation();
  const { setModal } = useModal();
  const listInnerRef = useRef<HTMLInputElement | null>(null);
  const [searchText, setSearchText] = useState('');
  const [isIndexedList, setIsIndexedList] = useState(true);
  const [url, setUrl] = useState(`/memes?limit=20&page=${page}&countUnindexed=1&unindexed=0`);
  const [unindexedCount, setUnindexedCount] = useState(0);
  const [searchTags, setSearchTags] = useState<Tag[]>([]);
  const [tagError, setTagError] = useState('');

  const urlMap = new Map<string, string>();
  urlMap.set('limit', '20');
  urlMap.set('page', page.toString());
  urlMap.set('countUnindexed', '1');
  urlMap.set('unindexed', '0');

  // eslint-disable-next-line  @typescript-eslint/no-explicit-any
  const latestMemes: { error: any; isPending: boolean; data: any } = useFetch(url);

  const tags: { tagList: Tag[] } = useSearchTag(searchText);

  const updateUrl = (forceRefresh = false) => {
    setUrl(
      `/memes?limit=${urlMap.get('limit')}&page=${urlMap.get('page')}&countUnindexed=${urlMap.get(
        'countUnindexed',
      )}&unindexed=${urlMap.get('unindexed')}${
        searchTags.length > 0 ? `&tags=${searchTags.map((x) => x.id).join(',')}` : ''
      }${forceRefresh ? `&f=${Math.random() * 10000}` : ''}`,
    );
  };

  /**
   * Function responsible for downloading the appropriate amount of data from the api
   * runs so many times until enough data has been downloaded to
   * display the scroll bar and start infinite pagination
   */
  useEffect(() => {
    setTimeout(() => {
      if (listInnerRef && listInnerRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = listInnerRef.current;
        if (scrollHeight !== null && scrollTop !== null && clientHeight !== null) {
          if (
            !latestMemes.isPending &&
            (listInnerRef.current.scrollHeight <= listInnerRef.current.clientHeight ||
              (scrollTop + clientHeight) / scrollHeight >= 0.9)
          ) {
            if ((scrollTop + clientHeight) / scrollHeight >= 0.8) {
              setPage(latestMemes.data.nextPage);
              urlMap.set('page', latestMemes.data.nextPage.toString());
              updateUrl();
            }
          }
        }
      }
    }, 100);
    // eslint-disable-next-line
  }, [listInnerRef, listOfFiles]);

  /**
   * Function that runs every time new data is downloaded from the api
   * creates a list of files to be displayed by date
   */
  useEffect(() => {
    if (latestMemes.data != null && latestMemes.data.rows != null) {
      latestMemes.data.rows.forEach((meme: Meme) => {
        if (!listOfFiles.has(new Date(meme.modifiedDate).toDateString())) {
          listOfFiles.set(new Date(meme.modifiedDate).toDateString(), []);
        }
        const fileOfDate = listOfFiles.get(new Date(meme.modifiedDate).toDateString());
        if (fileOfDate) {
          if (!fileOfDate.find((m) => m.id === meme.id)) {
            fileOfDate.push(meme);
          }
        }
      });
      setListOfFiles(new Map(listOfFiles));

      if (latestMemes.data.unindexedAmount != null) {
        setUnindexedCount(latestMemes.data.unindexedAmount);
      }
    }
    // eslint-disable-next-line
  }, [latestMemes.data]);

  /**
   * Props needed to setup modal responsible for uploading files
   */
  const modalProps = {
    onUploadEnds: () => {
      setModal(undefined);
      setListOfFiles(new Map());
      setPage(0);
      urlMap.set('unindexed', isIndexedList ? '1' : '0');
      updateUrl(true);
    },
    negativeButton: {
      text: t('cancel'),
      func: () => {
        setModal(undefined);
      },
    },
  };

  const showUploadModal = () => {
    setModal(<UploadMemeDialog {...modalProps} />);
  };

  /**
   * Function runs every time user scroll page
   * when user is nearly end of files function will download new data if they exist
   */
  const onListScroll = () => {
    if (listInnerRef.current && !latestMemes.isPending) {
      setTimeout(() => {
        if (listInnerRef && listInnerRef.current) {
          const { scrollTop, scrollHeight, clientHeight } = listInnerRef.current;
          if ((scrollTop + clientHeight) / scrollHeight >= 0.8) {
            setPage(latestMemes.data.nextPage);

            urlMap.set('unindexed', isIndexedList ? '1' : '0');
            urlMap.set('page', page.toString());
            updateUrl();
          }
        }
      }, 150);
    }
  };

  const switchUnindexedMemes = () => {
    setPage(0);
    setListOfFiles(new Map());

    urlMap.set('unindexed', isIndexedList ? '1' : '0');
    urlMap.set('page', '0');

    if (isIndexedList) {
      setIsIndexedList(false);
      setSearchTags([]);
    } else {
      setIsIndexedList(true);
      updateUrl();
    }
  };

  const fileClickHandler = (
    fileId: string,
    src: string,
    width: number,
    height: number,
    type: string,
    blurhash?: string,
  ) => {
    setModal(
      <EditMemeDialog
        fileId={fileId}
        src={src}
        width={width}
        height={height}
        blurhash={blurhash}
        type={type}
        onClose={() => setModal(undefined)}
      />,
    );
  };

  /**
   * run every time search tags list changed
   */
  useEffect(() => {
    if (searchTags.length > 0) {
      setListOfFiles(new Map());
      urlMap.set('unindexed', '0');
      setIsIndexedList(true);
    } else {
      urlMap.set('unindexed', isIndexedList ? '0' : '1');
      urlMap.set('page', '0');
      setPage(0);
      setListOfFiles(new Map());
    }
    updateUrl();
  }, [searchTags]);

  /**
   * handle search tag function
   */
  const onSearch = () => {
    const tag = tags.tagList.find((tag) => tag.name === searchText.toLowerCase());

    if (tag) {
      const mTag = searchTags.find((t) => t.id === tag.id);
      if (!mTag) {
        setSearchTags((oldTags) => [...oldTags, tag]);
      }
      setSearchText('');
      setTagError('');
    } else {
      setTagError(t('files.tagDoesNotExist') || '');
    }
  };

  const removeSearchTag = (name: string) => {
    setSearchTags((oldTags) => [...oldTags.filter((tag) => tag.name !== name.toLowerCase())]);
  };

  return (
    <div className='flex-row h-full bg-backgroundSurface dark:bg-backgroundSurface-dark rounded-md p-4'>
      <div className='pb-4 flex max-w-full'>
        <SearchComponent
          dataList={tags.tagList.map((x) => x.name)}
          className='w-auto h-auto'
          onChange={(text) => setSearchText(text)}
          value={searchText}
          onSearch={() => onSearch()}
          error={tagError}
        />
        <button onClick={() => showUploadModal()} className='bg-primary-400 rounded-md p-2 text-backgroundSurface mx-2'>
          {t('files.addMeme')}
        </button>
        {unindexedCount > 0 && (
          <button
            onClick={switchUnindexedMemes}
            className={`bg-primary-400 rounded-md p-2 text-backgroundSurface ${!isIndexedList && 'bg-primary-300'}`}
          >
            {t('files.unindexed')}
            <div className='relative'>
              <div className='absolute bottom-5 -right-5 w-6 h-6 rounded-full bg-videoColor'>{unindexedCount}</div>
            </div>
          </button>
        )}
      </div>
      <div className='max-w-2xl my-2'>
        {searchTags.map((tag) => (
          <div
            onClick={() => removeSearchTag(tag.name)}
            key={tag.id}
            className='px-2 bg-primary-400 rounded-lg ml-2 mt-2 inline-block cursor-pointer'
          >
            {tag.name}
          </div>
        ))}
      </div>
      <div className='h-[calc(100%-3.5rem)] w-full overflow-y-auto flex-row' ref={listInnerRef} onScroll={onListScroll}>
        {latestMemes.isPending && listOfFiles.size === 0 ? (
          <div className='h-[calc(100%-3.5rem)] w-full'>
            <div className='h-[calc(100%-3.5rem)] w-full'>
              <img
                loading={'lazy'}
                className='relative m-auto top-[calc(50%-10rem)] left-0 right-0 rounded-full animate-loadingDogo'
                src={logo}
                alt='loading'
              />
            </div>
          </div>
        ) : (
          <div className='h-[calc(100%-3.5rem)] w-full'>
            {listOfFiles.size > 0 ? (
              <>
                {Array.from(listOfFiles).map((data) => (
                  <FileRoll
                    key={data[0]}
                    files={data[1]}
                    date={new Date(data[0])}
                    onFileClick={(id, src, width, height, type, blurhash) =>
                      fileClickHandler(id, src, width, height, type, blurhash)
                    }
                  />
                ))}
              </>
            ) : (
              <div className='h-[calc(100%-3.5rem)] w-full'>
                <img className='relative m-auto top-[calc(50%-10rem)] left-0 right-0' src={noMemesImg} alt='no memes' />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default FilesPage;
