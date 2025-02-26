import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
const ModalLogin = ({ isOpen, onClose }) => {
    const [role, setRole] = useState(null);
    const navigate = useNavigate();
    if (!isOpen)
        return null; // Don't render modal if not open
    // Navigate based on role
    const handleContinue = () => {
        if (role === "admin") {
            navigate("/admin-login");
        }
        else if (role === "pasien") {
            navigate("/pasien-login");
        }
        onClose(); // Close modal after navigation
    };
    return (_jsx("div", { className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50", children: _jsxs("div", { className: "relative z-10 p-8 bg-white bg-opacity-90 rounded-xl shadow-lg w-full max-w-md sm:max-w-lg", children: [_jsx("button", { className: "absolute top-2 right-2 text-gray-600 hover:text-gray-900", onClick: onClose, children: "\u2715" }), _jsx("h2", { className: "text-3xl font-semibold text-center text-gray-800 mb-6", children: "Selamat Datang di Sistem Pakar" }), _jsxs("div", { className: "mb-6", children: [_jsx("h3", { className: "text-xl font-semibold text-gray-700 mb-4 text-center", children: "Pilih peran Anda untuk melanjutkan" }), _jsxs("div", { className: "flex space-x-4 justify-center", children: [_jsx("button", { className: `px-6 py-2 w-36 rounded-lg font-semibold ${role === "admin"
                                        ? "bg-[#4F81C7] text-white"
                                        : "bg-transparent border-2 border-[#4F81C7] text-[#4F81C7]"} hover:bg-[#3A6BA8] transition duration-300`, onClick: () => setRole("admin"), children: "Admin" }), _jsx("button", { className: `px-6 py-2 w-36 rounded-lg font-semibold ${role === "pasien"
                                        ? "bg-[#4F81C7] text-white"
                                        : "bg-transparent border-2 border-[#4F81C7] text-[#4F81C7]"} hover:bg-[#3e6b99] transition duration-300`, onClick: () => setRole("pasien"), children: "Pasien" })] })] }), _jsx("button", { disabled: !role, onClick: handleContinue, className: `w-full py-3 text-white rounded-lg transition duration-300 ${role
                        ? "bg-[#4F81C7] hover:bg-[#3e6b99]"
                        : "bg-gray-400 cursor-not-allowed"}`, children: "Lanjutkan" })] }) }));
};
export default ModalLogin;
