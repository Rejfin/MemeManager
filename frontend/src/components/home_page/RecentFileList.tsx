import { useTranslation } from 'react-i18next';
import { Meme } from '../../models/meme.model';
import { convertSize } from '../../utils/sizeConverter';
import Image from '../global/Image';

export interface FileListProps {
  files: Meme[];
  onFileClick: (file: Meme) => void;
}

/**
 * Crates entry element for list of recent files
 */
const ListItem = (props: Meme, secondBackground: boolean, onFileClick: (file: Meme) => void) => {
  // eslint-disable-next-line  @typescript-eslint/no-explicit-any
  const baseUrl = (window as any).env.API_ADDRESS;
  return (
    <li
      onClick={() => onFileClick(props)}
      key={props.id}
      className={
        'grid grid-cols-4 cursor-pointer md:grid-cols-7 py-3 mx-4 content-center content-justify' +
        (secondBackground ? ' bg-background dark:bg-background-dark' : '')
      }
    >
      <div className={'h-10 block text-center'}>
        <Image
          id={props.id}
          className='justify-center self-center text-center block h-10 max-w-[80px]'
          src={`${baseUrl}/memes/file/${props.id}`}
          alt={props.name}
          type={props.type}
          width={props.width || 60}
          height={props.height || 40}
          blurHash={props.blurHash}
        />
      </div>
      <div className='col-span-2 md:col-span-4 text-ellipsis self-center overflow-hidden whitespace-nowrap text-textColor dark:text-textColor-dark'>
        {props.originalName}
      </div>
      <div className='hidden md:block text-center self-center text-textColor dark:text-textColor-dark'>
        {new Intl.DateTimeFormat(window.navigator.language).format(new Date(props.uploadDate))}
      </div>
      <div className='hidden lg:block text-center self-center text-textColor dark:text-textColor-dark'>
        {convertSize(props.size)}
      </div>
    </li>
  );
};

const RecentFileList = (props: FileListProps) => {
  const { t } = useTranslation();
  const fileList = props.files?.map((file: Meme, index: number) =>
    ListItem(file, index % 2 === 0, (file: Meme) => props.onFileClick(file)),
  );
  return (
    <div className='rounded-md bg-backgroundSurface dark:bg-backgroundSurface-dark w-full h-full shadow-md overflow-y-auto'>
      <div className='p-6 text-textColor dark:text-textColor-dark text-lg font-medium'>{t('recentFileList.title')}</div>
      <ul>
        <li key={'listTitle'} className='grid grid-cols-4 md:grid-cols-7 py-3 mx-4 content-center content-justify'>
          <div className='col-span-3 md:col-span-5 text-center self-center text-textColor dark:text-textColor-dark'>
            {t('recentFileList.name')}
          </div>
          <div className='hidden md:block text-center self-center text-textColor dark:text-textColor-dark'>
            {t('recentFileList.date')}
          </div>
          <div className='hidden lg:block text-center self-center text-textColor dark:text-textColor-dark'>
            {t('recentFileList.size')}
          </div>
        </li>
        {fileList}
      </ul>
    </div>
  );
};

export default RecentFileList;
