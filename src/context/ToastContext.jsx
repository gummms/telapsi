import { createContext, useContext, useState, useCallback } from "react";
import "./Toast.css";
import Icones from "../components/Icones";

const ToastContext = createContext();

export const useToast = () => useContext(ToastContext);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = "success") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div className="toast-container">
        {toasts.map((toast) => (
          <div key={toast.id} className={`toast ${toast.type}`}>
            <span className="toast-icon">
              <i>
                <Icones icone={toast.type === "success" ? "fa-circle-check" : "fa-circle-exclamation"} />
              </i>
            </span>
            <p>{toast.message}</p>
            <button onClick={() => removeToast(toast.id)} className="toast-close">
              <i>
                <Icones icone="fa-xmark" />
              </i>
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};
