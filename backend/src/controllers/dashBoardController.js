import registerModel from "../models/registerModel.js";
import Item from "../models/itemModel.js"
import Supplier from "../models/supplierModel.js";
import { ThrowError } from '../utils/ErrorUtils.js';
import { sendSuccessResponse } from "../utils/ResponseUtils.js"


export const getTotalExpense = async (req, res) => {
    try {
        const result = await Item.aggregate([
            {
                $group: {
                    _id: null,
                    totalExpense: { $sum: "$price" }
                }
            }
        ]);
        const totalExpense = result[0]?.totalExpense || 0;
        return sendSuccessResponse(res, "Total expense fetched successfully", { totalExpense });
    } catch (error) {
        return ThrowError(res, 500, error.message);
    }
};

export const getEmployeeCounts = async (req, res) => {
    try {
        const chefCount = await registerModel.countDocuments({ role: 'chef' });
        const waiterCount = await registerModel.countDocuments({ role: 'waiter' });
        const managerCount = await registerModel.countDocuments({ role: 'manager' });
        const total = chefCount + waiterCount + managerCount;
        return sendSuccessResponse(res, "Employee counts fetched successfully", {
            total,
            chef: chefCount,
            waiter: waiterCount,
            manager: managerCount
        });
    } catch (error) {
        return ThrowError(res, 500, error.message);
    }
};

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

        // Fetch items directly
        const items = await Item.find({
            createdAt: { $gte: fourWeeksAgo },
            created_by: { $in: adminManagerIds }
        });

        // Helper to get day name (Mon, Tue, ...)
        function getDayName(date) {
            const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
            return days[new Date(date).getDay()];
        }

        // Aggregate by day
        const dailySales = {};
        items.forEach(item => {
            const day = getDayName(item.createdAt);
            if (!dailySales[day]) {
                dailySales[day] = 0;
            }
            dailySales[day] += item.price || 0;
        });

        // Convert to chart-friendly array (Mon-Sun order)
        const dayOrder = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
        const chartData = dayOrder.map(day => ({
            day,
            totalSales: dailySales[day] || 0
        }));

        return sendSuccessResponse(res, "Daily item additions fetched successfully", chartData);
    } catch (error) {
        return ThrowError(res, 500, error.message);
    }
};

export const getTopSellingProducts = async (req, res) => {
    try {
        // Aggregate top 5 items by total quantity added
        const topProducts = await Item.aggregate([
            {
                $group: {
                    _id: "$item_name",
                    count: { $sum: 1 }
                }
            },
            { $sort: { count: -1 } },
            { $limit: 5 }
        ]);
        return sendSuccessResponse(res, "Top selling products fetched successfully", topProducts);
    } catch (error) {
        return ThrowError(res, 500, error.message);
    }
};

export const getRecentOrders = async (req, res) => {
    try {
        const recentItems = await Item.find({})
            .sort({ createdAt: -1 })
            .populate('category_id')
            .populate('supplier_id')
            .select('item_name quantity createdAt supplier_id category_id price');
        return sendSuccessResponse(res, "Recent orders fetched successfully", recentItems);
    } catch (error) {
        return ThrowError(res, 500, error.message);
    }
};

export const getTotalItems = async (req, res) => {
    try {
        const totalItem = await Item.find().countDocuments()
        return sendSuccessResponse(res, "Total item fetched successfully", { totalItem });
    } catch (error) {
        return ThrowError(res, 500, error.message);
    }
}

export const getTotalValues = async (req, res) => {
    try {
        const result = await Item.aggregate([
            {
                $group: {
                    _id: null,
                    totalPrice: { $sum: "$price" }
                }
            }
        ]);
        const totalPrice = result[0]?.totalPrice || 0;
        return sendSuccessResponse(res, "Total item price sum fetched successfully", { totalPrice });
    } catch (error) {
        return ThrowError(res, 500, error.message);
    }
}

export const getCategoryWiseStock = async (req, res) => {
    try {
        const stock = await Item.aggregate([
            {
                $group: {
                    _id: "$category_id",
                    count: { $sum: 1 }
                }
            },
            {
                $lookup: {
                    from: "categories",
                    localField: "_id",
                    foreignField: "_id",
                    as: "category"
                }
            },
            {
                $unwind: {
                    path: "$category",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $project: {
                    category: { $ifNull: ["$category.category_name", "Unknown"] },
                    count: 1
                }
            },
            { $sort: { count: -1 } }
        ]);
        return sendSuccessResponse(res, "Category-wise stock fetched successfully", stock);
    } catch (error) {
        return ThrowError(res, 500, error.message);
    }
};

export const getLowStockItems = async (req, res) => {
    try {
        // Extract numeric part from quantity and compare with minimum_threshold
        const lowStockItems = await Item.aggregate([
            {
                $addFields: {
                    numericQuantity: {
                        $convert: {
                            input: {
                                $arrayElemAt: [
                                    { $regexFind: { input: "$quantity", regex: /^\\d+(\\.\\d+)?/ } },
                                    "match"
                                ]
                            },
                            to: "double",
                            onError: 0,
                            onNull: 0
                        }
                    }
                }
            },
            {
                $match: {
                    $expr: { $lte: ["$numericQuantity", "$minimum_threshold"] }
                }
            }
        ]);
        // Populate category_id and supplier_id
        const populated = await Item.populate(lowStockItems, [
            { path: "category_id", select: "category_name" },
            { path: "supplier_id", select: "name" }
        ]);
        return sendSuccessResponse(res, "Low stock items fetched successfully", populated);
    } catch (error) {
        return ThrowError(res, 500, error.message);
    }
};

export const getOutOfStockItems = async (req, res) => {
    try {
        const outOfStockItems = await Item.aggregate([
            {
                $addFields: {
                    numericQuantity: {
                        $convert: {
                            input: {
                                $arrayElemAt: [
                                    { $regexFind: { input: "$quantity", regex: /^\\d+(\\.\\d+)?/ } },
                                    "match"
                                ]
                            },
                            to: "double",
                            onError: 0,
                            onNull: 0
                        }
                    }
                }
            },
            {
                $match: {
                    numericQuantity: 0
                }
            }
        ]);
        // Populate category_id and supplier_id
        const populated = await Item.populate(outOfStockItems, [
            { path: "category_id", select: "category_name" },
            { path: "supplier_id", select: "name" }
        ]);
        return sendSuccessResponse(res, "Out of stock items fetched successfully", populated);
    } catch (error) {
        return ThrowError(res, 500, error.message);
    }
};
