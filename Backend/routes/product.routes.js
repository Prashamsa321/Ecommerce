import express from "express";
import {
  createProduct,
  getProducts,
  getProductById,
  deleteProduct,
  updateProduct,
} from "../controllers/product.controller.js";

import { protect, admin } from "../middleware/auth.middleware.js";

const router = express.Router();

// Public
router.get("/getproduct", getProducts);
router.get("/:id", getProductById);

// Admin only
router.post("/createproduct", protect, admin, createProduct);
router.delete("/delete/:id", protect, admin, deleteProduct);
router.put("/update/:id", protect, admin, updateProduct);

export default router;