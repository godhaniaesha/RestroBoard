import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost:3000/api";

const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

// 1. Get Total Expense
export const getTotalExpense = createAsyncThunk(
  "dashboard/getTotalExpense",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/getTotalExpense`, getAuthHeader());
      console.log("API response (getTotalExpense):", response.data);
      const result = response.data.result || response.data;
      console.log("Returned (getTotalExpense):", result);
      return result;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Error occurred");
    }
  }
);

// 2. Get Employee Counts
export const getEmployeeCounts = createAsyncThunk(
  "dashboard/getEmployeeCounts",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/getEmployeeCounts`, getAuthHeader());
      console.log("API response (getEmployeeCounts):", response.data);
      const result = response.data.result || response.data;
      console.log("Returned (getEmployeeCounts):", result);
      return result;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Error occurred");
    }
  }
);

// 3. Get Supplier Count
export const getSupplierCount = createAsyncThunk(
  "dashboard/getSupplierCount",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/getSupplierCount`, getAuthHeader());
      console.log("API response (getSupplierCount):", response.data);
      const result = response.data.result || response.data;
      console.log("Returned (getSupplierCount):", result);
      return result;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Error occurred");
    }
  }
);

// 4. Get Weekly Item Additions
export const getWeeklyItemAdditions = createAsyncThunk(
  "dashboard/getWeeklyItemAdditions",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/getWeeklyItemAdditions`, getAuthHeader());
      console.log("API response (getWeeklyItemAdditions):", response.data);
      const result = response.data.result || response.data;
      console.log("Returned (getWeeklyItemAdditions):", result);
      return result;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Error occurred");
    }
  }
);

// 5. Get Top Selling Products
export const getTopSellingProducts = createAsyncThunk(
  "dashboard/getTopSellingProducts",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/getTopSellingProducts`, getAuthHeader());
      console.log("API response (getTopSellingProducts):", response.data);
      const result = response.data.result || response.data;
      console.log("Returned (getTopSellingProducts):", result);
      return result;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Error occurred");
    }
  }
);

// 6. Get Recent Orders
export const getRecentOrders = createAsyncThunk(
  "dashboard/getRecentOrders",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/getRecentOrders`, getAuthHeader());
      console.log("API response (getRecentOrders):", response.data);
      const result = response.data.result || response.data;
      console.log("Returned (getRecentOrders):", result);
      return result;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Error occurred");
    }
  }
);

// 7. Get Total Items
export const getTotalItems = createAsyncThunk(
  "dashboard/getTotalItems",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/getTotalItems`, getAuthHeader());
      console.log("API response (getTotalItems):", response.data);
      const result = response.data.result || response.data;
      console.log("Returned (getTotalItems):", result);
      return result;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Error occurred");
    }
  }
);

// 8. Get Total Values
export const getTotalValues = createAsyncThunk(
  "dashboard/getTotalValues",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/getTotalValues`, getAuthHeader());
      console.log("API response (getTotalValues):", response.data);
      const result = response.data.result || response.data;
      console.log("Returned (getTotalValues):", result);
      return result;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Error occurred");
    }
  }
);

// 9. Get Category Wise Stock
export const getCategoryWiseStock = createAsyncThunk(
  "dashboard/getCategoryWiseStock",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/getCategoryWiseStock`, getAuthHeader());
      console.log("API response (getCategoryWiseStock):", response.data);
      const result = response.data.result || response.data;
      console.log("Returned (getCategoryWiseStock):", result);
      return result;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Error occurred");
    }
  }
);

// 10. Get Low Stock Items
export const getLowStockItems = createAsyncThunk(
  "dashboard/getLowStockItems",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/getLowStockItems`, getAuthHeader());
      console.log("API response (getLowStockItems):", response.data);
      const result = response.data.result || response.data;
      console.log("Returned (getLowStockItems):", result);
      return result;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Error occurred");
    }
  }
);

// 11. Get Out Of Stock Items
export const getOutOfStockItems = createAsyncThunk(
  "dashboard/getOutOfStockItems",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/getOutOfStockItems`, getAuthHeader());
      console.log("API response (getOutOfStockItems):", response.data);
      const result = response.data.result || response.data;
      console.log("Returned (getOutOfStockItems):", result);
      return result;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Error occurred");
    }
  }
);

// Initial state
const initialState = {
  totalExpense: null,
  employeeCounts: null,
  supplierCount: null,
  weeklyItemAdditions: [],
  topSellingProducts: [],
  recentOrders: [],
  totalItems: null,
  totalValues: null,
  categoryWiseStock: [],
  lowStockItems: [],
  outOfStockItems: [],
  loading: false,
  error: null,
};

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getTotalExpense.fulfilled, (state, action) => {
        state.totalExpense = action.payload;
        console.log("FULFILLED (getTotalExpense):", action.payload);
      })
      .addCase(getEmployeeCounts.fulfilled, (state, action) => {
        state.employeeCounts = action.payload;
        console.log("FULFILLED (getEmployeeCounts):", action.payload);
      })
      .addCase(getSupplierCount.fulfilled, (state, action) => {
        state.supplierCount = action.payload;
        console.log("FULFILLED (getSupplierCount):", action.payload);
      })
      .addCase(getWeeklyItemAdditions.fulfilled, (state, action) => {
        state.weeklyItemAdditions = action.payload;
        console.log("FULFILLED (getWeeklyItemAdditions):", action.payload);
      })
      .addCase(getTopSellingProducts.fulfilled, (state, action) => {
        state.topSellingProducts = action.payload;
        console.log("FULFILLED (getTopSellingProducts):", action.payload);
      })
      .addCase(getRecentOrders.fulfilled, (state, action) => {
        state.recentOrders = action.payload;
        console.log("FULFILLED (getRecentOrders):", action.payload);
      })
      .addCase(getTotalItems.fulfilled, (state, action) => {
        state.totalItems = action.payload;
        console.log("FULFILLED (getTotalItems):", action.payload);
      })
      .addCase(getTotalValues.fulfilled, (state, action) => {
        state.totalValues = action.payload;
        console.log("FULFILLED (getTotalValues):", action.payload);
      })
      .addCase(getCategoryWiseStock.fulfilled, (state, action) => {
        state.categoryWiseStock = action.payload;
        console.log("FULFILLED (getCategoryWiseStock):", action.payload);
      })
      .addCase(getLowStockItems.fulfilled, (state, action) => {
        state.lowStockItems = action.payload;
        console.log("FULFILLED (getLowStockItems):", action.payload);
      })
      .addCase(getOutOfStockItems.fulfilled, (state, action) => {
        state.outOfStockItems = action.payload;
        console.log("FULFILLED (getOutOfStockItems):", action.payload);
      });
  },
});

export default dashboardSlice.reducer;
