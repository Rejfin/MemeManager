interface IToggleButtonProps {
  isChecked: boolean;
  onChange: () => void;
  className?: string;
  isDisabled?: boolean;
}

const ToggleButton = (props: IToggleButtonProps) => {
  return (
    <div className={`${props.className} h-5`}>
      <label className='relative inline-block w-10 h-5 '>
        <input
          disabled={props.isDisabled}
          className='hidden peer'
          type='checkbox'
          checked={props.isChecked}
          onChange={() => props.onChange()}
        />
        <span className='absolute cursor-pointer top-0 left-0 right-0 bottom-0 bg-[#ccc] dark:bg-inputBorderColor dark:bg-opacity-70 duration-300 before:absolute before:h-3 before:w-3 before:left-1 before:bottom-1 before:bg-[white] before:duration-300 peer-checked:bg-primary-500 peer-focus:shadow-md peer-checked:before:translate-x-5 rounded-[34px] before:rounded-[50%]'></span>
      </label>
    </div>
  );
};

export default ToggleButton;
