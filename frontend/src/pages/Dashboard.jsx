import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Package,
  TrendingUp,
  Clock,
  Loader,
  Truck,
  CheckCircle2,
  XCircle,
  PlusCircle,
  RefreshCw,
  ArrowRight,
  Database,
  Layers,
  MapPin,
  Calendar,
  Eye,
  AlertCircle,
} from 'lucide-react';
import StatusBadge from '../components/StatusBadge';
import { baseURL } from '../api/axiosClient';

export default function Dashboard({
  orders = [],
  isLoading = false,
  error = null,
  onRefresh,
  onOpenCreate,
  onViewOrder,
  onEditOrder,
  onDeleteOrder,
}) {
  // Compute real statistics from actual API data
  const stats = useMemo(() => {
    const total = orders.length;

    const byStatus = {
      Pending: 0,
      Processing: 0,
      Shipped: 0,
      Delivered: 0,
      Cancelled: 0,
    };

    const byType = {};
    const byLocation = {};

    orders.forEach((o) => {
      // Status count
      const statusKey = o.status
        ? o.status.charAt(0).toUpperCase() + o.status.slice(1).toLowerCase()
        : 'Pending';
      if (byStatus[statusKey] !== undefined) {
        byStatus[statusKey]++;
      } else {
        byStatus[statusKey] = 1;
      }

      // Type count
      const typeKey = o.type?.trim() || 'Uncategorized';
      byType[typeKey] = (byType[typeKey] || 0) + 1;

      // Location count
      const locKey = o.location?.trim() || 'Unknown';
      byLocation[locKey] = (byLocation[locKey] || 0) + 1;
    });

    // Sort types descending
    const sortedTypes = Object.entries(byType)
      .map(([name, count]) => ({
        name,
        count,
        percentage: total > 0 ? Math.round((count / total) * 100) : 0,
      }))
      .sort((a, b) => b.count - a.count);

    // Sort locations descending
    const sortedLocations = Object.entries(byLocation)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Recent orders (sort by orderId descending or createdAt)
    const recent = [...orders]
      .sort((a, b) => (b.orderId || 0) - (a.orderId || 0))
      .slice(0, 5);

    return {
      total,
      byStatus,
      sortedTypes,
      sortedLocations,
      recent,
    };
  }, [orders]);

  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Welcome / Hero Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute right-20 top-0 w-32 h-32 bg-violet-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold border border-indigo-400/20">
              <Database className="w-3.5 h-3.5" />
              <span>Connected to External MySQL Database</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Order Management Overview
            </h1>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Real-time synchronization with Spring Boot REST service. Monitor order lifecycles,
              category distributions, and order fulfillment status.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={onRefresh}
              disabled={isLoading}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white text-sm font-semibold rounded-xl border border-white/10 transition backdrop-blur-xs disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              <span>Refresh Data</span>
            </button>
            <button
              onClick={onOpenCreate}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-semibold rounded-xl shadow-lg shadow-indigo-500/30 transition transform hover:-translate-y-0.5"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Create Order</span>
            </button>
          </div>
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-center justify-between text-rose-800 text-sm">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />
            <span>{error}</span>
          </div>
          <button
            onClick={onRefresh}
            className="px-3 py-1 bg-rose-600 text-white rounded-lg text-xs font-semibold hover:bg-rose-700 transition"
          >
            Retry
          </button>
        </div>
      )}

      {/* Key Metric KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
        {/* Total Orders */}
        <div className="col-span-2 sm:col-span-1 lg:col-span-1 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Total Orders
            </span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-bold text-slate-900">
            {isLoading ? '...' : stats.total}
          </div>
          <p className="mt-1 text-[11px] text-slate-400">All registered records</p>
        </div>

        {/* Pending */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Pending
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-bold text-slate-900">
            {isLoading ? '...' : stats.byStatus.Pending}
          </div>
          <p className="mt-1 text-[11px] text-amber-600 font-medium">Awaiting action</p>
        </div>

        {/* Processing */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Processing
            </span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Loader className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-bold text-slate-900">
            {isLoading ? '...' : stats.byStatus.Processing}
          </div>
          <p className="mt-1 text-[11px] text-blue-600 font-medium">In preparation</p>
        </div>

        {/* Shipped */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Shipped
            </span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Truck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-bold text-slate-900">
            {isLoading ? '...' : stats.byStatus.Shipped}
          </div>
          <p className="mt-1 text-[11px] text-indigo-600 font-medium">In transit</p>
        </div>

        {/* Delivered */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Delivered
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-bold text-slate-900">
            {isLoading ? '...' : stats.byStatus.Delivered}
          </div>
          <p className="mt-1 text-[11px] text-emerald-600 font-medium">Completed</p>
        </div>

        {/* Cancelled */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Cancelled
            </span>
            <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
              <XCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-bold text-slate-900">
            {isLoading ? '...' : stats.byStatus.Cancelled}
          </div>
          <p className="mt-1 text-[11px] text-rose-600 font-medium">Voided</p>
        </div>
      </div>

      {/* Analytics Breakdown & Architecture Info */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Categories / Types Breakdown */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Layers className="w-5 h-5 text-indigo-600" />
              <h2 className="text-base font-bold text-slate-900">Orders by Category</h2>
            </div>
            <span className="text-xs font-medium text-slate-500">
              {stats.sortedTypes.length} Types
            </span>
          </div>

          {stats.sortedTypes.length === 0 ? (
            <div className="text-center py-8 text-slate-400 text-sm">
              No categories recorded yet.
            </div>
          ) : (
            <div className="space-y-3.5">
              {stats.sortedTypes.map((item) => (
                <div key={item.name} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-700">{item.name}</span>
                    <span className="text-slate-500 font-mono">
                      {item.count} ({item.percentage}%)
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full transition-all duration-500"
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Top Locations */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-indigo-600" />
              <h2 className="text-base font-bold text-slate-900">Top Delivery Locations</h2>
            </div>
            <span className="text-xs font-medium text-slate-500">
              {stats.sortedLocations.length} Regions
            </span>
          </div>

          {stats.sortedLocations.length === 0 ? (
            <div className="text-center py-8 text-slate-400 text-sm">
              No delivery locations found.
            </div>
          ) : (
            <ul className="divide-y divide-slate-100">
              {stats.sortedLocations.map((loc, idx) => (
                <li key={loc.name} className="py-2.5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-600 text-xs font-bold flex items-center justify-center font-mono">
                      {idx + 1}
                    </span>
                    <span className="text-sm font-medium text-slate-700">{loc.name}</span>
                  </div>
                  <span className="text-xs font-semibold px-2.5 py-1 bg-slate-100 text-slate-700 rounded-full font-mono">
                    {loc.count} {loc.count === 1 ? 'order' : 'orders'}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* System Architecture & Status Card */}
        <div className="bg-gradient-to-br from-slate-900 to-indigo-950 p-6 rounded-3xl text-white shadow-xs">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-indigo-400" />
            <h2 className="text-base font-bold text-white">System Architecture</h2>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3 bg-white/5 rounded-xl border border-white/10 flex justify-between items-center">
              <span className="text-slate-400">Backend Port</span>
              <span className="font-mono font-semibold text-emerald-400">8050 (Active)</span>
            </div>

            <div className="p-3 bg-white/5 rounded-xl border border-white/10 flex justify-between items-center">
              <span className="text-slate-400">REST Base URL</span>
              <span className="font-mono font-semibold text-slate-200 truncate max-w-[160px]">
                {baseURL}
              </span>
            </div>

            <div className="p-3 bg-white/5 rounded-xl border border-white/10 flex justify-between items-center">
              <span className="text-slate-400">Database Engine</span>
              <span className="font-semibold text-slate-200">MySQL 8.0</span>
            </div>

            <div className="p-3 bg-white/5 rounded-xl border border-white/10 flex justify-between items-center">
              <span className="text-slate-400">Frontend Stack</span>
              <span className="font-semibold text-slate-200">React 19 + Vite + Tailwind</span>
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-between">
            <Link
              to="/api-docs"
              className="text-xs font-semibold text-indigo-300 hover:text-indigo-200 flex items-center gap-1.5 transition"
            >
              <span>Explore REST Endpoints</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Orders Section */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-6 flex items-center justify-between border-b border-slate-100">
          <div>
            <h2 className="text-base font-bold text-slate-900">Recent Orders</h2>
            <p className="text-xs text-slate-500">Latest entries fetched from the live database</p>
          </div>
          <Link
            to="/orders"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-700 transition"
          >
            <span>View All Orders</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {isLoading ? (
          <div className="p-12 text-center">
            <div className="inline-block w-8 h-8 border-3 border-indigo-600/20 border-t-indigo-600 rounded-full animate-spin mb-3" />
            <p className="text-sm text-slate-500">Loading orders from backend...</p>
          </div>
        ) : stats.recent.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <Package className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-sm font-bold text-slate-800">No Orders in Database</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              The database is ready. Click below to add your first order using the POST /order/add
              endpoint.
            </p>
            <button
              onClick={onOpenCreate}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-semibold hover:bg-indigo-700 transition"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Create Order</span>
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/70 border-b border-slate-100 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                  <th className="py-3.5 px-6">ID</th>
                  <th className="py-3.5 px-6">Product / Name</th>
                  <th className="py-3.5 px-6">Category</th>
                  <th className="py-3.5 px-6">Status</th>
                  <th className="py-3.5 px-6">Location</th>
                  <th className="py-3.5 px-6">Date</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {stats.recent.map((order) => (
                  <tr
                    key={order.orderId}
                    className="hover:bg-slate-50/60 transition group cursor-pointer"
                    onClick={() => onViewOrder(order)}
                  >
                    <td className="py-3.5 px-6 font-mono text-xs font-bold text-slate-700">
                      #{order.orderId}
                    </td>
                    <td className="py-3.5 px-6 font-semibold text-slate-900 group-hover:text-indigo-600 transition">
                      {order.name}
                    </td>
                    <td className="py-3.5 px-6 text-slate-600 text-xs">
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-medium">
                        {order.type || 'N/A'}
                      </span>
                    </td>
                    <td className="py-3.5 px-6">
                      <StatusBadge status={order.status} />
                    </td>
                    <td className="py-3.5 px-6 text-slate-600 text-xs">{order.location || '—'}</td>
                    <td className="py-3.5 px-6 text-slate-500 text-xs">
                      {formatDate(order.createdAt)}
                    </td>
                    <td
                      className="py-3.5 px-6 text-right"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => onViewOrder(order)}
                          className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onEditOrder(order)}
                          className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                          title="Edit"
                        >
                          <span className="text-xs font-semibold px-1">Edit</span>
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
    </div>
  );
}
