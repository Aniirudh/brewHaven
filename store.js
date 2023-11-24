import {configureStore} from '@reduxjs/toolkit';
import basketReducer from './features/cartSlice';
import navReducer from './features/navSlice'
import userReducer from './features/userSlice'

const store = configureStore({
  reducer: {
    basket: basketReducer,
    nav: navReducer,
    user: userReducer
  },
});

export default store;
