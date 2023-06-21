import ToggleButton from '../global/ToggleButton';

interface ISettingsItemProps {
  title: string;
  className?: string;
  description?: string;
  onClick?: () => void;
  onToggleChange?: () => void;
  isChecked?: boolean;
}

const SettingsItem = (props: ISettingsItemProps) => {
  return (
    <div className={props.className}>
      <div className='flex w-full items-center'>
        <div className='w-full h-fit'>
          <p className='text-textColor dark:text-textColor-dark text-lg font-medium whitespace-nowrap overflow-hidden text-ellipsis'>
            {props.title}
          </p>
          <p
            className={`${
              props.description && 'block'
            } text-secondaryTextColor dark:text-secondaryTextColor-dark w-full text-sm overflow-hidden leading-5 max-h-10`}
          >
            {props.description}
          </p>
        </div>
        {props.onToggleChange && (
          <ToggleButton
            isChecked={props.isChecked || false}
            onChange={() => {
              if (props.onToggleChange) {
                props.onToggleChange();
              }
            }}
          />
        )}
      </div>
    </div>
  );
};

export default SettingsItem;
