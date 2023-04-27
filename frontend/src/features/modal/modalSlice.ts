import { createSlice, PayloadAction } from '@reduxjs/toolkit'

// Define a type for the slice state
interface IModalState {
  isOpen: boolean,
  modal: React.ReactNode | undefined
}

// Define the initial state using that type
const initialState: IModalState = {
  isOpen: false,
  modal: undefined
}

export const modalSlice = createSlice({
  name: 'modal',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    openModal: (state, action: PayloadAction<React.ReactNode>) => {
        state.isOpen = true
        state.modal = action.payload
    },
    closeModal: (state) => {
        state.isOpen = false
    }
  },
})

export const { openModal, closeModal } = modalSlice.actions

export default modalSlice.reducer