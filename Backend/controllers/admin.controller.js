import Product from '../models/product.js';
import Order from '../models/Order.js';
import User from '../models/user.js';
import Contact from '../models/Contact.js';

const LOW_STOCK_THRESHOLD = 10;

const getLastMonths = (count = 6) => {
  const months = [];
  const now = new Date();
  for (let i = count - 1; i >= 0; i -= 1) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push({
      key: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`,
      label: d.toLocaleString('en-US', { month: 'short' }),
      start: new Date(d.getFullYear(), d.getMonth(), 1),
      end: new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59, 999),
    });
  }
  return months;
};

const countInRange = (items, start, end, dateField = 'createdAt') =>
  items.filter((item) => {
    const date = new Date(item[dateField]);
    return date >= start && date <= end;
  }).length;

const sumInRange = (items, start, end, valueField = 'totalAmount', dateField = 'createdAt') =>
  items
    .filter((item) => {
      const date = new Date(item[dateField]);
      return date >= start && date <= end;
    })
    .reduce((sum, item) => sum + (item[valueField] || 0), 0);

export const getAdminReports = async (req, res) => {
  try {
    const [products, orders, users, contacts] = await Promise.all([
      Product.find({}).select('name category price stock images createdAt').lean(),
      Order.find({}).select('totalAmount orderStatus paymentMethod paymentStatus createdAt orderNumber user items shippingAddress').populate('user', 'name email').sort({ createdAt: -1 }).lean(),
      User.find({ role: 'user' }).select('name email createdAt').lean(),
      Contact.find({}).select('status createdAt subject').lean(),
    ]);

    const months = getLastMonths(6);
    const nonCancelledOrders = orders.filter((o) => o.orderStatus !== 'cancelled');

    const revenueGrowth = months.map((m) => ({
      month: m.label,
      revenue: sumInRange(nonCancelledOrders, m.start, m.end),
      orders: countInRange(orders, m.start, m.end),
    }));

    const userGrowth = months.map((m) => ({
      month: m.label,
      users: countInRange(users, m.start, m.end),
    }));

    const orderStatusCounts = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'].map((status) => ({
      name: status.charAt(0).toUpperCase() + status.slice(1),
      value: orders.filter((o) => o.orderStatus === status).length,
      status,
    }));

    const paymentMethodCounts = ['COD', 'esewa', 'khalti'].map((method) => ({
      name: method,
      value: orders.filter((o) => (o.paymentMethod || 'COD').toLowerCase() === method.toLowerCase()).length,
    }));

    const categoryMap = products.reduce((acc, product) => {
      const cat = product.category || 'Uncategorized';
      if (!acc[cat]) acc[cat] = { category: cat, products: 0, stock: 0 };
      acc[cat].products += 1;
      acc[cat].stock += product.stock || 0;
      return acc;
    }, {});

    const productsByCategory = Object.values(categoryMap)
      .sort((a, b) => b.products - a.products)
      .slice(0, 8);

    const lowStockProducts = products
      .filter((p) => (p.stock ?? 0) <= LOW_STOCK_THRESHOLD)
      .sort((a, b) => (a.stock ?? 0) - (b.stock ?? 0))
      .slice(0, 15)
      .map((p) => ({
        _id: p._id,
        name: p.name,
        category: p.category,
        stock: p.stock ?? 0,
        price: p.price,
        image: p.images?.[0] || null,
      }));

    const outOfStockCount = products.filter((p) => (p.stock ?? 0) === 0).length;
    const totalRevenue = nonCancelledOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
    const deliveredOrders = orders.filter((o) => o.orderStatus === 'delivered').length;
    const fulfillmentRate = orders.length
      ? Math.round((deliveredOrders / orders.length) * 100)
      : 0;

    const contactStats = {
      total: contacts.length,
      pending: contacts.filter((c) => c.status === 'pending').length,
      read: contacts.filter((c) => c.status === 'read').length,
      replied: contacts.filter((c) => c.status === 'replied').length,
    };

    const recentOrders = orders.slice(0, 8).map((o) => ({
      _id: o._id,
      orderNumber: o.orderNumber,
      customer: o.user?.name || 'Guest',
      email: o.user?.email || o.shippingAddress?.email || '',
      totalAmount: o.totalAmount,
      orderStatus: o.orderStatus,
      paymentMethod: o.paymentMethod,
      createdAt: o.createdAt,
      itemsCount: o.items?.length || 0,
    }));

    const avgOrderValue = nonCancelledOrders.length
      ? Math.round(totalRevenue / nonCancelledOrders.length)
      : 0;

    const inventoryValue = products.reduce(
      (sum, p) => sum + (p.price || 0) * (p.stock || 0),
      0
    );

    res.status(200).json({
      success: true,
      reports: {
        overview: {
          totalProducts: products.length,
          totalOrders: orders.length,
          totalUsers: users.length,
          totalRevenue,
          avgOrderValue,
          fulfillmentRate,
          inventoryValue,
          lowStockCount: lowStockProducts.length,
          outOfStockCount,
          totalContacts: contactStats.total,
        },
        revenueGrowth,
        userGrowth,
        orderStatusCounts,
        paymentMethodCounts,
        productsByCategory,
        lowStockProducts,
        contactStats,
        recentOrders,
        orderStats: {
          pending: orderStatusCounts.find((s) => s.status === 'pending')?.value || 0,
          processing: orderStatusCounts.find((s) => s.status === 'processing')?.value || 0,
          shipped: orderStatusCounts.find((s) => s.status === 'shipped')?.value || 0,
          delivered: deliveredOrders,
          cancelled: orderStatusCounts.find((s) => s.status === 'cancelled')?.value || 0,
        },
      },
    });
  } catch (error) {
    console.error('Admin reports error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching admin reports',
      error: error.message,
    });
  }
};
