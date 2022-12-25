import { FileListHistoryProps } from "../../Utils/FileTypes";

const FileRoll = (props: FileListHistoryProps) => {
  return (
    <div className="w-full mt-4">
      <div className="text-textColor dark:text-textColor-dark">{props.date.toLocaleDateString()}</div>
      <div className="bg-navigationIconColor w-full h-[2px]"></div>
      {props.files.map((file) => (
        <div className="h-[120px] inline-block pt-2">
          <img className="h-[120px]" src={file.imageLink} alt={file.name} />
        </div>
      ))}
    </div>
  );
};

export default FileRoll;
