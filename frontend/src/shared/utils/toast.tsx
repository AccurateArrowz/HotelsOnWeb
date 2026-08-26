import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  duration: number;
}

interface ToastContextValue {
  toasts: Toast[];
  addToast: (message: string, type?: Toast['type'], duration?: number) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

interface ToastProviderProps {
  children: ReactNode;
}

/**
 * Provider component to wrap the application and provide toast functionality.
 */
export const ToastProvider = ({ children }: ToastProviderProps) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback((message: string, type: Toast['type'] = 'info', duration: number = 5000) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type, duration }]);

    if (duration !== Infinity) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  }, [removeToast]);

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
    </ToastContext.Provider>
  );
};

/**
 * Hook to access the toast system from within React components.
 */
export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

/**
 * Singleton-like access for non-component usage (e.g., API interceptors).
 * We'll use a listener pattern to bridge Context to non-React code if needed.
 */
let externalAddToast: ((msg: string, type?: Toast['type'], duration?: number) => void) | null = null;

export const ToastListener = () => {
  const { addToast } = useToast();
  React.useEffect(() => {
    externalAddToast = addToast;
    return () => {
      externalAddToast = null;
    };
  }, [addToast]);
  return null;
};

export const toast = {
  success: (msg: string, duration?: number) => externalAddToast?.(msg, 'success', duration),
  error: (msg: string, duration?: number) => externalAddToast?.(msg, 'error', duration),
  info: (msg: string, duration?: number) => externalAddToast?.(msg, 'info', duration),
  warning: (msg: string, duration?: number) => externalAddToast?.(msg, 'warning', duration),
};
