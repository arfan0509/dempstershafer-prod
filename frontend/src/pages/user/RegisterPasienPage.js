import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiEye, FiEyeOff } from "react-icons/fi";
import SuccessModal from "../../components/SuccessModal"; // ✅ Import modal berhasil
import axiosInstance from "../../api/axiosInstance";
const RegisterPasienPage = () => {
    const [formData, setFormData] = useState({
        nama: "",
        alamat: "",
        no_telp: "",
        email: "",
        password: "",
    });
    const [showPassword, setShowPassword] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [showSuccessModal, setShowSuccessModal] = useState(false); // ✅ State modal berhasil
    const navigate = useNavigate();
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };
    // ✅ Fungsi validasi email dengan regex
    const isValidEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };
    const handleRegister = async () => {
        if (!formData.nama ||
            !formData.alamat ||
            !formData.no_telp ||
            !formData.email ||
            !formData.password) {
            setErrorMessage("Semua kolom harus diisi!");
            return;
        }
        if (!isValidEmail(formData.email)) {
            setErrorMessage("Format email tidak valid!");
            return;
        }
        try {
            await axiosInstance.post("/pasien/register", formData);
            setShowSuccessModal(true); // ✅ Tampilkan modal berhasil
        }
        catch (error) {
            console.error("Register error:", error);
            setErrorMessage(error.response?.data?.message || "Terjadi kesalahan saat mendaftar");
        }
    };
    const handleCloseModal = () => {
        setShowSuccessModal(false);
        navigate("/pasien-login"); // ✅ Arahkan ke login setelah modal ditutup
    };
    return (_jsxs("div", { className: "relative flex items-center justify-center min-h-screen bg-cover bg-center", style: { backgroundImage: 'url("/assets/register-pasien.jpg")' }, children: [_jsx("div", { className: "absolute inset-0 bg-white bg-opacity-60 backdrop-blur-md" }), _jsxs("div", { className: "relative z-10 w-full max-w-md lg:max-w-2xl p-8 bg-white bg-opacity-90 rounded-2xl shadow-2xl", children: [_jsx("h2", { className: "text-3xl font-bold text-center text-gray-800 mb-6", children: "Daftar Pasien" }), errorMessage && (_jsx("div", { className: "mb-4 text-center text-red-500 font-medium", children: errorMessage })), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-gray-700 font-medium mb-1", children: "Nama" }), _jsx("input", { type: "text", name: "nama", placeholder: "Masukkan nama", className: "w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4F81C7]", value: formData.nama, onChange: handleChange })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-gray-700 font-medium mb-1", children: "No. Telepon" }), _jsx("input", { type: "text", name: "no_telp", placeholder: "Masukkan no. telepon", className: "w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4F81C7]", value: formData.no_telp, onChange: handleChange })] }), _jsxs("div", { className: "lg:col-span-2", children: [_jsx("label", { className: "block text-gray-700 font-medium mb-1", children: "Alamat" }), _jsx("input", { type: "text", name: "alamat", placeholder: "Masukkan alamat", className: "w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4F81C7]", value: formData.alamat, onChange: handleChange })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-gray-700 font-medium mb-1", children: "Email" }), _jsx("input", { type: "email", name: "email", placeholder: "Masukkan email", className: "w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4F81C7]", value: formData.email, onChange: handleChange })] }), _jsxs("div", { className: "relative", children: [_jsx("label", { className: "block text-gray-700 font-medium mb-1", children: "Password" }), _jsx("input", { type: showPassword ? "text" : "password", name: "password", placeholder: "Masukkan password", className: "w-full p-3 pr-14 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4F81C7]", value: formData.password, onChange: handleChange }), _jsx("div", { className: "absolute top-[53px] right-4 transform -translate-y-1/2 cursor-pointer text-gray-600 hover:text-gray-900", onClick: () => setShowPassword((prev) => !prev), children: showPassword ? _jsx(FiEyeOff, { size: 20 }) : _jsx(FiEye, { size: 20 }) })] })] }), _jsx("button", { className: "w-full mt-6 py-3 text-white bg-[#4F81C7] rounded-lg hover:bg-[#3e6b99] transition duration-300 font-semibold shadow-md", onClick: handleRegister, children: "Daftar" }), _jsxs("p", { className: "text-center text-gray-600 mt-4", children: ["Sudah punya akun?", " ", _jsx("button", { className: "text-[#4F81C7] font-semibold hover:underline", onClick: () => navigate("/pasien-login"), children: "Login di sini" })] })] }), _jsx(SuccessModal, { isOpen: showSuccessModal, message: "Pendaftaran berhasil! Silakan login untuk melanjutkan.", onClose: handleCloseModal })] }));
};
export default RegisterPasienPage;
