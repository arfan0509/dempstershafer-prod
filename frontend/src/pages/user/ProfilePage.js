import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosInstance";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft, FiEye, FiEyeOff } from "react-icons/fi";
import SuccessModal from "../../components/SuccessModal";
import NavbarComponent from "../../components/user/NavbarComponent";
const ProfilePage = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        nama: "",
        email: "",
        alamat: "",
        no_telp: "",
    });
    const [passwordData, setPasswordData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });
    const [passwordVisibility, setPasswordVisibility] = useState({
        currentPassword: false,
        newPassword: false,
        confirmPassword: false,
    });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMessage, setModalMessage] = useState("");
    const [validationError, setValidationError] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });
    const fetchProfileData = async () => {
        try {
            const response = await axiosInstance.get("/pasien/me", {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                },
            });
            const { nama, email, alamat, no_telp } = response.data;
            setFormData({ nama, email, alamat, no_telp: no_telp || "" });
        }
        catch (error) {
            console.error("Error fetching profile data:", error);
            navigate("/login-pasien");
        }
    };
    useEffect(() => {
        fetchProfileData();
    }, []);
    const handleProfileChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };
    const handlePasswordChange = (e) => {
        setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
    };
    const togglePasswordVisibility = (field) => {
        setPasswordVisibility({
            ...passwordVisibility,
            [field]: !passwordVisibility[field],
        });
    };
    const handleProfileSubmit = async (e) => {
        e.preventDefault();
        try {
            await axiosInstance.put("/pasien/edit", formData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                },
            });
            setModalMessage("Profil berhasil diperbarui!");
            setIsModalOpen(true);
            fetchProfileData();
        }
        catch (error) {
            console.error("Error updating profile:", error);
            alert("Gagal memperbarui profil.");
        }
    };
    const validatePassword = () => {
        let isValid = true;
        const errors = {
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
        };
        if (!passwordData.currentPassword) {
            errors.currentPassword = "Password saat ini tidak boleh kosong.";
            isValid = false;
        }
        if (!passwordData.newPassword) {
            errors.newPassword = "Password baru tidak boleh kosong.";
            isValid = false;
        }
        else if (passwordData.newPassword.length < 6) {
            errors.newPassword = "Password baru minimal 6 karakter.";
            isValid = false;
        }
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            errors.confirmPassword = "Konfirmasi password baru tidak cocok.";
            isValid = false;
        }
        setValidationError(errors);
        return isValid;
    };
    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        if (!validatePassword())
            return;
        try {
            await axiosInstance.put("/pasien/change-password", passwordData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                },
            });
            setModalMessage("Password berhasil diubah!");
            setIsModalOpen(true);
            setPasswordData({
                currentPassword: "",
                newPassword: "",
                confirmPassword: "",
            });
        }
        catch (error) {
            if (error.response && error.response.status === 400) {
                setValidationError({
                    currentPassword: "Password Salah",
                    newPassword: "",
                    confirmPassword: "",
                });
            }
            else {
                console.error("Error changing password:", error);
                alert("Gagal mengubah password.");
            }
        }
    };
    const handleModalClose = () => {
        setIsModalOpen(false);
        navigate("/pasien-login");
    };
    return (_jsxs(_Fragment, { children: [_jsx(NavbarComponent, {}), _jsxs("div", { className: "container mx-auto pt-20 px-4 sm:px-6 lg:px-8", children: [_jsxs("button", { onClick: () => navigate("/sistem-pakar"), className: "flex items-center text-[#4F81C7] hover:text-[#3e6b99] font-semibold text-lg pb-5", children: [_jsx(FiArrowLeft, { className: "mr-2", size: 20 }), "Kembali"] }), _jsxs("div", { className: "bg-white bg-opacity-85 p-8 rounded-lg shadow-lg space-y-8", children: [_jsx("h2", { className: "text-3xl font-bold text-center text-gray-700", children: "Profil Saya" }), _jsxs("form", { onSubmit: handleProfileSubmit, className: "space-y-4", children: [_jsx("h3", { className: "text-xl font-semibold text-gray-600", children: "Edit Profil" }), _jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4", children: [_jsxs("div", { className: "space-y-1", children: [_jsx("label", { className: "block text-gray-700 font-medium", children: "Nama Lengkap" }), _jsx("input", { type: "text", name: "nama", value: formData.nama, onChange: handleProfileChange, className: "p-3 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-[#4F81C7]", required: true })] }), _jsxs("div", { className: "space-y-1", children: [_jsx("label", { className: "block text-gray-700 font-medium", children: "Email" }), _jsx("input", { type: "email", name: "email", value: formData.email, disabled: true, className: "p-3 border rounded-lg w-full bg-gray-100 focus:outline-none" })] }), _jsxs("div", { className: "space-y-1", children: [_jsx("label", { className: "block text-gray-700 font-medium", children: "Nomor Telepon" }), _jsx("input", { type: "text", name: "no_telp", value: formData.no_telp, onChange: handleProfileChange, className: "p-3 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-[#4F81C7]", required: true })] }), _jsxs("div", { className: "space-y-1", children: [_jsx("label", { className: "block text-gray-700 font-medium", children: "Alamat" }), _jsx("input", { type: "text", name: "alamat", value: formData.alamat, onChange: handleProfileChange, className: "p-3 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-[#4F81C7]", required: true })] })] }), _jsx("button", { type: "submit", className: "w-full bg-[#4F81C7] hover:bg-[#3A6BA8] text-white py-3 rounded-lg transition duration-300", children: "Simpan Perubahan" })] }), _jsxs("form", { onSubmit: handlePasswordSubmit, className: "space-y-4", children: [_jsx("h3", { className: "text-xl font-semibold text-gray-600", children: "Ubah Password" }), _jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4", children: ["currentPassword", "newPassword", "confirmPassword"].map((field, idx) => (_jsxs("div", { className: "space-y-1", children: [_jsx("label", { className: "block text-gray-700 font-medium", children: field === "currentPassword"
                                                        ? "Password Saat Ini"
                                                        : field === "newPassword"
                                                            ? "Password Baru"
                                                            : "Konfirmasi Password Baru" }), _jsxs("div", { className: "relative", children: [_jsx("input", { type: passwordVisibility[field] ? "text" : "password", name: field, value: passwordData[field], onChange: handlePasswordChange, className: "p-3 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-[#4F81C7]", required: true }), _jsx("button", { type: "button", onClick: () => togglePasswordVisibility(field), className: "absolute right-3 top-1/2 transform -translate-y-1/2", children: passwordVisibility[field] ? _jsx(FiEye, {}) : _jsx(FiEyeOff, {}) })] }), validationError[field] && (_jsx("p", { className: "text-red-500 text-sm", children: validationError[field] }))] }, idx))) }), _jsx("button", { type: "submit", className: "w-full bg-[#4F81C7] hover:bg-[#3A6BA8] text-white py-3 rounded-lg transition duration-300", children: "Ubah Password" })] })] })] }), _jsx(SuccessModal, { isOpen: isModalOpen, message: modalMessage, onClose: handleModalClose })] }));
};
export default ProfilePage;
