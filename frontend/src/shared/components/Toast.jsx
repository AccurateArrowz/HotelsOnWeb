import React from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import { cn } from '@shared/utils/cn';
import { useToast } from '@shared/utils/toast';

const TOAST_VARIANTS = {
  success: {
    icon: <CheckCircle className="w-5 h-5 text-green-500" />,
    className: 'bg-green-50 border-green-200 text-green-800',
  },
  error: {
    icon: <AlertCircle className="w-5 h-5 text-red-500" />,
    className: 'bg-red-50 border-red-200 text-red-800',
  },
  info: {
    icon: <Info className="w-5 h-5 text-blue-500" />,
    className: 'bg-blue-50 border-blue-200 text-blue-800',
  },
  warning: {
    icon: <AlertTriangle className="w-5 h-5 text-amber-500" />,
    className: 'bg-amber-50 border-amber-200 text-amber-800',
  },
};

/**
 * Individual Toast notification component.
 * Uses Tailwind for a modern, accessible UI.
 */
const Toast = ({ id, message, type = 'info' }) => {
  const { removeToast } = useToast();
  const variant = TOAST_VARIANTS[type] || TOAST_VARIANTS.info;

  return (
    <div
      role="alert"
      className={cn(
        'flex items-center gap-3 p-4 min-w-[300px] max-w-md rounded-lg border shadow-lg transition-all duration-300 animate-in fade-in slide-in-from-right-5',
        variant.className
      )}
    >
      <div className="flex-shrink-0">{variant.icon}</div>
      <p className="flex-grow text-sm font-medium">{message}</p>
      <button
        onClick={() => removeToast(id)}
        className="flex-shrink-0 p-1 rounded-md hover:bg-black/5 transition-colors"
        aria-label="Close notification"
      >
        <X className="w-4 h-4 opacity-70" />
      </button>
    </div>
  );
};

/**
 * Container for multiple toast notifications.
 * Positions toasts at the top-right of the viewport.
 */
export const ToastContainer = () => {
  const { toasts } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-3 pointer-events-none">
      {toasts.map((toast) => (
        <div key={toast.id} className="pointer-events-auto">
          <Toast {...toast} />
        </div>
      ))}
    </div>
  );
};
