import FileRoll from "../components/FilesPage/FileRoll";
import SearchComponent from "../components/FilesPage/SearchComponent";
import { FileData } from "../Utils/FileTypes";

const listOfFiles = [
  {
    id: "asd",
    name: "test1 asd as das das dasd asd asd asd ",
    size: 1235,
    createdDate: new Date(2022, 11, 12),
    imageLink: "https://i.imgur.com/nu4swVQ.jpeg",
  } as FileData,
  {
    id: "asd",
    name: "test2",
    size: 1235,
    createdDate: new Date(2022, 11, 12),
    imageLink: "https://i.imgur.com/b9NyUGm.png",
  } as FileData,
  {
    id: "asd",
    name: "test3",
    size: 1235,
    createdDate: new Date(2022, 11, 12),
    imageLink: "https://i.imgur.com/nu4swVQ.jpeg",
  } as FileData,
  {
    id: "asd",
    name: "test4",
    size: 1235,
    createdDate: new Date(2022, 11, 12),
    imageLink: "https://i.imgur.com/b9NyUGm.png",
  } as FileData,
  {
    id: "asd",
    name: "test5",
    size: 1235,
    createdDate: new Date(2022, 11, 12),
    imageLink: "https://i.imgur.com/b9NyUGm.png",
  } as FileData,
  {
    id: "asd",
    name: "test1 asd as das das dasd asd asd asd ",
    size: 1235,
    createdDate: new Date(2022, 11, 12),
    imageLink: "https://i.imgur.com/nu4swVQ.jpeg",
  } as FileData,
  {
    id: "asd",
    name: "test2",
    size: 1235,
    createdDate: new Date(2022, 11, 12),
    imageLink: "https://i.imgur.com/b9NyUGm.png",
  } as FileData,
  {
    id: "asd",
    name: "test3",
    size: 1235,
    createdDate: new Date(2022, 11, 12),
    imageLink: "https://i.imgur.com/nu4swVQ.jpeg",
  } as FileData,
  {
    id: "asd",
    name: "test4",
    size: 1235,
    createdDate: new Date(2022, 11, 12),
    imageLink: "https://i.imgur.com/b9NyUGm.png",
  } as FileData,
  {
    id: "asd",
    name: "test5",
    size: 1235,
    createdDate: new Date(2022, 11, 12),
    imageLink: "https://i.imgur.com/b9NyUGm.png",
  } as FileData,
  {
    id: "asd",
    name: "test1 asd as das das dasd asd asd asd ",
    size: 1235,
    createdDate: new Date(2022, 11, 12),
    imageLink: "https://i.imgur.com/nu4swVQ.jpeg",
  } as FileData,
  {
    id: "asd",
    name: "test2",
    size: 1235,
    createdDate: new Date(2022, 11, 12),
    imageLink: "https://i.imgur.com/b9NyUGm.png",
  } as FileData,
  {
    id: "asd",
    name: "test3",
    size: 1235,
    createdDate: new Date(2022, 11, 12),
    imageLink: "https://i.imgur.com/nu4swVQ.jpeg",
  } as FileData,
  {
    id: "asd",
    name: "test4",
    size: 1235,
    createdDate: new Date(2022, 11, 12),
    imageLink: "https://i.imgur.com/b9NyUGm.png",
  } as FileData,
  {
    id: "asd",
    name: "test5",
    size: 1235,
    createdDate: new Date(2022, 11, 12),
    imageLink: "https://i.imgur.com/b9NyUGm.png",
  } as FileData,
  {
    id: "asd",
    name: "test1 asd as das das dasd asd asd asd ",
    size: 1235,
    createdDate: new Date(2022, 11, 12),
    imageLink: "https://i.imgur.com/nu4swVQ.jpeg",
  } as FileData,
  {
    id: "asd",
    name: "test2",
    size: 1235,
    createdDate: new Date(2022, 11, 12),
    imageLink: "https://i.imgur.com/b9NyUGm.png",
  } as FileData,
  {
    id: "asd",
    name: "test3",
    size: 1235,
    createdDate: new Date(2022, 11, 12),
    imageLink: "https://i.imgur.com/nu4swVQ.jpeg",
  } as FileData,
  {
    id: "asd",
    name: "test4",
    size: 1235,
    createdDate: new Date(2022, 11, 12),
    imageLink: "https://i.imgur.com/b9NyUGm.png",
  } as FileData,
  {
    id: "asd",
    name: "test5",
    size: 1235,
    createdDate: new Date(2022, 11, 12),
    imageLink: "https://i.imgur.com/b9NyUGm.png",
  } as FileData,
];

const FilesPage = () => {
  return (
    <>
      <div className="flex-auto h-full bg-backgroundSurface dark:bg-backgroundSurface-dark rounded-md m-2 p-4">
        <div>
          <SearchComponent/>
        </div>

        <FileRoll files={listOfFiles} date={new Date(2022, 11, 12)} />
        <FileRoll files={listOfFiles} date={new Date(2022, 11, 13)} />
      </div>
    </>
  );
};

export default FilesPage;
