import { Outlet } from "react-router-dom";
import AuthProvider from "./context/AuthContext";
import { ToastProvider } from "./context/ToastContext";

import "./App.css";

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <div className="App">
          <Outlet />
        </div>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;
