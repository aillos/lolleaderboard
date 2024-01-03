import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import {
    createBrowserRouter,
    RouterProvider,
} from "react-router-dom";
import {Home} from "./pages/Home";
import {Manage} from "./pages/Manage";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Home />,
    },
    {
        path: "/manage",
        element: <Manage />,
    },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
      <div className="app-container">
      <RouterProvider router={router} />
      </div>
  </React.StrictMode>,
)