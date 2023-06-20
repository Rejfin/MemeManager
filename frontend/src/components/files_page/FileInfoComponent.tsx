import { convertSize } from '../../utils/sizeConverter';

interface FileInfo {
  name: string;
  size: number;
  uploadDate: Date;
  type: string;
  height?: number;
  width?: number;
  className?: string;
}

const FileInfoComponent = (props: FileInfo) => {
  return (
    <div className={`flex flex-col w-full p-4 border-2 bg-backgroundSurface dark:bg-backgroundSurface-dark rounded-md ${props.className}`}>
      <p className='text-ellipsis whitespace-nowrap overflow-hidden text-textColor dark:text-textColor-dark'>name: {props.name}</p>
      <p className='text-ellipsis whitespace-nowrap overflow-hidden text-textColor dark:text-textColor-dark'>size: {convertSize(props.size)}</p>
      <p className='text-ellipsis whitespace-nowrap overflow-hidden text-textColor dark:text-textColor-dark'>type: {props.type}</p>
      <p className='text-ellipsis whitespace-nowrap overflow-hidden text-textColor dark:text-textColor-dark'>upload date: {new Intl.DateTimeFormat(window.navigator.language).format(new Date(props.uploadDate))}</p>
      {props.height && props.width ? <p className='text-ellipsis whitespace-nowrap overflow-hidden text-textColor dark:text-textColor-dark'>resolution: {props.width}x{props.height}</p> : ''}
    </div>
  );
};

export default FileInfoComponent;
