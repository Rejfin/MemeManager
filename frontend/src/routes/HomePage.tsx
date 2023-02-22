import { useEffect, useState } from 'react';
import RecentFileList from '../components/home_page/RecentFileList';
import StorageStats from '../components/home_page/StorageStats';
import useFetch from '../hooks/useFetch';

interface statsData {
  sizes: { total?: number; video?: number; image?: number; other?: number };
  counts: { total?: number; video?: number; image?: number; other?: number };
}

const HomePage = () => {
  // eslint-disable-next-line  @typescript-eslint/no-explicit-any
  const latestMemes: { error: any; isPending: boolean; data: any } = useFetch('/memes?limit=10&page=0&latest=1');

  // eslint-disable-next-line  @typescript-eslint/no-explicit-any
  const statsData: { data: any; isPending: boolean; error: any } = useFetch('memes/stats');

  const [stats, setStats] = useState<statsData | null>(null);

  useEffect(() => {
    if (statsData.data) {
      let sizeTotal = 0;
      let countTotal = 0;

      Object.keys(statsData.data['sizes']).forEach((key: string) => {
        sizeTotal = sizeTotal + statsData.data['sizes'][key];
        countTotal = countTotal + statsData.data['counts'][key];
      });

      statsData.data['sizes'].total = sizeTotal;
      statsData.data['counts'].total = countTotal;
      setStats(statsData.data);
    }
  }, [statsData.data]);

  return (
    <div className='bg-background dark:bg-background-dark grid md:grid-cols-3 lg:grid-cols-4 h-full'>
      <div className='flex md:col-span-2 lg:col-span-3 p-2 max-h-[calc(100vh-1rem)]'>
        {latestMemes.data && <RecentFileList files={latestMemes.data.rows} />}
      </div>
      <div className='p-2 flex max-h-[calc(100vh-1rem)]'>
        {stats && (
          <StorageStats
            storageSize={stats['sizes']['total'] || 0}
            imageSize={stats['sizes']['image'] || 0}
            videoSize={stats['sizes']['video'] || 0}
            otherSize={stats['sizes']['other'] || 0}
            videoCount={stats['counts']['image'] || 0}
            imageCount={stats['counts']['video'] || 0}
            otherCount={stats['counts']['other'] || 0}
          />
        )}
      </div>
    </div>
  );
};
export default HomePage;
