import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IEditMemeDialogProps } from '../../components/files_page/EditMemeDialog';
import { IUploadMemeModalProps } from '../../components/files_page/UploadMemeDialog';
import { IAlertProps } from '../../components/global/AlertDialog';

// Define a type for the slice state
interface IModalState {
  isOpen: boolean;
  modalProps: (IAlertProps | IUploadMemeModalProps | IEditMemeDialogProps)[];
}

// Define the initial state using that type
const initialState: IModalState = {
  isOpen: false,
  modalProps: [],
};

export const modalSlice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    openModal: (state, action: PayloadAction<IAlertProps | IUploadMemeModalProps | IEditMemeDialogProps>) => {
      state.modalProps.unshift(action.payload);
      state.isOpen = true;
    },
    closeModal: (state) => {
      state.modalProps.shift();
      if (state.modalProps.length == 0) {
        state.isOpen = false;
      }
    },
  },
});

export const { openModal, closeModal } = modalSlice.actions;

export default modalSlice.reducer;
