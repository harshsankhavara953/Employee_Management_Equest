import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
import api from "../api";

const LogoutButton = () => {
    const navigate = useNavigate();

    const handleLogout = async () => {
        const token = localStorage.getItem("token");

        try {
            await api.post(
                "/auth/logout",
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );
        } catch (err) {
            console.error("Logout API error:", err);
        } finally {
            localStorage.removeItem("token");
            localStorage.removeItem("role");
            navigate("/login", { replace: true });
        }
    };

    return (
        <Button variant="contained" color="error" onClick={handleLogout}>
            Logout
        </Button>
    );
};

export default LogoutButton;
