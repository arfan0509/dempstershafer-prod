import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
export const AuthContext = createContext({
    isLoggedIn: false,
    isAdmin: false,
    isPasien: false,
    isLoading: true,
    login: () => { },
    logout: () => { },
});
export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [isPasien, setIsPasien] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();
    const refreshAccessToken = async () => {
        try {
            const refreshToken = localStorage.getItem("refreshToken");
            if (!refreshToken)
                throw new Error("Refresh token tidak ditemukan");
            const response = await axios.post("http://localhost:5000/api/auth/refresh-token", {
                refreshToken,
            });
            const { accessToken } = response.data;
            localStorage.setItem("accessToken", accessToken);
            const decoded = jwtDecode(accessToken);
            setIsLoggedIn(true);
            setIsAdmin(decoded.role === "admin");
            setIsPasien(decoded.role === "pasien");
        }
        catch (error) {
            console.error("❌ Gagal refresh token:", error);
            logout();
        }
    };
    const checkToken = async () => {
        setIsLoading(true);
        const token = localStorage.getItem("accessToken");
        // Menambahkan delay agar loading spinner tetap tampil selama beberapa detik
        await new Promise((resolve) => setTimeout(resolve, 800));
        if (token) {
            try {
                const decoded = jwtDecode(token);
                if (decoded.exp * 1000 < Date.now()) {
                    console.log("⚠️ Token expired, mencoba refresh...");
                    await refreshAccessToken();
                }
                else {
                    setIsLoggedIn(true);
                    setIsAdmin(decoded.role === "admin");
                    setIsPasien(decoded.role === "pasien");
                }
            }
            catch (error) {
                console.error("❌ Token tidak valid:", error);
                logout();
            }
        }
        else {
            await refreshAccessToken();
        }
        setIsLoading(false);
    };
    const login = (accessToken, refreshToken) => {
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
        const decoded = jwtDecode(accessToken);
        setIsLoggedIn(true);
        setIsAdmin(decoded.role === "admin");
        setIsPasien(decoded.role === "pasien");
        if (decoded.role === "admin")
            navigate("/admin-dashboard", { replace: true });
        if (decoded.role === "pasien")
            navigate("/sistem-pakar", { replace: true });
    };
    const logout = () => {
        localStorage.clear();
        setIsLoggedIn(false);
        setIsAdmin(false);
        setIsPasien(false);
        navigate("/", { replace: true });
    };
    useEffect(() => {
        checkToken();
    }, []);
    return (_jsx(AuthContext.Provider, { value: { isLoggedIn, isAdmin, isPasien, isLoading, login, logout }, children: children }));
};
