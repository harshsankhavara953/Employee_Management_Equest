import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import AdminDashboard from "../pages/admin/AdminDashboard";
import HrDashboard from "../pages/hr/HrDashboard";
import ManagerDashboard from "../pages/manager/ManagerDashboard";
import EmployeeDashboard from "../pages/employee/EmployeeDashboard";
import PrivateRoute from "./PrivateRoute";
import NotFound from "../pages/notfound/NotFound";
import React from "react";
import Logout from "../pages/auth/Logout";
const AppRoutes = () => {
    return (
        <BrowserRouter>
            <Routes>
                {/* Public */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/logout" element={<Logout />} />
                {/* Role-based */}
                <Route
                    path="/admin"
                    element={
                        <PrivateRoute allowedRoles={["admin"]}>
                            <AdminDashboard />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/hr"
                    element={
                        <PrivateRoute allowedRoles={["hr_manager"]}>
                            <HrDashboard />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/manager"
                    element={
                        <PrivateRoute allowedRoles={["department_manager"]}>
                            <ManagerDashboard />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/employee"
                    element={
                        <PrivateRoute allowedRoles={["employee"]}>
                            <EmployeeDashboard />
                        </PrivateRoute>
                    }
                />

                {/* Fallback */}
                <Route path="*" element={<NotFound />} />
            </Routes>
        </BrowserRouter>
    );
};

export default AppRoutes;
