interface AlertProps {
  title: string;
  text: string;
  positiveButton: {
    text: string;
    func: () => void;
  };
  negativeButton?: {
    text: string;
    func: () => void;
  };
}

const AlertDialog = (props: AlertProps) => {
  return (
    <div className='absolute flex items-center justify-center w-full h-full bg-textColor bg-opacity-60 z-50'>
      <div className='min-w-[20rem] min-h-[10rem] max-w-xl bg-backgroundSurface dark:bg-backgroundSurface-dark rounded-md flex flex-col overflow-hidden'>
        <div className='m-6 flex flex-col items-center'>
          <h2 className='text-2xl text-textColor dark:text-textColor-dark text-center'>{props.title}</h2>
          <p className='text-textColor dark:text-textColor-dark my-4 text-center'>{props.text}</p>
        </div>
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
            onClick={props.positiveButton.func}
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
