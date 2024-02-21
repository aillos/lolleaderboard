import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Home } from "./pages/Home";
import { Admin } from "./pages/Admin.jsx";
import {Header} from "./Header.jsx";
import 'bootstrap/dist/css/bootstrap.css';
import Add from "./pages/Add.jsx";
import Remove from "./pages/Remove.jsx";
import {Profile} from "./pages/Profile.jsx";

const App = () => {

    const router = createBrowserRouter([
        {
            path: "/",
            element: <Home />,
        },
        {
            path: "/admin",
            element: <Admin />,
        },
        {
            path: "/add",
            element: <Add />,
        },
        {
            path: "/remove",
            element: <Remove />,
        },
        {
            path: "/profile/:name/:tag",
            element: <Profile />,
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
        <Header />
        <App />
    </React.StrictMode>
);
