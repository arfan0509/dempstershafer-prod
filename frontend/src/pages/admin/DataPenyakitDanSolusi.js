import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import axiosInstance from "../../api/axiosInstance";
import { FiEdit, FiTrash, FiPlus, FiSearch } from "react-icons/fi";
import ModalTambahPenyakit from "../../components/admin/ModalTambahPenyakit";
import ModalEditPenyakit from "../../components/admin/ModalEditPenyakit";
import ModalKonfirmasi from "../../components/ModalKonfirmasi";
const DataPenyakit = () => {
    const [isModalTambahOpen, setIsModalTambahOpen] = useState(false);
    const [isModalEditOpen, setIsModalEditOpen] = useState(false);
    const [penyakitData, setPenyakitData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [selectedPenyakit, setSelectedPenyakit] = useState(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [penyakitToDelete, setPenyakitToDelete] = useState(null);
    // ✅ Search & Filter states
    const [searchInput, setSearchInput] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [kodeFilter, setKodeFilter] = useState("");
    // ✅ Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const [dataPerPage, setDataPerPage] = useState(5);
    const getAuthHeaders = () => {
        const accessToken = localStorage.getItem("accessToken");
        if (!accessToken) {
            console.error("Token tidak ditemukan, silakan login ulang!");
            return null;
        }
        return {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
            },
        };
    };
    const fetchPenyakit = async () => {
        try {
            const headers = getAuthHeaders();
            if (!headers)
                return;
            const response = await axiosInstance.get("/penyakit", headers);
            setPenyakitData(response.data);
            setFilteredData(response.data);
        }
        catch (error) {
            console.error("Error fetching penyakit data:", error.response?.data || error.message);
        }
    };
    useEffect(() => {
        fetchPenyakit();
    }, []);
    // ✅ Search & Filter Handler
    useEffect(() => {
        let filtered = [...penyakitData];
        if (kodeFilter) {
            filtered = filtered.filter((item) => item.kode_penyakit === kodeFilter);
        }
        if (searchQuery) {
            filtered = filtered.filter((item) => item.kode_penyakit
                .toLowerCase()
                .includes(searchQuery.toLowerCase()) ||
                item.nama_penyakit.toLowerCase().includes(searchQuery.toLowerCase()));
        }
        setFilteredData(filtered);
        setCurrentPage(1); // Reset ke halaman pertama saat filter berubah
    }, [searchQuery, kodeFilter, penyakitData]);
    const handleSearch = () => setSearchQuery(searchInput);
    const handleAddData = async (newData) => {
        try {
            const headers = getAuthHeaders();
            if (!headers)
                return;
            await axiosInstance.post("/penyakit/tambah", newData, headers);
            fetchPenyakit();
            setIsModalTambahOpen(false);
        }
        catch (error) {
            console.error("Error adding penyakit:", error.response?.data || error.message);
        }
    };
    const handleDelete = async (id) => {
        try {
            const headers = getAuthHeaders();
            if (!headers)
                return;
            await axiosInstance.delete(`/penyakit/hapus/${id}`, headers);
            fetchPenyakit();
            setIsDeleteModalOpen(false);
        }
        catch (error) {
            console.error("Error deleting penyakit:", error.response?.data || error.message);
        }
    };
    const handleEdit = async (updatedData) => {
        try {
            const headers = getAuthHeaders();
            if (!headers)
                return;
            await axiosInstance.put(`/penyakit/update/${updatedData.id_penyakit}`, updatedData, headers);
            fetchPenyakit();
            setIsModalEditOpen(false);
        }
        catch (error) {
            console.error("Error updating penyakit:", error.response?.data || error.message);
        }
    };
    // ✅ Pagination Logic
    const indexOfLastData = currentPage * dataPerPage;
    const indexOfFirstData = indexOfLastData - dataPerPage;
    const currentData = filteredData.slice(indexOfFirstData, indexOfLastData);
    const totalPages = Math.ceil(filteredData.length / dataPerPage);
    const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);
    return (_jsxs("div", { className: "p-2 pt-4 w-full", children: [_jsx("h1", { className: "text-3xl font-bold text-[#4F81C7] mb-6", children: "Data Penyakit dan Solusi" }), _jsxs("div", { className: "flex flex-col md:flex-row gap-4 mb-4 items-center w-full", children: [_jsxs("div", { className: "flex gap-2 w-full md:w-auto", children: [_jsx("input", { type: "text", placeholder: "Cari Kode/Nama Penyakit...", value: searchInput, onChange: (e) => setSearchInput(e.target.value), className: "border px-4 py-2 rounded-md focus:outline-none w-full" }), _jsx("button", { onClick: handleSearch, className: "bg-[#4F81C7] text-white px-4 py-2 rounded-md hover:bg-[#2E5077] transition", children: _jsx(FiSearch, {}) })] }), _jsxs("select", { value: kodeFilter, onChange: (e) => setKodeFilter(e.target.value), className: "border px-4 py-2 rounded-md focus:outline-none w-full md:w-64", children: [_jsx("option", { value: "", children: "Filter Kode Penyakit" }), penyakitData.map((item) => (_jsx("option", { value: item.kode_penyakit, children: item.kode_penyakit }, item.kode_penyakit)))] }), _jsx("input", { type: "number", min: "1", value: dataPerPage, onChange: (e) => setDataPerPage(Number(e.target.value)), className: "border px-4 py-2 rounded-md w-full md:w-32", placeholder: "Jumlah per halaman" })] }), _jsxs("button", { onClick: () => setIsModalTambahOpen(true), className: "mb-4 bg-[#4F81C7] text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-[#2E5077] transition", children: [_jsx(FiPlus, {}), " Tambah Data"] }), _jsx("div", { className: "relative overflow-x-auto md:overflow-visible shadow-md sm:rounded-lg", children: _jsxs("table", { className: "w-full text-sm text-center text-gray-500 border-collapse", children: [_jsx("thead", { className: "text-xs text-gray-700 uppercase bg-gray-50", children: _jsxs("tr", { children: [_jsx("th", { className: "px-4 py-3 border", children: "No" }), _jsx("th", { className: "px-4 py-3 border", children: "Kode Penyakit" }), _jsx("th", { className: "px-4 py-3 border", children: "Nama Penyakit" }), _jsx("th", { className: "px-4 py-3 border", children: "Deskripsi" }), _jsx("th", { className: "px-4 py-3 border", children: "Solusi" }), _jsx("th", { className: "px-4 py-3 border text-center", children: "Aksi" })] }) }), _jsx("tbody", { children: currentData.map((penyakit, index) => (_jsxs("tr", { className: "bg-white border-b hover:bg-gray-50", children: [_jsx("td", { className: "px-4 py-4 border", children: indexOfFirstData + index + 1 }), _jsx("td", { className: "px-4 py-4 border", children: penyakit.kode_penyakit }), _jsx("td", { className: "px-4 py-4 border", children: penyakit.nama_penyakit }), _jsx("td", { className: "px-4 py-4 border", children: penyakit.deskripsi }), _jsx("td", { className: "px-4 py-4 border", children: penyakit.solusi }), _jsx("td", { className: "px-4 py-4 border", children: _jsxs("div", { className: "flex flex-col items-center gap-2", children: [_jsxs("button", { onClick: () => {
                                                        setSelectedPenyakit(penyakit);
                                                        setIsModalEditOpen(true);
                                                    }, className: "border border-blue-500 text-blue-500 px-3 py-2 rounded-md w-24 flex items-center justify-center gap-1 hover:bg-blue-500 hover:text-white transition", children: [_jsx(FiEdit, {}), " Edit"] }), _jsxs("button", { onClick: () => {
                                                        setPenyakitToDelete(penyakit);
                                                        setIsDeleteModalOpen(true);
                                                    }, className: "border border-red-700 text-red-700 px-3 py-2 rounded-md w-24 flex items-center justify-center gap-1 hover:bg-red-700 hover:text-white transition", children: [_jsx(FiTrash, {}), " Hapus"] })] }) })] }, penyakit.id_penyakit))) })] }) }), _jsxs("div", { className: "flex justify-center mt-4 gap-2", children: [_jsx("button", { onClick: () => handlePageChange(currentPage - 1), disabled: currentPage === 1, className: `px-3 py-1 rounded-md ${currentPage === 1
                            ? "bg-gray-300"
                            : "bg-[#4F81C7] text-white hover:bg-[#2E5077]"}`, children: "\u2B9C" }), _jsxs("span", { className: "px-4 py-1 bg-gray-100 rounded-md", children: ["Halaman ", currentPage, " dari ", totalPages] }), _jsx("button", { onClick: () => handlePageChange(currentPage + 1), disabled: currentPage === totalPages, className: `px-3 py-1 rounded-md ${currentPage === totalPages
                            ? "bg-gray-300"
                            : "bg-[#4F81C7] text-white hover:bg-[#2E5077]"}`, children: "\u2B9E" })] }), _jsx(ModalTambahPenyakit, { isOpen: isModalTambahOpen, onClose: () => setIsModalTambahOpen(false), onSave: handleAddData }), selectedPenyakit && (_jsx(ModalEditPenyakit, { isOpen: isModalEditOpen, onClose: () => setIsModalEditOpen(false), onSave: handleEdit, data: selectedPenyakit })), penyakitToDelete && (_jsx(ModalKonfirmasi, { isOpen: isDeleteModalOpen, message: `Apakah Anda yakin ingin menghapus penyakit ${penyakitToDelete.nama_penyakit}?`, onConfirm: () => handleDelete(penyakitToDelete.id_penyakit), onCancel: () => setIsDeleteModalOpen(false) }))] }));
};
export default DataPenyakit;
