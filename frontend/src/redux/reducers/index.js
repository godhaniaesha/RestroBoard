import { combineReducers } from '@reduxjs/toolkit';
import authReducer from '../slice/auth.slice';
import categoryReducer from '../slice/category.slice'



export const rootReducer = combineReducers({
    auth: authReducer,
    category: categoryReducer,
});

export default rootReducer;
