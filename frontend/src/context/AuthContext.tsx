import React, { createContext, useState, useEffect, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

interface AuthContextType {
  isLoggedIn: boolean;
  isAdmin: boolean;
  isPasien: boolean;
  isLoading: boolean;
  login: (accessToken: string, refreshToken: string) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
  isAdmin: false,
  isPasien: false,
  isLoading: true,
  login: () => {},
  logout: () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isPasien, setIsPasien] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const refreshAccessToken = async () => {
    try {
      const refreshToken = localStorage.getItem("refreshToken");
      if (!refreshToken) throw new Error("Refresh token tidak ditemukan");

      const response = await axios.post(
        "http://localhost:5000/api/auth/refresh-token",
        {
          refreshToken,
        }
      );
      const { accessToken } = response.data;
      localStorage.setItem("accessToken", accessToken);
      const decoded: any = jwtDecode(accessToken);
      setIsLoggedIn(true);
      setIsAdmin(decoded.role === "admin");
      setIsPasien(decoded.role === "pasien");
    } catch (error) {
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
        const decoded: any = jwtDecode(token);
        if (decoded.exp * 1000 < Date.now()) {
          console.log("⚠️ Token expired, mencoba refresh...");
          await refreshAccessToken();
        } else {
          setIsLoggedIn(true);
          setIsAdmin(decoded.role === "admin");
          setIsPasien(decoded.role === "pasien");
        }
      } catch (error) {
        console.error("❌ Token tidak valid:", error);
        logout();
      }
    } else {
      await refreshAccessToken();
    }
    setIsLoading(false);
  };

  const login = (accessToken: string, refreshToken: string) => {
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
    const decoded: any = jwtDecode(accessToken);
    setIsLoggedIn(true);
    setIsAdmin(decoded.role === "admin");
    setIsPasien(decoded.role === "pasien");

    if (decoded.role === "admin")
      navigate("/admin-dashboard", { replace: true });
    if (decoded.role === "pasien") navigate("/sistem-pakar", { replace: true });
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

  return (
    <AuthContext.Provider
      value={{ isLoggedIn, isAdmin, isPasien, isLoading, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};
