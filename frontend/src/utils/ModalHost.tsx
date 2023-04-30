import type { RootState } from '../app/store';
import { useAppSelector } from '../app/hooks';
import AlertDialog, { IAlertProps } from '../components/global/AlertDialog';
import UploadMemeDialog, { IUploadMemeModalProps } from '../components/files_page/UploadMemeDialog';
import EditMemeDialog, { IEditMemeDialogProps } from '../components/files_page/EditMemeDialog';

const ModalHost = () => {
  const isModalOpen = useAppSelector((state: RootState) => state.modal.isOpen);
  const modalProps = useAppSelector((state: RootState) => state.modal.modalProps);
  return (
    <>
      {isModalOpen && (
        <div className='fixed flex items-center justify-center w-full h-full bg-textColor bg-opacity-60 z-50'>
          {'title' in modalProps && <AlertDialog {...(modalProps as IAlertProps)} />}
          {'onUploadEnds' in modalProps && <UploadMemeDialog {...(modalProps as IUploadMemeModalProps)} />}
          {'fileId' in modalProps && <EditMemeDialog {...(modalProps as IEditMemeDialogProps)} />}
        </div>
      )}
    </>
  );
};

export default ModalHost;
