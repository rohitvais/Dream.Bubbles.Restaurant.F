import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  IndianRupee,
  ShoppingBag,
  Store,
  AlertTriangle,
  ArrowUpRight,
  Clock,
  CheckCircle,
  Truck,
  RotateCcw,
  RefreshCw,
  Phone,
} from 'lucide-react';
import api from '../../api/apiClient';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await api.getDashboardStats();
      if (res.success) {
        setStats(res.data);
      }
    } catch (err) {
      console.error('Failed to load dashboard metrics:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      await api.updateOrderStatus(orderId, newStatus);
      fetchStats();
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 gap-3 text-slate-500">
        <RefreshCw className="w-6 h-6 animate-spin text-bubble-600" />
        <span className="text-sm font-bold">Loading restaurant analytics...</span>
      </div>
    );
  }

  const s = stats || {
    totalRevenue: 0,
    totalOrders: 0,
    activeOutlets: 0,
    lowStockCount: 0,
    statusBreakdown: {},
    recentOrders: [],
    outletSales: [],
  };

  return (
    <div className="space-y-6 sm:space-y-8 max-w-7xl mx-auto">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
            Dashboard Overview
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time multi-outlet operations, inventory alerts, and order tracking.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchStats}
          className="self-start sm:self-auto flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 shadow-xs"
        >
          <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
          <span>Refresh Data</span>
        </button>
      </div>

      {/* Metrics Cards (2x2 on Mobile, 4x1 on Desktop) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
        
        {/* Card 1: Revenue */}
        <div className="bg-white p-4 sm:p-6 rounded-3xl border border-slate-200/80 shadow-soft space-y-2 sm:space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider">
              Total Revenue
            </span>
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-sm">
              ₹
            </div>
          </div>
          <div>
            <div className="text-lg sm:text-2xl font-black text-slate-900">
              ₹{s.totalRevenue.toLocaleString()}
            </div>
            <p className="text-[10px] sm:text-[11px] text-emerald-600 font-semibold mt-0.5">
              Active orders
            </p>
          </div>
        </div>

        {/* Card 2: Total Orders */}
        <div className="bg-white p-4 sm:p-6 rounded-3xl border border-slate-200/80 shadow-soft space-y-2 sm:space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider">
              Total Orders
            </span>
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-2xl bg-bubble-50 text-bubble-600 flex items-center justify-center">
              <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
          </div>
          <div>
            <div className="text-lg sm:text-2xl font-black text-slate-900">
              {s.totalOrders}
            </div>
            <p className="text-[10px] sm:text-[11px] text-bubble-600 font-semibold mt-0.5">
              {s.pendingOrders} pending
            </p>
          </div>
        </div>

        {/* Card 3: Active Outlets */}
        <div className="bg-white p-4 sm:p-6 rounded-3xl border border-slate-200/80 shadow-soft space-y-2 sm:space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider">
              Active Outlets
            </span>
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Store className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
          </div>
          <div>
            <div className="text-lg sm:text-2xl font-black text-slate-900">
              {s.activeOutlets} / {s.totalOutlets || s.activeOutlets}
            </div>
            <p className="text-[10px] sm:text-[11px] text-purple-600 font-semibold mt-0.5">
              Accepting orders
            </p>
          </div>
        </div>

        {/* Card 4: Low Stock Alerts */}
        <div className="bg-white p-4 sm:p-6 rounded-3xl border border-slate-200/80 shadow-soft space-y-2 sm:space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider">
              Low Stock Alerts
            </span>
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
          </div>
          <div>
            <div className="text-lg sm:text-2xl font-black text-slate-900">
              {s.lowStockCount}
            </div>
            <Link
              to="/admin/inventory"
              className="text-[10px] sm:text-[11px] text-amber-600 font-bold hover:underline flex items-center gap-1 mt-0.5"
            >
              <span>Restock now</span>
              <ArrowUpRight className="w-3 h-3" />
            </Link>
          </div>
        </div>

      </div>

      {/* Quick Navigation Modules */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {[
          {
            title: '1. Outlet Management',
            desc: 'Store locations, contacts & hours',
            path: '/admin/outlets',
            color: 'border-l-4 border-l-blue-500',
          },
          {
            title: '2. Products Management',
            desc: 'Drinks, prices, calories & tags',
            path: '/admin/products',
            color: 'border-l-4 border-l-bubble-500',
          },
          {
            title: '3. Inventory Management',
            desc: 'Stock controls per kitchen branch',
            path: '/admin/inventory',
            color: 'border-l-4 border-l-amber-500',
          },
          {
            title: '4. Order Management',
            desc: 'Live queue & WhatsApp orders',
            path: '/admin/orders',
            color: 'border-l-4 border-l-emerald-500',
          },
        ].map((mod, i) => (
          <Link
            key={i}
            to={mod.path}
            className={`p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-xs hover:shadow-md transition-all group ${mod.color}`}
          >
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-xs sm:text-sm text-slate-900 group-hover:text-bubble-600 transition-colors">
                {mod.title}
              </h3>
              <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-bubble-600 transition-transform" />
            </div>
            <p className="text-[11px] text-slate-500 mt-1">{mod.desc}</p>
          </Link>
        ))}
      </div>

      {/* Recent Orders Section (Responsive Cards on Mobile, Table on Desktop) */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-soft overflow-hidden">
        <div className="p-4 sm:p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-sm sm:text-base font-black text-slate-900">Recent Customer Orders</h2>
            <p className="text-[11px] sm:text-xs text-slate-500">Live order queue from WhatsApp, Phone, and Web</p>
          </div>
          <Link
            to="/admin/orders"
            className="text-xs font-bold text-bubble-600 hover:text-bubble-700 flex items-center gap-1"
          >
            <span>View All</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Mobile View: Cards */}
        <div className="block sm:hidden divide-y divide-slate-100">
          {s.recentOrders.length === 0 ? (
            <div className="p-6 text-center text-xs text-slate-400 font-semibold">
              No recent orders yet.
            </div>
          ) : (
            s.recentOrders.map((ord) => (
              <div key={ord._id} className="p-4 space-y-2.5">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="font-black text-slate-900 text-xs">#{ord.orderNumber}</span>
                    <div className="font-bold text-xs text-slate-800">{ord.customerName}</div>
                    <div className="text-[10px] text-slate-400">{ord.outlet?.name}</div>
                  </div>
                  <div className="text-right">
                    <span className="font-black text-sm text-slate-900">₹{ord.totalAmount}</span>
                    <div className="text-[10px] text-slate-400">{ord.orderType} • {ord.channel}</div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span
                    className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${
                      ord.status === 'Delivered'
                        ? 'bg-emerald-100 text-emerald-800'
                        : ord.status === 'Preparing'
                        ? 'bg-purple-100 text-purple-800'
                        : ord.status === 'Confirmed'
                        ? 'bg-blue-100 text-blue-800'
                        : ord.status === 'Cancelled'
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {ord.status}
                  </span>

                  <select
                    value={ord.status}
                    onChange={(e) => handleUpdateStatus(ord._id, e.target.value)}
                    className="bg-slate-50 border border-slate-200 text-slate-800 font-bold text-[11px] rounded-xl px-2 py-1 focus:outline-none"
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
            ))
          )}
        </div>

        {/* Desktop View: Table */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-bold border-b border-slate-100">
              <tr>
                <th className="px-6 py-3.5">Order ID</th>
                <th className="px-6 py-3.5">Customer</th>
                <th className="px-6 py-3.5">Outlet</th>
                <th className="px-6 py-3.5">Type & Channel</th>
                <th className="px-6 py-3.5">Amount</th>
                <th className="px-6 py-3.5">Status</th>
                <th className="px-6 py-3.5">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {s.recentOrders.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-8 text-slate-400 font-semibold">
                    No recent orders.
                  </td>
                </tr>
              ) : (
                s.recentOrders.map((ord) => (
                  <tr key={ord._id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-6 py-4 font-black text-slate-900">
                      #{ord.orderNumber}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-900">{ord.customerName}</div>
                      <div className="text-[11px] text-slate-400">{ord.customerPhone}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-slate-800">{ord.outlet?.name}</div>
                      <div className="text-[10px] text-slate-400">{ord.outlet?.city}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-semibold text-slate-700">{ord.orderType}</span>
                      <span className="block text-[10px] text-emerald-600 font-bold">
                        via {ord.channel}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-black text-slate-900">
                      ₹{ord.totalAmount}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                          ord.status === 'Delivered'
                            ? 'bg-emerald-100 text-emerald-800'
                            : ord.status === 'Preparing'
                            ? 'bg-purple-100 text-purple-800'
                            : ord.status === 'Confirmed'
                            ? 'bg-blue-100 text-blue-800'
                            : ord.status === 'Cancelled'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {ord.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={ord.status}
                        onChange={(e) => handleUpdateStatus(ord._id, e.target.value)}
                        className="bg-white border border-slate-200 text-slate-700 font-bold text-xs rounded-xl px-2.5 py-1 focus:ring-1 focus:ring-bubble-500 focus:outline-none"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="Preparing">Preparing</option>
                        <option value="Out for Delivery">Out for Delivery</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
