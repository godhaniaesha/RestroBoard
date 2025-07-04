import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost:3000/api";

// Utility to get auth headers
const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

// 1. Create Hotel (with image)
export const createHotel = createAsyncThunk(
  "hotel/createHotel",
  async (formData, thunkAPI) => {
    try {
      const response = await axios.post(
        `${API_URL}/createHotel`,
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

// 2. Get All Hotels
export const getAllHotel = createAsyncThunk(
  "hotel/getAllHotel",
  async (_, thunkAPI) => {
    try {
      const response = await axios.get(`${API_URL}/getAllHotel`, getAuthHeader());
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

// 3. Get Hotel By ID
export const getHotelById = createAsyncThunk(
  "hotel/getHotelById",
  async (id, thunkAPI) => {
    try {
      const response = await axios.get(`${API_URL}/getHotelById/${id}`, getAuthHeader());
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

// 4. Update Hotel (with image)
export const updateHotel = createAsyncThunk(
  "hotel/updateHotel",
  async ({ id, data }, thunkAPI) => {
    try {
      const response = await axios.put(
        `${API_URL}/updateHotel/${id}`,
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


// 5. Delete Hotel
export const deleteHotel = createAsyncThunk(
  "hotel/deleteHotel",
  async (id, thunkAPI) => {
    try {
      const response = await axios.delete(`${API_URL}/deleteHotel/${id}`, getAuthHeader());
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
  hotels: [],
  selectedHotel: null,
  loading: false,
  error: null,
  success: null,
};

// Slice
const hotelSlice = createSlice({
  name: "hotel",
  initialState,
  reducers: {
    clearHotelState: (state) => {
      state.hotels = [];
      state.selectedHotel = null;
      state.loading = false;
      state.error = null;
      state.success = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create Hotel
      .addCase(createHotel.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createHotel.fulfilled, (state, action) => {
        state.loading = false;
        state.success = "Hotel created successfully";
        state.hotels.push(action.payload.result);
      })
      .addCase(createHotel.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get All Hotels
      .addCase(getAllHotel.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllHotel.fulfilled, (state, action) => {
        state.loading = false;
        state.hotels = action.payload;
      })
      .addCase(getAllHotel.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get Hotel By ID
      .addCase(getHotelById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getHotelById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedHotel = action.payload;
      })
      .addCase(getHotelById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update Hotel
      .addCase(updateHotel.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateHotel.fulfilled, (state, action) => {
        state.loading = false;
        state.success = "Hotel updated successfully";
        state.hotels = state.hotels.map((hotel) =>
          hotel._id === action.payload.result._id ? action.payload.result : hotel
        );
      })
      .addCase(updateHotel.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete Hotel
      .addCase(deleteHotel.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteHotel.fulfilled, (state, action) => {
        state.loading = false;
        state.success = "Hotel deleted successfully";
        state.hotels = state.hotels.filter((hotel) => hotel._id !== action.meta.arg);
      })
      .addCase(deleteHotel.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// Export actions and reducer
export const { clearHotelState } = hotelSlice.actions;
export default hotelSlice.reducer;
