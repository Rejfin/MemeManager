import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import useFetch from '../../hooks/useFetch';
import useSearchTag from '../../hooks/useSearchTag';
import { Tag } from '../../models/tag.model';
import api from '../../services/api';
import Image from '../global/Image';
import SearchComponent from './SearchComponent';

interface EditMemeDialogProps {
  fileId: string;
  src: string;
  width: number;
  height: number;
  type: string;
  blurhash?: string;
  onClose: () => void;
}

const EditMemeDialog = (props: EditMemeDialogProps) => {
  const { t } = useTranslation();
  const [tagText, setTagText] = useState('');
  const [tagList, setTagList] = useState<Tag[]>([]);
  const [editedTagList, setEditedTagList] = useState<Tag[]>([]);
  const [id, setId] = useState(-1);
  const [newTagError, setNewTagError] = useState<string>('');
  const [isSaving, setIsSaving] = useState(false);

  // eslint-disable-next-line  @typescript-eslint/no-explicit-any
  const memeData: { data: any; isPending: boolean; error: any } = useFetch(`/memes/${props.fileId}`);

  const tags: { tagList: Tag[] } = useSearchTag(tagText);

  /**
   * set list of tags when they are available
   */
  useEffect(() => {
    if (!memeData.isPending && memeData.data.tags) {
      setEditedTagList(memeData.data.tags);
      setTagList(memeData.data.tags);
    }
  }, [memeData.data, memeData.isPending]);

  const onTextChange = (text: string) => {
    setTagText(text);
  };

  /**
   * when user click enter or magnifier icon, text from input is checked
   * to see if it doesnt already exist in tags list and if not it is added,
   * otherwise an error message is dispalyed
   */
  const onSearch = (text: string) => {
    if (text !== '') {
      if (!editedTagList.find((tag) => tag.name === text.toLowerCase())) {
        setEditedTagList((oldList) => [...oldList, { id: id, name: text }]);
        setId((oldId) => oldId - 1);
        setTagText('');
        setNewTagError('');
      } else {
        setNewTagError(t('files.tagExistOnList') || '');
      }
    }
  };

  const removeTag = (tagId: number) => {
    setEditedTagList((oldList) => oldList.filter((tag) => tag.id !== tagId));
  };

  /**
   * when user clicked on save button first two list are compared
   * if they have same tags inside then modal is just closed without any request to api
   * if they have not same tags inside then request with updated list is sended to the api
   */
  const onSave = () => {
    if (tagList === editedTagList || memeData.isPending) {
      props.onClose();
    } else {
      setIsSaving(true);
      api.put(`memes/${props.fileId}`, { tags: editedTagList }).then((data) => {
        setTagList(data.data.tags);
        setEditedTagList(data.data.tags);
        setIsSaving(false);
      });
    }
  };

  return (
    <div className='min-w-[20rem] min-h-[10rem] w-4/5 max-w-xl bg-backgroundSurface dark:bg-backgroundSurface-dark rounded-md flex flex-col overflow-hidden'>
      <div className='m-6 flex flex-col items-center justify-center'>
        {props.type.startsWith('image') ? (
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
        <div className='w-full my-2'>
          {editedTagList.map((tag) => (
            <div
              onClick={() => removeTag(tag.id)}
              key={tag.id}
              className='px-2 bg-primary-400 rounded-lg ml-2 mt-2 inline-block cursor-pointer'
            >
              {tag.name}
            </div>
          ))}
        </div>
        <SearchComponent
          disabled={isSaving}
          placeholder='add tag'
          onSearch={onSearch}
          onChange={onTextChange}
          value={tagText}
          error={newTagError}
          dataList={tags.tagList.map((x) => x.name)}
        />
        <div className='flex flex-row pt-4 justify-between w-full'>
          {tagList !== editedTagList && !memeData.isPending && (
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
            {tagList !== editedTagList && !memeData.isPending ? t('save') : t('close')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditMemeDialog;
