import { configureStore } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';
import type { Store } from 'redux';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import appSlice from './modules/app';
import menuSlice from './modules/menu';
import tagsSlice from './modules/tags';
import userSlice from './modules/user';

const persistConfig = {
  key: 'redux-persist',
  storage,
};

export const store: Store = configureStore({
  reducer: {
    app: persistReducer(persistConfig, appSlice),
    menu: persistReducer(persistConfig, menuSlice),
    tags: persistReducer(persistConfig, tagsSlice),
    user: persistReducer(persistConfig, userSlice),
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
  devTools: true,
});

export const myPersiStore = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
