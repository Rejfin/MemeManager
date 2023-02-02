import { Outlet } from 'react-router-dom';
import SideNavigation from '../components/global/SideNavigation';
import '../App.css';

const BaseScreen = () => {
  return (
    <div className='bg-background dark:bg-background-dark h-full min-h-full overflow-y-auto flex flex-col md:flex-row'>
      <SideNavigation />
      <div className='bg-background dark:bg-background-dark h-full min-h-full flex-1 p-3'>
        <Outlet />
      </div>
    </div>
  );
};

export default BaseScreen;
