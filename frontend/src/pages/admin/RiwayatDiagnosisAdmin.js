import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import axiosInstance from "../../api/axiosInstance";
import { FiSearch, FiTrash, FiPrinter, FiEdit, FiChevronDown, FiChevronUp, } from "react-icons/fi";
import ModalKonfirmasi from "../../components/ModalKonfirmasi";
import SuccessModal from "../../components/SuccessModal";
import PrintSingleDiagnosis from "../../components/user/PrintSingleDiagnosis";
import ModalEditDiagnosis from "../../components/admin/ModalEditDiagnosis";
const RiwayatDiagnosisAdmin = () => {
    const [diagnosisList, setDiagnosisList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredData, setFilteredData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [dataPerPage] = useState(10);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [diagnosisToDelete, setDiagnosisToDelete] = useState(null);
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [sortOrder, setSortOrder] = useState("baru");
    const [expandedIndex, setExpandedIndex] = useState(null);
    const [selectedPatient, setSelectedPatient] = useState("");
    const [patients, setPatients] = useState([]);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedDiagnosis, setSelectedDiagnosis] = useState(null);
    useEffect(() => {
        fetchDiagnosis();
    }, [sortOrder, selectedPatient]);
    const fetchDiagnosis = async () => {
        try {
            const response = await axiosInstance.get("/diagnosis");
            const sortedData = sortDiagnoses(response.data, sortOrder);
            setDiagnosisList(sortedData);
            setFilteredData(selectedPatient
                ? sortedData.filter((item) => item.pasien.nama === selectedPatient)
                : sortedData);
            setPatients([...new Set(response.data.map((d) => d.pasien.nama))]);
        }
        catch (error) {
            console.error("Error fetching diagnosis data:", error);
        }
        finally {
            setLoading(false);
        }
    };
    const sortDiagnoses = (data, order) => {
        return data.sort((a, b) => order === "baru"
            ? new Date(b.tanggal_diagnosis).getTime() -
                new Date(a.tanggal_diagnosis).getTime()
            : new Date(a.tanggal_diagnosis).getTime() -
                new Date(b.tanggal_diagnosis).getTime());
    };
    const handleSearch = () => {
        const filtered = diagnosisList.filter((item) => item.nama_kucing.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.hasil_diagnosis.penyakit
                .toLowerCase()
                .includes(searchQuery.toLowerCase()) ||
            item.pasien.nama.toLowerCase().includes(searchQuery.toLowerCase()));
        setFilteredData(filtered);
        setCurrentPage(1);
    };
    const handleDelete = async (id) => {
        try {
            await axiosInstance.delete(`/diagnosis/${id}`);
            setSuccessMessage("Diagnosis berhasil dihapus!");
            setIsSuccessModalOpen(true);
            fetchDiagnosis();
        }
        catch (error) {
            console.error("Error deleting diagnosis:", error);
        }
    };
    const handlePrint = (diagnosis) => {
        PrintSingleDiagnosis(diagnosis);
    };
    const indexOfLastData = currentPage * dataPerPage;
    const indexOfFirstData = indexOfLastData - dataPerPage;
    const currentData = filteredData.slice(indexOfFirstData, indexOfLastData);
    const totalPages = Math.ceil(filteredData.length / dataPerPage);
    const toggleDropdown = (index) => {
        setExpandedIndex(expandedIndex === index ? null : index);
    };
    // ✅ Handler untuk membuka modal edit
    const openEditModal = (diagnosis) => {
        setSelectedDiagnosis(diagnosis);
        setIsEditModalOpen(true);
    };
    // ✅ Handler untuk menyimpan hasil edit
    const handleEditSave = async (updatedData) => {
        try {
            await axiosInstance.put(`/diagnosis/${updatedData.id_diagnosis}`, updatedData);
            setSuccessMessage("Diagnosis berhasil diperbarui!");
            setIsSuccessModalOpen(true);
            setIsEditModalOpen(false);
            fetchDiagnosis(); // Refresh data
        }
        catch (error) {
            console.error("Error updating diagnosis:", error);
        }
    };
    return (_jsxs("div", { className: "flex-1 p-2 min-h-screen", children: [_jsx("h1", { className: "text-3xl font-bold text-[#4F81C7] mb-6", children: "Riwayat Diagnosis" }), _jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6", children: [_jsxs("div", { className: "flex gap-2", children: [_jsx("input", { type: "text", placeholder: "Cari nama pasien/kucing/penyakit...", value: searchQuery, onChange: (e) => setSearchQuery(e.target.value), className: "p-2 border rounded-lg w-full focus:ring-[#4F81C7]" }), _jsx("button", { onClick: handleSearch, className: "bg-[#4F81C7] text-white px-4 py-2 rounded-lg hover:bg-[#3e6b99]", children: _jsx(FiSearch, { size: 18 }) })] }), _jsxs("select", { value: selectedPatient, onChange: (e) => setSelectedPatient(e.target.value), className: "p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4F81C7]", children: [_jsx("option", { value: "", children: "Semua Pasien" }), patients.map((name) => (_jsx("option", { value: name, children: name }, name)))] }), _jsxs("select", { value: sortOrder, onChange: (e) => setSortOrder(e.target.value), className: "p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4F81C7]", children: [_jsx("option", { value: "baru", children: "Urutkan: Terbaru" }), _jsx("option", { value: "lama", children: "Urutkan: Terlama" })] })] }), loading ? (_jsx("div", { className: "flex justify-center items-center py-20", children: _jsx("div", { className: "animate-spin border-4 border-[#4F81C7] border-t-transparent rounded-full w-16 h-16" }) })) : (_jsx("div", { className: "grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-6", children: currentData.map((diagnosis, index) => (_jsxs("div", { className: "bg-white p-6 rounded-lg shadow-lg hover:shadow-2xl border border-[#4F81C7] transition duration-300", children: [_jsxs("div", { className: "space-y-2", children: [_jsxs("p", { children: [_jsx("strong", { children: "Nama Pasien:" }), " ", diagnosis.pasien.nama] }), _jsxs("p", { children: [_jsx("strong", { children: "Alamat:" }), " ", diagnosis.pasien.alamat] }), _jsxs("p", { children: [_jsx("strong", { children: "No. Telepon:" }), " ", diagnosis.pasien.no_telp] }), _jsxs("p", { children: [_jsx("strong", { children: "Nama Kucing:" }), " ", diagnosis.nama_kucing] }), _jsxs("p", { children: [_jsx("strong", { children: "Penyakit:" }), " ", diagnosis.hasil_diagnosis.penyakit] }), _jsxs("p", { children: [_jsx("strong", { children: "Gejala Terdeteksi:" }), " ", diagnosis.hasil_diagnosis.gejala_terdeteksi.join(", ")] }), diagnosis.hasil_diagnosis.kemungkinan_penyakit_lain &&
                                    diagnosis.hasil_diagnosis.kemungkinan_penyakit_lain.length >
                                        0 && (_jsxs("div", { className: "mt-4", children: [_jsxs("button", { onClick: () => toggleDropdown(index), className: "w-full flex justify-between items-center text-[#4F81C7] font-semibold bg-gray-100 py-2 px-4 rounded-lg hover:bg-gray-200 transition", children: ["Kemungkinan Penyakit Lain", expandedIndex === index ? (_jsx(FiChevronUp, { size: 20 })) : (_jsx(FiChevronDown, { size: 20 }))] }), expandedIndex === index && (_jsx("div", { className: "mt-2 space-y-2", children: diagnosis.hasil_diagnosis.kemungkinan_penyakit_lain.map((penyakit, idx) => (_jsxs("div", { className: "bg-gray-100 p-3 rounded-lg border border-[#4F81C7]", children: [_jsxs("p", { children: [_jsx("strong", { children: "Penyakit:" }), " ", penyakit.penyakit] }), _jsxs("p", { children: [_jsx("strong", { children: "Gejala Terdeteksi:" }), " ", penyakit.gejala_terdeteksi.join(", ")] }), _jsxs("p", { children: [_jsx("strong", { children: "Solusi:" }), " ", penyakit.solusi] })] }, idx))) }))] })), _jsxs("p", { children: [_jsx("strong", { children: "Tanggal:" }), " ", new Date(diagnosis.tanggal_diagnosis).toLocaleString("id-ID")] })] }), _jsxs("div", { className: "flex justify-center md:justify-end mt-4 gap-2", children: [_jsxs("button", { onClick: () => handlePrint(diagnosis), className: "border border-blue-500 text-blue-500 px-3 py-2 rounded-md w-24 flex items-center justify-center gap-1 hover:bg-[#4F81C7] hover:text-white transition", children: [_jsx(FiPrinter, {}), " Cetak"] }), _jsxs("button", { onClick: () => openEditModal(diagnosis), className: "bg-[#4F81C7] text-white px-3 py-2 rounded-lg hover:bg-[#3e6b99] flex items-center gap-1", children: [_jsx(FiEdit, {}), " Edit"] }), _jsxs("button", { onClick: () => {
                                        setDiagnosisToDelete(diagnosis);
                                        setIsDeleteModalOpen(true);
                                    }, className: "bg-red-700 text-white px-3 py-2 rounded-lg hover:bg-red-800 flex items-center gap-1", children: [_jsx(FiTrash, {}), " Hapus"] })] })] }, diagnosis.id_diagnosis))) })), _jsxs("div", { className: "flex justify-center mt-6 gap-2", children: [_jsx("button", { onClick: () => setCurrentPage((prev) => Math.max(prev - 1, 1)), disabled: currentPage === 1, className: "px-3 py-1 bg-[#4F81C7] text-white rounded-lg disabled:bg-gray-300", children: "\u2B9C" }), _jsxs("span", { className: "text-gray-700 py-1 px-3 bg-gray-100 rounded-lg", children: ["Halaman ", currentPage, " dari ", totalPages] }), _jsx("button", { onClick: () => setCurrentPage((prev) => Math.min(prev + 1, totalPages)), disabled: currentPage === totalPages, className: "px-3 py-1 bg-[#4F81C7] text-white rounded-lg disabled:bg-gray-300", children: "\u2B9E" })] }), _jsx(ModalEditDiagnosis, { isOpen: isEditModalOpen, onClose: () => setIsEditModalOpen(false), onSave: handleEditSave, data: selectedDiagnosis }), ";", diagnosisToDelete && (_jsx(ModalKonfirmasi, { isOpen: isDeleteModalOpen, message: `Apakah Anda yakin ingin menghapus diagnosis kucing bernama ${diagnosisToDelete.nama_kucing}?`, onConfirm: () => handleDelete(diagnosisToDelete.id_diagnosis), onCancel: () => setIsDeleteModalOpen(false) })), _jsx(SuccessModal, { isOpen: isSuccessModalOpen, message: successMessage, onClose: () => setIsSuccessModalOpen(false) })] }));
};
export default RiwayatDiagnosisAdmin;
