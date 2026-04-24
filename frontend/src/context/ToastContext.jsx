import React, { createContext, useContext, useState, useCallback } from 'react';
import { X, CheckCircle, AlertCircle, Info, Loader2 } from 'lucide-react';
import './Toast.css';

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info', options = {}) => {
    const { id = Math.random().toString(36).substr(2, 9), duration = 3500 } = options;
    
    setToasts((prev) => {
      const exists = prev.find(t => t.id === id);
      if (exists) {
        return prev.map(t => t.id === id ? { ...t, message, type, duration } : t);
      }
      return [...prev, { id, message, type, duration }];
    });

    if (duration !== Infinity && type !== 'loading') {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const toast = {
    success: (msg, opts) => addToast(msg, 'success', typeof opts === 'number' ? { duration: opts } : opts),
    error: (msg, opts) => addToast(msg, 'error', typeof opts === 'number' ? { duration: opts } : opts),
    info: (msg, opts) => addToast(msg, 'info', typeof opts === 'number' ? { duration: opts } : opts),
    loading: (msg, opts) => addToast(msg, 'loading', { duration: Infinity, ...opts }),
    dismiss: (id) => removeToast(id)
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div className="toast-container">
        {toasts.map((t) => (
          <div key={t.id} className={`toast-item glass ${t.type}`}>
            <div className="toast-icon">
              {t.type === 'success' && <CheckCircle size={18} />}
              {t.type === 'error' && <AlertCircle size={18} />}
              {t.type === 'info' && <Info size={18} />}
              {t.type === 'loading' && <Loader2 size={18} className="animate-spin" />}
            </div>
            <div className="toast-message">{t.message}</div>
            <button className="toast-close" onClick={() => removeToast(t.id)}>
              <X size={14} />
            </button>
            {t.duration !== Infinity && (
              <div className="toast-progress" style={{ animationDuration: `${t.duration}ms` }}></div>
            )}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
