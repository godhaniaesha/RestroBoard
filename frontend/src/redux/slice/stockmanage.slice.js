import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchItems = createAsyncThunk(
    'stock/fetchItems',
    async (_, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');
            const config = token
                ? { headers: { Authorization: `Bearer ${token}` } }
                : {};
            const response = await axios.get('http://localhost:3000/api/getAllItems', config);
            // Adjust if your backend returns data in a different property
            return response.data.result;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

export const deleteItem = createAsyncThunk(
    'stock/deleteItem',
    async (id, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');
            const config = token
                ? { headers: { Authorization: `Bearer ${token}` } }
                : {};
            await axios.delete(`http://localhost:3000/api/deleteItem/${id}`, config);
            return id;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

export const createItem = createAsyncThunk(
    'stock/createItem',
    async (formData, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                },
            };
            const response = await axios.post('http://localhost:3000/api/createItem', formData, config);
            // Adjust if your backend returns data in a different property
            return response.data.result;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

const stockSlice = createSlice({
    name: 'stock',
    initialState: {
        items: [],
        loading: false,
        error: null,
        createSuccess: false,
    },
    reducers: {
        resetCreateSuccess(state) {
            state.createSuccess = false;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchItems.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchItems.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload;
            })
            .addCase(fetchItems.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(deleteItem.pending, (state) => {
                state.loading = true;
            })
            .addCase(deleteItem.fulfilled, (state, action) => {
                state.loading = false;
                state.items = state.items.filter(item => item._id !== action.payload);
            })
            .addCase(deleteItem.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(createItem.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.createSuccess = false;
            })
            .addCase(createItem.fulfilled, (state, action) => {
                state.loading = false;
                state.createSuccess = true;
                state.items.push(action.payload);
            })
            .addCase(createItem.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.createSuccess = false;
            });
    },
});

export const { resetCreateSuccess } = stockSlice.actions;
export default stockSlice.reducer;
