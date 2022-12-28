import RecentFileList from "../components/HomePage/RecentFileList";
import StorageStats from "../components/HomePage/StorageStats";
import { FileData } from "../Utils/FileTypes";

const listOfRecentFiles = [
  {
    id: "1",
    name: "test1 asd as das das dasd asd asd asd ",
    size: 1235,
    createdDate: new Date(2022,11, 12),
    imageLink: "https://i.imgur.com/nu4swVQ.jpeg"
  } as FileData,
  {
    id: "2",
    name: "test2",
    size: 1235,
    createdDate: new Date(2022,11, 12),
    imageLink: "https://i.imgur.com/b9NyUGm.png"
  } as FileData,
  {
    id: "3",
    name: "test3",
    size: 1235,
    createdDate: new Date(2022,11, 12),
    imageLink: "https://i.imgur.com/nu4swVQ.jpeg"
  } as FileData,
  {
    id: "4",
    name: "test4",
    size: 1235,
    createdDate: new Date(2022,11, 12),
    imageLink: "https://i.imgur.com/b9NyUGm.png"
  } as FileData,
  {
    id: "5",
    name: "test5",
    size: 1235,
    createdDate: new Date(2022,11, 12),
    imageLink: "https://i.imgur.com/b9NyUGm.png"
  } as FileData
]

const HomePage = () => {
  return (
    <div className="bg-background dark:bg-background-dark grid md:grid-cols-3 lg:grid-cols-4">
      <div className="flex md:col-span-2 lg:col-span-3 p-2">
        <RecentFileList files={listOfRecentFiles}/>
      </div>
      <div className="p-2 flex">
        <StorageStats
          storageSize={98756432}
          imageSize={13756432}
          videoSize={8356432}
          gifSize={4356432}
          otherSize={2256432}
        />
      </div>
    </div>
  );
};
export default HomePage;
