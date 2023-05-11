import { useState } from 'react';
import InputField, { InputFieldType } from './InputField';

export interface IAlertProps {
  title: string;
  text: string;
  positiveButton: {
    text: string;
    func: (text?: string) => void;
  };
  negativeButton?: {
    text: string;
    func: () => void;
  };
  inputField?: {
    onChange?: (value: string) => void;
    inputType?: InputFieldType;
    placeholder?: string;
    validationFunction?: (text: string) => [boolean, string?];
  };
}

const AlertDialog = (props: IAlertProps) => {
  const [inputValue, setInputValue] = useState('');
  const [inputError, setInputError] = useState('');

  const handleInputChange = (text: string) => {
    setInputValue(text);
    props.inputField?.onChange?.(text);
  };

  const handlePositiveClick = () => {
    if (props.inputField?.validationFunction) {
      const [isValid, errorText] = props.inputField?.validationFunction?.(inputValue) || [false, 'input error'];
      if (isValid) {
        props.positiveButton.func(inputValue);
      } else {
        setInputError(errorText || '');
      }
    } else {
      props.positiveButton.func(inputValue);
    }
  };

  return (
    <div className='absolute flex items-center justify-center w-full h-full bg-textColor bg-opacity-60 z-50'>
      <div className='min-w-[20rem] min-h-[10rem] max-w-xl bg-backgroundSurface dark:bg-backgroundSurface-dark rounded-md flex flex-col overflow-hidden'>
        <div className='m-6 flex flex-col items-center'>
          <h2 className='text-2xl text-textColor dark:text-textColor-dark text-center'>{props.title}</h2>
          <p className='text-textColor dark:text-textColor-dark my-4 text-center whitespace-pre-line'>{props.text}</p>
        </div>
        {props.inputField && (
          <div className='w-full flex justify-center px-4 pb-4'>
            <InputField
              id={'input'}
              inputType={props.inputField.inputType || 'text'}
              placeholder={props.inputField.placeholder || ''}
              value={inputValue}
              onChange={handleInputChange}
              error={inputError}
            />
          </div>
        )}
        <div className='w-full flex mt-auto min-h-[3rem] items-center justify-center'>
          {props.negativeButton && (
            <button
              onClick={props.negativeButton.func}
              className='w-fit rounded-md bg-primary-300 mb-4 mr-2 py-1 px-9 text-textColor-dark'
            >
              {props.negativeButton.text}
            </button>
          )}
          <button
            onClick={() => handlePositiveClick()}
            className='w-fit rounded-md bg-primary-600 mb-4 ml-2 py-1 px-9 text-textColor-dark'
          >
            {props.positiveButton.text}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AlertDialog;
