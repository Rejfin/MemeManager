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

        <div className='bg-backgroundSurface-dark dark:bg-background-dark bg-opacity-40 w-full h-[2px] mt-6'></div>
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
