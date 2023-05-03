import { useTranslation } from 'react-i18next';
import { InputFieldType } from '../components/global/InputField';
import { useNavigate } from 'react-router-dom';
import AuthService from '../services/auth.service';
import { useAppDispatch } from '../app/hooks';
import { closeModal, openModal } from '../features/modal/modalSlice';

const SettingsPage = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const onRemoveAccount = () => {
    const modalProps = {
      title: '',
      text: t('settings.accountHasBeenDeleted'),
      positiveButton: {
        text: t('ok'),
        func: () => {
          dispatch(closeModal());
          navigate('/login');
        },
      },
    };

    const removeProps = {
      title: t('warning'),
      text: t('settings.removeAccountMessage'),
      positiveButton: {
        text: t('settings.iWantIt'),
        func: (text?: string) => {
          AuthService.removeAccount(text!)
            .then((data) => {
              if (data.status == 200) {
                dispatch(closeModal());
                dispatch(openModal(modalProps));
              } else {
                modalProps.title = t('somethingWentWrong');
                modalProps.text = data.data.message;
                modalProps.positiveButton.func = () => {
                  dispatch(closeModal());
                };

                dispatch(openModal(modalProps));
              }
            })
            .catch(() => {
              const mProps = {
                ...modalProps,
                positiveButton: { ...modalProps.positiveButton },
              };
              mProps.title = t('somethingWentWrong');
              mProps.text = t('settings.accountFailedToDelete');
              mProps.positiveButton.func = () => {
                dispatch(closeModal());
              };
              dispatch(openModal(mProps));
            });
        },
      },
      negativeButton: {
        text: t('cancel'),
        func: () => {
          dispatch(closeModal());
        },
      },
      inputField: {
        placeholder: t('auth.password'),
        inputType: 'password' as InputFieldType,
        validationFunction: (text: string): [boolean, string?] => {
          return text ? [true] : [false, t('auth.emptyFieldError') || ''];
        },
      },
    };

    dispatch(openModal(removeProps));
  };

  return (
    <div className='flex-row h-full bg-backgroundSurface dark:bg-backgroundSurface-dark rounded-md p-4'>
      <div className='pb-4 flex flex-col max-w-full'>
        <button
          onClick={onRemoveAccount}
          className='w-full bg-errorColor rounded-md p-2 text-textColor-dark bg-opacity-60 flex justify-center hover:bg-opacity-50'
        >
          remove account
        </button>
      </div>
    </div>
  );
};

export default SettingsPage;
