import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback((message, type = 'info', duration = 3500) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  }, [removeToast]);

  const success = useCallback((msg, duration) => addToast(msg, 'success', duration), [addToast]);
  const error = useCallback((msg, duration) => addToast(msg, 'error', duration), [addToast]);
  const info = useCallback((msg, duration) => addToast(msg, 'info', duration), [addToast]);

  return (
    <ToastContext.Provider value={{ addToast, success, error, info, removeToast }}>
      {children}
      {/* Toast Render Stack */}
      <div style={{
        position: 'fixed',
        bottom: '1.5rem',
        right: '1.5rem',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        gap: '0.6rem',
        pointerEvents: 'none'
      }}>
        {toasts.map((toast) => {
          const isSuccess = toast.type === 'success';
          const isError = toast.type === 'error';
          const bgColor = isSuccess ? '#15803D' : isError ? '#BE123C' : '#1A1715';

          return (
            <div
              key={toast.id}
              style={{
                pointerEvents: 'auto',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                background: bgColor,
                color: '#FFFFFF',
                padding: '0.85rem 1.25rem',
                borderRadius: '12px',
                boxShadow: '0 10px 25px rgba(0,0,0,0.18)',
                fontSize: '0.92rem',
                minWidth: '280px',
                maxWidth: '420px',
                animation: 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                backdropFilter: 'blur(8px)'
              }}
            >
              {isSuccess && <CheckCircle2 size={18} style={{ color: '#86EFAC', flexShrink: 0 }} />}
              {isError && <AlertCircle size={18} style={{ color: '#FDA4AF', flexShrink: 0 }} />}
              {!isSuccess && !isError && <Info size={18} style={{ color: '#D4AF37', flexShrink: 0 }} />}

              <span style={{ flex: 1, lineHeight: 1.4 }}>{toast.message}</span>

              <button
                onClick={() => removeToast(toast.id)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'rgba(255,255,255,0.7)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  padding: '2px'
                }}
              >
                <X size={15} />
              </button>
            </div>
          );
        })}
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
