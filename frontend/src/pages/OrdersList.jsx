import React, { useState, useMemo, useEffect } from 'react';
import {
  Search,
  Filter,
  PlusCircle,
  Eye,
  Edit,
  Trash2,
  RefreshCw,
  LayoutGrid,
  List,
  MapPin,
  Calendar,
  X,
  Package,
} from 'lucide-react';
import StatusBadge from '../components/StatusBadge';
import orderService from '../api/orderService';

const STATUS_FILTERS = ['ALL', 'Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

export default function OrdersList({
  orders = [],
  isLoading = false,
  onRefresh,
  onOpenCreate,
  onViewOrder,
  onEditOrder,
  onDeleteOrder,
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [viewMode, setViewMode] = useState('table'); // 'table' | 'grid'
  const [sortBy, setSortBy] = useState('newest'); // 'newest' | 'oldest' | 'name-asc' | 'id-asc'
  const [isApiSearching, setIsApiSearching] = useState(false);
  const [searchedOrders, setSearchedOrders] = useState(null);

  // Extract unique types from current orders
  const availableTypes = useMemo(() => {
    const types = new Set();
    orders.forEach((o) => {
      if (o.type && o.type.trim()) {
        types.add(o.type.trim());
      }
    });
    return ['ALL', ...Array.from(types).sort()];
  }, [orders]);

  // Handle direct API search by name or type
  const handleApiSearch = async (e) => {
    e?.preventDefault();
    if (!searchTerm.trim()) {
      setSearchedOrders(null);
      return;
    }
    try {
      setIsApiSearching(true);
      const res = await orderService.getOrdersByName(searchTerm.trim());
      setSearchedOrders(res);
    } catch {
      setSearchedOrders([]);
    } finally {
      setIsApiSearching(false);
    }
  };

  // Handle API search by category type
  const handleTypeChange = async (type) => {
    setSelectedType(type);
    if (type === 'ALL') {
      setSearchedOrders(null);
      return;
    }
    try {
      setIsApiSearching(true);
      const res = await orderService.getOrdersByType(type);
      setSearchedOrders(res);
    } catch {
      setSearchedOrders([]);
    } finally {
      setIsApiSearching(false);
    }
  };

  // Reset all filters
  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedType('ALL');
    setSelectedStatus('ALL');
    setSearchedOrders(null);
    onRefresh();
  };

  // Base list to filter from
  const activeList = searchedOrders !== null ? searchedOrders : orders;

  // Filter and sort orders
  const filteredOrders = useMemo(() => {
    return activeList
      .filter((o) => {
        // Search term client-side filter
        if (searchTerm.trim() && searchedOrders === null) {
          const term = searchTerm.toLowerCase();
          const matchName = o.name?.toLowerCase().includes(term);
          const matchLoc = o.location?.toLowerCase().includes(term);
          const matchId = String(o.orderId).includes(term);
          if (!matchName && !matchLoc && !matchId) return false;
        }

        // Type filter (if client-side)
        if (selectedType !== 'ALL' && searchedOrders === null) {
          if (o.type?.toLowerCase() !== selectedType.toLowerCase()) return false;
        }

        // Status filter
        if (selectedStatus !== 'ALL') {
          if (o.status?.toLowerCase() !== selectedStatus.toLowerCase()) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'newest') return (b.orderId || 0) - (a.orderId || 0);
        if (sortBy === 'oldest') return (a.orderId || 0) - (b.orderId || 0);
        if (sortBy === 'name-asc') return (a.name || '').localeCompare(b.name || '');
        if (sortBy === 'id-asc') return (a.orderId || 0) - (b.orderId || 0);
        return 0;
      });
  }, [activeList, searchTerm, selectedType, selectedStatus, sortBy, searchedOrders]);

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
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Order Directory</h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Search, filter, view, edit, and manage all orders in real time.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* View mode toggle */}
          <div className="bg-slate-100 p-1 rounded-xl flex items-center border border-slate-200">
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg transition ${
                viewMode === 'table' ? 'bg-white shadow-xs text-indigo-600' : 'text-slate-500'
              }`}
              title="Table View"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition ${
                viewMode === 'grid' ? 'bg-white shadow-xs text-indigo-600' : 'text-slate-500'
              }`}
              title="Grid Card View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={onRefresh}
            disabled={isLoading || isApiSearching}
            className="p-2.5 bg-white hover:bg-slate-50 border border-slate-300 rounded-xl text-slate-600 hover:text-slate-900 transition shadow-xs"
            title="Reload Orders"
          >
            <RefreshCw
              className={`w-4 h-4 ${isLoading || isApiSearching ? 'animate-spin' : ''}`}
            />
          </button>

          <button
            onClick={onOpenCreate}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 shadow-sm shadow-indigo-600/20 transition"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Create Order</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search Input with API form submission */}
          <form onSubmit={handleApiSearch} className="flex-1 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by order name (Press Enter for API /order/displaybyname)..."
              className="w-full pl-10 pr-20 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500 transition"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => {
                  setSearchTerm('');
                  setSearchedOrders(null);
                }}
                className="absolute right-12 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
            <button
              type="submit"
              disabled={isApiSearching}
              className="absolute right-1.5 top-1/2 -translate-y-1/2 px-2.5 py-1 text-xs font-semibold bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
            >
              Search
            </button>
          </form>

          {/* Category Type Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <select
              value={selectedType}
              onChange={(e) => handleTypeChange(e.target.value)}
              className="px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500 font-medium text-slate-700"
            >
              <option value="ALL">All Categories</option>
              {availableTypes
                .filter((t) => t !== 'ALL')
                .map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
            </select>
          </div>

          {/* Sort By Select */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500 font-medium text-slate-700"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="name-asc">Name (A-Z)</option>
            <option value="id-asc">ID (Low to High)</option>
          </select>
        </div>

        {/* Status Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 text-xs">
          <span className="text-slate-400 font-semibold uppercase tracking-wider text-[10px] mr-1">
            Status:
          </span>
          {STATUS_FILTERS.map((s) => {
            const isSelected = selectedStatus === s;
            return (
              <button
                key={s}
                onClick={() => setSelectedStatus(s)}
                className={`px-3 py-1 rounded-full font-medium transition ${
                  isSelected
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                }`}
              >
                {s}
              </button>
            );
          })}

          {(searchTerm || selectedType !== 'ALL' || selectedStatus !== 'ALL' || searchedOrders !== null) && (
            <button
              onClick={handleResetFilters}
              className="ml-auto text-xs text-rose-600 hover:text-rose-700 font-medium underline cursor-pointer"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* API Search Notice */}
      {searchedOrders !== null && (
        <div className="p-3 bg-indigo-50/80 border border-indigo-200 rounded-xl flex items-center justify-between text-xs text-indigo-900">
          <span>
            Showing API filtered results (<strong>{filteredOrders.length}</strong> matches found)
          </span>
          <button
            onClick={handleResetFilters}
            className="font-semibold text-indigo-700 hover:underline"
          >
            Clear Filter & Show All
          </button>
        </div>
      )}

      {/* Orders View */}
      {isLoading ? (
        <div className="bg-white rounded-3xl p-16 text-center border border-slate-200">
          <div className="inline-block w-8 h-8 border-3 border-indigo-600/20 border-t-indigo-600 rounded-full animate-spin mb-3" />
          <p className="text-sm font-medium text-slate-600">Fetching order records...</p>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="bg-white rounded-3xl p-16 text-center border border-slate-200 space-y-3">
          <Package className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">No Orders Found</h3>
          <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
            {searchTerm || selectedType !== 'ALL' || selectedStatus !== 'ALL'
              ? 'No orders match your filter criteria. Try adjusting or resetting your search filters.'
              : 'The database contains no orders. Click "Create Order" to insert your first record.'}
          </p>
          {(searchTerm || selectedType !== 'ALL' || selectedStatus !== 'ALL') ? (
            <button
              onClick={handleResetFilters}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition"
            >
              Clear Filters
            </button>
          ) : (
            <button
              onClick={onOpenCreate}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-semibold hover:bg-indigo-700 transition"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Create First Order</span>
            </button>
          )}
        </div>
      ) : viewMode === 'table' ? (
        /* Table View */
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/70 border-b border-slate-100 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                  <th className="py-3.5 px-6">ID</th>
                  <th className="py-3.5 px-6">Product / Name</th>
                  <th className="py-3.5 px-6">Category</th>
                  <th className="py-3.5 px-6">Status</th>
                  <th className="py-3.5 px-6">Delivery Location</th>
                  <th className="py-3.5 px-6">Created At</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {filteredOrders.map((order) => (
                  <tr
                    key={order.orderId}
                    className="hover:bg-slate-50/70 transition cursor-pointer group"
                    onClick={() => onViewOrder(order)}
                  >
                    <td className="py-4 px-6 font-mono text-xs font-bold text-slate-700">
                      #{order.orderId}
                    </td>
                    <td className="py-4 px-6">
                      <div className="font-semibold text-slate-900 group-hover:text-indigo-600 transition">
                        {order.name}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-medium">
                        {order.type || 'N/A'}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <StatusBadge status={order.status} />
                    </td>
                    <td className="py-4 px-6 text-slate-600 text-xs">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                        <span className="truncate max-w-[180px]">{order.location || '—'}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-slate-500 text-xs">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>{formatDate(order.createdAt)}</span>
                      </div>
                    </td>
                    <td
                      className="py-4 px-6 text-right"
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
                          title="Edit Order"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onDeleteOrder(order)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
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
        </div>
      ) : (
        /* Grid Card View */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredOrders.map((order) => (
            <div
              key={order.orderId}
              onClick={() => onViewOrder(order)}
              className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition cursor-pointer flex flex-col justify-between space-y-4 group"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-xs font-bold text-slate-500">
                    #{order.orderId}
                  </span>
                  <StatusBadge status={order.status} />
                </div>
                <h3 className="font-bold text-base text-slate-900 group-hover:text-indigo-600 transition">
                  {order.name}
                </h3>
                <div className="mt-2 text-xs text-slate-600 flex items-center gap-1.5">
                  <span className="px-2 py-0.5 rounded bg-slate-100 font-medium">
                    {order.type || 'N/A'}
                  </span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 text-xs text-slate-500 space-y-1.5">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span className="truncate">{order.location || '—'}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>{formatDate(order.createdAt)}</span>
                </div>
              </div>

              <div
                className="pt-2 flex items-center justify-end gap-2"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => onViewOrder(order)}
                  className="px-2.5 py-1 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition"
                >
                  Details
                </button>
                <button
                  onClick={() => onEditOrder(order)}
                  className="px-2.5 py-1 text-xs font-semibold text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDeleteOrder(order)}
                  className="px-2.5 py-1 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-lg transition"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
