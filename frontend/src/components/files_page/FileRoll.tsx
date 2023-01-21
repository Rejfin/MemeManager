import { FileListHistoryProps } from "../../utils/fileTypes";

const FileRoll = (props: FileListHistoryProps) => {
  const baseUrl = process.env.REACT_APP_API_ADDRESS
  return (
    <div className="w-full">
      <div className="flex">
        <div className="flex flex-col items-center pt-2">
          <div className="rounded-full bg-navigationIconColor w-3 h-3 mb-2"></div>
          <div className="bg-navigationIconColor w-[2px] h-full"></div>
        </div>
        <div className="pl-2">
          <div className="text-textColor dark:text-textColor-dark">
            {new Intl.DateTimeFormat(window.navigator.language).format(props.date)}
          </div>
          {props.files.map((file) => (
            <img
              key={file.id}
              className="h-[130px] inline-block py-2 pr-3"
              src={`${baseUrl}/memes/file/${file.id}`}
              alt={file.name}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default FileRoll;