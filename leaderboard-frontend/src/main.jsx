import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Home } from "./pages/Home";
import { Manage } from "./pages/Manage";
import {Header} from "./Header.jsx";
import 'bootstrap/dist/css/bootstrap.css';
import Contact from "./pages/Contact.jsx";

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
        {
            path: "/contact",
            element: <Contact />,
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
