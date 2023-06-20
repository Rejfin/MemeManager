import type { RootState } from '../app/store';
import { useAppSelector } from '../app/hooks';
import AlertDialog, { IAlertProps } from '../components/global/AlertDialog';
import UploadMemeDialog, { IUploadMemeModalProps } from '../components/files_page/UploadMemeDialog';
import EditMemeDialog, { IEditMemeDialogProps } from '../components/files_page/EditMemeDialog';

const ModalHost = () => {
  const isModalOpen = useAppSelector((state: RootState) => state.modal.isOpen);
  const modalProps = useAppSelector((state: RootState) => state.modal.modalProps);

  const getModal = () => {
    if(modalProps && modalProps[0]){
      if('title' in modalProps[0]){
        return (<AlertDialog {...(modalProps[0] as IAlertProps)} />)
      }else if('onUploadEnds' in modalProps[0]){
        return (<UploadMemeDialog {...(modalProps[0] as IUploadMemeModalProps)} />)
      }else if('fileId' in modalProps[0]){
        return (<EditMemeDialog {...(modalProps[0] as IEditMemeDialogProps)} />)
      }
    }
  }

  return (
    <>
      <div
        className={`fixed flex items-center justify-center w-full h-full bg-textColor bg-opacity-60 z-50 transition duration-300 ${
          isModalOpen ? ' scale-100 opacity-100' : 'scale-0 opacity-0'
        }`}
      >
        {getModal()}
      </div>
    </>
  );
};

export default ModalHost;
