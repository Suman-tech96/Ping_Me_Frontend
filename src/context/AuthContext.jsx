import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const API_URL = "https://ping-me-backend-09ed.onrender.com/api/auth";

    useEffect(() => {
        const storedUser = localStorage.getItem("chatUser");
        const token = localStorage.getItem("chatToken");
        if (storedUser && token) {
            const parsed = JSON.parse(storedUser);
            // Ensure ID is accessible via both .id and ._id for consistency
            parsed.id = parsed.id || parsed._id;
            setUser(parsed);
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            const res = await axios.post(`${API_URL}/login`, { email, password });
            if (res.data.success) {
                const userData = res.data.user;
                userData.id = userData.id || userData._id; // Harmonize ID
                localStorage.setItem("chatToken", res.data.token);
                localStorage.setItem("chatUser", JSON.stringify(userData));
                setUser(userData);
                return { success: true };
            }
        } catch (err) {
            return { success: false, message: err.response?.data?.message || "Login failed" };
        }
    };

    const logout = () => {
        localStorage.removeItem("chatToken");
        localStorage.removeItem("chatUser");
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, setUser, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
