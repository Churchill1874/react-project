// src/store.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './reducers/authSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});

//暴露 redux的状态类型 用于调用方的声明
export type RootState = ReturnType<typeof store.getState>;

export default store;
