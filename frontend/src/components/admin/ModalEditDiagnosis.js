import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { FiX, FiPlus, FiTrash2 } from "react-icons/fi";
const ModalEditDiagnosis = ({ isOpen, onClose, onSave, data, }) => {
    const [formData, setFormData] = useState({
        nama_kucing: "",
        jenis_kelamin: "",
        usia: "",
        warna_bulu: "",
        penyakit: "",
        solusi: "",
        gejala_terdeteksi: "",
        kemungkinan_penyakit_lain: [],
    });
    useEffect(() => {
        if (data) {
            const { hasil_diagnosis } = data;
            setFormData({
                nama_kucing: data.nama_kucing,
                jenis_kelamin: data.jenis_kelamin,
                usia: data.usia,
                warna_bulu: data.warna_bulu,
                penyakit: hasil_diagnosis?.penyakit || "",
                solusi: hasil_diagnosis?.solusi || "",
                gejala_terdeteksi: hasil_diagnosis?.gejala_terdeteksi?.join(", ") || "",
                kemungkinan_penyakit_lain: hasil_diagnosis?.kemungkinan_penyakit_lain || [],
            });
        }
    }, [data]);
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };
    const handleKemungkinanChange = (index, field, value) => {
        const updated = [...formData.kemungkinan_penyakit_lain];
        updated[index][field] = value;
        setFormData({ ...formData, kemungkinan_penyakit_lain: updated });
    };
    const addKemungkinanPenyakit = () => {
        setFormData({
            ...formData,
            kemungkinan_penyakit_lain: [
                ...formData.kemungkinan_penyakit_lain,
                { penyakit: "", solusi: "", gejala_terdeteksi: "" },
            ],
        });
    };
    const removeKemungkinanPenyakit = (index) => {
        const updated = formData.kemungkinan_penyakit_lain.filter((_, i) => i !== index);
        setFormData({ ...formData, kemungkinan_penyakit_lain: updated });
    };
    const handleSubmit = () => {
        const updatedData = {
            nama_kucing: formData.nama_kucing,
            jenis_kelamin: formData.jenis_kelamin,
            usia: formData.usia,
            warna_bulu: formData.warna_bulu,
            hasil_diagnosis: {
                penyakit: formData.penyakit,
                solusi: formData.solusi,
                gejala_terdeteksi: formData.gejala_terdeteksi
                    .split(",")
                    .map((g) => g.trim()),
                kemungkinan_penyakit_lain: formData.kemungkinan_penyakit_lain.map((item) => ({
                    penyakit: item.penyakit,
                    solusi: item.solusi,
                    gejala_terdeteksi: item.gejala_terdeteksi
                        .split(",")
                        .map((g) => g.trim()),
                })),
            },
            id_diagnosis: data.id_diagnosis,
        };
        onSave(updatedData);
    };
    if (!isOpen)
        return null;
    return (_jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 overflow-auto", children: _jsxs("div", { className: "bg-white w-full max-w-3xl max-h-screen overflow-y-auto rounded-lg shadow-lg p-6 my-6", children: [_jsxs("div", { className: "flex justify-between items-center mb-4", children: [_jsx("h2", { className: "text-2xl font-semibold text-[#4F81C7]", children: "Edit Diagnosis" }), _jsx("button", { onClick: onClose, className: "text-gray-500 hover:text-gray-700", children: _jsx(FiX, { size: 24 }) })] }), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-gray-700 font-medium mb-1", children: "Nama Kucing" }), _jsx("input", { type: "text", name: "nama_kucing", value: formData.nama_kucing, onChange: handleChange, className: "w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4F81C7]" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-gray-700 font-medium mb-1", children: "Jenis Kelamin" }), _jsxs("select", { name: "jenis_kelamin", value: formData.jenis_kelamin, onChange: handleChange, className: "w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4F81C7]", children: [_jsx("option", { value: "", children: "Pilih Jenis Kelamin" }), _jsx("option", { value: "Jantan", children: "Jantan" }), _jsx("option", { value: "Betina", children: "Betina" })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-gray-700 font-medium mb-1", children: "Usia" }), _jsx("input", { type: "text", name: "usia", value: formData.usia, onChange: handleChange, className: "w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4F81C7]" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-gray-700 font-medium mb-1", children: "Warna Bulu" }), _jsx("input", { type: "text", name: "warna_bulu", value: formData.warna_bulu, onChange: handleChange, className: "w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4F81C7]" })] })] }), _jsx("h3", { className: "text-xl font-semibold text-[#4F81C7] mt-6", children: "Hasil Diagnosis" }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-gray-700 font-medium mb-1", children: "Penyakit" }), _jsx("input", { type: "text", name: "penyakit", value: formData.penyakit, onChange: handleChange, className: "w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4F81C7]" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-gray-700 font-medium mb-1", children: "Solusi" }), _jsx("textarea", { rows: 1, name: "solusi", value: formData.solusi, onChange: handleChange, className: "w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4F81C7]" })] }), _jsxs("div", { className: "md:col-span-2", children: [_jsx("label", { className: "block text-gray-700 font-medium mb-1", children: "Gejala Terdeteksi (pisahkan dengan koma)" }), _jsx("textarea", { name: "gejala_terdeteksi", value: formData.gejala_terdeteksi, onChange: handleChange, rows: 2, className: "w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4F81C7]" })] })] }), _jsxs("h3", { className: "text-xl font-semibold text-[#4F81C7] mt-6 flex justify-between items-center", children: ["Kemungkinan Penyakit Lain", _jsxs("button", { onClick: addKemungkinanPenyakit, className: "bg-[#4F81C7] hover:bg-[#3e6b99] text-white px-3 py-1 rounded-lg flex items-center gap-1", children: [_jsx(FiPlus, {}), " Tambah Penyakit"] })] }), formData.kemungkinan_penyakit_lain.map((item, index) => (_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-100 p-4 rounded-lg relative", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-gray-700 font-medium mb-1", children: "Penyakit" }), _jsx("input", { type: "text", value: item.penyakit, onChange: (e) => handleKemungkinanChange(index, "penyakit", e.target.value), className: "w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4F81C7]" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-gray-700 font-medium mb-1", children: "Solusi" }), _jsx("textarea", { rows: 1, value: item.solusi, onChange: (e) => handleKemungkinanChange(index, "solusi", e.target.value), className: "w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4F81C7]" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-gray-700 font-medium mb-1", children: "Gejala Terdeteksi (pisahkan dengan koma)" }), _jsx("textarea", { value: item.gejala_terdeteksi, onChange: (e) => handleKemungkinanChange(index, "gejala_terdeteksi", e.target.value), rows: 2, className: "w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4F81C7]" })] }), _jsx("button", { onClick: () => removeKemungkinanPenyakit(index), className: "absolute top-2 right-2 text-red-500 hover:text-red-700", children: _jsx(FiTrash2, { size: 20 }) })] }, index)))] }), _jsxs("div", { className: "flex justify-end gap-3 mt-6", children: [_jsx("button", { onClick: onClose, className: "bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-lg", children: "Batal" }), _jsx("button", { onClick: handleSubmit, className: "bg-[#4F81C7] hover:bg-[#3e6b99] text-white px-4 py-2 rounded-lg", children: "Simpan Perubahan" })] })] }) }));
};
export default ModalEditDiagnosis;
