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
          app_name: 'Meme Manager',
          storage_stats: {
              title: 'Storage Statistics',
              images: 'Images',
              videos: 'Videos',
              gifs: 'Gifs',
              other: 'Other'
          },
          recent_file_list: {
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
          }
        }
      }
    }
  });

  export default i18n;