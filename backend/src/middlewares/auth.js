import jwt from "jsonwebtoken";
import registerModel from "../models/registerModel.js";
import Leave from '../models/leaveModel.js';
import mongoose from "mongoose";
import {
    sendErrorResponse,
    sendForbiddenResponse,
    sendUnauthorizedResponse,
    sendNotFoundResponse,
    sendBadRequestResponse
} from '../utils/ResponseUtils.js';

export const UserAuth = async (req, res, next) => {
    try {
        // Check if JWT_SECRET is properly configured
        if (!process.env.JWT_SECRET) {
            console.error('JWT_SECRET is not configured');
            return sendErrorResponse(res, 500, 'Server configuration error');
        }

        const token = req.header('Authorization')?.replace('Bearer ', '');

        if (!token) {
            return sendUnauthorizedResponse(res, "Access denied. No token provided.");
        }

        try {
            const decodedObj = jwt.verify(token, process.env.JWT_SECRET);
            const { _id, role, isAdmin } = decodedObj;

            const user = await registerModel.findById(_id).select('-password');
            if (!user) {
                return sendNotFoundResponse(res, "User not found");
            }

            // Set user information in request
            req.user = {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role || 'user',
                isAdmin: user.role === 'admin'
            };

            next();
        } catch (err) {
            console.error('Token verification error:', err);
            return sendUnauthorizedResponse(res, "Invalid token.");
        }
    } catch (error) {
        return sendErrorResponse(res, 500, error.message);
    }
};

export const isAdmin = async (req, res, next) => {
    try {
        if (!req.user || !req.user.isAdmin) {
            return sendForbiddenResponse(res, "Access denied. Admin privileges required.");
        }
        next();
    } catch (error) {
        return sendErrorResponse(res, 500, error.message);
    }
};

export const isManager = async (req, res, next) => {
    try {
        if (!req.user || req.user.role !== 'manager') {
            return sendForbiddenResponse(res, "Access denied. Manager privileges required.");
        }
        next();
    } catch (error) {
        return sendErrorResponse(res, 500, error.message);
    }
};

export const canCreateLeave = (req, res, next) => {
    const { role } = req.user;
    if (role === 'manager' || role === 'saif' || role === 'waiter') {
        return next();
    }
    return sendForbiddenResponse(res, "Access denied. Only Managers, Saifs, and Waiters can create leave requests.");
};

export const canChangeLeaveStatus = async (req, res, next) => {
    try {
        const leaveId = req.params.id;
        if (!mongoose.Types.ObjectId.isValid(leaveId)) {
            return sendBadRequestResponse(res, "Invalid Leave ID format");
        }

        const leave = await Leave.findById(leaveId).populate('userId', 'role');
        if (!leave) {
            return sendNotFoundResponse(res, "Leave not found");
        }

        const leaveOwnerRole = leave.userId.role;
        const currentUser = req.user;

        if (String(leave.userId._id) === String(currentUser._id)) {
            return sendForbiddenResponse(res, "You cannot approve or reject your own leave request.");
        }

        if ((leaveOwnerRole === 'saif' || leaveOwnerRole === 'waiter') && (currentUser.role === 'manager' || currentUser.isAdmin)) {
            return next();
        }

        if (leaveOwnerRole === 'manager' && currentUser.isAdmin) {
            return next();
        }

        return sendForbiddenResponse(res, "You do not have permission to change the status of this leave request.");
    } catch (error) {
        return sendErrorResponse(res, 500, error.message);
    }
};

export const canUpdateLeaveDetails = async (req, res, next) => {
    try {
        const leaveId = req.params.id;
        if (!mongoose.Types.ObjectId.isValid(leaveId)) {
            return sendBadRequestResponse(res, "Invalid Leave ID format");
        }

        const leave = await Leave.findById(leaveId);
        if (!leave) {
            return sendNotFoundResponse(res, "Leave not found");
        }

        if (String(leave.userId) !== String(req.user._id)) {
            return sendForbiddenResponse(res, "You can only update your own leave requests.");
        }

        if (leave.leave_status !== 'pending') {
            return sendForbiddenResponse(res, `You cannot update a leave that has already been ${leave.leave_status}.`);
        }

        next();
    } catch (error) {
        return sendErrorResponse(res, 500, error.message);
    }
};

export const canViewLeaveDetails = async (req, res, next) => {
    try {
        const { id: leaveId } = req.params;
        const currentUser = req.user;

        // Admins and managers can view any leave request.
        if (currentUser.isAdmin || currentUser.role === 'manager') {
            return next();
        }

        if (!mongoose.Types.ObjectId.isValid(leaveId)) {
            return sendBadRequestResponse(res, "Invalid Leave ID format");
        }

        const leave = await Leave.findById(leaveId);
        if (!leave) {
            return sendNotFoundResponse(res, "Leave not found");
        }

        // A user can view their own leave request.
        if (String(leave.userId) === String(currentUser._id)) {
            return next();
        }

        // If none of the above, deny access.
        return sendForbiddenResponse(res, "Access denied. You do not have permission to view this leave request.");

    } catch (error) {
        return sendErrorResponse(res, 500, error.message);
    }
};

export const canViewUserLeaves = async (req, res, next) => {
    try {
        const { userId } = req.params;
        const currentUser = req.user;
        if (currentUser.isAdmin || currentUser.role === 'manager' || String(currentUser._id) === String(userId)) {
            return next();
        }
        return sendForbiddenResponse(res, "Access denied. You do not have permission to view these leaves.");
    } catch (error) {
        return sendErrorResponse(res, 500, error.message);
    }
};

export const canDeleteOwnLeave = async (req, res, next) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return sendBadRequestResponse(res, "Invalid Leave ID format");
        }
        const leave = await Leave.findById(id);
        if (!leave) {
            return sendNotFoundResponse(res, "Leave not found");
        }
        // Allow if user is owner
        if (String(leave.userId) === String(req.user._id)) {
            return next();
        }
        // Optionally, allow admin to delete any leave:
        // if (req.user.isAdmin) return next();
        return sendForbiddenResponse(res, "You can only delete your own leave.");
    } catch (error) {
        return sendErrorResponse(res, 500, error.message);
    }
}; 
