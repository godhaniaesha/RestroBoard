import mongoose from "mongoose";
import Leave from "../models/leaveModel.js";
import {
    sendSuccessResponse,
    sendErrorResponse,
    sendBadRequestResponse,
    sendCreatedResponse,
    sendNotFoundResponse,
    sendForbiddenResponse
} from '../utils/ResponseUtils.js';
import { ThrowError } from "../utils/ErrorUtils.js";
import Register from "../models/registerModel.js";

// Create a new Leave
export const createLeave = async (req, res) => {
    try {
        const { emp_name, leave_type, start_date, start_time, end_date, end_time, leave_reason } = req.body;

        if (!emp_name || !leave_type || !start_date || !end_date || !leave_reason) {
            return sendBadRequestResponse(res, "Employee name, leave type, start date, end date, and reason are required.");
        }

        // --- Smart Date Parser (handles YYYY-MM-DD and DD-MM-YYYY) ---
        const parseDate = (dateString) => {
            if (!dateString || typeof dateString !== 'string') return null;

            // Check for YYYY-MM-DD format
            if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
                const date = new Date(dateString);
                return isNaN(date.getTime()) ? null : date;
            }

            // Check for DD-MM-YYYY format
            if (/^\d{2}-\d{2}-\d{4}$/.test(dateString)) {
                const parts = dateString.split('-');
                // new Date(year, monthIndex, day)
                const date = new Date(parts[2], parts[1] - 1, parts[0]);
                return isNaN(date.getTime()) ? null : date;
            }

            // Fallback for direct Date parsing if no regex matches
            const date = new Date(dateString);
            if (!isNaN(date.getTime())) {
                return date;
            }

            return null;
        };

        const parsedStartDate = parseDate(start_date);
        const parsedEndDate = parseDate(end_date);

        // Check if parsing was successful
        if (!parsedStartDate || !parsedEndDate) {
            return sendBadRequestResponse(res, "Invalid date format provided. Please use YYYY-MM-DD or DD-MM-YYYY.");
        }

        // Check for existing leave for the same user with the exact same start and end date and not rejected
        const existingLeave = await Leave.findOne({
            userId: req.user._id,
            leave_status: { $in: ['pending', 'approved'] },
            start_date: parsedStartDate,
            end_date: parsedEndDate
        });
        if (existingLeave) {
            return sendBadRequestResponse(res, "You already have a leave request for these exact dates.");
        }

        const newLeave = await Leave.create({
            userId: req.user._id,
            emp_name,
            leave_type,
            start_date: parsedStartDate,
            start_time,
            end_date: parsedEndDate,
            end_time,
            leave_reason
            // leave_status is defaulted to 'pending' by the model
        });

        const formattedLeave = newLeave.toObject();
        if (formattedLeave.start_date) {
            formattedLeave.start_date = new Date(formattedLeave.start_date).toISOString().split('T')[0];
        }
        if (formattedLeave.end_date) {
            formattedLeave.end_date = new Date(formattedLeave.end_date).toISOString().split('T')[0];
        }

        // After creating the leave
        const user = await Register.findById(req.user._id);
        if (user && ['chef', 'waiter', 'manager'].includes(user.role)) {
            user.leave_balance = (user.leave_balance || 50) - 1;
            await user.save();
        }

        return sendCreatedResponse(res, "Leave created successfully", formattedLeave);
    } catch (error) {
        return ThrowError(res, 500, error.message);
    }
};

// Get all Leaves
export const getAllLeaves = async (req, res) => {
    try {
        const leaves = await Leave.find({});
        if (!leaves || leaves.length === 0) {
            return sendSuccessResponse(res, "No leaves found", []);
        }

        const formattedLeaves = leaves.map(leave => {
            const leaveObj = leave.toObject();
            if (leaveObj.start_date) {
                leaveObj.start_date = new Date(leaveObj.start_date).toISOString().split('T')[0];
            }
            if (leaveObj.end_date) {
                leaveObj.end_date = new Date(leaveObj.end_date).toISOString().split('T')[0];
            }
            return leaveObj;
        });

        return sendSuccessResponse(res, "Leaves fetched successfully", formattedLeaves);
    } catch (error) {
        return ThrowError(res, 500, error.message);
    }
};

// Get a single leave by ID
export const getLeavesByUserId = async (req, res) => {
    try {
        const { userId } = req.params;
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return sendBadRequestResponse(res, "Invalid User ID format");
        }
        const leaves = await Leave.find({ userId });
        if (!leaves || leaves.length === 0) {
            return sendSuccessResponse(res, "No leaves found for this user", []);
        }

        const formattedLeaves = leaves.map(leave => {
            const leaveObj = leave.toObject();
            if (leaveObj.start_date) {
                leaveObj.start_date = new Date(leaveObj.start_date).toISOString().split('T')[0];
            }
            if (leaveObj.end_date) {
                leaveObj.end_date = new Date(leaveObj.end_date).toISOString().split('T')[0];
            }
            return leaveObj;
        });

        return sendSuccessResponse(res, "Leaves fetched successfully", formattedLeaves);
    } catch (error) {
        return ThrowError(res, 500, error.message);
    }
};

