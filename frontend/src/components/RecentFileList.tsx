export interface FileData {
  id: string;
  name: string;
  size: number;
  createdDate: Date;
  imageLink: string;
}

interface FileListProps {
  files: FileData[];
}

const ListItem = (props: FileData) => {
  return (
    <li className="grid grid-cols-4 md:grid-cols-7 py-3 content-center content-justify">
      <div className="h-10 block ml-auto mr-auto">
        <img
          className="justify-center block ml-auto mr-auto h-10"
          src={props.imageLink}
        />
      </div>
      <div className="col-span-2 md:col-span-4 text-ellipsis self-center overflow-hidden whitespace-nowrap text-textColor dark:text-textColor-dark">
        {props.name}
      </div>
      <div className="hidden md:block text-center self-center text-textColor dark:text-textColor-dark">
        {props.createdDate.toLocaleDateString()}
      </div>
      <div className="hidden lg:block text-center self-center text-textColor dark:text-textColor-dark">
        {props.size}
      </div>
    </li>
  );
};

const RecentFileList = ({ files }: FileListProps) => {
  const fileList = files.map((file: FileData) => ListItem(file));
  return (
    <div className="rounded-md bg-backgroundSurface dark:bg-backgroundSurface-dark w-full shadow-md">
      <div className="p-6 text-textColor dark:text-textColor-dark text-lg font-medium">Recent Files</div>
      <ul>
        <li className="grid grid-cols-4 md:grid-cols-7 content-center content-justify">
          <div className="col-span-3 md:col-span-5 text-center self-center text-textColor dark:text-textColor-dark">
            File name
          </div>
          <div className="hidden md:block text-center self-center text-textColor dark:text-textColor-dark">Date</div>
          <div className="hidden lg:block text-center self-center text-textColor dark:text-textColor-dark">Size</div>
        </li>
        {fileList}
      </ul>
    </div>
  );
};

export default RecentFileList;
