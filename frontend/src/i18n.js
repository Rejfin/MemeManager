import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

i18n.use(initReactI18next).init({
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
        cancel: 'Cancel',
        close: 'Close',
        save: 'Save',
        ok: 'OK',
        warning: 'Warning',
        somethingWentWrong: 'Something went wrong :/',
        copyToClipboard: 'Link copied to clipboard',
        storageStats: {
          title: 'Storage Statistics',
          images: 'Images',
          videos: 'Videos',
          other: 'Other',
        },
        recentFileList: {
          title: 'Recently uploaded files',
          date: 'Date',
          size: 'Size',
          name: 'File name',
        },
        navigation: {
          dashboard: 'Dashboard',
          files: 'Files',
          settings: 'Settings',
          profile: 'Profile',
          logout: 'Log Out',
          darkMode: 'Dark mode',
          lightMode: 'Light mode',
        },
        auth: {
          login: 'Login',
          logIn: 'Log in',
          register: 'Register',
          password: 'Password',
          errorTitle: 'Authentication Error',
          repeatPassword: 'Repeat password',
          dontHaveAcc: "You don't have an account?",
          createNewAccount: 'Create new',
          alreadyHaveAcc: 'You already have an account?',
          loginToShortError: 'Your login must be atleast 4 charaters',
          emptyFieldError: "This field can't be emty",
          repeatedPasswordNotMatchError: 'Your repeated password is not the same as your password',
          passwordError: 'Your password must have at least 6 characters including one special character and one number',
          authError: 'Not correct login details, make sure you have entered correct login and password',
          unexpectedAuthError: 'An unexpected problem occurred during the authorization process',
          registerError: 'There was a problem during registration, make sure your login and password meet the rules',
          userAlreadyExist: 'A user with this login already exists, if this is your account try to log into it',
          sessionExpired: 'Your session has expired. Please log in again.',
        },
        files: {
          addMeme: 'Add Meme',
          upload: 'Upload',
          browseFiles: 'Browse for file',
          orDragItHere: ' or drag it here',
          unindexed: 'unindexed memes',
          tagExistOnList: 'tag already exist on list',
          videoNotSupported: 'Video not supported',
          tagDoesNotExist: 'tag does not exist :/',
          searchForTags: 'search for tags...',
          uploading: 'uploading...',
          saving: 'saving...',
          uploaded: 'UPLOADED'
        },
        settings: {
          removeAccount: 'Remove Account',
          clearAccount: 'Clear account information',
          repairDatabase: 'Repair Database/Files',
          advancedSettings: 'Advanced Settings',
          blurhash: 'Blurhash',
          blurhashDesc: 'Blurhash is a string that represents an image in blurred form. It is used before downloading the file as a palceholder and it is generating when you send file to server (forcing enabled for now)',
          iWantIt: 'Yes I want it',
          clearAccountMessage:
            'This operation is not reversible. If you still want to clear you account, it will delete all of your files, database entries and tags that you created. Are you sure you want to clear your account?',
          removeAccountMessage:
            'This operation is not reversible. If you still want to remove your account, it will delete all associated information and files. Are you sure you want to remove your account?',
          accountHasBeenDeleted: 'Your account has been deleted',
          accountHasBeenCleared: 'Your account has been cleared.\nRemoved Memes: {{memesCount}}\nRemoved Tags: {{tagsCount}}',
          accountFailedToDelete: 'Failed to remove your account. Make sure the password you entered is correct and that you are still logged in',
          accountFailedToClean: 'Failed to clean your account. Make sure the password you entered is correct and that you are still logged in',
        },
      },
    },
  },
});

export default i18n;
