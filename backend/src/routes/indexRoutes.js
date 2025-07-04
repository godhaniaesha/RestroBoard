import express from "express";
import { upload, convertJfifToJpeg } from "../middlewares/imageupload.js";
import { isAdmin, UserAuth, canCreateLeave, canChangeLeaveStatus, canUpdateLeaveDetails, canViewLeaveDetails, canDeleteOwnLeave, canViewUserLeaves } from "../middlewares/auth.js";
import { createRegister, getRegisterById, updateProfileUser, getAllEmployee, deleteEmployee } from "../controllers/registerController.js";
import { changePassword, forgotPassword, loginUser, logoutUser, resetPassword, VerifyPhone } from "../controllers/loginController.js"
import { createSupplier, deleteSupplier, getAllSuppliers, getSupplierById, updateSupplier } from "../controllers/supplierController.js";
import { createCategory, deleteCategory, getAllCategories, getCategoryById, updateCategory } from "../controllers/categoryController.js";
import { createItem, getAllItems, getItemById, updateItem, deleteItem } from "../controllers/itemController.js";
import { createHotel, deleteHotel, getAllHotel, getHotelById, updateHotel } from "../controllers/hotelController.js";
import { createDish, deleteDish, getAllDish, getDishById, updateDish } from "../controllers/dishController.js";
import { createLeave, getAllLeaves, getLeavesByUserId, updateLeaveDetails, updateLeaveStatus, deleteLeave, getPendingLeaves, getApprovedLeaves, getRejectedLeaves } from "../controllers/leaveController.js";
import { getTotalExpense, getEmployeeCounts, getSupplierCount, getWeeklyItemAdditions, getTopSellingProducts, getRecentOrders, getTotalItems, getTotalValues, getCategoryWiseStock, getLowStockItems, getOutOfStockItems } from "../controllers/dashBoardController.js";

const indexRoutes = express.Router()

// Add isAdminOrManager middleware
const isAdminOrManager = (req, res, next) => {
    console.log('req.user', req.user)
    if (req.user && (req.user.isAdmin || req.user.role === 'manager')) {
        return next();
    }
    return res.status(403).json({ message: 'Access denied. Admin or Manager privileges required.' });
};

// Regitser Routes
indexRoutes.post("/createRegister", upload.single("image"), convertJfifToJpeg, createRegister)
indexRoutes.get("/getRegisterById/:id", UserAuth, getRegisterById)
indexRoutes.put("/updateProfileUser/:id", UserAuth, upload.single("image"), convertJfifToJpeg, updateProfileUser)
indexRoutes.get("/getAllEmployee", UserAuth, isAdminOrManager, getAllEmployee)
indexRoutes.delete("/deleteEmployee/:id", UserAuth, isAdminOrManager, deleteEmployee)

// Supplier Routes (Admin or Manager)
indexRoutes.post("/createSupplier", UserAuth, isAdminOrManager, upload.single("supplyer_image"), convertJfifToJpeg, createSupplier);
indexRoutes.get("/getAllSuppliers", UserAuth, isAdminOrManager, getAllSuppliers);
indexRoutes.get("/getSupplierById/:id", UserAuth, isAdminOrManager, getSupplierById);
indexRoutes.put("/updateSupplier/:id", UserAuth, isAdminOrManager, upload.single("supplyer_image"), convertJfifToJpeg, updateSupplier);
indexRoutes.delete("/deleteSupplier/:id", UserAuth, isAdminOrManager, deleteSupplier);

// Category Routes (Admin or Manager)
indexRoutes.post("/createCategory", UserAuth, isAdminOrManager, upload.single("category_image"), convertJfifToJpeg, createCategory);
indexRoutes.get("/getAllCategories", UserAuth, isAdminOrManager, getAllCategories);
indexRoutes.get("/getCategoryById/:id", UserAuth, isAdminOrManager, getCategoryById);
indexRoutes.put("/updateCategory/:id", UserAuth, isAdminOrManager, upload.single("category_image"), convertJfifToJpeg, updateCategory);
indexRoutes.delete("/deleteCategory/:id", UserAuth, isAdminOrManager, deleteCategory);

