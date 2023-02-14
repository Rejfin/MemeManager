import { forwardRef, KeyboardEvent } from 'react';

type InputFieldType = 'text' | 'password' | 'email' | 'number';

interface InputFieldProps {
  id: string;
  inputType: InputFieldType;
  placeholder: string;
  value: string;
  className?: string;
  error?: string;
  disabled?: boolean;
  dataList?: string[];
  autocomplete?: string;
  onChange: (value: string) => void;
  onEnter?: () => void;
}

const InputField = forwardRef<HTMLInputElement, InputFieldProps>((props, ref) => {
  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Enter') {
      props.onEnter?.();
    }
  };

  return (
    <div className='flex flex-col w-full'>
      <div className={props.error ?? 'relative'}>
        <input
          disabled={props.disabled}
          ref={ref}
          list='tag-list'
          autoComplete={props.autocomplete || 'off'}
          type={props.inputType}
          id={props.id}
          className={
            props.className
              ? props.className
              : `border text-base rounded-lg block w-full p-4 ${
                  props.error
                    ? ' border-errorColor placeholder-errorColor focus:outline-errorColor'
                    : ' border-inputBorderColor placeholder-inputBorderColor focus:outline-primary-500'
                }`
          }
          placeholder={props.placeholder}
          onChange={(element) => props.onChange(element.target.value)}
          value={props.value}
          onKeyDown={handleKeyDown}
        />
        <datalist id='tag-list'>
          {props.dataList?.map((tagName) => (
            <option key={tagName} value={tagName} />
          ))}
        </datalist>
        {props.error && (
          <p className={`text-sm text-errorColor ${props.error ?? 'absolute left-0 right-0 bottom-0 top-14'}`}>
            {props.error}
          </p>
        )}
      </div>
    </div>
  );
});

InputField.displayName = 'InpuField';

export default InputField;
