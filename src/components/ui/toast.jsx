import React, { createContext, useContext, useState } from "react";

const ToastContext = createContext();

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = (toast) => {
    setToasts((prevToasts) => [...prevToasts, toast]);
  };

  const removeToast = (id) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  };

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      <div className="fixed bottom-0 right-0 z-50 p-4 space-y-4">
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            {...toast}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}

function Toast({ title, description, action, onClose }) {
  return (
    <div className="bg-white border rounded-lg shadow-lg p-4 max-w-sm w-full">
      {title && <div className="font-semibold">{title}</div>}
      {description && (
        <div className="text-sm text-gray-500">{description}</div>
      )}
      {action && (
        <div className="mt-2">
          <button
            onClick={action.onClick}
            className="text-sm font-medium text-blue-600 hover:text-blue-500"
          >
            {action.label}
          </button>
        </div>
      )}
      <button
        onClick={onClose}
        className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
      >
        &times;
      </button>
    </div>
  );
}

export function ToastAction({ children, ...props }) {
  return (
    <button
      className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background hover:bg-secondary"
      {...props}
    >
      {children}
    </button>
  );
}
