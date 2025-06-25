import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchCategories = createAsyncThunk(
    'category/fetchCategories',
    async () => {
        const response = await axios.get('http://localhost:3000/api/getAllCategories');


        console.log(response.data.data)
        return response.data.data; // Adjust if your API response structure is different
    }
);

export const createCategory = createAsyncThunk(
    'category/createCategory',
    async (formData, { rejectWithValue }) => {
        try {
            const response = await axios.post('http://localhost:3000/api/createCategory', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);


const categorySlice = createSlice({
    name: 'category',
    initialState: {
        categories: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchCategories.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCategories.fulfilled, (state, action) => {
                state.loading = false;
                state.categories = action.payload;
            })
            .addCase(fetchCategories.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(createCategory.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.createSuccess = false;
            })
            .addCase(createCategory.fulfilled, (state, action) => {
                state.loading = false;
                state.createSuccess = true;
                // Optionally, add the new category to the list:
                state.categories.push(action.payload);
            })
            .addCase(createCategory.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.createSuccess = false;
            });
    },
});

export const { resetCreateSuccess } = categorySlice.actions;
export default categorySlice.reducer;
