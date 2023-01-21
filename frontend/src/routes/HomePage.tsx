import RecentFileList from "../components/home_page/RecentFileList";
import StorageStats from "../components/home_page/StorageStats";
import useFetch from "../hooks/useFetch";
import { Meme } from "../models/meme.model";

const listOfRecentFiles:Meme[] = []

const HomePage = () => {
  const latestMemes: { error: any, isPending:any, data: any } = useFetch('/memes?latest=1')
  
  return (
    <div className="bg-background dark:bg-background-dark grid md:grid-cols-3 lg:grid-cols-4">
      <div className="flex md:col-span-2 lg:col-span-3 p-2">
        {latestMemes.data && 
        <RecentFileList files={latestMemes.data}/>
        }
        
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
