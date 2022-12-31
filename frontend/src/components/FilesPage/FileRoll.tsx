import { FileListHistoryProps } from "../../Utils/FileTypes";

const FileRoll = (props: FileListHistoryProps) => {
  return (
    <div className="w-full">
      <div className="flex">
        <div className="flex flex-col items-center pt-2">
          <div className="rounded-full bg-navigationIconColor w-3 h-3"></div>
          <div className="h-2"></div>
          <div className="bg-navigationIconColor w-[2px] h-full"></div>
        </div>
        <div className="pl-2">
          <div className="text-textColor dark:text-textColor-dark">
            {props.date.toLocaleDateString()}
          </div>
          {props.files.map((file) => (
            <img
              className="h-[120px] inline-block pt-2"
              src={file.imageLink}
              alt={file.name}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default FileRoll;
