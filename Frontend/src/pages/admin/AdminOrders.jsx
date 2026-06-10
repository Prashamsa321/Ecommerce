import React, { useState } from 'react';
import { useToast } from '../../context/ToastContext';

const AdminOrders = () => {
  const { success, error: toastError } = useToast();
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [statusComment, setStatusComment] = useState('');
  const [orders, setOrders] = useState([
    {
      _id: "ORD-001",
      orderNumber: "ORD-2024-0001",
      user: { name: "Prashamsa Lamsal", email: "prashamsa@gmail.com" },
      items: [
        { name: "iPhone 15 Pro", quantity: 1, price: 150000, image: null },
        { name: "AirPods Pro", quantity: 1, price: 35000, image: null }
      ],
      totalAmount: 185000,
      orderStatus: "delivered",
      paymentMethod: "esewa",
      paymentStatus: "paid",
      shippingAddress: {
        fullName: "Prashamsa Lamsal",
        email: "prashamsa@gmail.com",
        phone: "9800000000",
        address: "Hall Chowk",
        city: "Kawasoti"
      },
      createdAt: "2024-01-15T10:30:00",
      statusHistory: [
        { status: "pending", comment: "Order placed", updatedAt: "2024-01-15T10:30:00" },
        { status: "processing", comment: "Payment confirmed", updatedAt: "2024-01-15T11:00:00" },
        { status: "shipped", comment: "Order shipped via courier", updatedAt: "2024-01-16T09:00:00" },
        { status: "delivered", comment: "Delivered to customer", updatedAt: "2024-01-18T14:30:00" }
      ]
    },
    {
      _id: "ORD-002",
      orderNumber: "ORD-2024-0002",
      user: { name: "Ramesh Sharma", email: "ramesh@example.com" },
      items: [
        { name: "Samsung Galaxy S24", quantity: 1, price: 120000, image: null },
        { name: "Galaxy Watch 6", quantity: 1, price: 45000, image: null }
      ],
      totalAmount: 165000,
      orderStatus: "shipped",
      paymentMethod: "khalti",
      paymentStatus: "paid",
      shippingAddress: {
        fullName: "Ramesh Sharma",
        email: "ramesh@example.com",
        phone: "9812345678",
        address: "Baneshwor",
        city: "Kathmandu"
      },
      createdAt: "2024-01-16T14:20:00",
      statusHistory: [
        { status: "pending", comment: "Order placed", updatedAt: "2024-01-16T14:20:00" },
        { status: "processing", comment: "Payment verified", updatedAt: "2024-01-16T15:00:00" },
        { status: "shipped", comment: "Out for delivery", updatedAt: "2024-01-17T10:00:00" }
      ]
    },
    {
      _id: "ORD-003",
      orderNumber: "ORD-2024-0003",
      user: { name: "Sita Gurung", email: "sita@example.com" },
      items: [
        { name: "MacBook Pro M3", quantity: 1, price: 250000, image: null },
        { name: "Magic Mouse", quantity: 1, price: 12000, image: null }
      ],
      totalAmount: 262000,
      orderStatus: "processing",
      paymentMethod: "cod",
      paymentStatus: "pending",
      shippingAddress: {
        fullName: "Sita Gurung",
        email: "sita@example.com",
        phone: "9856789012",
        address: "Lakeside",
        city: "Pokhara"
      },
      createdAt: "2024-01-17T09:45:00",
      statusHistory: [
        { status: "pending", comment: "Order placed", updatedAt: "2024-01-17T09:45:00" },
        { status: "processing", comment: "Order confirmed", updatedAt: "2024-01-17T10:30:00" }
      ]
    },
    {
      _id: "ORD-004",
      orderNumber: "ORD-2024-0004",
      user: { name: "Bikash Thapa", email: "bikash@example.com" },
      items: [
        { name: "PlayStation 5", quantity: 1, price: 85000, image: null },
        { name: "DualSense Controller", quantity: 2, price: 8000, image: null }
      ],
      totalAmount: 101000,
      orderStatus: "pending",
      paymentMethod: "cod",
      paymentStatus: "pending",
      shippingAddress: {
        fullName: "Bikash Thapa",
        email: "bikash@example.com",
        phone: "9876543210",
        address: "New Road",
        city: "Butwal"
      },
      createdAt: "2024-01-18T16:15:00",
      statusHistory: [
        { status: "pending", comment: "Order placed - awaiting payment", updatedAt: "2024-01-18T16:15:00" }
      ]
    },
    {
      _id: "ORD-005",
      orderNumber: "ORD-2024-0005",
      user: { name: "Aarav Shrestha", email: "aarav@example.com" },
      items: [
        { name: "Dell XPS 15", quantity: 1, price: 180000, image: null },
        { name: "Logitech Mouse", quantity: 1, price: 5000, image: null }
      ],
      totalAmount: 185000,
      orderStatus: "delivered",
      paymentMethod: "esewa",
      paymentStatus: "paid",
      shippingAddress: {
        fullName: "Aarav Shrestha",
        email: "aarav@example.com",
        phone: "9834567890",
        address: "Jawalakhel",
        city: "Lalitpur"
      },
      createdAt: "2024-01-10T11:00:00",
      statusHistory: [
        { status: "pending", comment: "Order placed", updatedAt: "2024-01-10T11:00:00" },
        { status: "processing", comment: "Payment confirmed", updatedAt: "2024-01-10T12:00:00" },
        { status: "shipped", comment: "Shipped via DHL", updatedAt: "2024-01-11T09:00:00" },
        { status: "delivered", comment: "Delivered successfully", updatedAt: "2024-01-13T15:00:00" }
      ]
    },
    {
      _id: "ORD-006",
      orderNumber: "ORD-2024-0006",
      user: { name: "Riya Karki", email: "riya@example.com" },
      items: [
        { name: "iPad Pro", quantity: 1, price: 120000, image: null },
        { name: "Apple Pencil", quantity: 1, price: 15000, image: null }
      ],
      totalAmount: 135000,
      orderStatus: "cancelled",
      paymentMethod: "khalti",
      paymentStatus: "refunded",
      shippingAddress: {
        fullName: "Riya Karki",
        email: "riya@example.com",
        phone: "9845678901",
        address: "Bharatpur",
        city: "Chitwan"
      },
      createdAt: "2024-01-14T13:30:00",
      statusHistory: [
        { status: "pending", comment: "Order placed", updatedAt: "2024-01-14T13:30:00" },
        { status: "cancelled", comment: "Customer requested cancellation", updatedAt: "2024-01-14T15:00:00" }
      ]
    }
  ]);

  const statusOptions = [
    { value: 'pending', label: 'Pending', color: 'bg-amber-500/20 text-amber-400 border-amber-500/30', icon: '⏳', message: 'Order status updated to Pending' },
    { value: 'processing', label: 'Processing', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30', icon: '⚙️', message: 'Order status updated to Processing' },
    { value: 'shipped', label: 'Shipped', color: 'bg-purple-500/20 text-purple-400 border-purple-500/30', icon: '🚚', message: 'Order status updated to Shipped' },
    { value: 'delivered', label: 'Delivered', color: 'bg-green-500/20 text-green-400 border-green-500/30', icon: '✅', message: 'Order status updated to Delivered' },
    { value: 'cancelled', label: 'Cancelled', color: 'bg-red-500/20 text-red-400 border-red-500/30', icon: '❌', message: 'Order status updated to Cancelled' }
  ];

  const getStatusBadge = (status) => {
    const badges = {
      pending: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
      processing: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      shipped: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
      delivered: 'bg-green-500/20 text-green-400 border-green-500/30',
      cancelled: 'bg-red-500/20 text-red-400 border-red-500/30'
    };
    return badges[status] || badges.pending;
  };

  const getStatusLabel = (status) => {
    const labels = {
      pending: 'Pending',
      processing: 'Processing',
      shipped: 'Shipped',
      delivered: 'Delivered',
      cancelled: 'Cancelled'
    };
    return labels[status] || status;
  };

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setIsDetailsModalOpen(true);
  };

  const handleUpdateStatus = (order) => {
    setSelectedOrder(order);
    setNewStatus(order.orderStatus);
    setStatusComment('');
    setIsStatusModalOpen(true);
  };

  const handleConfirmStatusUpdate = () => {
    const updatedOrders = orders.map(order => {
      if (order._id === selectedOrder._id) {
        const newStatusHistory = [
          ...order.statusHistory,
          {
            status: newStatus,
            comment: statusComment || `Order status updated to ${newStatus}`,
            updatedAt: new Date().toISOString()
          }
        ];
        return {
          ...order,
          orderStatus: newStatus,
          statusHistory: newStatusHistory
        };
      }
      return order;
    });
    
    setOrders(updatedOrders);
    setIsStatusModalOpen(false);
    setSelectedOrder(null);
    
    // Show success toast message
    const statusMessage = statusOptions.find(opt => opt.value === newStatus)?.message || 'Order status updated successfully';
    success(statusMessage);
    
    setNewStatus('');
    setStatusComment('');
  };

  const getStatusIcon = (status) => {
    const icons = {
      pending: '⏳',
      processing: '⚙️',
      shipped: '🚚',
      delivered: '✅',
      cancelled: '❌'
    };
    return icons[status] || '📦';
  };

  const stats = {
    totalOrders: orders.length,
    totalRevenue: orders.reduce((sum, order) => sum + order.totalAmount, 0),
    pending: orders.filter(o => o.orderStatus === 'pending').length,
    processing: orders.filter(o => o.orderStatus === 'processing').length,
    shipped: orders.filter(o => o.orderStatus === 'shipped').length,
    delivered: orders.filter(o => o.orderStatus === 'delivered').length,
    cancelled: orders.filter(o => o.orderStatus === 'cancelled').length
  };

  return (
    <div className="space-y-4 sm:space-y-6 p-4 sm:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white">Orders Management</h1>
          <p className="text-slate-400 text-sm sm:text-base mt-1">View and manage customer orders</p>
        </div>
        <div className="text-xs sm:text-sm text-slate-400 bg-slate-800/50 px-3 py-1.5 rounded-full self-start sm:self-auto">
          {stats.totalOrders} Total Orders
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-slate-800 rounded-xl p-3 sm:p-4 border border-slate-700">
          <div className="text-xl sm:text-2xl mb-1">📦</div>
          <div className="text-xl sm:text-2xl font-bold text-white">{stats.totalOrders}</div>
          <div className="text-xs text-slate-400">Total Orders</div>
        </div>
        <div className="bg-emerald-500/10 rounded-xl p-3 sm:p-4 border border-emerald-500/20">
          <div className="text-xl sm:text-2xl mb-1">💰</div>
          <div className="text-lg sm:text-2xl font-bold text-emerald-400">रू {stats.totalRevenue.toLocaleString()}</div>
          <div className="text-xs text-slate-400">Total Revenue</div>
        </div>
        <div className="bg-amber-500/10 rounded-xl p-3 sm:p-4 border border-amber-500/20">
          <div className="text-xl sm:text-2xl mb-1">⏳</div>
          <div className="text-xl sm:text-2xl font-bold text-amber-400">{stats.pending}</div>
          <div className="text-xs text-slate-400">Pending</div>
        </div>
        <div className="bg-green-500/10 rounded-xl p-3 sm:p-4 border border-green-500/20">
          <div className="text-xl sm:text-2xl mb-1">✅</div>
          <div className="text-xl sm:text-2xl font-bold text-green-400">{stats.delivered}</div>
          <div className="text-xs text-slate-400">Delivered</div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-slate-800 rounded-xl shadow-lg overflow-hidden border border-slate-700">
        {orders.length === 0 ? (
          <div className="text-center py-12 sm:py-16">
            <div className="text-5xl sm:text-6xl mb-3">🛒</div>
            <p className="text-slate-400">No orders found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            {/* Desktop Table */}
            <table className="min-w-full divide-y divide-slate-700 hidden md:table">
              <thead className="bg-slate-900">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Order ID</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Customer</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Items</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Total</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-slate-800 divide-y divide-slate-700">
                {orders.map((order) => (
                  <tr key={order._id} className="hover:bg-slate-700/50 transition-colors">
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="text-xs sm:text-sm font-mono text-blue-400">{order.orderNumber}</span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div>
                        <p className="text-sm font-medium text-white">{order.user?.name || 'N/A'}</p>
                        <p className="text-xs text-slate-400 truncate max-w-[150px]">{order.shippingAddress?.email || order.user?.email}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <p className="text-sm text-slate-300">{order.items?.length || 0} items</p>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <p className="text-sm font-semibold text-teal-400">रू {order.totalAmount?.toLocaleString()}</p>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(order.orderStatus)}`}>
                        <span className="mr-1">{getStatusIcon(order.orderStatus)}</span>
                        {getStatusLabel(order.orderStatus)}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <p className="text-sm text-slate-400">{new Date(order.createdAt).toLocaleDateString()}</p>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleViewDetails(order)}
                          className="px-2 py-1 bg-blue-600/20 text-blue-400 rounded-lg text-xs hover:bg-blue-600/30 transition-colors"
                        >
                          View
                        </button>
                        <button
                          onClick={() => handleUpdateStatus(order)}
                          className="px-2 py-1 bg-teal-600/20 text-teal-400 rounded-lg text-xs hover:bg-teal-600/30 transition-colors"
                        >
                          Update
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Mobile Cards */}
            <div className="md:hidden space-y-3 p-3">
              {orders.map((order) => (
                <div key={order._id} className="bg-slate-700/50 rounded-lg p-4 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-xs text-slate-400">Order ID</p>
                      <p className="text-sm font-mono text-blue-400">{order.orderNumber}</p>
                    </div>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(order.orderStatus)}`}>
                      <span className="mr-1">{getStatusIcon(order.orderStatus)}</span>
                      {getStatusLabel(order.orderStatus)}
                    </span>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">Customer</p>
                    <p className="text-sm font-medium text-white">{order.user?.name || 'N/A'}</p>
                    <p className="text-xs text-slate-400 truncate">{order.shippingAddress?.email || order.user?.email}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-xs text-slate-400">Items</p>
                      <p className="text-sm text-white">{order.items?.length || 0} items</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400">Total</p>
                      <p className="text-sm font-semibold text-teal-400">रू {order.totalAmount?.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400">Date</p>
                      <p className="text-sm text-white">{new Date(order.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={() => handleViewDetails(order)}
                      className="flex-1 py-2 bg-blue-600/20 text-blue-400 rounded-lg text-sm hover:bg-blue-600/30 transition-colors"
                    >
                      View Details
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(order)}
                      className="flex-1 py-2 bg-teal-600/20 text-teal-400 rounded-lg text-sm hover:bg-teal-600/30 transition-colors"
                    >
                      Update Status
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      {isDetailsModalOpen && selectedOrder && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4" 
          onClick={() => setIsDetailsModalOpen(false)}
        >
          <div 
            className="bg-slate-800 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto" 
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-slate-800 border-b border-slate-700 px-4 sm:px-6 py-3 sm:py-4 flex justify-between items-center">
              <h3 className="text-lg sm:text-xl font-bold text-white">Order Details</h3>
              <button onClick={() => setIsDetailsModalOpen(false)} className="text-slate-400 hover:text-white text-2xl">&times;</button>
            </div>
            <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
              {/* Order Info */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                <div>
                  <p className="text-xs text-slate-400">Order Number</p>
                  <p className="text-xs sm:text-sm font-mono text-blue-400 break-all">{selectedOrder.orderNumber}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400">Order Date</p>
                  <p className="text-xs sm:text-sm text-white">{new Date(selectedOrder.createdAt).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400">Payment Method</p>
                  <p className="text-xs sm:text-sm text-white uppercase">{selectedOrder.paymentMethod}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400">Payment Status</p>
                  <p className="text-xs sm:text-sm capitalize text-white">{selectedOrder.paymentStatus}</p>
                </div>
              </div>

              {/* Customer Info */}
              <div className="bg-slate-700/30 rounded-xl p-3 sm:p-4">
                <h4 className="text-sm sm:text-base text-white font-semibold mb-2 sm:mb-3">Customer Information</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                  <div>
                    <p className="text-xs text-slate-400">Name</p>
                    <p className="text-sm text-white">{selectedOrder.shippingAddress?.fullName || selectedOrder.user?.name}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">Email</p>
                    <p className="text-sm text-white break-all">{selectedOrder.shippingAddress?.email || selectedOrder.user?.email}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">Phone</p>
                    <p className="text-sm text-white">{selectedOrder.shippingAddress?.phone}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">Address</p>
                    <p className="text-sm text-white">{selectedOrder.shippingAddress?.address}, {selectedOrder.shippingAddress?.city}</p>
                  </div>
                </div>
              </div>

              {/* Products */}
              <div>
                <h4 className="text-sm sm:text-base text-white font-semibold mb-2 sm:mb-3">Products ({selectedOrder.items?.length} items)</h4>
                <div className="space-y-2">
                  {selectedOrder.items?.map((item, idx) => (
                    <div key={idx} className="flex flex-col sm:flex-row items-start sm:items-center gap-3 p-3 bg-slate-700/20 rounded-lg">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-slate-700 rounded-lg flex items-center justify-center flex-shrink-0">
                        {item.image ? (
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover rounded-lg" />
                        ) : (
                          <span className="text-xl sm:text-2xl">📦</span>
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm sm:text-base text-white font-medium">{item.name}</p>
                        <p className="text-xs text-slate-400">Qty: {item.quantity} × रू {item.price.toLocaleString()}</p>
                      </div>
                      <div className="text-right w-full sm:w-auto">
                        <p className="text-sm sm:text-base text-white font-semibold">रू {(item.price * item.quantity).toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-slate-700 text-right">
                  <p className="text-white text-sm sm:text-base">Total: <span className="text-lg sm:text-xl font-bold text-teal-400">रू {selectedOrder.totalAmount?.toLocaleString()}</span></p>
                </div>
              </div>

              {/* Status History */}
              {selectedOrder.statusHistory?.length > 0 && (
                <div>
                  <h4 className="text-sm sm:text-base text-white font-semibold mb-2 sm:mb-3">Status History</h4>
                  <div className="space-y-2">
                    {selectedOrder.statusHistory.map((history, idx) => (
                      <div key={idx} className="flex flex-wrap items-center gap-2 text-xs sm:text-sm">
                        <div className="w-1.5 h-1.5 rounded-full bg-teal-400"></div>
                        <p className="text-slate-300 capitalize">{history.status}</p>
                        <p className="text-slate-500 text-xs">{new Date(history.updatedAt).toLocaleString()}</p>
                        {history.comment && <p className="text-slate-400 text-xs">- {history.comment}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Update Status Modal */}
      {isStatusModalOpen && selectedOrder && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4" 
          onClick={() => setIsStatusModalOpen(false)}
        >
          <div 
            className="bg-slate-800 rounded-2xl shadow-2xl w-full max-w-md mx-4" 
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-gradient-to-r from-teal-600 to-blue-600 px-4 sm:px-6 py-4 rounded-t-2xl">
              <h3 className="text-lg sm:text-xl font-bold text-white">Update Order Status</h3>
              <p className="text-white/80 text-xs sm:text-sm mt-1 break-all">Order: {selectedOrder.orderNumber}</p>
            </div>
            
            <div className="p-4 sm:p-6 space-y-4 sm:space-y-5">
              {/* Status Options */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2 sm:mb-3">Select Status</label>
                <div className="grid grid-cols-2 gap-2 sm:gap-3">
                  {statusOptions.map((status) => (
                    <button
                      key={status.value}
                      onClick={() => setNewStatus(status.value)}
                      className={`p-2 sm:p-3 rounded-xl border-2 transition-all duration-200 flex items-center gap-1 sm:gap-2 text-sm sm:text-base ${
                        newStatus === status.value
                          ? `${status.color} border-current`
                          : 'bg-slate-700/50 border-slate-600 text-slate-400 hover:bg-slate-700'
                      }`}
                    >
                      <span className="text-lg sm:text-xl">{status.icon}</span>
                      <span className="font-medium">{status.label}</span>
                    </button>
                  ))}
                </div>
              </div>

          

              {/* Current Status Info */}
              <div className="bg-slate-700/30 rounded-lg p-3">
                <p className="text-xs text-slate-400">Current Status</p>
                <p className="text-sm text-white font-medium mt-1">
                  <span className="mr-1">{getStatusIcon(selectedOrder.orderStatus)}</span>
                  {getStatusLabel(selectedOrder.orderStatus)}
                </p>
              </div>
            </div>

            <div className="border-t border-slate-700 px-4 sm:px-6 py-3 sm:py-4 flex gap-3">
              <button
                onClick={() => setIsStatusModalOpen(false)}
                className="flex-1 px-3 sm:px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors text-sm sm:text-base"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmStatusUpdate}
                disabled={!newStatus}
                className="flex-1 px-3 sm:px-4 py-2 bg-gradient-to-r from-teal-500 to-blue-500 text-white rounded-lg hover:from-teal-600 hover:to-blue-600 transition-all disabled:opacity-50 text-sm sm:text-base"
              >
                Update Status
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;