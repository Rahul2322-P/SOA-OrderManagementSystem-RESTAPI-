import React, { useState, useEffect } from 'react';
import { X, PackagePlus, Edit3, Save, Check } from 'lucide-react';

const COMMON_TYPES = [
  'Electronics',
  'Clothing',
  'Groceries',
  'Furniture',
  'Books',
  'Sports',
  'Healthcare',
  'Other',
];

const STATUSES = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

export default function OrderFormModal({
  isOpen,
  initialData = null,
  onClose,
  onSubmit,
  isSubmitting = false,
}) {
  const isEdit = Boolean(initialData?.orderId);

  const [formData, setFormData] = useState({
    name: '',
    type: 'Electronics',
    status: 'Pending',
    location: '',
  });

  const [customType, setCustomType] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      const typeMatches = COMMON_TYPES.includes(initialData.type);
      setFormData({
        name: initialData.name || '',
        type: typeMatches ? initialData.type : 'Other',
        status: initialData.status || 'Pending',
        location: initialData.location || '',
      });
      if (!typeMatches && initialData.type) {
        setCustomType(initialData.type);
      }
    } else {
      setFormData({
        name: '',
        type: 'Electronics',
        status: 'Pending',
        location: '',
      });
      setCustomType('');
    }
    setErrors({});
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) {
      errs.name = 'Order name / product is required';
    } else if (formData.name.trim().length < 2) {
      errs.name = 'Order name must be at least 2 characters';
    }

    const effectiveType = formData.type === 'Other' ? customType.trim() : formData.type;
    if (!effectiveType) {
      errs.type = 'Category / Type is required';
    }

    if (!formData.status) {
      errs.status = 'Status is required';
    }

    if (!formData.location.trim()) {
      errs.location = 'Delivery location is required';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const effectiveType = formData.type === 'Other' ? customType.trim() : formData.type;

    const payload = {
      ...(isEdit ? { orderId: initialData.orderId } : {}),
      name: formData.name.trim(),
      type: effectiveType,
      status: formData.status,
      location: formData.location.trim(),
    };

    onSubmit(payload);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in">
      <div
        className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95"
        role="dialog"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                isEdit
                  ? 'bg-amber-50 border border-amber-100 text-amber-600'
                  : 'bg-indigo-50 border border-indigo-100 text-indigo-600'
              }`}
            >
              {isEdit ? <Edit3 className="w-5 h-5" /> : <PackagePlus className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                {isEdit ? `Edit Order #${initialData.orderId}` : 'Create New Order'}
              </h3>
              <p className="text-xs text-slate-500">
                {isEdit
                  ? 'Update order fields and sync with MySQL backend'
                  : 'Enter order details to save via Spring Boot REST API'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-4">
            {/* Order Name */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                Order / Item Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. MacBook Pro 16-inch M3 Max"
                className={`w-full px-3.5 py-2.5 text-sm bg-slate-50 border rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500 transition ${
                  errors.name ? 'border-rose-400 focus:ring-rose-500' : 'border-slate-300'
                }`}
              />
              {errors.name && <p className="text-xs text-rose-600 mt-1">{errors.name}</p>}
            </div>

            {/* Category / Type & Status Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                  Category / Type <span className="text-rose-500">*</span>
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500 transition"
                >
                  {COMMON_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
                {formData.type === 'Other' && (
                  <input
                    type="text"
                    value={customType}
                    onChange={(e) => setCustomType(e.target.value)}
                    placeholder="Enter custom category"
                    className="mt-2 w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                  />
                )}
                {errors.type && <p className="text-xs text-rose-600 mt-1">{errors.type}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                  Order Status <span className="text-rose-500">*</span>
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500 transition"
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
                {errors.status && <p className="text-xs text-rose-600 mt-1">{errors.status}</p>}
              </div>
            </div>

            {/* Location */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                Delivery Location / Address <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="e.g. 450 Broadway St, New York, NY"
                className={`w-full px-3.5 py-2.5 text-sm bg-slate-50 border rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500 transition ${
                  errors.location ? 'border-rose-400 focus:ring-rose-500' : 'border-slate-300'
                }`}
              />
              {errors.location && <p className="text-xs text-rose-600 mt-1">{errors.location}</p>}
            </div>
          </div>

          {/* Footer actions */}
          <div className="bg-slate-50 px-6 py-4 flex items-center justify-end gap-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 px-5 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden disabled:opacity-50 transition shadow-xs"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  {isEdit ? 'Update Order' : 'Create Order'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
