import { configureStore } from '@reduxjs/toolkit';
import todoReducer from '../slices/todoSlice.js';

export const store = configureStore({
  reducer: {
    todo: todoReducer,
  },
});
