import { configureStore } from '@reduxjs/toolkit'
import modalReducer from '../features/modal/modalSlice'
import searchReducer from '../features/search/searchSlice'
import editModalReducer from '../features/editModal/editModalSlice';

export const store = configureStore({
  reducer: {
    modal: modalReducer,
    search: searchReducer,
    editModal: editModalReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['modal/openModal', 'search/addTag'],
        ignoredPaths: ['modal.modalProps', 'search.tags']
      },
    }),
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch