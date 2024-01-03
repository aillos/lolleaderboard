import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Home } from "./pages/Home";
import { Manage } from "./pages/Manage";
import PatchVersionContext from './context/PatchVersionContext';

const App = () => {

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

    return (
            <div className="app-container">
                <RouterProvider router={router} />
            </div>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
