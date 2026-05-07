// backend/routes/cart.route.js
import express from "express";
import { 
  getCart, 
  addToCart, 
  increaseCartQty, 
  decreaseCartQty, 
  removeFromCart 
} from "../controllers/cart.controller.js";  // Import all from one file
import { protect, userOnly } from "../middleware/auth.middleware.js";

const router = express.Router();

// All routes require authentication and user role (not admin)
// router.use(protect, userOnly);

// Cart routes
router.get("/getcart", getCart);
router.post("/addtocart", addToCart);
router.put("/increase", increaseCartQty);
router.put("/decrease", decreaseCartQty);
router.delete("/remove/:productId", removeFromCart);

export default router;