import { combineReducers } from '@reduxjs/toolkit';
import authReducer from '../slice/auth.slice';
import categoryReducer from '../slice/category.slice'
import stockReducer from '../slice/stockmanage.slice'
import hotelReducer from '../slice/hotel.slice'
import userReducer from '../slice/user.slice';
import dishReducer from '../slice/dish.slice';
import supplierReducer from '../slice/supplier.slice';

export const rootReducer = combineReducers({
    auth: authReducer,
    category: categoryReducer,
    stock: stockReducer,
    user : userReducer,
    hotel : hotelReducer,
    dish : dishReducer,
    supplier : supplierReducer
});

export default rootReducer;
