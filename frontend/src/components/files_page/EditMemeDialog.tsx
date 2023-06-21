import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { useAppSelector } from '../../app/hooks';
import { removeEditedTag, setEditedTags, setIsSaving, setOriginalTags } from '../../features/editModal/editModalSlice';
import useFetch from '../../hooks/useFetch';
import { Tag } from '../../models/tag.model';
import FileService from '../../services/file.service';
import Image from '../global/Image';
import SearchComponent from './SearchComponent';
import { ReactComponent as DownloadIcon } from '../../assets/icon-download.svg';
import { ReactComponent as InfoIcon } from '../../assets/icon-info.svg';
import { ReactComponent as ShareIcon } from '../../assets/icon-share.svg';
import FileInfoComponent from './FileInfoComponent';

export interface IEditMemeDialogProps {
  fileId: string;
  src: string;
  width: number;
  height: number;
  type: string;
  blurhash?: string;
  onClose: () => void;
}

const EditMemeDialog = (props: IEditMemeDialogProps) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const originalTags = useAppSelector((state) => state.editModal.originalTags);
  const editedTags = useAppSelector((state) => state.editModal.editedTags);
  const isSaving = useAppSelector((state) => state.editModal.isSaving);
  const [showInfo, setShowInfo] = useState(false);
  const [copyInfo, setCopyInfo] = useState(false);

  const [areTagArraysSame, setAreTagArraysSame] = useState(false);
  // eslint-disable-next-line  @typescript-eslint/no-explicit-any
  const memeData: { data: any; isPending: boolean; error: string } = useFetch(`/memes/${props.fileId}`);

  /**
   * set list of tags when they are available
   */
  useEffect(() => {
    if (!memeData.isPending && memeData.data.data.tags) {
      dispatch(setOriginalTags(memeData.data.data.tags));
      dispatch(setEditedTags(memeData.data.data.tags));
    }
  }, [memeData.data, memeData.isPending]);

  useEffect(() => {
    areEquals(editedTags, originalTags);
  }, [editedTags]);

  /**
   * when user clicked on save button first two list are compared
   * if they have same tags inside then modal is just closed without any request to api
   * if they have not same tags inside then request with updated list is sended to the api
   */
  const onSave = () => {
    if (originalTags === editedTags || memeData.isPending) {
      props.onClose();
    } else {
      dispatch(setIsSaving(true));
      FileService.updateTags(props.fileId, editedTags).then((data) => {
        dispatch(setOriginalTags(data.data.data.tags));
        dispatch(setEditedTags(data.data.data.tags));
        dispatch(setIsSaving(false));
      });
    }
  };

  const areEquals = (tagArray1: Tag[], tagArray2: Tag[]): boolean => {
    if (tagArray1.length !== tagArray2.length) {
      setAreTagArraysSame(false);
      return false;
    }
    for (const el1 of tagArray1) {
      if (!tagArray2.some((el2) => el1.id === el2.id && el1.name === el2.name)) {
        setAreTagArraysSame(false);
        return false;
      }
    }
    setAreTagArraysSame(true);
    return true;
  };

  const onDownloadClick = async () => {
    if (memeData.data) {
      try {
        const url = !props.type.startsWith('video') ? props.src : props.src + '?o=1';
        const response = await fetch(url);

        const blob = await response.blob();
        const blobURL = window.URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = blobURL;
        link.download = memeData.data.data.originalName;
        link.click();

        window.URL.revokeObjectURL(blobURL);
      } catch (error) {
        console.error('Error downloading the file:', error);
      }
    }
  };

  const onInfoClick = () => {
    setShowInfo((state) => !state);
  };

  const onShareClick = async () => {
    navigator.clipboard.writeText(props.src);
    setCopyInfo(true);
    setTimeout(() => {
      setCopyInfo(false);
    }, 1200);
  };

  return (
    <div className='min-w-[20rem] min-h-[10rem] w-4/5 max-w-xl bg-backgroundSurface dark:bg-backgroundSurface-dark rounded-md flex flex-col overflow-hidden'>
      <div className='m-6 flex flex-col items-center justify-center'>
        {props.type.startsWith('image') || !props.type.startsWith('video') ? (
          <Image
            id={props.fileId}
            src={props.src}
            width={props.width}
            type={props.type}
            height={props.height}
            blurHash={props.blurhash}
            className={'h-80 max-w-full'}
          />
        ) : (
          <video src={props.src + '?o=1'} autoPlay controls poster={props.src} className='h-80 max-w-full'>
            {t('files.videoNotSupported')}
          </video>
        )}
        <div className='flex w-full justify-end relative mt-3'>
          <p className='text-ellipsis whitespace-nowrap overflow-hidden w-full me-4 text-textColor dark:text-textColor-dar dark:text-textColor-dark'>
            {memeData.data ? memeData.data.data.originalName : ''}
          </p>
          <div>
            <div
              className={`absolute z-[60] w-[calc(100%-5.5rem)] right-[5.5rem] -bottom-[7.5rem] left-auto origin-bottom-right -translate-y-full transition duration-500 ${
                showInfo ? ' scale-100 opacity-100' : 'scale-0 opacity-0'
              }`}
            >
              {memeData.data ? (
                <FileInfoComponent
                  className='max-w-full'
                  {...memeData.data.data}
                  name={memeData.data.data.originalName}
                />
              ) : (
                ''
              )}
            </div>
            <InfoIcon
              className={`w-6 h-6 cursor-pointer dark:fill-navigationIconColor ${
                memeData.data ? 'opacity-100 cursor-pointer ' : 'opacity-20'
              }`}
              onClick={() => onInfoClick()}
            />
          </div>

          <div>
            <div
              className={`absolute z-[60] right-1 left-auto origin-bottom-right -translate-y-full transition duration-500 ${
                copyInfo ? ' scale-100 opacity-100' : 'scale-0 opacity-0'
              }`}
            >
              <div className='bg-backgroundSurface dark:bg-backgroundSurface-dark p-1 rounded-md text-ellipsis whitespace-nowrap overflow-hidden text-textColor dark:text-textColor-dark'>
                {t('copyToClipboard')}
              </div>
            </div>
            <ShareIcon
              className='w-6 h-6 mx-4 cursor-pointer dark:fill-navigationIconColor'
              onClick={() => onShareClick()}
            />
          </div>

          <DownloadIcon
            className={`w-8 h-6 dark:fill-navigationIconColor ${
              memeData.data ? 'opacity-100 cursor-pointer ' : 'opacity-20'
            }`}
            onClick={() => onDownloadClick()}
          />
        </div>
        <div className='bg-backgroundSurface-dark dark:bg-background-dark bg-opacity-40 w-full h-[2px] mt-3'></div>
        <div className='w-full my-2 flex flex-wrap'>
          {editedTags.map((tag) => (
            <div
              onClick={() => dispatch(removeEditedTag(tag))}
              key={tag.id}
              className='bg-primary-500 text-textColor-dark cursor-pointer rounded-2xl px-3 mt-2 mx-[0.15rem]'
            >
              {tag.name}
            </div>
          ))}
        </div>
        <SearchComponent inEditModal={true} />
        <div className='flex flex-row pt-4 justify-between w-full'>
          {!areTagArraysSame && !memeData.isPending && (
            <button
              onClick={props.onClose}
              className='bg-primary-500 text-textColor-dark rounded-lg py-2 w-40 max-w-[10rem] mr-auto'
            >
              {t('close')}
            </button>
          )}

          <button
            disabled={isSaving}
            onClick={onSave}
            className='bg-primary-500 text-textColor-dark rounded-lg py-2 w-40 max-w-[10rem] ml-auto disabled:bg-inputBorderColor'
          >
            {!areTagArraysSame && !memeData.isPending ? t('save') : t('close')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditMemeDialog;
