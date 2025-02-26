import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useContext } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/user/LoginPasienPage";
import LoginAdminPage from "./pages/admin/LoginAdminPage";
import LoginPasienPage from "./pages/user/LoginPasienPage";
import RegisterPasienPage from "./pages/user/RegisterPasienPage";
import SistemPakarPage from "./pages/user/SistemPakarPage";
import Dashboard from "./pages/admin/Dashboard";
import DataPenyakitDanSolusi from "./pages/admin/DataPenyakitDanSolusi";
import DataGejala from "./pages/admin/DataGejala";
import DataRelasiGejala from "./pages/admin/DataRelasiGejala";
import AdminSidebar from "./components/admin/AdminSidebar";
import { AuthProvider, AuthContext } from "./context/AuthContext";
import ProfilePage from "./pages/user/ProfilePage";
import RiwayatDiagnosisPage from "./pages/user/RiwayatDiagnosisPage";
import RiwayatDiagnosisAdminPage from "./pages/admin/RiwayatDiagnosisAdmin";
const LoadingScreen = () => (_jsx("div", { className: "flex items-center justify-center min-h-screen bg-gray-100", children: _jsxs("div", { className: "flex flex-col items-center", children: [_jsx("div", { className: "w-16 h-16 border-4 border-blue-500 border-dashed rounded-full animate-spin" }), _jsx("p", { className: "mt-4 text-lg font-semibold text-gray-700 animate-pulse", children: "Memuat halaman..." })] }) }));
const PrivateRouteAdmin = ({ children }) => {
    const { isLoggedIn, isAdmin, isLoading } = useContext(AuthContext);
    if (isLoading)
        return _jsx(LoadingScreen, {});
    return isLoggedIn && isAdmin ? (children) : (_jsx(Navigate, { to: "/admin-login", replace: true }));
};
const PrivateRoutePasien = ({ children }) => {
    const { isLoggedIn, isPasien, isLoading } = useContext(AuthContext);
    if (isLoading)
        return _jsx(LoadingScreen, {});
    return isLoggedIn && isPasien ? (children) : (_jsx(Navigate, { to: "/pasien-login", replace: true }));
};
function App() {
    return (_jsx(Router, { children: _jsx(AuthProvider, { children: _jsxs(Routes, { children: [_jsx(Route, { path: "/", element: _jsx(LandingPage, {}) }), _jsx(Route, { path: "/login", element: _jsx(LoginPage, {}) }), _jsx(Route, { path: "/admin-login", element: _jsx(LoginAdminPage, {}) }), _jsx(Route, { path: "/pasien-login", element: _jsx(LoginPasienPage, {}) }), _jsx(Route, { path: "/pasien-register", element: _jsx(RegisterPasienPage, {}) }), _jsx(Route, { path: "/sistem-pakar", element: _jsx(PrivateRoutePasien, { children: _jsx(SistemPakarPage, {}) }) }), _jsx(Route, { path: "/akun-saya", element: _jsx(PrivateRoutePasien, { children: _jsx(ProfilePage, {}) }) }), _jsx(Route, { path: "/riwayat-diagnosis", element: _jsx(PrivateRoutePasien, { children: _jsx(RiwayatDiagnosisPage, {}) }) }), _jsx(Route, { path: "/admin-dashboard", element: _jsx(PrivateRouteAdmin, { children: _jsx(AdminSidebar, { children: _jsx(Dashboard, {}) }) }) }), _jsx(Route, { path: "/data-penyakit-dan-solusi", element: _jsx(PrivateRouteAdmin, { children: _jsx(AdminSidebar, { children: _jsx(DataPenyakitDanSolusi, {}) }) }) }), _jsx(Route, { path: "/data-gejala", element: _jsx(PrivateRouteAdmin, { children: _jsx(AdminSidebar, { children: _jsx(DataGejala, {}) }) }) }), _jsx(Route, { path: "/data-relasi-gejala", element: _jsx(PrivateRouteAdmin, { children: _jsx(AdminSidebar, { children: _jsx(DataRelasiGejala, {}) }) }) }), _jsx(Route, { path: "/riwayatdiagnosis-admin", element: _jsx(PrivateRouteAdmin, { children: _jsx(AdminSidebar, { children: _jsx(RiwayatDiagnosisAdminPage, {}) }) }) }), _jsx(Route, { path: "*", element: _jsx(Navigate, { to: "/", replace: true }) })] }) }) }));
}
export default App;
