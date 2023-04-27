import { ReactElement, ReactNode, MouseEvent } from 'react';

type ButtonType = 'submit' | 'button' | 'reset' | undefined;

interface IButtonProps {
  children?: ReactNode;
  className?: string;
  icon?: ReactElement;
  type?: ButtonType;
  onClick?: (e: MouseEvent) => void;
}

const Button = (props: IButtonProps) => {
  return (
    <button
      onClick={(e) => props.onClick?.(e)}
      type={props.type}
      className={`group bg-primary-500 rounded-md w-fit p-1 px-2 align-bottom transition duration-200 outline-primary-600 hover:bg-background border-2 border-primary-600 ${props.className}`}
    >
      <div className='flex items-center'>
        {props.icon ?? props.icon}
        <p
          className={`text-textColor-dark w-full group-hover:text-primary-500 transition duration-200 ${
            props.icon && 'ps-2'
          }`}
        >
          {props.children}
        </p>
      </div>
    </button>
  );
};

export default Button;
