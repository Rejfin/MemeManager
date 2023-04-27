import type { RootState } from '../app/store'
import { useAppSelector } from '../app/hooks'

const ModalHost = () => {
  const isModalOpen = useAppSelector((state: RootState) => state.modal.isOpen)
  const modal = useAppSelector((state: RootState) => state.modal.modal)
  return (
    <>
      {isModalOpen && (
        <div className='fixed flex items-center justify-center w-full h-full bg-textColor bg-opacity-60 z-50'>
          {modal}
        </div>
      )}
    </>
  );
};

export default ModalHost;
