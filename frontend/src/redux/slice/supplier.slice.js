import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost:3000/api";

// Utility function to get auth headers
const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

// 1. Create Supplier (with image upload)
export const createSupplier = createAsyncThunk(
  "supplier/createSupplier",
  async (formData, thunkAPI) => {
    try {
      const response = await axios.post(
        `${API_URL}/createSupplier`,
        formData,
        {
          headers: {
            ...getAuthHeader().headers,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data;
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

// 2. Get All Suppliers
export const getAllSuppliers = createAsyncThunk(
  "supplier/getAllSuppliers",
  async (_, thunkAPI) => {
    try {
      const response = await axios.get(`${API_URL}/getAllSuppliers`, getAuthHeader());
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

// 3. Get Supplier By ID
export const getSupplierById = createAsyncThunk(
  "supplier/getSupplierById",
  async (id, thunkAPI) => {
    try {
      const response = await axios.get(`${API_URL}/getSupplierById/${id}`, getAuthHeader());
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

// 4. ✅ FIXED: Update Supplier (with image)
export const updateSupplier = createAsyncThunk(
  "supplier/updateSupplier",
  async ({ id, data }, thunkAPI) => {
    try {
      const response = await axios.put(
        `${API_URL}/updateSupplier/${id}`,
        data,
        {
          headers: {
            ...getAuthHeader().headers,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data;
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

// 5. Delete Supplier
export const deleteSupplier = createAsyncThunk(
  "supplier/deleteSupplier",
  async (id, thunkAPI) => {
    try {
      const response = await axios.delete(`${API_URL}/deleteSupplier/${id}`, getAuthHeader());
      return response.data;
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

// Initial state
const initialState = {
  supplierData: null,
  suppliers: [],
  loading: false,
  error: null,
  success: null,
};

// Slice
const supplierSlice = createSlice({
  name: "supplier",
  initialState,
  reducers: {
    clearSupplierState: (state) => {
      state.supplierData = null;
      state.suppliers = [];
      state.loading = false;
      state.error = null;
      state.success = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create Supplier
      .addCase(createSupplier.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createSupplier.fulfilled, (state, action) => {
        state.loading = false;
        state.success = "Supplier created successfully";
        state.supplierData = action.payload;
      })
      .addCase(createSupplier.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get All Suppliers
      .addCase(getAllSuppliers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllSuppliers.fulfilled, (state, action) => {
        state.loading = false;
        state.suppliers = action.payload;
      })
      .addCase(getAllSuppliers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get Supplier By ID
      .addCase(getSupplierById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getSupplierById.fulfilled, (state, action) => {
        state.loading = false;
        state.supplierData = action.payload;
      })
      .addCase(getSupplierById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ✅ Update Supplier
      .addCase(updateSupplier.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateSupplier.fulfilled, (state, action) => {
        state.loading = false;
        state.success = "Supplier updated successfully";
        state.supplierData = action.payload;
      })
      .addCase(updateSupplier.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete Supplier
      .addCase(deleteSupplier.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteSupplier.fulfilled, (state, action) => {
        state.loading = false;
        state.success = "Supplier deleted successfully";
        state.suppliers = state.suppliers.filter(s => s._id !== action.meta.arg);
      })
      .addCase(deleteSupplier.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// Export actions and reducer
export const { clearSupplierState } = supplierSlice.actions;
export default supplierSlice.reducer;
