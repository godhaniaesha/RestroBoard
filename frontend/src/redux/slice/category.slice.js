import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchCategories = createAsyncThunk(
    'category/fetchCategories',
    async (_, thunkAPI) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                return thunkAPI.rejectWithValue('Token not found in local storage.');
            }
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };
            const response = await axios.get('http://localhost:3000/api/getAllCategories', config);
            console.log(response.data.result, 'category');

            return response.data.result;
        } catch (err) {
            const message = err.response?.data?.message || "Error occurred";
            console.log(message, "message");

            console.log(message === "Invalid token.", "message");

            if (message === "Invalid token.") {
                localStorage.removeItem('user');
                localStorage.removeItem('userId');
                localStorage.removeItem('token');
            }
            return thunkAPI.thunkAPI.rejectWithValue(message);
        }
    }
);

export const getCategoryById = createAsyncThunk(
    'category/getCategoryById',
    async (id, thunkAPI) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                return thunkAPI.rejectWithValue('Token not found in local storage.');
            }
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const response = await axios.get(`http://localhost:3000/api/getCategoryById/${id}`, config);
            return response.data.result;
        } catch (err) {
            const message = err.response?.data?.message || "Error occurred";
            console.log(message, "message");

            console.log(message === "Invalid token.", "message");

            if (message === "Invalid token.") {
                localStorage.removeItem('user');
                localStorage.removeItem('userId');
                localStorage.removeItem('token');
            }
            return thunkAPI.thunkAPI.rejectWithValue(message);
        }
    }
);

export const updateCategory = createAsyncThunk(
    'category/updateCategory',
    async ({ id, formData }, thunkAPI) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                return thunkAPI.rejectWithValue('Token not found in local storage.');
            }
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`,
                }
            };
            const response = await axios.put(`http://localhost:3000/api/updateCategory/${id}`, formData, config);
            return response.data.result;
        } catch (err) {
            const message = err.response?.data?.message || "Error occurred";
            console.log(message, "message");

            console.log(message === "Invalid token.", "message");

            if (message === "Invalid token.") {
                localStorage.removeItem('user');
                localStorage.removeItem('userId');
                localStorage.removeItem('token');
            }
            return thunkAPI.thunkAPI.rejectWithValue(message);
        }
    }
);

export const createCategory = createAsyncThunk(
    'category/createCategory',
    async (formData, thunkAPI) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                return thunkAPI.rejectWithValue('Token not found in local storage.');
            }
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`,
                }
            };
            const response = await axios.post('http://localhost:3000/api/createCategory', formData, config);
            return response.data.result;
        } catch (err) {
            const message = err.response?.data?.message || "Error occurred";
            console.log(message, "message");

            console.log(message === "Invalid token.", "message");

            if (message === "Invalid token.") {
                localStorage.removeItem('user');
                localStorage.removeItem('userId');
                localStorage.removeItem('token');
            }
            return thunkAPI.thunkAPI.rejectWithValue(message);
        }
    }
);

export const deleteCategory = createAsyncThunk(
    'category/deleteCategory',
    async (id, thunkAPI) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                return thunkAPI.rejectWithValue('Token not found in local storage.');
            }
            const config = { headers: { Authorization: `Bearer ${token}` } };
            await axios.delete(`http://localhost:3000/api/deleteCategory/${id}`, config);
            return id;
        } catch (err) {
            const message = err.response?.data?.message || "Error occurred";
            console.log(message, "message");

            console.log(message === "Invalid token.", "message");

            if (message === "Invalid token.") {
                localStorage.removeItem('user');
                localStorage.removeItem('userId');
                localStorage.removeItem('token');
            }
            return thunkAPI.thunkAPI.rejectWithValue(message);
        }
    }
);

const categorySlice = createSlice({
    name: 'category',
    initialState: {
        categories: [],
        selectedCategory: null,
        loading: false,
        error: null,
        createSuccess: false,
        updateSuccess: false,
    },
    reducers: {
        resetCreateSuccess(state) {
            state.createSuccess = false;
        },
        resetUpdateSuccess(state) {
            state.updateSuccess = false;
        },
        clearSelectedCategory(state) {
            state.selectedCategory = null;
        }
    },
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
                state.error = action.payload;
            })
            .addCase(getCategoryById.pending, (state) => {
                state.loading = true;
                state.selectedCategory = null;
            })
            .addCase(getCategoryById.fulfilled, (state, action) => {
                state.loading = false;
                state.selectedCategory = action.payload;
            })
            .addCase(getCategoryById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(createCategory.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.createSuccess = false;
            })
            .addCase(createCategory.fulfilled, (state, action) => {
                state.loading = false;
                state.createSuccess = true;
                state.categories.push(action.payload);
            })
            .addCase(createCategory.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.createSuccess = false;
            })
            .addCase(updateCategory.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.updateSuccess = false;
            })
            .addCase(updateCategory.fulfilled, (state, action) => {
                state.loading = false;
                state.updateSuccess = true;
                const index = state.categories.findIndex(cat => cat._id === action.payload._id);
                console.log(index, "index")
                if (index !== -1) {
                    state.categories[index] = action.payload;
                }
            })
            .addCase(updateCategory.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.updateSuccess = false;
            })
            .addCase(deleteCategory.pending, (state) => {
                state.loading = true;
            })
            .addCase(deleteCategory.fulfilled, (state, action) => {
                state.loading = false;
                state.categories = state.categories.filter(cat => cat._id !== action.payload);
            })
            .addCase(deleteCategory.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { resetCreateSuccess, resetUpdateSuccess, clearSelectedCategory } = categorySlice.actions;
export default categorySlice.reducer;
