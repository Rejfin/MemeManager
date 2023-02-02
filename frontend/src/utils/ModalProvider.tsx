import { createContext, useContext, useState } from 'react';

type ModalProviderProps = { children: React.ReactNode };

const ModalStateContext = createContext<
  | {
      modal: React.ReactNode | undefined;
      setModal: React.Dispatch<React.SetStateAction<React.ReactNode | undefined>>;
    }
  | undefined
>(undefined);

function ModalProvider({ children }: ModalProviderProps) {
  const [modal, setModal] = useState<React.ReactNode | undefined>(undefined);

  return <ModalStateContext.Provider value={{ modal, setModal }}>{children}</ModalStateContext.Provider>;
}

function useModal() {
  const context = useContext(ModalStateContext);
  if (context === undefined) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
}

export { ModalProvider, useModal };
