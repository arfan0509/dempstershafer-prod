import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useContext } from "react";
import axiosInstance from "../../api/axiosInstance";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { FiEye, FiEyeOff } from "react-icons/fi";
const LoginPasienPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();
    const validateInputs = () => {
        let valid = true;
        setEmailError("");
        setPasswordError("");
        if (!email.trim()) {
            setEmailError("Email harus diisi.");
            valid = false;
        }
        if (!password.trim()) {
            setPasswordError("Password harus diisi.");
            valid = false;
        }
        return valid;
    };
    const handleLogin = async () => {
        if (!validateInputs())
            return;
        try {
            const response = await axiosInstance.post("/pasien/login", {
                email,
                password,
            });
            const { accessToken, refreshToken, id_pasien } = response.data;
            // Pastikan kedua token disimpan
            localStorage.setItem("accessToken", accessToken);
            localStorage.setItem("refreshToken", refreshToken);
            localStorage.setItem("id_pasien", id_pasien);
            login(accessToken, refreshToken); // Login dengan token
        }
        catch (error) {
            if (error.response?.data?.message.includes("Email")) {
                setEmailError(error.response.data.message);
            }
            else if (error.response?.data?.message.includes("Password")) {
                setPasswordError(error.response.data.message);
            }
            else {
                console.error("Login error:", error);
            }
        }
    };
    return (_jsxs("div", { className: "relative flex items-center justify-center min-h-screen bg-cover bg-center", style: { backgroundImage: 'url("/assets/login-pasien.jpg")' }, children: [_jsx("div", { className: "absolute inset-0 bg-white bg-opacity-60 backdrop-blur-md" }), _jsxs("div", { className: "relative z-10 w-full max-w-md p-8 bg-white bg-opacity-90 rounded-2xl shadow-2xl", children: [_jsx("h2", { className: "text-3xl font-bold text-center text-gray-800 mb-6", children: "Login Pasien" }), _jsxs("div", { className: "mb-4", children: [_jsxs("label", { className: "block text-gray-700 font-medium mb-1", children: ["Email ", _jsx("span", { className: "text-red-500", children: "*" })] }), _jsx("input", { type: "email", placeholder: "Masukkan email", className: `w-full p-3 border ${emailError ? "border-red-500" : "border-gray-300"} rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4F81C7] bg-white/90 text-gray-900`, value: email, onChange: (e) => setEmail(e.target.value) }), emailError && (_jsx("p", { className: "text-red-500 text-sm mt-1", children: emailError }))] }), _jsxs("div", { className: "mb-4 relative", children: [_jsxs("label", { className: "block text-gray-700 font-medium mb-1", children: ["Password ", _jsx("span", { className: "text-red-500", children: "*" })] }), _jsxs("div", { className: "relative", children: [_jsx("input", { type: showPassword ? "text" : "password", placeholder: "Masukkan password", className: `w-full p-3 border ${passwordError ? "border-red-500" : "border-gray-300"} rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4F81C7] pr-12 bg-white/90 text-gray-900`, value: password, onChange: (e) => setPassword(e.target.value) }), _jsx("div", { className: "absolute inset-y-0 right-3 flex items-center cursor-pointer text-gray-600 hover:text-gray-900", onClick: () => setShowPassword((prev) => !prev), children: showPassword ? _jsx(FiEyeOff, { size: 22 }) : _jsx(FiEye, { size: 22 }) })] }), passwordError && (_jsx("p", { className: "text-red-500 text-sm mt-1", children: passwordError }))] }), _jsx("button", { className: "w-full py-3 text-white bg-[#4F81C7] rounded-lg hover:bg-[#3e6b99] transition duration-300 font-semibold shadow-md", onClick: handleLogin, children: "Login" }), _jsxs("p", { className: "text-center text-gray-600 mt-4", children: ["Belum punya akun?", " ", _jsx("button", { className: "text-[#4F81C7] font-semibold hover:underline focus:outline-none", onClick: () => navigate("/pasien-register"), children: "Daftar di sini" })] })] })] }));
};
export default LoginPasienPage;
