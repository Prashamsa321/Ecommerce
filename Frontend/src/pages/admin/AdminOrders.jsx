import React, { useState, useEffect, useCallback } from 'react';
import FaIcon from '../../components/common/FaIcon';
import AdminModalOverlay from '../../components/admin/AdminModalOverlay';
import { useToast } from '../../context/ToastContext';
import { formatNpr } from '../../utils/helpers';
import { orderService } from '../../services/orderService';

const STATUS_CONFIG = {
  pending: {
    label: 'Pending',
    color: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    icon: 'clock',
    message: 'Order status updated to Pending',
  },
  processing: {
    label: 'Processing',
    color: 'bg-brand-light text-brand-orange border-brand-orange/20',
    icon: 'gear',
    message: 'Order status updated to Processing',
  },
  shipped: {
    label: 'Shipped',
    color: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    icon: 'truck',
    message: 'Order status updated to Shipped',
  },
  delivered: {
    label: 'Delivered',
    color: 'bg-green-500/20 text-green-400 border-green-500/30',
    icon: 'circle-check',
    message: 'Order status updated to Delivered',
  },
  cancelled: {
    label: 'Cancelled',
    color: 'bg-red-500/20 text-red-400 border-red-500/30',
    icon: 'circle-xmark',
    message: 'Order status updated to Cancelled',
  },
};

const StatusIcon = ({ status, size = 14 }) => {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.pending;
  return <FaIcon icon={config.icon} size={size} aria-hidden="true" />;
};

