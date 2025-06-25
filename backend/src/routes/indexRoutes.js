import express from "express";
import { upload, convertJfifToJpeg } from "../middlewares/imageupload.js";
import { isAdmin, isUser, UserAuth } from "../middlewares/auth.js";
import { createRegister, getRegisterById, updateProfileUser, getAllEmployee, deleteEmployee } from "../controllers/registerController.js";
import { changePassword, forgotPassword, loginUser, logoutUser, resetPassword, VerifyPhone } from "../controllers/loginController.js"
import { createSupplier, deleteSupplier, getAllSuppliers, getSupplierById, updateSupplier } from "../controllers/supplierController.js";
import { createCategory, deleteCategory, getAllCategories, getCategoryById, updateCategory } from "../controllers/categoryController.js";
import { createItem, getAllItems, getItemById, updateItem, deleteItem } from "../controllers/itemController.js";

const indexRoutes = express.Router()

//Regitser Routes
indexRoutes.post("/createRegister", upload.single("image"), convertJfifToJpeg, createRegister)
indexRoutes.get("/getRegisterById/:id", UserAuth, getRegisterById)
indexRoutes.put("/updateProfileUser/:id", UserAuth, upload.single("image"), convertJfifToJpeg, updateProfileUser)
indexRoutes.get("/getAllEmployee", UserAuth, isAdmin, getAllEmployee)
indexRoutes.delete("/deleteEmployee/:id", UserAuth, isAdmin, deleteEmployee)

// Supplier Routes (Admin Only)
indexRoutes.post("/createSupplier", UserAuth, isAdmin, upload.single("supplyer_image"), convertJfifToJpeg, createSupplier);
indexRoutes.get("/getAllSuppliers", UserAuth, isAdmin, getAllSuppliers);
indexRoutes.get("/getSupplierById/:id", UserAuth, isAdmin, getSupplierById);
indexRoutes.put("/updateSupplier/:id", UserAuth, isAdmin, upload.single("supplyer_image"), convertJfifToJpeg, updateSupplier);
indexRoutes.delete("/deleteSupplier/:id", UserAuth, isAdmin, deleteSupplier);

// Category Routes (Admin Only)
indexRoutes.post("/createCategory", UserAuth, isAdmin, upload.single("category_image"), convertJfifToJpeg, createCategory);
indexRoutes.get("/getAllCategories", UserAuth, isAdmin, getAllCategories);
indexRoutes.get("/getCategoryById/:id", UserAuth, isAdmin, getCategoryById);
indexRoutes.put("/updateCategory/:id", UserAuth, isAdmin, upload.single("category_image"), convertJfifToJpeg, updateCategory);
indexRoutes.delete("/deleteCategory/:id", UserAuth, isAdmin, deleteCategory);

//login Routes
indexRoutes.post('/loginUser', loginUser);
indexRoutes.post('/forgotPassword', forgotPassword);
indexRoutes.post('/VerifyPhone', VerifyPhone);
indexRoutes.post('/resetPassword', resetPassword);
indexRoutes.post('/changePassword', UserAuth, changePassword);
indexRoutes.post('/logoutUser', UserAuth, logoutUser);

// Item Routes (Admin Only for create/update/delete)
indexRoutes.post("/createItem", UserAuth, isAdmin, upload.single("item_image"), convertJfifToJpeg, createItem);
indexRoutes.get("/getAllItems", UserAuth, getAllItems);
indexRoutes.get("/getItemById/:id", UserAuth, getItemById);
indexRoutes.put("/updateItem/:id", UserAuth, isAdmin, upload.single("item_image"), convertJfifToJpeg, updateItem);
indexRoutes.delete("/deleteItem/:id", UserAuth, isAdmin, deleteItem);

export default indexRoutes