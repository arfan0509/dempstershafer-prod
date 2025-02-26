import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
const ModalTambahPenyakit = ({ isOpen, onClose, onSave }) => {
    const [formData, setFormData] = useState({
        kode_penyakit: "",
        nama_penyakit: "",
        deskripsi: "",
        solusi: "",
    });
    if (!isOpen)
        return null;
    const handleSubmit = () => {
        onSave(formData);
        setFormData({
            kode_penyakit: "",
            nama_penyakit: "",
            deskripsi: "",
            solusi: "",
        });
    };
    return (_jsx("div", { className: "fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4", children: _jsxs("div", { className: "bg-white p-6 rounded-lg w-full max-w-md shadow-lg", children: [_jsx("h2", { className: "text-xl font-semibold text-gray-800 mb-4 text-center", children: "Tambah Penyakit" }), _jsxs("div", { className: "mb-3", children: [_jsx("label", { className: "block text-gray-700 font-medium mb-1", children: "Kode Penyakit" }), _jsx("input", { className: "w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#4F81C7]", type: "text", value: formData.kode_penyakit, onChange: (e) => setFormData({ ...formData, kode_penyakit: e.target.value }) })] }), _jsxs("div", { className: "mb-3", children: [_jsx("label", { className: "block text-gray-700 font-medium mb-1", children: "Nama Penyakit" }), _jsx("input", { className: "w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#4F81C7]", type: "text", value: formData.nama_penyakit, onChange: (e) => setFormData({ ...formData, nama_penyakit: e.target.value }) })] }), _jsxs("div", { className: "mb-3", children: [_jsx("label", { className: "block text-gray-700 font-medium mb-1", children: "Deskripsi Penyakit" }), _jsx("textarea", { className: "w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#4F81C7] resize-none", rows: 3, value: formData.deskripsi, onChange: (e) => setFormData({ ...formData, deskripsi: e.target.value }) })] }), _jsxs("div", { className: "mb-4", children: [_jsx("label", { className: "block text-gray-700 font-medium mb-1", children: "Solusi Penyakit" }), _jsx("textarea", { className: "w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#4F81C7] resize-none", rows: 3, value: formData.solusi, onChange: (e) => setFormData({ ...formData, solusi: e.target.value }) })] }), _jsxs("div", { className: "flex justify-end gap-2", children: [_jsx("button", { onClick: onClose, className: "px-4 py-2 bg-gray-400 text-white rounded-md hover:bg-gray-500 transition", children: "Batal" }), _jsx("button", { onClick: handleSubmit, className: "px-4 py-2 bg-[#4F81C7] text-white rounded-md hover:bg-[#3A6BA8] transition", children: "Simpan" })] })] }) }));
};
export default ModalTambahPenyakit;
