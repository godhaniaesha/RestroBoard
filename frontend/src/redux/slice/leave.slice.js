import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost:3000/api";

// Auth header
const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

// Create Leave
export const db_createLeave = createAsyncThunk(
  "leave/createLeave",
  async (leaveData, thunkAPI) => {
    try {
      const res = await axios.post(`${API_URL}/createLeave`, leaveData, getAuthHeader());
      return res.data;
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

// Get All Leaves (admin/manager only)
export const db_getAllLeaves = createAsyncThunk(
  "leave/getAllLeaves",
  async (_, thunkAPI) => {
    try {
      const res = await axios.get(`${API_URL}/getAllLeaves`, getAuthHeader());
      return res.data.result;
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

// Get Leaves by User ID
export const db_getLeavesByUserId = createAsyncThunk(
  "leave/getLeavesByUserId",
  async (userId, thunkAPI) => {
    try {
      const res = await axios.get(`${API_URL}/getLeavesByUserId/${userId}`, getAuthHeader());
      return res.data.result;
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

// Update Leave Details
export const db_updateLeaveDetails = createAsyncThunk(
  "leave/updateLeaveDetails",
  async ({ id, leaveData }, thunkAPI) => {
    try {
      const res = await axios.put(`${API_URL}/updateLeaveDetails/${id}`, leaveData, getAuthHeader());
      return res.data;
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

// Delete Leave
export const db_deleteLeave = createAsyncThunk(
  "leave/deleteLeave",
  async (id, thunkAPI) => {
    try {
      const res = await axios.delete(`${API_URL}/deleteLeave/${id}`, getAuthHeader());
      return { id, ...res.data };
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

// Update Leave Status
export const db_updateLeaveStatus = createAsyncThunk(
  "leave/updateLeaveStatus",
  async ({ id, statusData }, thunkAPI) => {
    try {
      const res = await axios.put(`${API_URL}/updateLeaveStatus/${id}`, statusData, getAuthHeader());
      return res.data;
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

// Get Pending Leaves
export const db_getPendingLeaves = createAsyncThunk(
  "leave/getPendingLeaves",
  async (_, thunkAPI) => {
    try {
      const res = await axios.get(`${API_URL}/getPendingLeaves`, getAuthHeader());
      return res.data.result;
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

// Get Approved Leaves
export const db_getApprovedLeaves = createAsyncThunk(
  "leave/getApprovedLeaves",
  async (_, thunkAPI) => {
    try {
      const res = await axios.get(`${API_URL}/getApprovedLeaves`, getAuthHeader());
      return res.data.result;
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

// Get Rejected Leaves
export const db_getRejectedLeaves = createAsyncThunk(
  "leave/getRejectedLeaves",
  async (_, thunkAPI) => {
    try {
      const res = await axios.get(`${API_URL}/getRejectedLeaves`, getAuthHeader());
      return res.data.result;
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

// Initial State
const initialState = {
  leaves: [],
  userLeaves: [],
  pendingLeaves: [],
  approvedLeaves: [],
  rejectedLeaves: [],
  loading: false,
  error: null,
  success: null,
};

// Slice
const leaveSlice = createSlice({
  name: "leave",
  initialState,
  reducers: {
    db_clearLeaveState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create Leave
      .addCase(db_createLeave.pending, (state) => {
        state.loading = true;
      })
      .addCase(db_createLeave.fulfilled, (state, action) => {
        state.loading = false;
        state.success = "Leave created successfully";
        state.leaves.push(action.payload);
        state.userLeaves.push(action.payload); // ✅ Add this
      })
      .addCase(db_createLeave.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get All Leaves
      .addCase(db_getAllLeaves.pending, (state) => {
        state.loading = true;
      })
      .addCase(db_getAllLeaves.fulfilled, (state, action) => {
        state.loading = false;
        state.leaves = action.payload;
      })
      .addCase(db_getAllLeaves.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get User Leaves
      .addCase(db_getLeavesByUserId.pending, (state) => {
        state.loading = true;
      })
      .addCase(db_getLeavesByUserId.fulfilled, (state, action) => {
        state.loading = false;
        state.userLeaves = action.payload;
      })
      .addCase(db_getLeavesByUserId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update Leave Details
      .addCase(db_updateLeaveDetails.pending, (state) => {
        state.loading = true;
      })
      .addCase(db_updateLeaveDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.success = "Leave updated successfully";
      })
      .addCase(db_updateLeaveDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete Leave
      .addCase(db_deleteLeave.pending, (state) => {
        state.loading = true;
      })
      .addCase(db_deleteLeave.fulfilled, (state, action) => {
        state.loading = false;
        state.success = "Leave deleted successfully";
        state.leaves = state.leaves.filter(leave => leave._id !== action.payload.id);
        state.userLeaves = state.userLeaves.filter(leave => leave._id !== action.payload.id); // ✅ Add this line
      })

      .addCase(db_deleteLeave.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update Leave Status
      .addCase(db_updateLeaveStatus.pending, (state) => {
        state.loading = true;
      })
      .addCase(db_updateLeaveStatus.fulfilled, (state) => {
        state.loading = false;
        state.success = "Leave status updated";
      })
      .addCase(db_updateLeaveStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Pending Leaves
      .addCase(db_getPendingLeaves.pending, (state) => {
        state.loading = true;
      })
      .addCase(db_getPendingLeaves.fulfilled, (state, action) => {
        state.loading = false;
        state.pendingLeaves = action.payload;
      })
      .addCase(db_getPendingLeaves.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Approved Leaves
      .addCase(db_getApprovedLeaves.pending, (state) => {
        state.loading = true;
      })
      .addCase(db_getApprovedLeaves.fulfilled, (state, action) => {
        state.loading = false;
        state.approvedLeaves = action.payload;
      })
      .addCase(db_getApprovedLeaves.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Rejected Leaves
      .addCase(db_getRejectedLeaves.pending, (state) => {
        state.loading = true;
      })
      .addCase(db_getRejectedLeaves.fulfilled, (state, action) => {
        state.loading = false;
        state.rejectedLeaves = action.payload;
      })
      .addCase(db_getRejectedLeaves.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { db_clearLeaveState } = leaveSlice.actions;
export default leaveSlice.reducer;
