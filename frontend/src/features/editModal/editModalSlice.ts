import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Tag } from '../../models/tag.model';

// Define a type for the slice state
interface IModalState {
  originalTags: Tag[];
  editedTags: Tag[];
  isSaving: boolean;
}

// Define the initial state using that type
const initialState: IModalState = {
  originalTags: [],
  editedTags: [],
  isSaving: false,
};

export const editModalSlice = createSlice({
  name: 'editModal',
  initialState,
  reducers: {
    setOriginalTags: (state, action: PayloadAction<Tag[]>) => {
      state.originalTags = action.payload;
    },
    setEditedTags: (state, action: PayloadAction<Tag[]>) => {
      state.editedTags = action.payload;
    },
    addEditedTag: (state, action: PayloadAction<Tag>) => {
      state.editedTags.push(action.payload);
    },
    removeEditedTag: (state, action: PayloadAction<Tag>) => {
      state.editedTags = state.editedTags.filter((tag) => tag.id !== action.payload.id);
    },
    setIsSaving: (state, action: PayloadAction<boolean>) => {
      state.isSaving = action.payload;
    },
  },
});

export const { setOriginalTags, setEditedTags, addEditedTag, removeEditedTag, setIsSaving } = editModalSlice.actions;

export default editModalSlice.reducer;
