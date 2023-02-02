import { FileListHistoryProps } from '../../utils/fileTypes';
import Image from '../global/Image';

const FileRoll = (props: FileListHistoryProps) => {
  const baseUrl = process.env.REACT_APP_API_ADDRESS;
  return (
    <div className='w-full'>
      <div className='flex'>
        <div className='flex flex-col items-center pt-2'>
          <div className='rounded-full bg-navigationIconColor w-3 h-3 mb-2'></div>
          <div className='bg-navigationIconColor w-[2px] h-full'></div>
        </div>
        <div className='pl-2'>
          <div className='text-textColor dark:text-textColor-dark'>
            {new Intl.DateTimeFormat(window.navigator.language).format(props.date)}
          </div>
          {props.files.map((file) => (
            <Image
              key={file.id}
              blurHash={file.blurHash}
              src={`${baseUrl}/memes/file/${file.id}`}
              alt={file.name}
              className='inline-block pr-2 cursor-pointer max-w-[180px] h-[120px] md:max-w-[250px] md:h-[150px]'
              width={file.width}
              height={file.height}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default FileRoll;
