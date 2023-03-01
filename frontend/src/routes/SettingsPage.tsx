import { useTranslation } from 'react-i18next';
import AlertDialog from '../components/global/AlertDialog';
import { useModal } from '../utils/ModalProvider';
import { InputFieldType } from '../components/global/InputField';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

const SettingsPage = () => {
  const { t } = useTranslation();
  const { setModal } = useModal();
  const navigate = useNavigate();

  const onRemoveAccount = () => {
    const removeProps = {
      title: t('warning'),
      text: t('settings.removeAccountMessage'),
      positiveButton: {
        text: t('settings.iWantIt'),
        func: (text?: string) => {
          api
            .delete('/auth/deleteme', { data: { password: text } })
            .then((data) => {
              if (data.status == 200) {
                setModal(
                  <AlertDialog
                    title={''}
                    text={t('settings.accountHasBeenDeleted')}
                    positiveButton={{
                      text: t('ok'),
                      func: () => {
                        setModal(undefined);
                        navigate('/login');
                      },
                    }}
                  />,
                );
              } else {
                setModal(
                  <AlertDialog
                    title={t('somethingWentWrong')}
                    text={data.data.message}
                    positiveButton={{
                      text: t('ok'),
                      func: () => {
                        setModal(undefined);
                      },
                    }}
                  />,
                );
              }
            })
            .catch(() => {
              setModal(
                <AlertDialog
                  title={t('somethingWentWrong')}
                  text={t('settings.accountFailedToDelete')}
                  positiveButton={{
                    text: t('ok'),
                    func: () => {
                      setModal(undefined);
                    },
                  }}
                />,
              );
            });

          setModal(undefined);
        },
      },
      negativeButton: {
        text: t('cancel'),
        func: () => {
          setModal(undefined);
        },
      },
      inputField: {
        placeholder: t('auth.password'),
        inputType: 'password' as InputFieldType,
      },
    };

    setModal(<AlertDialog {...removeProps} />);
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
