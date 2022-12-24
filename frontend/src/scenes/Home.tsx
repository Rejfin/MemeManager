import RecentFileList from "../components/RecentFileList";
import StorageStats from "../components/StorageStats";
import { FileData } from "../components/RecentFileList";
import SideNavigation from "../components/SideNavigation";

const listOfRecentFiles = [
  {
    id: "asd",
    name: "test1 asd as das das dasd asd asd asd ",
    size: 1235,
    createdDate: new Date(2022,11, 12),
    imageLink: "https://i.imgur.com/nu4swVQ.jpeg"
  } as FileData,
  {
    id: "asd",
    name: "test2",
    size: 1235,
    createdDate: new Date(2022,11, 12),
    imageLink: "https://i.imgur.com/b9NyUGm.png"
  } as FileData,
  {
    id: "asd",
    name: "test3",
    size: 1235,
    createdDate: new Date(2022,11, 12),
    imageLink: "https://i.imgur.com/nu4swVQ.jpeg"
  } as FileData,
  {
    id: "asd",
    name: "test4",
    size: 1235,
    createdDate: new Date(2022,11, 12),
    imageLink: "https://i.imgur.com/b9NyUGm.png"
  } as FileData,
  {
    id: "asd",
    name: "test5",
    size: 1235,
    createdDate: new Date(2022,11, 12),
    imageLink: "https://i.imgur.com/b9NyUGm.png"
  } as FileData,
  {
    id: "asd",
    name: "test6",
    size: 1235,
    createdDate: new Date(2022,11, 12),
    imageLink: "https://i.imgur.com/b9NyUGm.png"
  } as FileData
]

const home = () => {
  return (
    <div className="grid md:grid-cols-4">
      <div className="flex bg-primary-300">
        <SideNavigation/>
      </div>
      <div className=" flex md:col-span-2 p-2">
        <RecentFileList files={listOfRecentFiles}/>
      </div>
      <div className="p-2 min-w-[200px]">
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
export default home;
