import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Tag } from '../../models/tag.model';

interface ISearchState {
  tags: Tag[];
  isUnindexed: boolean;
}

// Define the initial state using that type
const initialState: ISearchState = {
  tags: [],
  isUnindexed: false,
};

export const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    addTag: (state, action: PayloadAction<Tag>) => {
      state.tags.push(action.payload);
    },
    removeTag: (state, action: PayloadAction<Tag>) => {
      state.tags = state.tags.filter((tag) => tag.id !== action.payload.id);
    },
    switchIndexedList: (state) => {
      state.isUnindexed = !state.isUnindexed;
    },
  },
});

export const { addTag, removeTag, switchIndexedList } = searchSlice.actions;

export default searchSlice.reducer;
