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

// 1. Create Register (with image upload)
export const createRegister = createAsyncThunk(
  "user/createRegister",
  async (formData, thunkAPI) => {
    try {
      const response = await axios.post(
        `${API_URL}/createRegister`,
        formData,
        {
          headers: {
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

// 2. Get Register By ID
export const getRegisterById = createAsyncThunk(
  "user/getRegisterById",
  async (id, thunkAPI) => {
    try {
      const response = await axios.get(`${API_URL}/getRegisterById/${id}`, getAuthHeader());
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

// 3. Update Profile User (with image)
export const updateProfileUser = createAsyncThunk(
  "user/updateProfileUser",
  async ({ id, formData }, thunkAPI) => {
    try {
      const response = await axios.put(
        `${API_URL}/updateProfileUser/${id}`,
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

// 4. Get All Employees (Admin only)
export const getAllEmployee = createAsyncThunk(
  "user/getAllEmployee",
  async (_, thunkAPI) => {
    try {
      const response = await axios.get(`${API_URL}/getAllEmployee`, getAuthHeader());
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

// 5. Delete Employee (Admin only)
export const deleteEmployee = createAsyncThunk(
  "user/deleteEmployee",
  async (id, thunkAPI) => {
    try {
      const response = await axios.delete(`${API_URL}/deleteEmployee/${id}`, getAuthHeader());
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
  userData: null,
  employees: [],
  loading: false,
  error: null,
  success: null,
};

// Slice
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    clearSuccess: (state) => {
      state.success = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    clearUserState: (state) => {
      state.userData = null;
      state.employees = [];
      state.loading = false;
      state.error = null;
      state.success = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create Register
      .addCase(createRegister.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createRegister.fulfilled, (state, action) => {
        state.loading = false;
        state.success = "User registered successfully";
        state.userData = action.payload;
      })
      .addCase(createRegister.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get Register By ID
      .addCase(getRegisterById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getRegisterById.fulfilled, (state, action) => {
        state.loading = false;
        state.userData = action.payload;
      })
      .addCase(getRegisterById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update Profile User
      .addCase(updateProfileUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProfileUser.fulfilled, (state, action) => {
        state.loading = false;
        state.success = "Profile updated successfully";
        state.userData = action.payload;
      })
      .addCase(updateProfileUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get All Employee
      .addCase(getAllEmployee.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllEmployee.fulfilled, (state, action) => {
        state.loading = false;
        state.employees = action.payload;
      })
      .addCase(getAllEmployee.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete Employee
      .addCase(deleteEmployee.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteEmployee.fulfilled, (state, action) => {
        state.loading = false;
        state.success = "Employee deleted successfully";
        state.employees = state.employees.filter(emp => emp._id !== action.meta.arg);
      })
      .addCase(deleteEmployee.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// Export actions and reducer
export const { clearUserState, clearSuccess, clearError } = userSlice.actions;
export default userSlice.reducer;
