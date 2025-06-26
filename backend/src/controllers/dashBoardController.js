import registerModel from "../models/registerModel.js";
import Item from "../models/itemModel.js"
import Supplier from "../models/supplierModel.js";
import { ThrowError } from '../utils/ErrorUtils.js';
import { sendSuccessResponse } from "../utils/ResponseUtils.js"

// Get total employees by role
export const getEmployeeCounts = async (req, res) => {
    try {
        const saifCount = await registerModel.countDocuments({ role: 'saif' });
        const waiterCount = await registerModel.countDocuments({ role: 'waiter' });
        const managerCount = await registerModel.countDocuments({ role: 'manager' });
        const total = saifCount + waiterCount + managerCount;
        return sendSuccessResponse(res, "Employee counts fetched successfully", {
            total,
            saif: saifCount,
            waiter: waiterCount,
            manager: managerCount
        });
    } catch (error) {
        return ThrowError(res, 500, error.message);
    }
};

// Get total suppliers
export const getSupplierCount = async (req, res) => {
    try {
        const supplierCount = await Supplier.countDocuments();
        return sendSuccessResponse(res, "Supplier count fetched successfully", { supplier: supplierCount });
    } catch (error) {
        return ThrowError(res, 500, error.message);
    }
};


export const getWeeklyItemAdditions = async (req, res) => {
    try {
        // Find all admin and manager user IDs
        const adminManagerUsers = await registerModel.find({ role: { $in: ['admin', 'manager'] } }, '_id');
        const adminManagerIds = adminManagerUsers.map(user => user._id);

        // Get items added by admin or manager in the last 4 weeks
        const fourWeeksAgo = new Date();
        fourWeeksAgo.setDate(fourWeeksAgo.getDate() - 28);

        const sales = await Item.aggregate([
            {
                $match: {
                    createdAt: { $gte: fourWeeksAgo },
                    createdBy: { $in: adminManagerIds }
                }
            },
            {
                $group: {
                    _id: { $isoWeek: "$createdAt" },
                    totalSales: { $sum: "$price" }
                }
            },
            { $sort: { "_id": 1 } }
        ]);

        return sendSuccessResponse(res, "Weekly item additions fetched successfully", sales);
    } catch (error) {
        return ThrowError(res, 500, error.message);
    }
};

