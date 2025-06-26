import { combineReducers } from '@reduxjs/toolkit';
import authReducer from '../slice/auth.slice';
import categoryReducer from '../slice/category.slice'
import stockReducer from '../slice/stockmanage.slice'

import userReducer from '../slice/user.slice';

export const rootReducer = combineReducers({
    auth: authReducer,
    category: categoryReducer,
    stock: stockReducer,
    user : userReducer
});

export default rootReducer;