// Update leave details (for the user who created it)
export const updateLeaveDetails = async (req, res) => {
    try {
        const { id } = req.params;
        const { emp_name, leave_type, start_date, start_time, end_date, end_time, leave_reason,leave_status,approvedBy,approvedByRole } = req.body;

        const leave = await Leave.findById(id);
        if (!leave) {
            return sendNotFoundResponse(res, "Leave not found");
        }

        // --- Smart Date Parser (handles YYYY-MM-DD and DD-MM-YYYY) ---
        const parseDate = (dateString) => {
            if (!dateString) return null;
            if (/^\\d{4}-\\d{2}-\\d{2}$/.test(dateString)) return new Date(dateString);
            if (/^\\d{2}-\\d{2}-\\d{4}$/.test(dateString)) {
                const parts = dateString.split('-');
                return new Date(parts[2], parts[1] - 1, parts[0]);
            }
            return new Date(dateString);
        };

        if (emp_name) leave.emp_name = emp_name;
        if (leave_type) leave.leave_type = leave_type;
        if (start_date) leave.start_date = parseDate(start_date);
        if (start_time) leave.start_time = start_time;
        if (end_date) leave.end_date = parseDate(end_date);
        if (end_time) leave.end_time = end_time;
        if (leave_reason) leave.leave_reason = leave_reason;
        if (leave_status) leave.leave_status = leave_status;
        if (approvedBy) leave.approvedBy = approvedBy;
        if (approvedByRole) leave.approvedByRole = approvedByRole;

        await leave.save();

        const formattedLeave = leave.toObject();
        if (formattedLeave.start_date) formattedLeave.start_date = new Date(formattedLeave.start_date).toISOString().split('T')[0];
        if (formattedLeave.end_date) formattedLeave.end_date = new Date(formattedLeave.end_date).toISOString().split('T')[0];

        return sendSuccessResponse(res, "Leave details updated successfully", formattedLeave);
    } catch (error) {
        return ThrowError(res, 500, error.message);
    }
};

// Update a leave status (Approve/Reject)
export const updateLeaveStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { leave_status } = req.body;

        if (!leave_status || !['approved', 'rejected'].includes(leave_status)) {
            return sendBadRequestResponse(res, "Invalid status provided. Must be 'approved' or 'rejected'.");
        }

        const leave = await Leave.findById(id);
        if (!leave) {
            return sendNotFoundResponse(res, "Leave not found");
        }

        leave.leave_status = leave_status;
        leave.approvedBy = req.user._id;
        leave.approvedByRole = req.user.role;

        await leave.save();
        return sendSuccessResponse(res, `Leave has been ${leave_status}`, leave);

    } catch (error) {
        return ThrowError(res, 500, error.message);
    }
};

// Delete a leave
export const deleteLeave = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return sendBadRequestResponse(res, "Invalid Leave ID format");
        }

        const leaveToDelete = await Leave.findByIdAndDelete(id);
        if (!leaveToDelete) {
            return sendNotFoundResponse(res, "Leave not found");
        }

        return sendSuccessResponse(res, "Leave deleted successfully");
    } catch (error) {
        return ThrowError(res, 500, error.message);
    }
};

// Get all pending leaves
export const getPendingLeaves = async (req, res) => {
    try {
        const leaves = await Leave.find({ leave_status: 'pending' });
        const formattedLeaves = leaves.map(leave => {
            const leaveObj = leave.toObject();
            const start = leaveObj.start_date ? new Date(leaveObj.start_date).toISOString().split('T')[0] : '';
            const end = leaveObj.end_date ? new Date(leaveObj.end_date).toISOString().split('T')[0] : '';
            leaveObj.Dates = `${start} to ${end}`;
            delete leaveObj.start_date;
            delete leaveObj.end_date;
            return leaveObj;
        });
        if (formattedLeaves.length === 0) {
            return sendSuccessResponse(res, "No Pending leaves found", []);
        }
        return sendSuccessResponse(res, "Pending leaves fetched successfully", formattedLeaves);
    } catch (error) {
        return ThrowError(res, 500, error.message);
    }
};

// Get all approved leaves
export const getApprovedLeaves = async (req, res) => {
    try {
        const leaves = await Leave.find({ leave_status: 'approved' }).populate('approvedBy', 'role');
        const formattedLeaves = leaves.map(leave => {
            const leaveObj = leave.toObject();
            const start = leaveObj.start_date ? new Date(leaveObj.start_date).toISOString().split('T')[0] : '';
            const end = leaveObj.end_date ? new Date(leaveObj.end_date).toISOString().split('T')[0] : '';
            leaveObj.Dates = `${start} to ${end}`;
            delete leaveObj.start_date;
            delete leaveObj.end_date;
            return leaveObj;
        });
        if (formattedLeaves.length === 0) {
            return sendSuccessResponse(res, "No Approved leaves found", []);
        }
        return sendSuccessResponse(res, "Approved leaves fetched successfully", formattedLeaves);
    } catch (error) {
        return ThrowError(res, 500, error.message);
    }
};

// Get all rejected leaves
export const getRejectedLeaves = async (req, res) => {
    try {
        const leaves = await Leave.find({ leave_status: 'rejected' }).populate('approvedBy', 'role');
        const formattedLeaves = leaves.map(leave => {
            const leaveObj = leave.toObject();
            const start = leaveObj.start_date ? new Date(leaveObj.start_date).toISOString().split('T')[0] : '';
            const end = leaveObj.end_date ? new Date(leaveObj.end_date).toISOString().split('T')[0] : '';
            leaveObj.Dates = `${start} to ${end}`;
            delete leaveObj.start_date;
            delete leaveObj.end_date;
            return leaveObj;
        });
        if (formattedLeaves.length === 0) {
            return sendSuccessResponse(res, "No rejected leaves found", []);
        }
        return sendSuccessResponse(res, "Rejected leaves fetched successfully", formattedLeaves);
    } catch (error) {
        return ThrowError(res, 500, error.message);
    }
};