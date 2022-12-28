import FileRoll from "../components/FilesPage/FileRoll";
import SearchComponent from "../components/FilesPage/SearchComponent";
import { FileData } from "../Utils/FileTypes";

const listOfFiles = [
  {
    id: "20",
    name: "test1 asd as das das dasd asd asd asd ",
    size: 1235,
    createdDate: new Date(2022, 11, 12),
    imageLink: "https://i.imgur.com/nu4swVQ.jpeg",
  } as FileData,
  {
    id: "19",
    name: "test2",
    size: 1235,
    createdDate: new Date(2022, 11, 12),
    imageLink: "https://i.imgur.com/b9NyUGm.png",
  } as FileData,
  {
    id: "18",
    name: "test3",
    size: 1235,
    createdDate: new Date(2022, 11, 12),
    imageLink: "https://i.imgur.com/nu4swVQ.jpeg",
  } as FileData,
  {
    id: "17",
    name: "test4",
    size: 1235,
    createdDate: new Date(2022, 11, 12),
    imageLink: "https://i.imgur.com/b9NyUGm.png",
  } as FileData,
  {
    id: "16",
    name: "test5",
    size: 1235,
    createdDate: new Date(2022, 11, 12),
    imageLink: "https://i.imgur.com/b9NyUGm.png",
  } as FileData,
  {
    id: "15",
    name: "test1 asd as das das dasd asd asd asd ",
    size: 1235,
    createdDate: new Date(2022, 11, 12),
    imageLink: "https://i.imgur.com/nu4swVQ.jpeg",
  } as FileData,
  {
    id: "14",
    name: "test2",
    size: 1235,
    createdDate: new Date(2022, 11, 12),
    imageLink: "https://i.imgur.com/b9NyUGm.png",
  } as FileData,
  {
    id: "13",
    name: "test3",
    size: 1235,
    createdDate: new Date(2022, 11, 12),
    imageLink: "https://i.imgur.com/nu4swVQ.jpeg",
  } as FileData,
  {
    id: "12",
    name: "test4",
    size: 1235,
    createdDate: new Date(2022, 11, 12),
    imageLink: "https://i.imgur.com/b9NyUGm.png",
  } as FileData,
  {
    id: "11",
    name: "test5",
    size: 1235,
    createdDate: new Date(2022, 11, 12),
    imageLink: "https://i.imgur.com/b9NyUGm.png",
  } as FileData,
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
      <div className="flex-auto h-full bg-backgroundSurface dark:bg-backgroundSurface-dark rounded-md p-4">
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
