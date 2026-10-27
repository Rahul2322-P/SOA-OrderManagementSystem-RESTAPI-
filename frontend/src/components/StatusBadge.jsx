import React from 'react';
import { Clock, Loader, Truck, CheckCircle2, XCircle } from 'lucide-react';

const statusConfig = {
  Pending: {
    bg: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800',
    icon: Clock,
    dot: 'bg-amber-500',
  },
  Processing: {
    bg: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800',
    icon: Loader,
    dot: 'bg-blue-500',
  },
  Shipped: {
    bg: 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-300 dark:border-indigo-800',
    icon: Truck,
    dot: 'bg-indigo-500',
  },
  Delivered: {
    bg: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800',
    icon: CheckCircle2,
    dot: 'bg-emerald-500',
  },
  Cancelled: {
    bg: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800',
    icon: XCircle,
    dot: 'bg-rose-500',
  },
};

export default function StatusBadge({ status, showIcon = true, size = 'sm' }) {
  const normalizedStatus = status
    ? status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()
    : 'Pending';

  const config = statusConfig[normalizedStatus] || {
    bg: 'bg-slate-100 text-slate-700 border-slate-200',
    icon: Clock,
    dot: 'bg-slate-400',
  };

  const Icon = config.icon;
  const isSm = size === 'sm';

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium border rounded-full ${config.bg} ${
        isSm ? 'px-2.5 py-0.5 text-xs' : 'px-3 py-1 text-sm'
      }`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      {showIcon && <Icon className={isSm ? 'w-3 h-3' : 'w-3.5 h-3.5'} />}
      <span>{normalizedStatus}</span>
    </span>
  );
}
