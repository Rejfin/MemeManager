import { useRef } from 'react';
import { ReactComponent as SearchIcon } from '../../assets/icon-search.svg';
import InputField from '../global/InputField';

const SearchComponent = (props: {
  value: string;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  dataList?: string[];
  onSearch?: (text: string) => void;
  onChange?: (text: string) => void;
}) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  return (
    <div>
      <div className='relative'>
        <InputField
          ref={inputRef}
          className='outline-none focus:outline-2 focus:border-b-2 text-textColor dark:text-textColor-dark border-navigationIconColor bg-background dark:bg-background-dark rounded-md focus:rounded-b-none p-2 pr-12'
          id={'search'}
          inputType={'text'}
          placeholder={props.placeholder || 'Search..'}
          value={props.value}
          error={props.error}
          disabled={props.disabled}
          onChange={(text) => {
            props.onChange?.(text);
          }}
          onEnter={() => props.onSearch?.(inputRef.current?.value || '')}
          dataList={props.dataList}
        />
        <SearchIcon
          onClick={() => !props.disabled && props.onSearch?.(inputRef.current?.value || '')}
          className={`w-6 inline-block absolute right-4 top-2 mb-1 fill-navigationIconColor dark:fill-textColor-dark opacity-60 ${
            props.onSearch && !props.disabled && 'cursor-pointer'
          }`}
        />
      </div>
    </div>
  );
};

export default SearchComponent;
