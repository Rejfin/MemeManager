import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

i18n
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    debug: true,

    interpolation: {
      escapeValue: false,
    },
    resources: {
      en: {
        translation: {
          appName: 'Meme Manager',
          appDescription: 'Self hosted aplication to manage your meme collection',
          storageStats: {
              title: 'Storage Statistics',
              images: 'Images',
              videos: 'Videos',
              gifs: 'Gifs',
              other: 'Other'
          },
          recentFileList: {
              title: 'Recent files',
              date: 'Date',
              size: 'Size',
              name: 'File name'
          },
          navigation: {
              dashboard: 'Dashboard',
              files: 'Files',
              settings: 'Settings',
              profile: 'Profile',
              logout: 'Log Out',
              darkMode: 'Dark mode',
              lightMode: 'Light mode'
          },
          auth: {
            login: 'Login',
            logIn: 'Log in',
            register: 'Register',
            password: 'Password',
            repeatPassword: 'Repeat password',
            dontHaveAcc: 'You don\'t have an account?',
            createNewAccount: 'Create new',
            alreadyHaveAcc: 'You already have an account?',
          }
        }
      }
    }
  });

  export default i18n;