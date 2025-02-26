import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
const ModalEditPasien = ({ isOpen, onClose, onSave, data }) => {
    const [formData, setFormData] = useState({
        id_pasien: "",
        nama: "",
        alamat: "",
        no_telp: "",
        email: "",
    });
    // ⏳ Mengisi data saat modal terbuka
    useEffect(() => {
        if (data) {
            setFormData({
                id_pasien: data.id_pasien,
                nama: data.nama,
                alamat: data.alamat,
                no_telp: data.no_telp,
                email: data.email,
            });
        }
    }, [data]);
    if (!isOpen)
        return null;
    const handleSubmit = () => {
        onSave(formData);
    };
    return (_jsx("div", { className: "fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4", children: _jsxs("div", { className: "bg-white p-6 rounded-lg w-full max-w-md shadow-lg", children: [_jsx("h2", { className: "text-xl font-semibold text-gray-800 mb-4 text-center", children: "Edit Data Pasien" }), _jsxs("div", { className: "mb-3", children: [_jsx("label", { className: "block text-gray-700 font-medium mb-1", children: "Nama Pasien" }), _jsx("input", { className: "w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#4F81C7]", type: "text", placeholder: "Masukkan nama pasien", value: formData.nama, onChange: (e) => setFormData({ ...formData, nama: e.target.value }) })] }), _jsxs("div", { className: "mb-3", children: [_jsx("label", { className: "block text-gray-700 font-medium mb-1", children: "Alamat" }), _jsx("textarea", { className: "w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#4F81C7] resize-none", rows: 2, placeholder: "Masukkan alamat", value: formData.alamat, onChange: (e) => setFormData({ ...formData, alamat: e.target.value }) })] }), _jsxs("div", { className: "mb-3", children: [_jsx("label", { className: "block text-gray-700 font-medium mb-1", children: "Nomor Telepon" }), _jsx("input", { className: "w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#4F81C7]", type: "text", placeholder: "Masukkan nomor telepon", value: formData.no_telp, onChange: (e) => setFormData({ ...formData, no_telp: e.target.value }) })] }), _jsxs("div", { className: "mb-4", children: [_jsx("label", { className: "block text-gray-700 font-medium mb-1", children: "Email (Tidak dapat diubah)" }), _jsx("input", { className: "w-full p-2 border rounded-md bg-gray-100 text-gray-600 cursor-not-allowed", type: "email", value: formData.email, readOnly: true })] }), _jsxs("div", { className: "flex justify-end gap-2", children: [_jsx("button", { onClick: onClose, className: "px-4 py-2 bg-gray-400 text-white rounded-md hover:bg-gray-500 transition", children: "Batal" }), _jsx("button", { onClick: handleSubmit, className: "px-4 py-2 bg-[#4F81C7] text-white rounded-md hover:bg-[#3A6BA8] transition", children: "Simpan Perubahan" })] })] }) }));
};
export default ModalEditPasien;
