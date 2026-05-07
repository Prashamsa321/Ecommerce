// Install cors first: npm install cors

import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";  // Add this
import authRoutes from "./routes/auth.routes.js";
import productRoutes from "./routes/product.routes.js";
import cartRoutes from "./routes/cart.route.js";

const app = express();

// Add CORS middleware BEFORE other middleware
app.use(cors({
  origin: 'http://localhost:3000',  // Your frontend URL
  credentials: true,  // Allow cookies to be sent/received
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Your routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);

app.get("/", (req, res) => {
  res.status(200).json({
    message: "API is running successfully",
  });
});

export default app;