//login Routes
indexRoutes.post('/loginUser', loginUser);
indexRoutes.post('/forgotPassword', forgotPassword);
indexRoutes.post('/VerifyPhone', VerifyPhone);
indexRoutes.post('/resetPassword', resetPassword);
indexRoutes.post('/changePassword', UserAuth, changePassword);
indexRoutes.post('/logoutUser', UserAuth, logoutUser);

// Item Routes 
indexRoutes.post("/createItem", UserAuth, isAdminOrManager, upload.single("item_image"), convertJfifToJpeg, createItem);
indexRoutes.get("/getAllItems", UserAuth, getAllItems);
indexRoutes.get("/getItemById/:id", UserAuth, getItemById);
indexRoutes.put("/updateItem/:id", UserAuth, isAdminOrManager, upload.single("item_image"), convertJfifToJpeg, updateItem);
indexRoutes.delete("/deleteItem/:id", UserAuth, isAdminOrManager, deleteItem);

// Hotel Routes 
indexRoutes.post("/createHotel", UserAuth, isAdminOrManager, upload.single("hotel_image"), convertJfifToJpeg, createHotel);
indexRoutes.get("/getAllHotel", UserAuth, getAllHotel);
indexRoutes.get("/getHotelById/:id", UserAuth, getHotelById);
indexRoutes.put("/updateHotel/:id", UserAuth, isAdminOrManager, upload.single("hotel_image"), convertJfifToJpeg, updateHotel);
indexRoutes.delete("/deleteHotel/:id", UserAuth, isAdminOrManager, deleteHotel);

// Dish Routes 
indexRoutes.post("/createDish", UserAuth, isAdminOrManager, upload.single("dish_image"), convertJfifToJpeg, createDish);
indexRoutes.get("/getAllDish", UserAuth, getAllDish);
indexRoutes.get("/getDishById/:id", UserAuth, getDishById);
indexRoutes.put("/updateDish/:id", UserAuth, isAdminOrManager, upload.single("dish_image"), convertJfifToJpeg, updateDish);
indexRoutes.delete("/deleteDish/:id", UserAuth, isAdminOrManager, deleteDish);

// Leave Routes
indexRoutes.post("/createLeave", UserAuth, canCreateLeave, createLeave);
indexRoutes.get("/getAllLeaves", UserAuth, getAllLeaves);
indexRoutes.get("/getLeavesByUserId/:userId", UserAuth, canViewUserLeaves, getLeavesByUserId);
indexRoutes.put("/updateLeaveDetails/:id", UserAuth, canUpdateLeaveDetails, updateLeaveDetails);
indexRoutes.delete("/deleteLeave/:id", UserAuth, canDeleteOwnLeave, deleteLeave);
indexRoutes.put("/updateLeaveStatus/:id", UserAuth, canChangeLeaveStatus, updateLeaveStatus);
indexRoutes.get("/getPendingLeaves", UserAuth, canViewUserLeaves, getPendingLeaves);
indexRoutes.get("/getApprovedLeaves", UserAuth, canViewUserLeaves, getApprovedLeaves);
indexRoutes.get("/getRejectedLeaves", UserAuth, canViewUserLeaves, getRejectedLeaves);

//dashBoard Routes
indexRoutes.get("/getTotalExpense", UserAuth, isAdminOrManager, getTotalExpense);
indexRoutes.get("/getEmployeeCounts", UserAuth, isAdminOrManager, getEmployeeCounts);
indexRoutes.get("/getSupplierCount", UserAuth, isAdminOrManager, getSupplierCount);
indexRoutes.get("/getWeeklyItemAdditions", UserAuth, isAdminOrManager, getWeeklyItemAdditions);
indexRoutes.get("/getTopSellingProducts", UserAuth, isAdminOrManager, getTopSellingProducts);
indexRoutes.get("/getRecentOrders", UserAuth, isAdminOrManager, getRecentOrders);
indexRoutes.get("/getTotalItems", UserAuth, isAdminOrManager, getTotalItems);
indexRoutes.get("/getTotalValues", UserAuth, isAdminOrManager, getTotalValues);
indexRoutes.get("/getCategoryWiseStock", UserAuth, isAdminOrManager, getCategoryWiseStock);
indexRoutes.get("/getLowStockItems", UserAuth, isAdminOrManager, getLowStockItems);
indexRoutes.get("/getOutOfStockItems", UserAuth, isAdminOrManager, getOutOfStockItems);

export default indexRoutes