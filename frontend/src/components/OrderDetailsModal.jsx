import React from 'react';
import {
  X,
  Package,
  Calendar,
  Clock,
  MapPin,
  Tag,
  Hash,
  Edit,
  Trash2,
} from 'lucide-react';
import StatusBadge from './StatusBadge';

export default function OrderDetailsModal({
  order,
  isOpen,
  onClose,
  onEdit,
  onDelete,
}) {
  if (!isOpen || !order) return null;

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    try {
      const d = new Date(dateStr);
      return d.toLocaleString('en-US', {
        dateStyle: 'medium',
        timeStyle: 'short',
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in">
      <div
        className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95"
        role="dialog"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-slate-900">{order.name}</h3>
                <StatusBadge status={order.status} />
              </div>
              <p className="text-xs text-slate-500 font-mono">Order ID: #{order.orderId}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Details */}
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
              <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">
                <Tag className="w-3.5 h-3.5 text-slate-400" /> Category / Type
              </div>
              <div className="text-sm font-semibold text-slate-800">{order.type || 'N/A'}</div>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
              <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" /> Delivery Location
              </div>
              <div className="text-sm font-semibold text-slate-800">{order.location || 'N/A'}</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
              <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" /> Created At
              </div>
              <div className="text-sm font-semibold text-slate-800">
                {formatDate(order.createdAt)}
              </div>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
              <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" /> Last Updated
              </div>
              <div className="text-sm font-semibold text-slate-800">
                {formatDate(order.updatedAt)}
              </div>
            </div>
          </div>

          {/* Raw JSON inspection toggle for testing/debugging */}
          <div className="mt-4 pt-3 border-t border-slate-100">
            <details className="text-xs text-slate-500">
              <summary className="cursor-pointer font-medium hover:text-slate-700">
                Inspect Raw API Response
              </summary>
              <pre className="mt-2 p-3 bg-slate-900 text-slate-100 rounded-lg overflow-x-auto text-[11px] font-mono leading-tight">
                {JSON.stringify(order, null, 2)}
              </pre>
            </details>
          </div>
        </div>

        {/* Footer actions */}
        <div className="bg-slate-50 px-6 py-4 flex items-center justify-between border-t border-slate-100">
          <button
            onClick={() => {
              onClose();
              onDelete(order);
            }}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-rose-600 hover:text-rose-700 hover:bg-rose-50 px-3 py-2 rounded-lg transition"
          >
            <Trash2 className="w-4 h-4" />
            Delete
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition"
            >
              Close
            </button>
            <button
              onClick={() => {
                onClose();
                onEdit(order);
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition shadow-xs"
            >
              <Edit className="w-4 h-4" />
              Edit Order
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
