import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
const ModalEditPenyakit = ({ isOpen, onClose, onSave, data }) => {
    const [formData, setFormData] = useState({
        id_penyakit: "",
        kode_penyakit: "",
        nama_penyakit: "",
        deskripsi: "",
        solusi: "",
    });
    // Mengisi data saat modal terbuka
    useEffect(() => {
        if (data) {
            setFormData({
                id_penyakit: data.id_penyakit,
                kode_penyakit: data.kode_penyakit,
                nama_penyakit: data.nama_penyakit,
                deskripsi: data.deskripsi,
                solusi: data.solusi,
            });
        }
    }, [data]);
    if (!isOpen)
        return null;
    const handleSubmit = () => {
        onSave(formData);
    };
    return (_jsx("div", { className: "fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4", children: _jsxs("div", { className: "bg-white p-6 rounded-lg w-full max-w-md shadow-lg", children: [_jsx("h2", { className: "text-xl font-semibold text-gray-800 mb-4 text-center", children: "Edit Penyakit" }), _jsxs("div", { className: "mb-3", children: [_jsx("label", { className: "block text-gray-700 font-medium mb-1", children: "Kode Penyakit" }), _jsx("input", { className: "w-full p-2 border rounded-md bg-gray-100 text-gray-600 cursor-not-allowed", type: "text", value: formData.kode_penyakit, readOnly: true })] }), _jsxs("div", { className: "mb-3", children: [_jsx("label", { className: "block text-gray-700 font-medium mb-1", children: "Nama Penyakit" }), _jsx("input", { className: "w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#4F81C7]", type: "text", placeholder: "Masukkan nama penyakit", value: formData.nama_penyakit, onChange: (e) => setFormData({ ...formData, nama_penyakit: e.target.value }) })] }), _jsxs("div", { className: "mb-3", children: [_jsx("label", { className: "block text-gray-700 font-medium mb-1", children: "Deskripsi Penyakit" }), _jsx("textarea", { className: "w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#4F81C7] resize-none", rows: 3, placeholder: "Masukkan deskripsi penyakit", value: formData.deskripsi, onChange: (e) => setFormData({ ...formData, deskripsi: e.target.value }) })] }), _jsxs("div", { className: "mb-4", children: [_jsx("label", { className: "block text-gray-700 font-medium mb-1", children: "Solusi Penyakit" }), _jsx("textarea", { className: "w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#4F81C7] resize-none", rows: 3, placeholder: "Masukkan solusi penyakit", value: formData.solusi, onChange: (e) => setFormData({ ...formData, solusi: e.target.value }) })] }), _jsxs("div", { className: "flex justify-end gap-2", children: [_jsx("button", { onClick: onClose, className: "px-4 py-2 bg-gray-400 text-white rounded-md hover:bg-gray-500 transition", children: "Batal" }), _jsx("button", { onClick: handleSubmit, className: "px-4 py-2 bg-[#4F81C7] text-white rounded-md hover:bg-[#3A6BA8] transition", children: "Simpan" })] })] }) }));
};
export default ModalEditPenyakit;
