import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { ReactComponent as SearchIcon } from '../../assets/icon-search.svg';
import { addEditedTag, removeEditedTag } from '../../features/editModal/editModalSlice';
import { addTag, removeTag, switchIndexedList } from '../../features/search/searchSlice';
import useSearchTag from '../../hooks/useSearchTag';
import { Tag } from '../../models/tag.model';
import InputField from '../global/InputField';

const SearchComponent = (props: { className?: string; inEditModal?: boolean }) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const searchTags = useAppSelector((state) => state.search.tags);
  const isUnindexed = useAppSelector((state) => state.search.isUnindexed);
  const editedTags = useAppSelector((state) => state.editModal.editedTags);

  const [searchText, setSearchText] = useState('');
  const [tagErrorText, setErrorTagText] = useState('');
  const [id, setId] = useState(-1);

  const tags: { tagList: Tag[] } = useSearchTag(searchText);

  /**
   * handle search tag function
   */
  const onSearch = () => {
    /**
     * when user click enter or magnifier icon, text from input is checked
     * to see if it doesnt already exist in tags list and if not it is added,
     * otherwise an error message is dispalyed
     */
    if (props.inEditModal) {
      if (searchText !== '') {
        if (!editedTags.find((tag) => tag.name === searchText.toLowerCase())) {
          dispatch(addEditedTag({ id: id, name: searchText }));
          setId((oldId) => oldId - 1);
          setSearchText('');
          setErrorTagText('');
        } else {
          setErrorTagText(t('files.tagExistOnList') || '');
        }
      }
    } else {
      const tag = tags.tagList.find((tag) => tag.name === searchText.toLowerCase());
      if (tag) {
        const mTag = searchTags.find((t) => t.id === tag.id);
        if (!mTag) {
          dispatch(addTag(tag));
        }
        setSearchText('');
        setErrorTagText('');
      } else {
        setErrorTagText(t('files.tagDoesNotExist') || '');
      }
    }
  };

  const onTagClick = (tagToRemove: Tag) => {
    if (props.inEditModal) {
      dispatch(removeEditedTag(tagToRemove));
    } else {
      dispatch(removeTag(tagToRemove));
    }
  };

  return (
    <div className={`w-full h-full ${props.className}`}>
      <div>
        <InputField
          disabled={isUnindexed}
          id={'search'}
          placeholder={t('files.searchForTags')}
          error={tagErrorText}
          icon={<SearchIcon className='w-6 fill-navigationIconColor' />}
          value={searchText}
          dataList={tags.tagList.map((t)=>t.name)}
          onChange={(text) => {
            setSearchText(text);
          }} 
          onIconClick={() => onSearch()}
          onEnterClick={() => onSearch()}
        />
        <div className='flex-col h-fit w-full pt-2'>
          {!props.inEditModal && (
            <div className='flex items-center'>
              <label className='relative inline-block w-10 h-5'>
                <input
                  className='hidden peer'
                  type='checkbox'
                  checked={isUnindexed}
                  onChange={() => {
                    dispatch(switchIndexedList());
                  }}
                />
                <span className='absolute cursor-pointer top-0 left-0 right-0 bottom-0 bg-[#ccc] duration-300 before:absolute before:h-3 before:w-3 before:left-1 before:bottom-1 before:bg-[white] before:duration-300 peer-checked:bg-primary-500 peer-focus:shadow-md peer-checked:before:translate-x-5 rounded-[34px] before:rounded-[50%]'></span>
              </label>
              <p className='ps-3 text-textColor dark:text-textColor-dark'>{t('files.unindexed')}</p>
            </div>
          )}

          <div className={`${isUnindexed ? 'hidden' : 'flex flex-wrap'}`}>
            {!props.inEditModal &&
              searchTags.length > 0 &&
              searchTags.map((tag) => (
                <div
                  id={tag.id.toString()}
                  onClick={() => onTagClick(tag)}
                  className='bg-primary-500 text-secondaryTextColor rounded-2xl px-3 mt-2 mx-[0.15rem]'
                >
                  {tag.name}
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchComponent;
