interface FileTypeStats {
  name: string;
  count: number;
  image?: React.SVGProps<SVGElement>;
  className?: string;
}

const FileTypeStatCard = (props: FileTypeStats) => {
  return (
    <>
      <div className={props.className}>
        <div className='border-2 border-primary-200 rounded-lg flex justify-center h-19 min-h-full'>
          <div className='p-3 grid grid-cols-2 place-items-center'>
            <>
              {props.image}
              <div className='grid-rows-2'>
                <div className='flex items-center text-textColor dark:text-textColor-dark'>{props.name}</div>
                <div className='flex items-center text-textColor dark:text-textColor-dark text-opacity-60 dark:text-opacity-60 text-xs'>
                  count: {props.count}
                </div>
              </div>
            </>
          </div>
        </div>
      </div>
    </>
  );
};

export default FileTypeStatCard;
