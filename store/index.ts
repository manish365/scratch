import { configureStore, combineReducers } from '@reduxjs/toolkit'
import { createWrapper } from 'next-redux-wrapper';
import cartReducer from './reducers/cart';
import userReducer from './reducers/user';
import cmsReducer from './reducers/cms';
import reviewReducer from './reducers/review';
import menuReducer from './reducers/menu';
import storage from 'redux-persist/lib/storage'
import {
  persistStore,
  persistReducer,
} from 'redux-persist'

const rootReducer = combineReducers({
  cart: cartReducer,
  user: userReducer,
  cms: cmsReducer,
  review: reviewReducer,
  menu: menuReducer
})

const makeStore = () => {
  if (typeof window === 'undefined') {
    // Server side: plain store without persistence
    return configureStore({
      reducer: rootReducer,
      middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({ serializableCheck: false }),
    });
  } else {
    // Client side: persisted store
    const persistConfig = {
      key: 'shoppingcart',
      whitelist: ['cart', 'user', 'cms', 'review', 'menu'],
      storage,
    };

    const persistedReducer = persistReducer(persistConfig, rootReducer);

    const store: any = configureStore({
      reducer: persistedReducer,
      middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({ serializableCheck: false }),
    });

    store.__persistor = persistStore(store);
    return store;
  }
};

// Export an assembled wrapper
export const wrapper = createWrapper(makeStore, { debug: false });

// Infer the `RootState` from the rootReducer (stable type)
export type RootState = ReturnType<typeof rootReducer>

// AppDispatch from a plain store instance
export type AppDispatch = ReturnType<typeof makeStore>['dispatch']