import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Typography, CircularProgress, Button } from "@mui/material";
import api from "../../api";

const Logout = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const logoutUser = async () => {
            const token = localStorage.getItem("token");
            if (!token) {
                navigate("/login", { replace: true });
                return;
            }

            try {
                await api.post(
                    "/auth/logout",
                    {},
                    { headers: { Authorization: `Bearer ${token}` } }
                );
            } catch (err) {
                console.error("Logout API error:", err);
                setError("Could not logout properly. Clearing local session.");
            } finally {
                // Clear localStorage and redirect to login
                localStorage.removeItem("token");
                localStorage.removeItem("role");
                setLoading(false);
            }
        };

        logoutUser();
    }, [navigate]);

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                height: "80vh",
                textAlign: "center",
                px: 2,
            }}
        >
            {loading ? (
                <>
                    <CircularProgress sx={{ mb: 2 }} />
                    <Typography variant="h6">Logging out...</Typography>
                </>
            ) : (
                <>
                    <Typography variant="h6" sx={{ mb: 2 }}>
                        You have been logged out.
                    </Typography>
                    {error && (
                        <Typography variant="body2" color="error" sx={{ mb: 2 }}>
                            {error}
                        </Typography>
                    )}
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => navigate("/login", { replace: true })}
                    >
                        Go to Login
                    </Button>
                </>
            )}
        </Box>
    );
};

export default Logout;
