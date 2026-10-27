import React, { useEffect } from 'react';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';

export default function Notification({ notification, onDismiss }) {
  useEffect(() => {
    if (!notification) return;
    const timer = setTimeout(() => {
      onDismiss();
    }, 5000);
    return () => clearTimeout(timer);
  }, [notification, onDismiss]);

  if (!notification) return null;

  const { type = 'info', message, title } = notification;

  const styles = {
    success: {
      bg: 'bg-emerald-50 border-emerald-300 text-emerald-900',
      icon: <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />,
      accent: 'text-emerald-800',
    },
    error: {
      bg: 'bg-rose-50 border-rose-300 text-rose-900',
      icon: <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />,
      accent: 'text-rose-800',
    },
    warning: {
      bg: 'bg-amber-50 border-amber-300 text-amber-900',
      icon: <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0" />,
      accent: 'text-amber-800',
    },
    info: {
      bg: 'bg-blue-50 border-blue-300 text-blue-900',
      icon: <Info className="w-5 h-5 text-blue-600 flex-shrink-0" />,
      accent: 'text-blue-800',
    },
  }[type] || styles.info;

  return (
    <div className="fixed top-5 right-5 z-50 max-w-md w-full animate-in fade-in slide-in-from-top-4 duration-200">
      <div
        className={`flex items-start gap-3 p-4 rounded-xl border shadow-lg backdrop-blur-sm ${styles.bg}`}
        role="alert"
      >
        {styles.icon}
        <div className="flex-1 min-w-0">
          {title && <p className="font-semibold text-sm leading-5 mb-0.5">{title}</p>}
          <p className="text-sm leading-5 break-words">{message}</p>
        </div>
        <button
          onClick={onDismiss}
          className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-black/5 transition"
          aria-label="Close notification"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
