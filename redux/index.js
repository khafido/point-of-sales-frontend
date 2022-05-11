import { configureStore, applyMiddleware } from '@reduxjs/toolkit'
import { combineReducers } from 'redux'
import { composeWithDevTools } from '@redux-devtools/extension';
import thunkMiddleware from "redux-thunk";

import user from './slices/user'

const rootReducer = combineReducers({
  user: user,
})

const bindMiddleware = (middleware) => {
    if (process.env.NODE_ENV !== "production") {
        return composeWithDevTools(applyMiddleware(...middleware));
    }
    return applyMiddleware(...middleware);
};

export const store = configureStore({
  reducer: rootReducer, 
  // middleware: [thunkMiddleware],
});