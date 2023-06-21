import { useTranslation } from 'react-i18next';
import { InputFieldType } from '../components/global/InputField';
import { useNavigate } from 'react-router-dom';
import AuthService from '../services/auth.service';
import { useAppDispatch } from '../app/hooks';
import { closeModal, openModal } from '../features/modal/modalSlice';
import Button from '../components/global/Button';
import SettingsItem from '../components/settings_page/SettingsItem';
import { IAlertProps } from '../components/global/AlertDialog';

const SettingsPage = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const onRemoveOrClearAccountClick = (wantToRemove = false) => {
    // modal props that warn user about account deletion or clean
    const modalProps = {
      title: t('warning'),
      text: t(wantToRemove ? 'settings.removeAccountMessage' : 'settings.clearAccountMessage'),
      positiveButton: {
        text: t('settings.iWantIt'),
        func: (text?: string) => {
          if (wantToRemove && text) {
            removeAccount(text)
              .then((props: IAlertProps) => {
                dispatch(closeModal());
                dispatch(openModal(props));
              })
              .catch((props: IAlertProps) => {
                dispatch(openModal(props));
              });
          } else {
            cleanAccount(text || '')
              .then((props: IAlertProps) => {
                dispatch(closeModal());
                dispatch(openModal(props));
              })
              .catch((props: IAlertProps) => {
                dispatch(openModal(props));
              });
          }
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

    dispatch(openModal(modalProps));
  };

  const removeAccount = async (password: string): Promise<IAlertProps> => {
    const propsToReturn: IAlertProps = {
      title: t(''),
      text: t('settings.accountHasBeenDeleted'),
      positiveButton: {
        text: t('ok'),
        func: function (): void {
          dispatch(closeModal());
          navigate('/login');
        },
      },
    };

    return new Promise<IAlertProps>((resolve, reject) => {
      AuthService.removeAccount(password)
        .then((data) => {
          if (data.status == 200) {
            resolve(propsToReturn);
          } else {
            propsToReturn.title = t('somethingWentWrong');
            propsToReturn.text = data.data.message;
            propsToReturn.positiveButton.func = () => {
              dispatch(closeModal());
            };
            reject(propsToReturn);
          }
        })
        .catch(() => {
          propsToReturn.title = t('somethingWentWrong');
          propsToReturn.text = t('settings.accountFailedToDelete');
          propsToReturn.positiveButton.func = () => {
            dispatch(closeModal());
          };
          reject(propsToReturn);
        });
    });
  };

  const cleanAccount = async (password: string): Promise<IAlertProps> => {
    const propsToReturn: IAlertProps = {
      title: '',
      text: '',
      positiveButton: {
        text: t('ok'),
        func: function (): void {
          dispatch(closeModal());
        },
      },
    };

    return new Promise<IAlertProps>((resolve, reject) => {
      AuthService.clearAccount(password)
        .then((data) => {
          if (data.status === 200) {
            propsToReturn.text = t('settings.accountHasBeenCleared', {
              memesCount: data.data.data[0].value,
              tagsCount: data.data.data[1].value,
            });
            resolve(propsToReturn);
          } else {
            propsToReturn.title = t('somethingWentWrong');
            propsToReturn.text = data.data.message;
            propsToReturn.positiveButton.func = () => {
              dispatch(closeModal());
            };
            reject(propsToReturn);
          }
        })
        .catch(() => {
          propsToReturn.title = t('somethingWentWrong');
          propsToReturn.text = t('settings.accountFailedToClean');
          propsToReturn.positiveButton.func = () => {
            dispatch(closeModal());
          };
          reject(propsToReturn);
        });
    });
  };

  return (
    <div className='flex-row h-full bg-backgroundSurface dark:bg-backgroundSurface-dark rounded-md p-4'>
      <div className='pb-4 flex flex-col max-w-full'>
        <SettingsItem
          className='mb-7'
          title={t('settings.blurhash')}
          description={t('settings.blurhashDesc') || ''}
          isChecked={true}
          onToggleChange={() => {
            /* use it later */
          }}
        />

        <p className='text-textColor dark:text-textColor-dark'>{t('settings.advancedSettings')}</p>
        <div className='bg-secondaryTextColor w-full h-[0.1rem] rounded-md mb-3'></div>

        <Button className='w-full my-3' buttonStyle='warning' onClick={() => onRemoveOrClearAccountClick(false)}>
          {t('settings.clearAccount')}
        </Button>
        <Button className='w-full' buttonStyle='warning' onClick={() => onRemoveOrClearAccountClick(true)}>
          {t('settings.removeAccount')}
        </Button>
      </div>
    </div>
  );
};

export default SettingsPage;
