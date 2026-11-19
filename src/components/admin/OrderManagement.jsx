import React, { useState, useEffect } from 'react';
import {
  ClipboardList,
  Search,
  Filter,
  Phone,
  MessageCircle,
  Clock,
  Eye,
  Trash2,
  RefreshCw,
  X,
  Truck,
  Store,
  MapPin,
  CheckCircle2,
} from 'lucide-react';
import api from '../../api/apiClient';

export default function OrderManagement() {
  const [orders, setOrders] = useState([]);
  const [outlets, setOutlets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOutlet, setSelectedOutlet] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedChannel, setSelectedChannel] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrderModal, setSelectedOrderModal] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [orderRes, outletRes] = await Promise.all([
        api.getOrders({
          outletId: selectedOutlet,
          status: selectedStatus,
          channel: selectedChannel,
          search: searchTerm,
        }),
        api.getOutlets(),
      ]);

      if (orderRes.success) setOrders(orderRes.data);
      if (outletRes.success) setOutlets(outletRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedOutlet, selectedStatus, selectedChannel, searchTerm]);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await api.updateOrderStatus(orderId, newStatus);
      fetchData();
      if (selectedOrderModal && selectedOrderModal._id === orderId) {
        setSelectedOrderModal((prev) => ({ ...prev, status: newStatus }));
      }
    } catch (err) {
      alert(err.message || 'Failed to update status');
    }
  };

  const handleDeleteOrder = async (orderId, orderNum) => {
    if (window.confirm(`Delete order #${orderNum}? This cannot be undone.`)) {
      try {
        await api.deleteOrder(orderId);
        fetchData();
        if (selectedOrderModal?._id === orderId) {
          setSelectedOrderModal(null);
        }
      } catch (err) {
        alert(err.message);
      }
    }
  };

  return (
    <div className="space-y-5 sm:space-y-6 max-w-7xl mx-auto pb-16 sm:pb-0">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Order Management
          </h1>
          <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5">
            Real-time live queue of incoming orders via WhatsApp, Phone Calls, and Web.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchData}
          className="self-start sm:self-auto flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 shadow-xs"
        >
          <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
          <span>Refresh Queue</span>
        </button>
      </div>

      {/* Filter Toolbar (Responsive 2x2 grid on mobile, 4 columns on desktop) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3 bg-white p-3.5 sm:p-4 rounded-3xl border border-slate-200 shadow-soft">
        
        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search order #, customer..."
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:ring-1 focus:ring-bubble-500 focus:outline-none"
          />
        </div>

        {/* Outlet Filter */}
        <div>
          <select
            value={selectedOutlet}
            onChange={(e) => setSelectedOutlet(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 font-bold text-xs rounded-xl px-3 py-2 text-slate-700 focus:ring-1 focus:ring-bubble-500 focus:outline-none"
          >
            <option value="all">All Kitchen Outlets</option>
            {outlets.map((o) => (
              <option key={o._id} value={o._id}>
                {o.name}
              </option>
            ))}
          </select>
        </div>

        {/* Status Filter */}
        <div>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 font-bold text-xs rounded-xl px-3 py-2 text-slate-700 focus:ring-1 focus:ring-bubble-500 focus:outline-none"
          >
            <option value="all">All Order Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Preparing">Preparing</option>
            <option value="Out for Delivery">Out for Delivery</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>

        {/* Channel Filter */}
        <div>
          <select
            value={selectedChannel}
            onChange={(e) => setSelectedChannel(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 font-bold text-xs rounded-xl px-3 py-2 text-slate-700 focus:ring-1 focus:ring-bubble-500 focus:outline-none"
          >
            <option value="all">All Channels (WhatsApp, Call, Web)</option>
            <option value="WhatsApp">WhatsApp</option>
            <option value="Call">Phone Call</option>
            <option value="Online">Online Web</option>
          </select>
        </div>

      </div>

      {/* Mobile Orders Cards View */}
      <div className="block sm:hidden space-y-3">
        {loading ? (
          <div className="text-center py-12 text-slate-400 text-xs">
            <RefreshCw className="w-5 h-5 animate-spin mx-auto text-bubble-600 mb-1" />
            Loading orders...
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-8 text-slate-400 text-xs">
            No orders found matching filters.
          </div>
        ) : (
          orders.map((ord) => (
            <div
              key={ord._id}
              className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="font-black text-slate-900 text-xs">#{ord.orderNumber}</span>
                  <div className="font-extrabold text-xs text-slate-900 mt-0.5">{ord.customerName}</div>
                  <div className="text-[10px] text-slate-400">{ord.outlet?.name}</div>
                </div>
                <div className="text-right">
                  <div className="font-black text-sm text-bubble-700">₹{ord.totalAmount}</div>
                  <span className="text-[9px] bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded font-bold">
                    {ord.orderType} • {ord.channel}
                  </span>
                </div>
              </div>

              {/* Items summary */}
              <div className="text-[11px] text-slate-600 bg-slate-50 p-2.5 rounded-xl space-y-1">
                {ord.items?.map((item, i) => (
                  <div key={i} className="flex justify-between">
                    <span>{item.quantity}x {item.name}</span>
                    <span className="font-bold text-slate-800">₹{item.subtotal}</span>
                  </div>
                ))}
              </div>

              {/* Status & Actions */}
              <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                <select
                  value={ord.status}
                  onChange={(e) => handleStatusChange(ord._id, e.target.value)}
                  className={`font-black text-[11px] rounded-xl px-2 py-1 border focus:outline-none ${
                    ord.status === 'Delivered'
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                      : ord.status === 'Preparing'
                      ? 'bg-purple-50 text-purple-800 border-purple-300'
                      : ord.status === 'Confirmed'
                      ? 'bg-blue-50 text-blue-800 border-blue-300'
                      : ord.status === 'Cancelled'
                      ? 'bg-rose-50 text-rose-800 border-rose-300'
                      : 'bg-amber-50 text-amber-800 border-amber-300'
                  }`}
                >
                  <option value="Pending">Pending</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Preparing">Preparing</option>
                  <option value="Out for Delivery">Out for Delivery</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>

                <div className="flex items-center gap-1.5">
                  <a
                    href={`tel:${ord.customerPhone}`}
                    className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700"
                    title="Call customer"
                  >
                    <Phone className="w-3.5 h-3.5" />
                  </a>
                  <button
                    type="button"
                    onClick={() => setSelectedOrderModal(ord)}
                    className="p-1.5 rounded-lg bg-slate-100 text-slate-700 hover:text-bubble-600"
                    title="View details"
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteOrder(ord._id, ord.orderNumber)}
                    className="p-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100"
                    title="Delete"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Desktop Orders Table */}
      <div className="hidden sm:block bg-white rounded-3xl border border-slate-200 shadow-soft overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20 text-slate-400 gap-2">
            <RefreshCw className="w-5 h-5 animate-spin text-bubble-600" />
            <span className="text-xs font-semibold">Loading orders...</span>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-16 text-slate-400 text-xs">
            No orders found matching criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-bold border-b border-slate-100">
                <tr>
                  <th className="px-6 py-4">Order ID & Date</th>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Outlet Kitchen</th>
                  <th className="px-6 py-4">Items Ordered</th>
                  <th className="px-6 py-4">Total</th>
                  <th className="px-6 py-4">Order Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {orders.map((ord) => (
                  <tr key={ord._id} className="hover:bg-slate-50/70 transition-colors">
                    
                    <td className="px-6 py-4">
                      <div className="font-black text-slate-900 text-sm">#{ord.orderNumber}</div>
                      <div className="text-[10px] text-slate-400 font-medium">
                        {new Date(ord.createdAt).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}{' '}
                        •{' '}
                        {new Date(ord.createdAt).toLocaleDateString([], {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="font-extrabold text-slate-900">{ord.customerName}</div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <a
                          href={`tel:${ord.customerPhone}`}
                          className="text-[11px] text-emerald-700 hover:underline flex items-center gap-1 font-semibold"
                        >
                          <Phone className="w-3 h-3" />
                          <span>{ord.customerPhone}</span>
                        </a>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-800">{ord.outlet?.name}</div>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-bold">
                          {ord.orderType}
                        </span>
                        <span className="text-[10px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded font-bold">
                          via {ord.channel}
                        </span>
                      </div>
                    </td>

                    <td className="px-6 py-4 max-w-xs">
                      <div className="space-y-1">
                        {ord.items?.slice(0, 2).map((item, i) => (
                          <div key={i} className="text-[11px] text-slate-700 truncate">
                            <span className="font-bold">{item.quantity}x</span> {item.name}
                          </div>
                        ))}
                        {ord.items?.length > 2 && (
                          <div className="text-[10px] text-bubble-600 font-bold">
                            +{ord.items.length - 2} more items...
                          </div>
                        )}
                      </div>
                    </td>

                    <td className="px-6 py-4 font-black text-slate-900 text-sm">
                      ₹{ord.totalAmount}
                    </td>

                    <td className="px-6 py-4">
                      <select
                        value={ord.status}
                        onChange={(e) => handleStatusChange(ord._id, e.target.value)}
                        className={`font-black text-xs rounded-xl px-2.5 py-1.5 border focus:outline-none transition-colors ${
                          ord.status === 'Delivered'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                            : ord.status === 'Preparing'
                            ? 'bg-purple-50 text-purple-800 border-purple-300'
                            : ord.status === 'Confirmed'
                            ? 'bg-blue-50 text-blue-800 border-blue-300'
                            : ord.status === 'Out for Delivery'
                            ? 'bg-indigo-50 text-indigo-800 border-indigo-300'
                            : ord.status === 'Cancelled'
                            ? 'bg-rose-50 text-rose-800 border-rose-300'
                            : 'bg-amber-50 text-amber-800 border-amber-300'
                        }`}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="Preparing">Preparing</option>
                        <option value="Out for Delivery">Out for Delivery</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>

                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setSelectedOrderModal(ord)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-bubble-600 hover:bg-bubble-50 transition-colors"
                          title="View Order Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteOrder(ord._id, ord.orderNumber)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                          title="Delete Order"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Order Detail Modal */}
      {selectedOrderModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-t-3xl sm:rounded-3xl max-w-lg w-full p-5 sm:p-6 shadow-2xl border border-slate-100 space-y-4 max-h-[90vh] overflow-y-auto animate-slide-up">
            
            <div className="flex items-center justify-between border-b pb-3 border-slate-100">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-bubble-600 bg-bubble-50 px-2 py-0.5 rounded">
                  {selectedOrderModal.channel} Order
                </span>
                <h3 className="text-lg sm:text-xl font-black text-slate-900 mt-0.5">
                  Order #{selectedOrderModal.orderNumber}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedOrderModal(null)}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Customer & Outlet Details */}
            <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50 p-3.5 rounded-2xl">
              <div className="space-y-1">
                <span className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">
                  Customer
                </span>
                <div className="font-extrabold text-slate-900">
                  {selectedOrderModal.customerName}
                </div>
                <a
                  href={`tel:${selectedOrderModal.customerPhone}`}
                  className="text-emerald-700 font-bold hover:underline flex items-center gap-1"
                >
                  <Phone className="w-3 h-3" />
                  <span>{selectedOrderModal.customerPhone}</span>
                </a>
              </div>

              <div className="space-y-1">
                <span className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">
                  Outlet Kitchen
                </span>
                <div className="font-extrabold text-slate-900">
                  {selectedOrderModal.outlet?.name}
                </div>
                <div className="text-slate-500 text-[11px]">
                  {selectedOrderModal.outlet?.city}
                </div>
              </div>

              {selectedOrderModal.customerAddress && (
                <div className="col-span-2 pt-2 border-t border-slate-200">
                  <span className="font-bold text-slate-500 uppercase tracking-wider text-[10px] block">
                    Delivery Address:
                  </span>
                  <p className="text-slate-800 text-[11px] leading-relaxed">
                    {selectedOrderModal.customerAddress}
                  </p>
                </div>
              )}

              {selectedOrderModal.specialInstructions && (
                <div className="col-span-2 pt-2 border-t border-slate-200">
                  <span className="font-bold text-slate-500 uppercase tracking-wider text-[10px] block">
                    Customer Instructions:
                  </span>
                  <p className="text-amber-800 text-[11px] font-medium bg-amber-50 p-2 rounded-lg border border-amber-200">
                    "{selectedOrderModal.specialInstructions}"
                  </p>
                </div>
              )}
            </div>

            {/* Items List */}
            <div className="space-y-1.5 text-xs">
              <span className="font-bold text-slate-700 uppercase tracking-wider text-[10px]">
                Ordered Drinks & Bites
              </span>
              <div className="divide-y divide-slate-100 border border-slate-100 rounded-2xl overflow-hidden">
                {selectedOrderModal.items?.map((item, idx) => (
                  <div key={idx} className="p-2.5 sm:p-3 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-slate-900">
                        {item.quantity}x {item.name}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        Sweetness: {item.sweetness || '100%'} • Ice: {item.ice || 'Regular'}
                      </div>
                    </div>
                    <span className="font-extrabold text-slate-900">₹{item.subtotal}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Total and Status change */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase">
                  Total Bill
                </span>
                <div className="text-xl font-black text-bubble-700">
                  ₹{selectedOrderModal.totalAmount}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={selectedOrderModal.status}
                  onChange={(e) => handleStatusChange(selectedOrderModal._id, e.target.value)}
                  className="bg-slate-100 border border-slate-200 font-bold text-xs rounded-xl px-3 py-1.5 text-slate-800 focus:outline-none"
                >
                  <option value="Pending">Pending</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Preparing">Preparing</option>
                  <option value="Out for Delivery">Out for Delivery</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
