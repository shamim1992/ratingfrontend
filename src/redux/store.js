// src/redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage
import { combineReducers } from 'redux';

// Import reducers
import authReducer from './slices/authSlice';
import questionReducer from './slices/questionSlice';
import ratingReducer from './slices/ratingSlice';
import userReducer from './slices/userSlice';

// Configure persist
const persistConfig = {
    key: 'root',
    storage,
    whitelist: ['auth'], // only auth will be persisted
};

// Combine reducers
const rootReducer = combineReducers({
    auth: authReducer,
    questions: questionReducer,
    ratings: ratingReducer,
    users: userReducer,
});

// Create persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Create store
export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
            },
        }),
    devTools: process.env.NODE_ENV !== 'production',
});

// Create persistor
export const persistor = persistStore(store);