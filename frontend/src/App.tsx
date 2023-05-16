import './i18n';
import BaseScreen from './routes/BaseScreen';
import { Routes, Route } from 'react-router-dom';
import HomePage from './routes/HomePage';
import FilesPage from './routes/FilesPage';
import ErrorPage from './routes/ErrorPage';
import SettingsPage from './routes/SettingsPage';
import AuthPage from './routes/AuthPage';
import Button from './components/global/Button';
import { ReactComponent as Icon } from './assets/icon-files.svg';

function App() {
  return (
    <div className='bg-background dark:bg-background-dark w-screen h-screen max-w-[100%] min-h-screen'>
      <Routes>
        <Route element={<BaseScreen />}>
          <Route index element={<HomePage />} />
          <Route path='dashboard' element={<HomePage />} />
          <Route path='files' element={<FilesPage />} />
          <Route path='settings' element={<SettingsPage />} />
          <Route path='*' element={<ErrorPage />} />
        </Route>
        <Route path='login' element={<AuthPage isRegisterPage={false} />} />
        <Route path='register' element={<AuthPage isRegisterPage={true} />} />
        <Route
          path='test'
          element={
            <div className='p-5'>
              <Button icon={<Icon />}>Test</Button>
            </div>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
