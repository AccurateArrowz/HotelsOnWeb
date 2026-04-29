import React, { createContext, useContext, useState, useCallback } from 'react';

/**
 * Toast types supported by the system.
 */
const ToastContext = createContext(null);

/**
 * Provider component to wrap the application and provide toast functionality.
 */
export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback((message, type = 'info', duration = 5000) => {
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
let externalAddToast = null;

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
  success: (msg, duration) => externalAddToast?.(msg, 'success', duration),
  error: (msg, duration) => externalAddToast?.(msg, 'error', duration),
  info: (msg, duration) => externalAddToast?.(msg, 'info', duration),
  warning: (msg, duration) => externalAddToast?.(msg, 'warning', duration),
};
