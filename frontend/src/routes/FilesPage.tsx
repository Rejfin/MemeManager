import FileRoll from '../components/files_page/FileRoll';
import SearchComponent from '../components/files_page/SearchComponent';
import useFetch from '../hooks/useFetch';
import noMemesImg from '../assets/no-memes.webp';
import logo from '../assets/logo.webp';
import { Meme } from '../models/meme.model';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { closeModal, openModal } from '../features/modal/modalSlice';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import Button from '../components/global/Button';

const FilesPage = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const searchTags = useAppSelector((state) => state.search.tags);
  const isUnindexedList = useAppSelector((state) => state.search.isUnindexed);

  const [listOfFiles, setListOfFiles] = useState<Map<string, Meme[]>>(new Map());
  const listInnerRef = useRef<HTMLInputElement | null>(null);

  const [url, setUrl] = useState(`/memes?limit=20&page=0&countUnindexed=1&unindexed=0`);

  const urlParams = new Map<string, string>();
  urlParams.set('limit', '20');
  urlParams.set('page', '0');
  urlParams.set('countUnindexed', '1');
  urlParams.set('unindexed', '0');

  // eslint-disable-next-line  @typescript-eslint/no-explicit-any
  const latestMemes: { error: string; isPending: boolean; data: any } = useFetch(url);

  const updateUrl = (forceRefresh = false) => {
    setUrl(
      `/memes?limit=${urlParams.get('limit')}&page=${urlParams.get('page')}&countUnindexed=${urlParams.get(
        'countUnindexed',
      )}&unindexed=${isUnindexedList ? '1' : '0'}${
        searchTags.length > 0 && !isUnindexedList ? `&tags=${searchTags.map((x) => x.id).join(',')}` : ''
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
              urlParams.set('page', latestMemes.data.nextPage.toString());
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
        //setUnindexedCount(latestMemes.data.unindexedAmount);
      }
    }
    // eslint-disable-next-line
  }, [latestMemes.data]);

  /**
   * Props needed to setup modal responsible for uploading files
   */
  const modalProps = {
    onUploadEnds: () => {
      dispatch(closeModal());
      setListOfFiles(new Map());
      urlParams.set('page', '0');
      updateUrl(true);
    },
    negativeButton: {
      text: t('cancel'),
      func: () => {
        dispatch(closeModal());
      },
    },
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
            urlParams.set('unindexed', isUnindexedList ? '1' : '0');
            urlParams.set('page', latestMemes.data.nextPage);
            updateUrl();
          }
        }
      }, 150);
    }
  };

  /**
   * runs when user change from all meme to unindexed only and back
   */
  useEffect(() => {
    setListOfFiles(new Map());
    urlParams.set('unindexed', isUnindexedList ? '1' : '0');
    urlParams.set('page', '0');
    updateUrl();
  }, [isUnindexedList]);

  const fileClickHandler = (
    fileId: string,
    src: string,
    width: number,
    height: number,
    type: string,
    blurhash?: string,
  ) => {
    dispatch(
      openModal({
        fileId: fileId,
        src: src,
        width: width,
        height: height,
        blurhash: blurhash,
        type: type,
        onClose: () => dispatch(closeModal()),
      }),
    );
  };

  /**
   * run every time search tags list changed
   */
  useEffect(() => {
    setListOfFiles(new Map());
    urlParams.set('page', '0');
    updateUrl();
  }, [searchTags]);

  return (
    <div className='flex-row h-full bg-backgroundSurface dark:bg-backgroundSurface-dark rounded-md p-4'>
      <div className='pb-4 flex max-w-full'>
        <SearchComponent className='w-auto h-auto' />
        <Button onClick={() => dispatch(openModal(modalProps))} className='min-w-fit max-h-[3.25rem] ms-2'>
          {t('files.addMeme')}
        </Button>
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
