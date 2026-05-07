// backend/controllers/cart.controller.js (updated with all methods)
import { Cart } from "../models/cart.model.js";
import { Product } from "../models/product.model.js";
import mongoose from "mongoose";

// GET /api/cart/getcart
export const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id })
      .populate("items.product");

    if (!cart) return res.json({ items: [] });
    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/cart/addtocart
export const addToCart = async (req, res) => {
  try {
    const productId = new mongoose.Types.ObjectId(req.body.productId);
    const qty = Number(req.body.qty) || 1;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      cart = await Cart.create({
        user: req.user._id,
        items: [],
      });
    }

    const existingItem = cart.items.find(
      (i) => i.product.toString() === productId.toString()
    );

    if (existingItem) {
      return res.status(400).json({
        message: "Item already in cart",
      });
    }

    if (qty > product.countInStock) {
      return res.status(400).json({
        message: `Only ${product.countInStock} items available.`,
      });
    }

    cart.items.push({
      product: product._id,
      qty,
    });

    await cart.save();
    const populatedCart = await Cart.findById(cart._id).populate("items.product");
    res.status(200).json(populatedCart);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/cart/increase
export const increaseCartQty = async (req, res) => {
  try {
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({ message: "Product ID is required" });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const item = cart.items.find(
      (i) => i.product.toString() === productId
    );

    if (!item) {
      return res.status(404).json({ message: "Item not in cart" });
    }

    const currentQty = Number(item.qty) || 0;
    const stock = Number(product.countInStock) || 0;
    const newQty = currentQty + 1;

    if (newQty > stock) {
      return res.status(400).json({
        message: `${stock} items available. You already have ${currentQty} in cart.`,
      });
    }

    item.qty = newQty;
    await cart.save();

    const populatedCart = await Cart.findById(cart._id).populate("items.product");
    return res.status(200).json(populatedCart);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// PUT /api/cart/decrease
export const decreaseCartQty = async (req, res) => {
  try {
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({ message: "Product ID is required" });
    }

    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const item = cart.items.find(
      (i) => i.product.toString() === productId
    );

    if (!item) {
      return res.status(404).json({ message: "Item not in cart" });
    }

    if (item.qty <= 1) {
      return res.status(400).json({
        message: "Minimum quantity is 1. Use remove option to delete item.",
      });
    }

    item.qty -= 1;
    await cart.save();

    const populatedCart = await Cart.findById(cart._id).populate("items.product");
    return res.status(200).json(populatedCart);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// DELETE /api/cart/remove/:productId
export const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;

    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    cart.items = cart.items.filter(
      (i) => i.product.toString() !== productId
    );

    await cart.save();

    const populatedCart = await Cart.findById(cart._id).populate("items.product");
    return res.status(200).json(populatedCart);
  } catch (err) {
    console.error("Remove from cart error:", err);
    return res.status(500).json({ message: err.message });
  }
};