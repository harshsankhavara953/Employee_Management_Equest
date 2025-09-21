// src/routes/PrivateRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ allowedRoles, children }) => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    // If no token, redirect to login
    if (!token) {
        return <Navigate to="/login" replace />;
    }

    // If role not allowed, redirect to login
    if (!allowedRoles.includes(role)) {
        return <Navigate to="/login" replace />;
    }

    // Otherwise, render the page
    return children;
};

export default PrivateRoute;
