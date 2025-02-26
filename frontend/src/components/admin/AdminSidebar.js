import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from "react";
import { FiMenu, FiHome, FiDatabase, FiFileText, FiActivity, FiBookOpen, FiClock, FiLogOut, } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
const Sidebar = ({ isOpen, onClose, }) => {
    const [isMasterOpen, setIsMasterOpen] = useState(false);
    const toggleMaster = () => setIsMasterOpen(!isMasterOpen);
    const navigate = useNavigate();
    // Fungsi Logout
    const handleLogout = () => {
        localStorage.removeItem("accessToken"); // ✅ Hapus access token
        localStorage.removeItem("refreshToken"); // ✅ Hapus refresh token
        navigate("/"); // ✅ Arahkan kembali ke halaman login admin
    };
    return (_jsxs(_Fragment, { children: [isOpen && (_jsx("div", { className: "fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden", onClick: onClose })), _jsxs("div", { className: `fixed inset-y-0 left-0 w-64 bg-[#4F81C7] text-white p-4 transform transition-transform duration-300 ease-in-out z-50
    ${isOpen ? "translate-x-0" : "-translate-x-full"} 
    md:static md:translate-x-0 h-screen`, children: [_jsxs("div", { className: "flex items-center gap-2 p-2 mb-4 border-b border-white", children: [_jsx("img", { src: "/assets/logo-admin.svg", alt: "Logo", className: "h-10 w-auto" }), _jsx("span", { className: "text-lg font-semibold", children: "Admin Menu" })] }), _jsxs("ul", { children: [_jsx("li", { children: _jsxs(Link, { to: "/admin-dashboard", className: "block p-2 hover:bg-[#3A6BA8] flex items-center", onClick: onClose, children: [_jsx(FiHome, { className: "mr-2" }), " Dashboard"] }) }), _jsxs("li", { className: "p-2 hover:bg-[#3A6BA8] flex justify-between items-center cursor-pointer", onClick: toggleMaster, children: [_jsxs("span", { className: "flex items-center", children: [_jsx(FiDatabase, { className: "mr-2" }), " Master Data"] }), _jsx("span", { children: isMasterOpen ? "−" : "+" })] }), _jsx("div", { className: `overflow-hidden transition-all duration-500 ease-in-out ${isMasterOpen ? "max-h-40 opacity-100" : "max-h-0 opacity-0"}`, children: _jsxs("ul", { className: "pl-4", children: [_jsx("li", { children: _jsxs(Link, { to: "/data-penyakit-dan-solusi", className: "block p-2 hover:bg-[#3A6BA8] flex items-center", onClick: onClose, children: [_jsx(FiFileText, { className: "mr-2" }), " Penyakit dan Solusi"] }) }), _jsx("li", { children: _jsxs(Link, { to: "/data-gejala", className: "block p-2 hover:bg-[#3A6BA8] flex items-center", onClick: onClose, children: [_jsx(FiActivity, { className: "mr-2" }), " Data Gejala"] }) })] }) }), _jsx("li", { className: "p-2 hover:bg-[#3A6BA8] flex items-center", children: _jsxs(Link, { to: "/data-relasi-gejala", className: "flex items-center text-white w-full", onClick: onClose, children: [_jsx(FiBookOpen, { className: "mr-2" }), " Rule Dempster Shafer"] }) }), _jsx("li", { className: "p-2 hover:bg-[#3A6BA8] flex items-center", children: _jsxs(Link, { to: "/riwayatdiagnosis-admin", className: "flex items-center text-white w-full", onClick: onClose, children: [_jsx(FiClock, { className: "mr-2" }), " Riwayat Diagnosis Kucing"] }) }), _jsxs("li", { className: "p-2 hover:bg-[#3A6BA8] flex items-center cursor-pointer", onClick: handleLogout, children: [_jsx(FiLogOut, { className: "mr-2" }), " Logout"] })] })] })] }));
};
const AdminSidebar = ({ children }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    return (_jsxs("div", { className: "flex min-h-screen", children: [_jsx(Sidebar, { isOpen: isSidebarOpen, onClose: () => setIsSidebarOpen(false) }), _jsxs("div", { className: "flex-1 min-w-0 h-screen overflow-y-auto", children: [_jsxs("div", { className: "md:hidden bg-[#4F81C7] text-white p-4 flex items-center gap-2 sticky top-0 z-50", children: [_jsx("button", { onClick: () => setIsSidebarOpen(!isSidebarOpen), className: "focus:outline-none", children: _jsx(FiMenu, { size: 24 }) }), _jsx("img", { src: "/assets/logo-admin.svg", alt: "Logo", className: "h-8 w-auto" }), _jsx("span", { className: "text-lg font-semibold", children: "Admin Menu" })] }), _jsx("div", { className: "p-4", children: children })] })] }));
};
export default AdminSidebar;
