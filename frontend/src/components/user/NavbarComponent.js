import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosInstance";
import { FiUser, FiLogOut, FiActivity, FiUserCheck } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
const NavbarComponent = () => {
    const [namaDepan, setNamaDepan] = useState("User");
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const navigate = useNavigate();
    // ✅ Ambil nama pasien yang login
    const fetchPasienData = async () => {
        try {
            const response = await axiosInstance.get("/pasien/me", {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                },
            });
            const fullName = response.data.nama || "User";
            const firstName = fullName.split(" ")[0]; // Ambil nama pertama
            setNamaDepan(firstName);
        }
        catch (error) {
            console.error("Error fetching pasien data:", error);
            navigate("/sistem-pakar"); // Redirect jika token invalid
        }
    };
    useEffect(() => {
        fetchPasienData();
    }, []);
    // ✅ Logout Handler
    const handleLogout = () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        navigate("/login-pasien");
    };
    return (_jsx("nav", { className: "bg-[#4F81C7] p-4 shadow-md fixed top-0 left-0 w-full z-50", children: _jsxs("div", { className: "container mx-auto flex justify-between items-center", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("img", { src: "/assets/nav-logo.png", alt: "Logo", className: "h-10 w-auto" }), _jsx("h1", { className: "text-white text-2xl font-semibold", children: "Sistem Pakar" })] }), _jsxs("div", { className: "relative", children: [_jsxs("button", { onClick: () => setDropdownOpen(!dropdownOpen), className: "flex items-center gap-2 text-white bg-[#3e6b99] p-2 rounded-lg hover:bg-[#355b80] transition", children: [_jsx(FiUser, { size: 24 }), _jsxs("span", { className: "font-medium", children: ["Halo, ", namaDepan] })] }), dropdownOpen && (_jsxs("div", { className: "absolute right-0 mt-2 bg-white rounded-lg shadow-lg w-48 z-50", children: [_jsxs("button", { onClick: () => {
                                        navigate("/akun-saya");
                                        setDropdownOpen(false);
                                    }, className: "flex items-center gap-2 w-full px-4 py-2 hover:bg-gray-100", children: [_jsx(FiUserCheck, {}), " Akun"] }), _jsxs("button", { onClick: () => {
                                        navigate("/riwayat-diagnosis");
                                        setDropdownOpen(false);
                                    }, className: "flex items-center gap-2 w-full px-4 py-2 hover:bg-gray-100", children: [_jsx(FiActivity, {}), " Riwayat Diagnosis"] }), _jsxs("button", { onClick: handleLogout, className: "flex items-center gap-2 w-full px-4 py-2 hover:bg-red-100 text-red-600", children: [_jsx(FiLogOut, {}), " Logout"] })] }))] })] }) }));
};
export default NavbarComponent;
