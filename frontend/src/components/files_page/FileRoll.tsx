import { Meme } from '../../models/meme.model';
import { baseUrl } from '../../services/api';
import Image from '../global/Image';

export interface FileListHistoryProps {
  date: Date;
  files: Meme[];
  onFileClick?: (fileId: string, src: string, width: number, height: number, type: string, blurhash?: string) => void;
}

const FileRoll = (props: FileListHistoryProps) => {
  // eslint-disable-next-line  @typescript-eslint/no-explicit-any
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
              onClick={(id, src, width, height, blurhash) =>
                props.onFileClick?.(id, src, width, height, file.type, blurhash) || undefined
              }
              type={file.type}
              id={file.id}
              blurHash={file.blurHash}
              src={`${baseUrl}/api/memes/file/${file.id}`}
              alt={file.name}
              className='inline-block pr-2 cursor-pointer max-w-[180px] h-[120px] md:max-w-[250px] md:h-[150px]'
              width={file.width || 120}
              height={file.height || 150}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default FileRoll;
