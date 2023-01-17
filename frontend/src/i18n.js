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
            loginToShortError: 'Your login must be atleast 4 charaters',
            emptyFieldError: 'This field can\'t be emty',
            repeatedPasswordNotMatchError: 'Your repeated password is not the same as your password',
            passwordError: 'Your password must have at least 6 characters including one special character and one number',
            authError: 'Not correct login details, make sure you have entered correct login and password',
            unexpectedAuthError: 'An unexpected problem occurred during the authorization process',
            registerError: 'There was a problem during registration, make sure your login and password meet the rules',
            userAlreadyExist: 'A user with this login already exists, if this is your account try to log into it',
          }
        }
      }
    }
  });

  export default i18n;