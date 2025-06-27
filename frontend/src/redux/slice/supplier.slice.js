import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async thunks for CRUD operations
export const fetchSuppliers = createAsyncThunk(
  'supplier/fetchSuppliers',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:3000/api/getAllSuppliers', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log(response.data.result,"vvvvvvvvv");
      return response.data.result;
      
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch suppliers');
    }
  }
);

export const getSupplierById = createAsyncThunk(
  'supplier/getSupplierById',
  async (id, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:3000/api/getSupplierById/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch supplier');
    }
  }
);

export const createSupplier = createAsyncThunk(
  'supplier/createSupplier',
  async (supplierData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      
      // Add supplier data to formData
      Object.keys(supplierData).forEach(key => {
        if (key === 'ingredients_supplied' && Array.isArray(supplierData[key])) {
          supplierData[key].forEach(ingredient => {
            formData.append('ingredients_supplied', ingredient);
          });
        } else if (key === 'supplyer_image' && supplierData[key] instanceof File) {
          formData.append('supplyer_image', supplierData[key]);
        } else {
          formData.append(key, supplierData[key]);
        }
      });

      const response = await axios.post('http://localhost:3000/api/createSupplier', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create supplier');
    }
  }
);

export const updateSupplier = createAsyncThunk(
  'supplier/updateSupplier',
  async ({ id, supplierData }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      
      // Add supplier data to formData
      Object.keys(supplierData).forEach(key => {
        if (key === 'ingredients_supplied' && Array.isArray(supplierData[key])) {
          supplierData[key].forEach(ingredient => {
            formData.append('ingredients_supplied', ingredient);
          });
        } else if (key === 'supplyer_image' && supplierData[key] instanceof File) {
          formData.append('supplyer_image', supplierData[key]);
        } else {
          formData.append(key, supplierData[key]);
        }
      });

      const response = await axios.put(`http://localhost:3000/api/updateSupplier/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update supplier');
    }
  }
);

export const deleteSupplier = createAsyncThunk(
  'supplier/deleteSupplier',
  async (id, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:3000/api/deleteSupplier/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete supplier');
    }
  }
);

// Initial state
const initialState = {
  suppliers: [],
  currentSupplier: null,
  loading: false,
  error: null,
  success: null
};

// Supplier slice
const supplierSlice = createSlice({
  name: 'supplier',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.success = null;
    },
    clearCurrentSupplier: (state) => {
      state.currentSupplier = null;
    },
    resetSupplierState: (state) => {
      state.suppliers = [];
      state.currentSupplier = null;
      state.loading = false;
      state.error = null;
      state.success = null;
    }
  },
  extraReducers: (builder) => {
    // Fetch suppliers
    builder
      .addCase(fetchSuppliers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSuppliers.fulfilled, (state, action) => {
        state.loading = false;
        // console.log("Action payload in fulfilled:", action.payload);
        state.suppliers = action.payload || [];
        state.success = action.payload.message || "Suppliers fetched successfully";
      })
      .addCase(fetchSuppliers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

    // Get supplier by ID
    builder
      .addCase(getSupplierById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getSupplierById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentSupplier = action.payload.result;
        state.success = action.payload.message || "Supplier fetched successfully";
      })
      .addCase(getSupplierById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

    // Create supplier
    builder
      .addCase(createSupplier.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createSupplier.fulfilled, (state, action) => {
        state.loading = false;
        state.suppliers.push(action.payload.result);
        state.success = action.payload.message || "Supplier created successfully";
      })
      .addCase(createSupplier.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

    // Update supplier
    builder
      .addCase(updateSupplier.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateSupplier.fulfilled, (state, action) => {
        state.loading = false;
        const updatedSupplier = action.payload.result;
        const index = state.suppliers.findIndex(supplier => supplier._id === updatedSupplier._id);
        if (index !== -1) {
          state.suppliers[index] = updatedSupplier;
        }
        if (state.currentSupplier && state.currentSupplier._id === updatedSupplier._id) {
          state.currentSupplier = updatedSupplier;
        }
        state.success = action.payload.message || "Supplier updated successfully";
      })
      .addCase(updateSupplier.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

    // Delete supplier
    builder
      .addCase(deleteSupplier.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteSupplier.fulfilled, (state, action) => {
        state.loading = false;
        state.suppliers = state.suppliers.filter(supplier => supplier._id !== action.payload);
        if (state.currentSupplier && state.currentSupplier._id === action.payload) {
          state.currentSupplier = null;
        }
        state.success = 'Supplier deleted successfully';
      })
      .addCase(deleteSupplier.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

// Export actions
export const { 
  clearError, 
  clearSuccess, 
  clearCurrentSupplier, 
  resetSupplierState 
} = supplierSlice.actions;

// Export selectors
export const selectSuppliers = (state) => state.supplier.suppliers;
export const selectCurrentSupplier = (state) => state.supplier.currentSupplier;
export const selectSupplierLoading = (state) => state.supplier.loading;
export const selectSupplierError = (state) => state.supplier.error;
export const selectSupplierSuccess = (state) => state.supplier.success;

// Export reducer
export default supplierSlice.reducer;