const AdminOrders = () => {
  const { success, error: toastError } = useToast();
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [statusComment, setStatusComment] = useState('');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    pending: 0,
    processing: 0,
    shipped: 0,
    delivered: 0,
    cancelled: 0,
  });

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      const [ordersData, statsData] = await Promise.all([
        orderService.getAllOrders({ limit: 100 }),
        orderService.getOrderStats(),
      ]);
      setOrders(ordersData.orders || []);
      if (statsData) {
        setStats({
          totalOrders: statsData.totalOrders || 0,
          totalRevenue: statsData.totalRevenue || 0,
          pending: statsData.pending || 0,
          processing: statsData.processing || 0,
          shipped: statsData.shipped || 0,
          delivered: statsData.delivered || 0,
          cancelled: statsData.cancelled || 0,
        });
      }
    } catch {
      toastError('Failed to load orders');
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, [toastError]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const statusOptions = Object.entries(STATUS_CONFIG).map(([value, config]) => ({
    value,
    label: config.label,
    color: config.color,
    icon: config.icon,
    message: config.message,
  }));

  const getStatusBadge = (status) => STATUS_CONFIG[status]?.color || STATUS_CONFIG.pending.color;

  const getStatusLabel = (status) => STATUS_CONFIG[status]?.label || status;

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

  const handleConfirmStatusUpdate = async () => {
    if (!selectedOrder || !newStatus) return;

    try {
      setUpdating(true);
      await orderService.updateOrderStatus(selectedOrder._id, {
        orderStatus: newStatus,
        comment: statusComment || `Order status updated to ${newStatus}`,
      });
      success(statusOptions.find(opt => opt.value === newStatus)?.message || 'Order status updated successfully');
      setIsStatusModalOpen(false);
      setSelectedOrder(null);
      setNewStatus('');
      setStatusComment('');
      await fetchOrders();
    } catch {
      toastError('Failed to update order status');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-brand-orange" />
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-text-primary">Orders Management</h1>
          <p className="text-text-muted text-sm sm:text-base mt-1">View and manage customer orders</p>
        </div>
        <div className="text-xs sm:text-sm text-text-muted bg-white/50 px-3 py-1.5 rounded-full self-start sm:self-auto">
          {stats.totalOrders} Total Orders
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white rounded-xl p-3 sm:p-4 border border-divider">
          <FaIcon icon="box" className="text-brand-orange mb-1" size={28} />
          <div className="text-xl sm:text-2xl font-bold text-text-primary">{stats.totalOrders}</div>
          <div className="text-xs text-text-muted">Total Orders</div>
        </div>
        <div className="bg-emerald-500/10 rounded-xl p-3 sm:p-4 border border-emerald-500/20">
          <FaIcon icon="indian-rupee-sign" className="text-emerald-400 mb-1" size={28} />
          <div className="text-lg sm:text-2xl font-bold text-emerald-400">{formatNpr(stats.totalRevenue)}</div>
          <div className="text-xs text-text-muted">Total Revenue</div>
        </div>
        <div className="bg-amber-500/10 rounded-xl p-3 sm:p-4 border border-amber-500/20">
          <FaIcon icon="clock" className="text-amber-400 mb-1" size={28} />
          <div className="text-xl sm:text-2xl font-bold text-amber-400">{stats.pending}</div>
          <div className="text-xs text-text-muted">Pending</div>
        </div>
        <div className="bg-green-500/10 rounded-xl p-3 sm:p-4 border border-green-500/20">
          <FaIcon icon="circle-check" className="text-green-400 mb-1" size={28} />
          <div className="text-xl sm:text-2xl font-bold text-green-400">{stats.delivered}</div>
          <div className="text-xs text-text-muted">Delivered</div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-divider">
        {orders.length === 0 ? (
          <div className="text-center py-12 sm:py-16">
            <FaIcon icon="cart-shopping" className="text-text-muted mx-auto mb-3" size={48} />
            <p className="text-text-muted">No orders found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            {/* Desktop Table */}
            <table className="min-w-full divide-y divide-divider hidden md:table">
              <thead className="bg-surface-primary">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">Order ID</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">Customer</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">Items</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">Total</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-divider">
                {orders.map((order) => (
                  <tr key={order._id} className="hover:bg-brand-light/50 transition-colors">
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="text-xs sm:text-sm font-mono text-brand-orange">{order.orderNumber}</span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div>
                        <p className="text-sm font-medium text-text-primary">{order.user?.name || 'N/A'}</p>
                        <p className="text-xs text-text-muted truncate max-w-[150px]">{order.shippingAddress?.email || order.user?.email}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <p className="text-sm text-text-secondary">{order.items?.length || 0} items</p>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <p className="text-sm font-semibold text-brand-orange">{formatNpr(order.totalAmount)}</p>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full inline-flex items-center gap-1 ${getStatusBadge(order.orderStatus)}`}>
                        <StatusIcon status={order.orderStatus} />
                        {getStatusLabel(order.orderStatus)}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <p className="text-sm text-text-muted">{new Date(order.createdAt).toLocaleDateString()}</p>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleViewDetails(order)}
                          className="px-2 py-1 bg-brand-orange/20 text-brand-orange rounded-lg text-xs hover:bg-brand-orange/30 transition-colors"
                        >
                          View
                        </button>
                        <button
                          onClick={() => handleUpdateStatus(order)}
                          className="px-2 py-1 bg-brand-orange/10 text-brand-orange rounded-lg text-xs hover:bg-brand-orange/20 transition-colors"
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
                <div key={order._id} className="bg-brand-light/50 rounded-lg p-4 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-xs text-text-muted">Order ID</p>
                      <p className="text-sm font-mono text-brand-orange">{order.orderNumber}</p>
                    </div>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full inline-flex items-center gap-1 ${getStatusBadge(order.orderStatus)}`}>
                      <StatusIcon status={order.orderStatus} />
                      {getStatusLabel(order.orderStatus)}
                    </span>
                  </div>
                  <div>
                    <p className="text-xs text-text-muted">Customer</p>
                    <p className="text-sm font-medium text-text-primary">{order.user?.name || 'N/A'}</p>
                    <p className="text-xs text-text-muted truncate">{order.shippingAddress?.email || order.user?.email}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-xs text-text-muted">Items</p>
                      <p className="text-sm text-text-primary">{order.items?.length || 0} items</p>
                    </div>
                    <div>
                      <p className="text-xs text-text-muted">Total</p>
                      <p className="text-sm font-semibold text-brand-orange">{formatNpr(order.totalAmount)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-text-muted">Date</p>
                      <p className="text-sm text-text-primary">{new Date(order.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={() => handleViewDetails(order)}
                      className="flex-1 py-2 bg-brand-orange/20 text-brand-orange rounded-lg text-sm hover:bg-brand-orange/30 transition-colors"
                    >
                      View Details
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(order)}
                      className="flex-1 py-2 bg-brand-orange/10 text-brand-orange rounded-lg text-sm hover:bg-brand-orange/20 transition-colors"
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
      <AdminModalOverlay
        open={isDetailsModalOpen && !!selectedOrder}
        onClose={() => setIsDetailsModalOpen(false)}
      >
        {selectedOrder && (
          <div
            className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-2xl bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="order-details-title"
          >
            <div className="sticky top-0 flex items-center justify-between border-b border-divider bg-white px-4 py-3 sm:px-6 sm:py-4">
              <h3 id="order-details-title" className="text-lg font-bold text-text-primary sm:text-xl">Order Details</h3>
              <button onClick={() => setIsDetailsModalOpen(false)} className="text-text-muted hover:text-text-primary text-2xl">&times;</button>
            </div>
            <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
              {/* Order Info */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                <div>
                  <p className="text-xs text-text-muted">Order Number</p>
                  <p className="text-xs sm:text-sm font-mono text-brand-orange break-all">{selectedOrder.orderNumber}</p>
                </div>
                <div>
                  <p className="text-xs text-text-muted">Order Date</p>
                  <p className="text-xs sm:text-sm text-text-primary">{new Date(selectedOrder.createdAt).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-xs text-text-muted">Payment Method</p>
                  <p className="text-xs sm:text-sm text-text-primary uppercase">{selectedOrder.paymentMethod}</p>
                </div>
                <div>
                  <p className="text-xs text-text-muted">Payment Status</p>
                  <p className="text-xs sm:text-sm capitalize text-text-primary">{selectedOrder.paymentStatus}</p>
                </div>
              </div>

              {/* Customer Info */}
              <div className="bg-brand-light/30 rounded-xl p-3 sm:p-4">
                <h4 className="text-sm sm:text-base text-text-primary font-semibold mb-2 sm:mb-3">Customer Information</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                  <div>
                    <p className="text-xs text-text-muted">Name</p>
                    <p className="text-sm text-text-primary">{selectedOrder.shippingAddress?.fullName || selectedOrder.user?.name}</p>
                  </div>
                  <div>
                    <p className="text-xs text-text-muted">Email</p>
                    <p className="text-sm text-text-primary break-all">{selectedOrder.shippingAddress?.email || selectedOrder.user?.email}</p>
                  </div>
                  <div>
                    <p className="text-xs text-text-muted">Phone</p>
                    <p className="text-sm text-text-primary">{selectedOrder.shippingAddress?.phone}</p>
                  </div>
                  <div>
                    <p className="text-xs text-text-muted">Address</p>
                    <p className="text-sm text-text-primary">{selectedOrder.shippingAddress?.address}, {selectedOrder.shippingAddress?.city}</p>
                  </div>
                </div>
              </div>

              {/* Products */}
              <div>
                <h4 className="text-sm sm:text-base text-text-primary font-semibold mb-2 sm:mb-3">Products ({selectedOrder.items?.length} items)</h4>
                <div className="space-y-2">
                  {selectedOrder.items?.map((item, idx) => (
                    <div key={idx} className="flex flex-col sm:flex-row items-start sm:items-center gap-3 p-3 bg-brand-light/20 rounded-lg">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-brand-light rounded-lg flex items-center justify-center flex-shrink-0">
                        {item.image ? (
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover rounded-lg" />
                        ) : (
                          <FaIcon icon="box" size={24} className="text-text-muted" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm sm:text-base text-text-primary font-medium">{item.name}</p>
                        <p className="text-xs text-text-muted">Qty: {item.quantity} x {formatNpr(item.price)}</p>
                      </div>
                      <div className="text-right w-full sm:w-auto">
                        <p className="text-sm sm:text-base text-text-primary font-semibold">{formatNpr(item.price * item.quantity)}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-divider text-right">
                  <p className="text-text-primary text-sm sm:text-base">Total: <span className="text-lg sm:text-xl font-bold text-brand-orange">{formatNpr(selectedOrder.totalAmount)}</span></p>
                </div>
              </div>

              {/* Status History */}
              {selectedOrder.statusHistory?.length > 0 && (
                <div>
                  <h4 className="text-sm sm:text-base text-text-primary font-semibold mb-2 sm:mb-3">Status History</h4>
                  <div className="space-y-2">
                    {selectedOrder.statusHistory.map((history, idx) => (
                      <div key={idx} className="flex flex-wrap items-center gap-2 text-xs sm:text-sm">
                        <div className="w-1.5 h-1.5 rounded-full bg-brand-orange"></div>
                        <p className="text-text-secondary capitalize">{history.status}</p>
                        <p className="text-text-muted text-xs">{new Date(history.updatedAt).toLocaleString()}</p>
                        {history.comment && <p className="text-text-muted text-xs">- {history.comment}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </AdminModalOverlay>

      {/* Update Status Modal */}
      <AdminModalOverlay
        open={isStatusModalOpen && !!selectedOrder}
        onClose={() => setIsStatusModalOpen(false)}
      >
        {selectedOrder && (
          <div
            className="mx-4 w-full max-w-md rounded-2xl bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="order-status-title"
          >
            <div className="rounded-t-2xl bg-gradient-to-r from-brand-orange to-brand-orange-dark px-4 py-4 sm:px-6">
              <h3 id="order-status-title" className="text-lg font-bold text-white sm:text-xl">Update Order Status</h3>
              <p className="text-white/80 text-xs sm:text-sm mt-1 break-all">Order: {selectedOrder.orderNumber}</p>
            </div>
            
            <div className="p-4 sm:p-6 space-y-4 sm:space-y-5">
              {/* Status Options */}
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2 sm:mb-3">Select Status</label>
                <div className="grid grid-cols-2 gap-2 sm:gap-3">
                  {statusOptions.map((status) => (
                    <button
                      key={status.value}
                      onClick={() => setNewStatus(status.value)}
                      className={`p-2 sm:p-3 rounded-xl border-2 transition-all duration-200 flex items-center gap-1 sm:gap-2 text-sm sm:text-base ${
                        newStatus === status.value
                          ? `${status.color} border-current`
                          : 'bg-brand-light/50 border-divider text-text-muted hover:bg-brand-light'
                      }`}
                    >
                      <FaIcon icon={status.icon} size={20} />
                      <span className="font-medium">{status.label}</span>
                    </button>
                  ))}
                </div>
              </div>

          

              {/* Current Status Info */}
              <div className="bg-brand-light/30 rounded-lg p-3">
                <p className="text-xs text-text-muted">Current Status</p>
                <p className="text-sm text-text-primary font-medium mt-1 inline-flex items-center gap-1">
                  <StatusIcon status={selectedOrder.orderStatus} />
                  {getStatusLabel(selectedOrder.orderStatus)}
                </p>
              </div>
            </div>

            <div className="border-t border-divider px-4 sm:px-6 py-3 sm:py-4 flex gap-3">
              <button
                onClick={() => setIsStatusModalOpen(false)}
                className="flex-1 px-3 sm:px-4 py-2 bg-brand-light text-brand-orange rounded-lg hover:bg-brand-light transition-colors text-sm sm:text-base"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmStatusUpdate}
                disabled={!newStatus || updating}
                className="flex-1 px-3 sm:px-4 py-2 bg-gradient-to-r from-brand-orange to-brand-orange-dark text-white rounded-lg hover:from-brand-orange-dark hover:to-brand-orange transition-all disabled:opacity-50 text-sm sm:text-base"
              >
                {updating ? 'Updating...' : 'Update Status'}
              </button>
            </div>
          </div>
        )}
      </AdminModalOverlay>
    </div>
  );
};

export default AdminOrders;