import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchItems = createAsyncThunk(
    'stock/fetchItems',
    async (_, thunkAPI) => {
        try {
            const token = localStorage.getItem('token');
            const config = token
                ? { headers: { Authorization: `Bearer ${token}` } }
                : {};
            const response = await axios.get('http://localhost:3000/api/getAllItems', config);
            // Adjust if your backend returns data in a different property
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
      return thunkAPI.rejectWithValue(message);
    }
    }
);

export const deleteItem = createAsyncThunk(
    'stock/deleteItem',
    async (id, thunkAPI) => {
        try {
            const token = localStorage.getItem('token');
            const config = token
                ? { headers: { Authorization: `Bearer ${token}` } }
                : {};
            await axios.delete(`http://localhost:3000/api/deleteItem/${id}`, config);
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
      return thunkAPI.rejectWithValue(message);
    }
    }
);

export const createItem = createAsyncThunk(
    'stock/createItem',
    async (formData, thunkAPI) => {
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
} catch (err) {
      const message = err.response?.data?.message || "Error occurred";
      console.log(message, "message");
      
      console.log(message === "Invalid token.", "message");
      
      if (message === "Invalid token.") {
        localStorage.removeItem('user');
        localStorage.removeItem('userId');
        localStorage.removeItem('token');
      }
      return thunkAPI.rejectWithValue(message);
    }
    }
);

export const updateItem = createAsyncThunk(
    'stock/updateItem',
    async ({ id, formData }, thunkAPI) => {
        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                },
            };
            const response = await axios.put(`http://localhost:3000/api/updateItem/${id}`, formData, config);
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
      return thunkAPI.rejectWithValue(message);
    }
    }
);

export const fetchItemById = createAsyncThunk(
    'stock/fetchItemById',
    async (id, thunkAPI) => {
        try {
            const token = localStorage.getItem('token');
            const config = token
                ? { headers: { Authorization: `Bearer ${token}` } }
                : {};
            const response = await axios.get(`http://localhost:3000/api/getItemById/${id}`, config);
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
      return thunkAPI.rejectWithValue(message);
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
        selectedItem: null,
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
            })
            .addCase(updateItem.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.createSuccess = false;
            })
            .addCase(updateItem.fulfilled, (state, action) => {
                state.loading = false;
                state.createSuccess = true;
                const idx = state.items.findIndex(item => item._id === action.payload._id);
                if (idx !== -1) {
                    state.items[idx] = action.payload;
                }
            })
            .addCase(updateItem.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.createSuccess = false;
            })
            .addCase(fetchItemById.pending, (state) => {
                state.loading = true;
                state.selectedItem = null;
            })
            .addCase(fetchItemById.fulfilled, (state, action) => {
                state.loading = false;
                state.selectedItem = action.payload;
            })
            .addCase(fetchItemById.rejected, (state, action) => {
                state.loading = false;
                state.selectedItem = null;
                state.error = action.payload;
            });
    },
});

export const { resetCreateSuccess } = stockSlice.actions;
export default stockSlice.reducer;
