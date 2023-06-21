import { useEffect, useState } from 'react';
import { useAppDispatch } from '../app/hooks';
import RecentFileList from '../components/home_page/RecentFileList';
import StorageStats from '../components/home_page/StorageStats';
import { closeModal, openModal } from '../features/modal/modalSlice';
import useFetch from '../hooks/useFetch';
import { Meme } from '../models/meme.model';

interface statsData {
  sizes: { total?: number; video?: number; image?: number; other?: number };
  counts: { total?: number; video?: number; image?: number; other?: number };
}

const HomePage = () => {
  // eslint-disable-next-line  @typescript-eslint/no-explicit-any
  const baseUrl = (window as any).env.API_ADDRESS;
  const dispatch = useAppDispatch();
  // eslint-disable-next-line  @typescript-eslint/no-explicit-any
  const latestMemes: { error: string; isPending: boolean; data: any } = useFetch('/memes?latest=1');

  // eslint-disable-next-line  @typescript-eslint/no-explicit-any
  const statsData: { data: any; isPending: boolean; error: string } = useFetch('memes/stats');

  const [stats, setStats] = useState<statsData | null>(null);

  useEffect(() => {
    if (statsData.data) {
      let sizeTotal = 0;
      let countTotal = 0;

      Object.keys(statsData.data.data['sizes']).forEach((key: string) => {
        sizeTotal = sizeTotal + statsData.data.data['sizes'][key];
        countTotal = countTotal + statsData.data.data['counts'][key];
      });

      statsData.data.data['sizes'].total = sizeTotal;
      statsData.data.data['counts'].total = countTotal;
      setStats(statsData.data.data);
    }
  }, [statsData.data]);

  const fileClickHandler = (file: Meme) => {
    dispatch(
      openModal({
        fileId: file.id,
        src: `${baseUrl}/memes/file/${file.id}`,
        width: file.width,
        height: file.height,
        blurhash: file.blurHash,
        type: file.type,
        onClose: () => dispatch(closeModal()),
      }),
    );
  };

  return (
    <div className='bg-background dark:bg-background-dark grid md:grid-cols-3 lg:grid-cols-4 h-full'>
      <div className='flex md:col-span-2 lg:col-span-3 p-2 max-h-[calc(100vh-1rem)]'>
        {latestMemes.data && (
          <RecentFileList files={latestMemes.data.data.items} onFileClick={(file: Meme) => fileClickHandler(file)} />
        )}
      </div>
      <div className='p-2 flex max-h-[calc(100vh-1rem)]'>
        {stats && (
          <StorageStats
            storageSize={stats['sizes']['total'] || 0}
            imageSize={stats['sizes']['image'] || 0}
            videoSize={stats['sizes']['video'] || 0}
            otherSize={stats['sizes']['other'] || 0}
            videoCount={stats['counts']['video'] || 0}
            imageCount={stats['counts']['image'] || 0}
            otherCount={stats['counts']['other'] || 0}
          />
        )}
      </div>
    </div>
  );
};
export default HomePage;
