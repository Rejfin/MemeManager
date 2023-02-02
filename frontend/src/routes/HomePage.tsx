import RecentFileList from '../components/home_page/RecentFileList';
import StorageStats from '../components/home_page/StorageStats';
import useFetch from '../hooks/useFetch';

const HomePage = () => {
  // eslint-disable-next-line  @typescript-eslint/no-explicit-any
  const latestMemes: { error: any; isPending: boolean; data: any } = useFetch('/memes?latest=1');

  return (
    <div className='bg-background dark:bg-background-dark grid md:grid-cols-3 lg:grid-cols-4 h-full'>
      <div className='flex md:col-span-2 lg:col-span-3 p-2 max-h-[calc(100vh-1rem)]'>
        {latestMemes.data && <RecentFileList files={latestMemes.data} />}
      </div>
      <div className='p-2 flex max-h-[calc(100vh-1rem)]'>
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
