import './i18n';
import BaseScreen from './routes/BaseScreen';
import { Routes, Route } from 'react-router-dom';
import HomePage from './routes/HomePage';
import FilesPage from './routes/FilesPage';
import ErrorPage from './routes/ErrorPage';
import SettingsPage from './routes/SettingsPage';
import ProfilePage from './routes/ProfilePage';
import AuthPage from './routes/AuthPage';
import InputField from './components/global/InputField';
import {ReactComponent as Icon} from './assets/icon-profile.svg'
import { useState } from 'react';

function App() {
  const [x, setX] = useState('')
  return (
    <div className='bg-background dark:bg-background-dark w-screen h-screen max-w-[100%] min-h-screen'>
      <Routes>
        <Route element={<BaseScreen />}>
          <Route index element={<HomePage />} />
          <Route path='dashboard' element={<HomePage />} />
          <Route path='files' element={<FilesPage />} />
          <Route path='profile' element={<ProfilePage />} />
          <Route path='settings' element={<SettingsPage />} />
          <Route path='*' element={<ErrorPage />} />
        </Route>
        <Route path='login' element={<AuthPage isRegisterPage={false} />} />
        <Route path='register' element={<AuthPage isRegisterPage={true} />} />
        <Route
          path='test'
          element={
            <div className='p-5'>
              <InputField
                id={'test'}
                inputType={'text'}
                placeholder={'test'}
                value={''}
                error={x}
                disabled
                onIconClick={()=>{console.log()}}
                icon={<Icon/>}
                dataList={['test', 'tes2']}
                onChange={(text) => setX('testa dahsd ajdb asd asd asd asd asd asd')}
              />
              <InputField
                id={'test2'}
                inputType={'text'}
                placeholder={'test'}
                value={''}
                onChange={(text)=>{console.log(text)}}
              />
             
            </div>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
