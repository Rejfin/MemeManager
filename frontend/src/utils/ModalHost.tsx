import { useModal } from "./ModalProvider";

const ModalHost = () => {
  const {modal} = useModal();
  return (
    <>
      {modal && (
        <div className="fixed flex items-center justify-center w-full h-full bg-textColor bg-opacity-60 z-50">
            {modal}
        </div>
      )}
    </>
  );
};

export default ModalHost;
