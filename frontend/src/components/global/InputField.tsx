import { KeyboardEvent, ReactElement, useEffect, useRef } from 'react';

export type InputFieldType = 'text' | 'password' | 'email' | 'number';

interface IInputFieldProps {
  id: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
  placeholder?: string | null;
  inputType?: InputFieldType;
  error?: string;
  disabled?: boolean;
  dataList?: string[];
  icon?: ReactElement;
  autocomplete?: string;
  // eslint-disable-next-line  @typescript-eslint/no-explicit-any
  required?: any;
  focus?: boolean;
  onEnterClick?: () => void;
  onIconClick?: () => void;
}

/**
 * Custom input field that can contains icon and have error handling option
 * @param {IInputFieldProps} props
 * @returns InputField element
 */
const InputField = (props: IInputFieldProps) => {
  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Enter') {
      props.onEnterClick?.();
    }
  };
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (props.focus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [inputRef]);

  return (
    <div className='flex flex-col w-full h-full'>
      <div className={'relative transition-all duration-700'}>
        {props.icon && (
          <div
            onClick={() => props.onIconClick?.()}
            className={`absolute ${props.onIconClick && 'cursor-pointer'} top-1/2 -translate-y-1/2 mx-2`}
          >
            {props.icon}
          </div>
        )}
        <input
          ref={inputRef}
          id={props.id}
          disabled={props.disabled}
          list={`${props.id}-option-list`}
          autoComplete={props.autocomplete || 'off'}
          type={props.inputType || 'text'}
          className={`border text-base rounded-lg block w-full h-full p-4 dark:text-textColor-dark dark:bg-background-dark ${
            props.icon && 'pl-11'
          } ${
            props.error
              ? ' border-errorColor placeholder-errorColor focus:outline-errorColor'
              : ' border-inputBorderColor placeholder-inputBorderColor focus:outline-primary-500'
          } ${
            props.disabled &&
            'bg-disableColor bg-opacity-60 border-disableColor border-opacity-30 dark:bg-disableDarkColor dark:bg-opacity-30'
          } ${props.className}`}
          placeholder={props.placeholder || ''}
          onChange={(element) => props.onChange(element.target.value)}
          value={props.value}
          onKeyDown={handleKeyDown}
          required={props.required}
        />
        <datalist id={`${props.id}-option-list`}>
          {props.dataList?.map((tagName) => (
            <option key={tagName} value={tagName} />
          ))}
        </datalist>
      </div>
      <p
        className={`text-sm px-2 text-errorColor transition-all duration-200 origin- ${
          props.error ? 'scale-y-100' : ' scale-y-0'
        }`}
      >
        {props.error}
      </p>
    </div>
  );
};

export default InputField;
