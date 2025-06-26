import { combineReducers } from '@reduxjs/toolkit';
import authReducer from '../slice/auth.slice';
import categoryReducer from '../slice/category.slice'
import stockReducer from '../slice/stockmanage.slice'


export const rootReducer = combineReducers({
    auth: authReducer,
    category: categoryReducer,
    stock: stockReducer,
});

export default rootReducer;
