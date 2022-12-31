import FileRoll from "../components/FilesPage/FileRoll";
import SearchComponent from "../components/FilesPage/SearchComponent";
import { FileData } from "../Utils/FileTypes";

const listOfFiles = [
  {
    id: "10",
    name: "test1 asd as das das dasd asd asd asd ",
    size: 1235,
    createdDate: new Date(2022, 11, 12),
    imageLink: "https://i.imgur.com/nu4swVQ.jpeg",
  } as FileData,
  {
    id: "9",
    name: "test2",
    size: 1235,
    createdDate: new Date(2022, 11, 12),
    imageLink: "https://i.imgur.com/b9NyUGm.png",
  } as FileData,
  {
    id: "8",
    name: "test3",
    size: 1235,
    createdDate: new Date(2022, 11, 12),
    imageLink: "https://i.imgur.com/nu4swVQ.jpeg",
  } as FileData,
  {
    id: "7",
    name: "test4",
    size: 1235,
    createdDate: new Date(2022, 11, 12),
    imageLink: "https://i.imgur.com/b9NyUGm.png",
  } as FileData,
  {
    id: "6",
    name: "test5",
    size: 1235,
    createdDate: new Date(2022, 11, 12),
    imageLink: "https://i.imgur.com/b9NyUGm.png",
  } as FileData,
  {
    id: "5",
    name: "test1 asd as das das dasd asd asd asd ",
    size: 1235,
    createdDate: new Date(2022, 11, 12),
    imageLink: "https://i.imgur.com/nu4swVQ.jpeg",
  } as FileData,
  {
    id: "4",
    name: "test2",
    size: 1235,
    createdDate: new Date(2022, 11, 12),
    imageLink: "https://i.imgur.com/b9NyUGm.png",
  } as FileData,
  {
    id: "3",
    name: "test3",
    size: 1235,
    createdDate: new Date(2022, 11, 12),
    imageLink: "https://i.imgur.com/nu4swVQ.jpeg",
  } as FileData,
  {
    id: "2",
    name: "test4",
    size: 1235,
    createdDate: new Date(2022, 11, 12),
    imageLink: "https://i.imgur.com/b9NyUGm.png",
  } as FileData,
  {
    id: "1",
    name: "test5",
    size: 1235,
    createdDate: new Date(2022, 11, 12),
    imageLink: "https://i.imgur.com/b9NyUGm.png",
  } as FileData,
];

const FilesPage = () => {
  return (
    <>
      <div className="flex-row h-full bg-backgroundSurface dark:bg-backgroundSurface-dark rounded-md p-4">
        <div className="pb-4">
          <SearchComponent />
        </div>
        <div className="h-[calc(100%-3.5rem)] overflow-y-auto">
          <FileRoll files={listOfFiles} date={new Date(2022, 11, 12)} />
          <FileRoll files={listOfFiles} date={new Date(2022, 11, 13)} />
          <FileRoll files={listOfFiles} date={new Date(2022, 11, 14)} />
          <FileRoll files={listOfFiles} date={new Date(2022, 11, 15)} />
        </div>
      </div>
    </>
  );
};

export default FilesPage;
