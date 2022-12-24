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
          }
        }
      }
    }
  });

  export default i18n;