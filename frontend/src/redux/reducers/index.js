import { combineReducers } from '@reduxjs/toolkit';
import authReducer from '../slice/auth.slice';
import categoryReducer from '../slice/category.slice'
import userReducer from '../slice/user.slice';

export const rootReducer = combineReducers({
    auth: authReducer,
    category: categoryReducer,
    user : userReducer
});

export default rootReducer;
