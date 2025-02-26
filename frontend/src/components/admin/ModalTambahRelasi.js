import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import axiosInstance from "../../api/axiosInstance";
const ModalTambahRelasi = ({ isOpen, onClose, onSave }) => {
    const [formData, setFormData] = useState({
        id_penyakit: "",
        id_gejala: "",
        bobot: "",
    });
    const [penyakitData, setPenyakitData] = useState([]);
    const [gejalaData, setGejalaData] = useState([]);
    useEffect(() => {
        if (isOpen) {
            // Fetch data penyakit dan gejala ketika modal dibuka
            const fetchData = async () => {
                try {
                    const penyakitResponse = await axiosInstance.get("/penyakit");
                    const gejalaResponse = await axiosInstance.get("/gejala");
                    setPenyakitData(penyakitResponse.data);
                    setGejalaData(gejalaResponse.data);
                }
                catch (error) {
                    console.error("Error fetching penyakit and gejala data:", error);
                }
            };
            fetchData();
        }
    }, [isOpen]);
    // Update bobot berdasarkan gejala yang dipilih
    useEffect(() => {
        if (formData.id_gejala) {
            const selectedGejala = gejalaData.find((gejala) => gejala.id_gejala === parseInt(formData.id_gejala, 10));
            if (selectedGejala) {
                setFormData((prevState) => ({
                    ...prevState,
                    bobot: selectedGejala.bobot, // Set bobot berdasarkan gejala yang dipilih
                }));
            }
        }
    }, [formData.id_gejala, gejalaData]);
    if (!isOpen)
        return null;
    const handleSubmit = () => {
        onSave(formData);
        setFormData({ id_penyakit: "", id_gejala: "", bobot: "" }); // Reset form after submit
    };
    return (_jsx("div", { className: "fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4", children: _jsxs("div", { className: "bg-white p-6 rounded-lg w-full max-w-md shadow-lg", children: [_jsx("h2", { className: "text-xl font-semibold text-gray-800 mb-4 text-center", children: "Tambah Relasi Gejala" }), _jsxs("div", { className: "mb-3", children: [_jsx("label", { className: "block text-gray-700 font-medium mb-1", children: "Penyakit" }), _jsxs("select", { className: "w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#4F81C7]", value: formData.id_penyakit, onChange: (e) => setFormData({ ...formData, id_penyakit: e.target.value }), children: [_jsx("option", { value: "", children: "Pilih Penyakit" }), penyakitData.map((penyakit) => (_jsxs("option", { value: penyakit.id_penyakit, children: [penyakit.kode_penyakit, " | ", penyakit.nama_penyakit] }, penyakit.id_penyakit)))] })] }), _jsxs("div", { className: "mb-3", children: [_jsx("label", { className: "block text-gray-700 font-medium mb-1", children: "Gejala" }), _jsxs("select", { className: "w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#4F81C7]", value: formData.id_gejala, onChange: (e) => setFormData({ ...formData, id_gejala: e.target.value }), children: [_jsx("option", { value: "", children: "Pilih Gejala" }), gejalaData.map((gejala) => (_jsxs("option", { value: gejala.id_gejala, children: [gejala.kode_gejala, " | ", gejala.nama_gejala] }, gejala.id_gejala)))] })] }), _jsxs("div", { className: "mb-3", children: [_jsx("label", { className: "block text-gray-700 font-medium mb-1", children: "Bobot" }), _jsx("input", { type: "text", value: formData.bobot || "", readOnly: true, className: "w-full p-2 border rounded-md bg-gray-100 focus:outline-none" })] }), _jsxs("div", { className: "flex justify-end gap-2", children: [_jsx("button", { onClick: onClose, className: "px-4 py-2 bg-gray-400 text-white rounded-md hover:bg-gray-500 transition", children: "Batal" }), _jsx("button", { onClick: handleSubmit, className: "px-4 py-2 bg-[#4F81C7] text-white rounded-md hover:bg-[#3A6BA8] transition", children: "Simpan" })] })] }) }));
};
export default ModalTambahRelasi;
