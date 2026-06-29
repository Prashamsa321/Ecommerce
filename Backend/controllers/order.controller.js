import Order from '../models/Order.js';
import Cart from '../models/cart.js';
import Product from '../models/product.js';

// Create new order
export const createOrder = async (req, res) => {
  try {
    const userId = req.user._id;
    const { shippingAddress, paymentMethod, notes } = req.body;

    if (!shippingAddress?.fullName || !shippingAddress?.email || !shippingAddress?.phone || !shippingAddress?.address || !shippingAddress?.city) {
      return res.status(400).json({
        success: false,
        message: 'Complete shipping address is required',
      });
    }

    const cart = await Cart.findOne({ userId });
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Cart is empty',
      });
    }

    const orderItems = cart.items.map((item) => ({
      productId: item.productId,
      name: item.name || 'Product',
      price: item.price,
      quantity: item.quantity,
      image: item.image || '',
    }));

    const allowedPayments = ['COD', 'esewa', 'khalti'];
    let normalizedPayment = paymentMethod || 'COD';
    if (normalizedPayment.toUpperCase() === 'COD') {
      normalizedPayment = 'COD';
    } else {
      normalizedPayment = normalizedPayment.toLowerCase();
    }
    if (!allowedPayments.includes(normalizedPayment)) {
      normalizedPayment = 'COD';
    }

    const totalAmount =
      cart.totalAmount ||
      orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const order = new Order({
      user: userId,
      items: orderItems,
      totalAmount,
      shippingAddress: {
        fullName: shippingAddress.fullName,
        email: shippingAddress.email,
        phone: shippingAddress.phone,
        address: shippingAddress.address,
        city: shippingAddress.city,
        postalCode: shippingAddress.postalCode || '',
        country: shippingAddress.country || 'Nepal',
      },
      paymentMethod: normalizedPayment,
      notes: notes || '',
      orderStatus: 'pending',
      paymentStatus: normalizedPayment === 'khalti' ? 'paid' : 'pending',
      statusHistory: [{
        status: 'pending',
        comment: 'Order placed successfully',
        updatedBy: userId,
      }],
    });

    await order.save();

    cart.items = [];
    cart.totalAmount = 0;
    await cart.save();

    res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      order,
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({
      success: false,
      message: error.name === 'ValidationError' ? 'Invalid order data' : 'Error creating order',
      error: error.message,
    });
  }
};

// Get all orders (admin only)
export const getAllOrders = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const query = {};
    
    if (status) query.orderStatus = status;
    
    const orders = await Order.find(query)
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));
    
    const totalOrders = await Order.countDocuments(query);
    
    res.status(200).json({
      success: true,
      orders,
      totalOrders,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalOrders / limit)
    });
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching orders',
      error: error.message
    });
  }
};

// Get user's orders
export const getUserOrders = async (req, res) => {
  try {
    const userId = req.user._id;
    const orders = await Order.find({ user: userId }).sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      orders
    });
  } catch (error) {
    console.error('Get user orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching orders',
      error: error.message
    });
  }
};

// Get single order
export const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id).populate('user', 'name email');
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }
    
    res.status(200).json({
      success: true,
      order
    });
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching order',
      error: error.message
    });
  }
};

// Update order status (admin only)
export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { orderStatus, trackingNumber, estimatedDelivery, comment } = req.body;
    
    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }
    
    // Update status
    if (orderStatus) {
      order.orderStatus = orderStatus;
      order.statusHistory.push({
        status: orderStatus,
        comment: comment || `Order status updated to ${orderStatus}`,
        updatedBy: req.user._id,
        updatedAt: new Date()
      });
    }
    
    if (trackingNumber) order.trackingNumber = trackingNumber;
    if (estimatedDelivery) order.estimatedDelivery = estimatedDelivery;
    
    await order.save();
    
    res.status(200).json({
      success: true,
      message: 'Order updated successfully',
      order
    });
  } catch (error) {
    console.error('Update order error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating order',
      error: error.message
    });
  }
};

// Delete order (admin only)
export const deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id);
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }
    
    await Order.findByIdAndDelete(id);
    
    res.status(200).json({
      success: true,
      message: 'Order deleted successfully'
    });
  } catch (error) {
    console.error('Delete order error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting order',
      error: error.message
    });
  }
};

// Get order statistics (admin only)
export const getOrderStats = async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const pendingOrders = await Order.countDocuments({ orderStatus: 'pending' });
    const processingOrders = await Order.countDocuments({ orderStatus: 'processing' });
    const shippedOrders = await Order.countDocuments({ orderStatus: 'shipped' });
    const deliveredOrders = await Order.countDocuments({ orderStatus: 'delivered' });
    const cancelledOrders = await Order.countDocuments({ orderStatus: 'cancelled' });
    
    const totalRevenue = await Order.aggregate([
      { $match: { orderStatus: { $ne: 'cancelled' } } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);
    
    res.status(200).json({
      success: true,
      stats: {
        totalOrders,
        pending: pendingOrders,
        processing: processingOrders,
        shipped: shippedOrders,
        delivered: deliveredOrders,
        cancelled: cancelledOrders,
        totalRevenue: totalRevenue[0]?.total || 0
      }
    });
  } catch (error) {
    console.error('Get order stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching statistics',
      error: error.message
    });
  }
};