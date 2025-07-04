import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost:3000/api";

// Auth header utility
const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

// 1. Create Dish (with image)
export const createDish = createAsyncThunk(
  "dish/createDish",
  async (formData, thunkAPI) => {
    try {
      const response = await axios.post(
        `${API_URL}/createDish`,
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

// 2. Get All Dishes
export const getAllDish = createAsyncThunk(
  "dish/getAllDish",
  async (_, thunkAPI) => {
    try {
      const response = await axios.get(`${API_URL}/getAllDish`, getAuthHeader());
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

// 3. Get Dish By ID
export const getDishById = createAsyncThunk(
  "dish/getDishById",
  async (id, thunkAPI) => {
    try {
      const response = await axios.get(`${API_URL}/getDishById/${id}`, getAuthHeader());
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

// 4. Update Dish (with image)
export const updateDish = createAsyncThunk(
  "dish/updateDish",
  async ({ id, formData }, thunkAPI) => {
    try {
      const response = await axios.put(
        `${API_URL}/updateDish/${id}`,
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

// 5. Delete Dish
export const deleteDish = createAsyncThunk(
  "dish/deleteDish",
  async (id, thunkAPI) => {
    try {
      const response = await axios.delete(`${API_URL}/deleteDish/${id}`, getAuthHeader());
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
  dishes: [],
  selectedDish: null,
  loading: false,
  error: null,
  success: null,
};

// Slice
const dishSlice = createSlice({
  name: "dish",
  initialState,
  reducers: {
    clearDishState: (state) => {
      state.dishes = [];
      state.selectedDish = null;
      state.loading = false;
      state.error = null;
      state.success = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create Dish
      .addCase(createDish.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createDish.fulfilled, (state, action) => {
        state.loading = false;
        state.success = "Dish created successfully";
        state.dishes.push(action.payload.result);
      })
      .addCase(createDish.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get All Dishes
      .addCase(getAllDish.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllDish.fulfilled, (state, action) => {
        state.loading = false;
        state.dishes = action.payload;
      })
      .addCase(getAllDish.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get Dish By ID
      .addCase(getDishById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getDishById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedDish = action.payload;
      })
      .addCase(getDishById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update Dish
      .addCase(updateDish.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateDish.fulfilled, (state, action) => {
        state.loading = false;
        state.success = "Dish updated successfully";
        state.dishes = state.dishes.map((dish) =>
          dish._id === action.payload.result._id ? action.payload.result : dish
        );
      })
      .addCase(updateDish.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete Dish
      .addCase(deleteDish.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteDish.fulfilled, (state, action) => {
        state.loading = false;
        state.success = "Dish deleted successfully";
        state.dishes = state.dishes.filter((dish) => dish._id !== action.meta.arg);
      })
      .addCase(deleteDish.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// Export actions and reducer
export const { clearDishState } = dishSlice.actions;
export default dishSlice.reducer;
