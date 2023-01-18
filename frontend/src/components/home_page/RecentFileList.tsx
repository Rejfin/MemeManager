import { useTranslation } from "react-i18next";
import useFetch from "../../hooks/useFetch";
import { Meme } from "../../models/meme.model";
import { FileListProps } from "../../utils/fileTypes";
import { convertSize } from "../../utils/sizeConverter"

const ListItem = (props: Meme, secondBackground: boolean) => {
  const baseUrl = process.env.REACT_APP_API_ADDRESS
  return (
    <li key={props.id} className={"grid grid-cols-4 md:grid-cols-7 py-3 mx-4 content-center content-justify" + (secondBackground ? " bg-background dark:bg-background-dark" : "")}>
      <div className={"h-10 block ml-auto mr-auto" }>
        <img
          className="justify-center block ml-auto mr-auto h-10"
          alt={props.name}
          src={`${baseUrl}/memes/file/${props.id}`}
        />
      </div>
      <div className="col-span-2 md:col-span-4 text-ellipsis self-center overflow-hidden whitespace-nowrap text-textColor dark:text-textColor-dark">
        {props.originalName}
      </div>
      <div className="hidden md:block text-center self-center text-textColor dark:text-textColor-dark">
        {new Date(props.uploadDate).toLocaleDateString()}
      </div>
      <div className="hidden lg:block text-center self-center text-textColor dark:text-textColor-dark">
        {convertSize(props.size)}
      </div>
    </li>
  );
};

const RecentFileList = ({ files }: FileListProps) => {
  const { t } = useTranslation()
  const fileList = files.map((file: Meme, index: number) => ListItem(file, index % 2 === 0));
  return (
    <div className="rounded-md bg-backgroundSurface dark:bg-backgroundSurface-dark w-full shadow-md">
      <div className="p-6 text-textColor dark:text-textColor-dark text-lg font-medium">{t('recentFileList.title')}</div>
      <ul>
        <li key={"listTitle"} className="grid grid-cols-4 md:grid-cols-7 py-3 mx-4 content-center content-justify">
          <div className="col-span-3 md:col-span-5 text-center self-center text-textColor dark:text-textColor-dark">
          {t('recentFileList.name')}
          </div>
          <div className="hidden md:block text-center self-center text-textColor dark:text-textColor-dark">{t('recentFileList.date')}</div>
          <div className="hidden lg:block text-center self-center text-textColor dark:text-textColor-dark">{t('recentFileList.size')}</div>
        </li>
        {fileList}
      </ul>
    </div>
  );
};

export default RecentFileList;
