import { ReactElement, ReactNode, MouseEvent } from 'react';

type ButtonType = 'submit' | 'button' | 'reset' | undefined;
type ButtonStyle = 'default' | 'warning';

interface IButtonProps {
  children?: ReactNode;
  className?: string;
  icon?: ReactElement;
  type?: ButtonType;
  buttonStyle?: ButtonStyle;
  disabled?: boolean;
  onClick?: (e: MouseEvent) => void;
}

const Button = (props: IButtonProps) => {
  const buttonStyle: ButtonStyle = props.buttonStyle || 'default';
  let buttonColors: string = '';
  let buttonTextColors: string = '';
  if (props.disabled) {
    buttonColors = 'bg-disableColor dark:bg-opacity-40 border-disableColor dark:border-opacity-0'
    buttonTextColors = 'text-textColor text-opacity-40 dark:text-opacity-50'
  } else if (buttonStyle == 'default') {
    buttonColors = 'bg-primary-500 outline-primary-600 hover:bg-backgroundSurface border-primary-500';
    buttonTextColors = 'text-textColor-dark group-hover:text-primary-500';
  } else {
    buttonColors = 'bg-errorColor outline-errorColor hover:bg-backgroundSurface border-errorColor';
    buttonTextColors = 'text-textColor-dark group-hover:text-errorColor';
  }

  return (
    
    <button
      disabled={props.disabled}
      onClick={(e) => props.onClick?.(e)}
      type={props.type}
      className={`${props.className} ${buttonColors} text-textColor group rounded-md w-fit p-1 px-2 align-bottom transition duration-200 border-2`}
    >
      <div className='flex items-center'>
        {props.icon ?? props.icon}
        <p className={`${buttonTextColors} w-full transition duration-200 ${props.icon && 'ps-2'}`}>{props.children}</p>
      </div>
    </button>
  );
};

export default Button;
