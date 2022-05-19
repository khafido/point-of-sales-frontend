import { configureStore, applyMiddleware } from '@reduxjs/toolkit'
import { combineReducers } from 'redux'
import { composeWithDevTools } from '@redux-devtools/extension';
import thunkMiddleware from "redux-thunk";
import storage from 'redux-persist/lib/storage';
import { persistReducer } from 'redux-persist'
import user from './slices/user'
import auth from './slices/auth';

const rootReducer = combineReducers({
  user: user,
  auth: auth
});

const persistConfig = {
  key: 'root',
  storage
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});