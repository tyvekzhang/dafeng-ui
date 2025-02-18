import { configureStore, Store } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';
import appSlice from './modules/app';
import menuSlice from './modules/menu';
import tagsSlice from './modules/tags';
import userSlice from './modules/user';
import dictSlice from '@/stores/modules/dict';

export const store: Store = configureStore({
  reducer: {
    app: appSlice,
    menu: menuSlice,
    tags: tagsSlice,
    user: userSlice,
    dict: dictSlice
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
  devTools: true,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
