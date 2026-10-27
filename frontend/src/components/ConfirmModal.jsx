import React from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';

export default function ConfirmModal({
  isOpen,
  title = 'Delete Order',
  message = 'Are you sure you want to delete this order? This action cannot be undone.',
  itemDetails,
  confirmText = 'Delete',
  cancelText = 'Cancel',
  isDeleting = false,
  onConfirm,
  onCancel,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in">
      <div
        className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden transform transition-all animate-in zoom-in-95"
        role="dialog"
        aria-modal="true"
      >
        <div className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center text-rose-600">
                <Trash2 className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">{title}</h3>
            </div>
            <button
              onClick={onCancel}
              disabled={isDeleting}
              className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <p className="mt-3 text-sm text-slate-600">{message}</p>

          {itemDetails && (
            <div className="mt-4 p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700">
              <div className="font-semibold text-slate-900">{itemDetails.name}</div>
              <div className="text-xs text-slate-500 mt-1 flex gap-3">
                <span>Order ID: #{itemDetails.orderId}</span>
                <span>•</span>
                <span>Type: {itemDetails.type}</span>
                <span>•</span>
                <span>Location: {itemDetails.location}</span>
              </div>
            </div>
          )}
        </div>

        <div className="bg-slate-50 px-6 py-4 flex items-center justify-end gap-3 border-t border-slate-100">
          <button
            type="button"
            onClick={onCancel}
            disabled={isDeleting}
            className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 focus:outline-hidden disabled:opacity-50 transition"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-rose-600 rounded-lg hover:bg-rose-700 focus:outline-hidden disabled:opacity-50 transition shadow-xs"
          >
            {isDeleting ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4" />
                {confirmText}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
