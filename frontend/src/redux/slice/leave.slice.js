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
  async (leaveData, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${API_URL}/createLeave`, leaveData, getAuthHeader());
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Error creating leave");
    }
  }
);

// Get All Leaves (admin/manager only)
export const db_getAllLeaves = createAsyncThunk(
  "leave/getAllLeaves",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${API_URL}/getAllLeaves`, getAuthHeader());
      return res.data.result;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Error getting all leaves");
    }
  }
);

// Get Leaves by User ID
export const db_getLeavesByUserId = createAsyncThunk(
  "leave/getLeavesByUserId",
  async (userId, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${API_URL}/getLeavesByUserId/${userId}`, getAuthHeader());
      return res.data.result;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Error getting user leaves");
    }
  }
);

// Update Leave Details
export const db_updateLeaveDetails = createAsyncThunk(
  "leave/updateLeaveDetails",
  async ({ id, leaveData }, { rejectWithValue }) => {
    try {
      const res = await axios.put(`${API_URL}/updateLeaveDetails/${id}`, leaveData, getAuthHeader());
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Error updating leave");
    }
  }
);

// Delete Leave
export const db_deleteLeave = createAsyncThunk(
  "leave/deleteLeave",
  async (id, { rejectWithValue }) => {
    try {
      const res = await axios.delete(`${API_URL}/deleteLeave/${id}`, getAuthHeader());
      return { id, ...res.data };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Error deleting leave");
    }
  }
);

// Update Leave Status
export const db_updateLeaveStatus = createAsyncThunk(
  "leave/updateLeaveStatus",
  async ({ id, statusData }, { rejectWithValue }) => {
    try {
      const res = await axios.put(`${API_URL}/updateLeaveStatus/${id}`, statusData, getAuthHeader());
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Error updating status");
    }
  }
);

// Get Pending Leaves
export const db_getPendingLeaves = createAsyncThunk(
  "leave/getPendingLeaves",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${API_URL}/getPendingLeaves`, getAuthHeader());
      return res.data.result;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Error getting pending leaves");
    }
  }
);

// Get Approved Leaves
export const db_getApprovedLeaves = createAsyncThunk(
  "leave/getApprovedLeaves",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${API_URL}/getApprovedLeaves`, getAuthHeader());
      return res.data.result;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Error getting approved leaves");
    }
  }
);

// Get Rejected Leaves
export const db_getRejectedLeaves = createAsyncThunk(
  "leave/getRejectedLeaves",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${API_URL}/getRejectedLeaves`, getAuthHeader());
      return res.data.result;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Error getting rejected leaves");
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
