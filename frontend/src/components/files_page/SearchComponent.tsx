import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ReactComponent as SearchIcon } from '../../assets/icon-search.svg';
import InputField from '../global/InputField';

const SearchComponent = (props: {
  value: string;
  className?: string;
  placeholder?: string;
  error?: string;
  dataList?: string[];
  isUnindexed?: boolean;
  onSearch?: () => void;
  onChange?: (text: string) => void;
  onUnindexedChange?: (isUnindexed: boolean) => void
}) => {
  const { t } = useTranslation();

  return (
    <div className={`w-full h-full ${props.className}`}>
      <div>
        <InputField
          disabled={props.isUnindexed || false}
          id={'search'}
          placeholder={props.placeholder}
          error={props.error}
          icon={<SearchIcon className='w-6 fill-navigationIconColor' />}
          value={props.value}
          onChange={(text) => {
            props.onChange?.(text)
          }}
          onIconClick={()=>props.onSearch?.()}
          onEnterClick={()=>props.onSearch?.()}
        />
        <div className='flex-col h-fit w-full pt-2'>
          <div className='flex items-center'>
            <label className='relative inline-block w-10 h-5'>
              <input
                className='hidden peer'
                type='checkbox'
                checked={props.isUnindexed || false}
                onChange={(val) => {
                  props.onUnindexedChange?.(val.target.checked)
                }}
              />
              <span className='absolute cursor-pointer top-0 left-0 right-0 bottom-0 bg-[#ccc] duration-300 before:absolute before:h-3 before:w-3 before:left-1 before:bottom-1 before:bg-[white] before:duration-300 peer-checked:bg-primary-500 peer-focus:shadow-md peer-checked:before:translate-x-5 rounded-[34px] before:rounded-[50%]'></span>
            </label>
            <p className='ps-3 text-textColor dark:text-textColor-dark'>{t('files.unindexed')}</p>
          </div>
          <div className={`${props.isUnindexed ? 'hidden': 'flex flex-wrap'}`}>
            {props.dataList && props.dataList.length > 0 &&
              props.dataList.map((tag) => (
                <div id={tag} className='bg-primary-500 text-secondaryTextColor rounded-2xl px-3 mt-2 mx-[0.15rem]'>{tag}</div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchComponent;
