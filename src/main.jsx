import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import App from "./App.jsx";

//páginas
import Landpage from "./routes/Landpage.jsx";
import Login from "./routes/Login.jsx";
import Professor from "./routes/Professor.jsx";
import ProtectedRoute from "./routes/ProtectedRoute.jsx";

import "./index.css";
import "./i18n/config";

const router = createBrowserRouter([
  {
    element: <App />,
    children: [
      {
        path: "/",
        element: <Landpage />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/professor",
        element: (
          <ProtectedRoute>
            <Professor />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
