import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import axiosInstance from "../../api/axiosInstance";
import { FiTrash, FiPlus, FiSearch } from "react-icons/fi";
import ModalTambahRelasi from "../../components/admin/ModalTambahRelasi";
import ModalKonfirmasi from "../../components/ModalKonfirmasi";
const DataRelasiGejala = () => {
    const [isModalTambahOpen, setIsModalTambahOpen] = useState(false);
    const [relasiData, setRelasiData] = useState([]);
    const [penyakitData, setPenyakitData] = useState([]);
    const [gejalaData, setGejalaData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [selectedRelasi, setSelectedRelasi] = useState(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [relasiToDelete, setRelasiToDelete] = useState(null);
    // ✅ Search & Filter states
    const [searchInput, setSearchInput] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [kodePenyakitFilter, setKodePenyakitFilter] = useState("");
    // ✅ Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const [dataPerPage, setDataPerPage] = useState(5);
    const getAuthHeaders = () => {
        const accessToken = localStorage.getItem("accessToken");
        if (!accessToken) {
            console.error("accessToken tidak ditemukan, silakan login ulang!");
            return null;
        }
        return {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
            },
        };
    };
    // ✅ Ambil Data Relasi, Penyakit, dan Gejala
    const fetchData = async () => {
        try {
            const [relasiRes, penyakitRes, gejalaRes] = await Promise.all([
                axiosInstance.get("/relasi"),
                axiosInstance.get("/penyakit"),
                axiosInstance.get("/gejala"),
            ]);
            setRelasiData(relasiRes.data);
            setPenyakitData(penyakitRes.data);
            setGejalaData(gejalaRes.data);
            setFilteredData(relasiRes.data);
        }
        catch (error) {
            console.error("Error fetching data:", error);
        }
    };
    useEffect(() => {
        fetchData();
    }, []);
    // ✅ Search & Filter Handler
    useEffect(() => {
        let filtered = [...relasiData];
        if (kodePenyakitFilter) {
            filtered = filtered.filter((item) => getPenyakitName(item.id_penyakit)
                .toLowerCase()
                .includes(kodePenyakitFilter.toLowerCase()));
        }
        if (searchQuery) {
            filtered = filtered.filter((item) => getPenyakitName(item.id_penyakit)
                .toLowerCase()
                .includes(searchQuery.toLowerCase()) ||
                getGejalaName(item.id_gejala)
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase()));
        }
        setFilteredData(filtered);
        setCurrentPage(1);
    }, [searchQuery, kodePenyakitFilter, relasiData]);
    const handleSearch = () => setSearchQuery(searchInput);
    // ✅ Pagination Logic
    const indexOfLastData = currentPage * dataPerPage;
    const indexOfFirstData = indexOfLastData - dataPerPage;
    const currentData = filteredData.slice(indexOfFirstData, indexOfLastData);
    const totalPages = Math.ceil(filteredData.length / dataPerPage);
    const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);
    // ✅ CRUD Handlers
    const handleAddData = async (newData) => {
        try {
            const headers = getAuthHeaders();
            if (!headers)
                return;
            await axiosInstance.post("/relasi/tambah", newData, headers);
            fetchData();
            setIsModalTambahOpen(false);
        }
        catch (error) {
            console.error("Error adding relasi:", error.response?.data || error.message);
        }
    };
    const handleDelete = async (id) => {
        try {
            const headers = getAuthHeaders();
            if (!headers)
                return;
            await axiosInstance.delete(`/relasi/hapus/${id}`, headers);
            fetchData();
            setIsDeleteModalOpen(false);
        }
        catch (error) {
            console.error("Error deleting relasi:", error.response?.data || error.message);
        }
    };
    // ✅ Helper Functions
    const getPenyakitName = (id_penyakit) => {
        const penyakit = penyakitData.find((p) => p.id_penyakit === id_penyakit);
        return penyakit
            ? `${penyakit.kode_penyakit} | ${penyakit.nama_penyakit}`
            : "-";
    };
    const getGejalaName = (id_gejala) => {
        const gejala = gejalaData.find((g) => g.id_gejala === id_gejala);
        return gejala ? `${gejala.kode_gejala} | ${gejala.nama_gejala}` : "-";
    };
    return (_jsxs("div", { className: "p-2 pt-4 w-full", children: [_jsx("h1", { className: "text-3xl font-bold text-[#4F81C7] mb-6", children: "Data Relasi Gejala (Rule Dempster Shafer)" }), _jsxs("div", { className: "flex flex-col md:flex-row gap-4 mb-4 items-center w-full", children: [_jsxs("div", { className: "flex gap-2 w-full md:w-auto", children: [_jsx("input", { type: "text", placeholder: "Cari Kode Penyakit/Gejala...", value: searchInput, onChange: (e) => setSearchInput(e.target.value), className: "border px-4 py-2 rounded-md focus:outline-none w-full" }), _jsx("button", { onClick: handleSearch, className: "bg-[#4F81C7] text-white px-4 py-2 rounded-md hover:bg-[#2E5077] transition", children: _jsx(FiSearch, {}) })] }), _jsxs("select", { value: kodePenyakitFilter, onChange: (e) => setKodePenyakitFilter(e.target.value), className: "border px-4 py-2 rounded-md focus:outline-none w-full md:w-64", children: [_jsx("option", { value: "", children: "Filter Kode Penyakit" }), penyakitData.map((item) => (_jsx("option", { value: item.kode_penyakit, children: item.kode_penyakit }, item.id_penyakit)))] }), _jsx("input", { type: "number", min: "1", value: dataPerPage, onChange: (e) => setDataPerPage(Number(e.target.value)), className: "border px-4 py-2 rounded-md w-full md:w-32", placeholder: "Jumlah per halaman" })] }), _jsxs("button", { onClick: () => setIsModalTambahOpen(true), className: "mb-4 bg-[#4F81C7] text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-[#2E5077] transition", children: [_jsx(FiPlus, {}), " Tambah Data"] }), _jsx("div", { className: "relative overflow-x-auto md:overflow-visible shadow-md sm:rounded-lg", children: _jsxs("table", { className: "w-full text-sm text-center text-gray-500 border-collapse", children: [_jsx("thead", { className: "text-xs text-gray-700 uppercase bg-gray-50", children: _jsxs("tr", { children: [_jsx("th", { className: "px-4 py-3 border", children: "No" }), _jsx("th", { className: "px-4 py-3 border", children: "Kode Penyakit" }), _jsx("th", { className: "px-4 py-3 border", children: "Kode Gejala" }), _jsx("th", { className: "px-4 py-3 border", children: "Bobot" }), _jsx("th", { className: "px-4 py-3 border text-center", children: "Aksi" })] }) }), _jsx("tbody", { children: currentData.map((relasi, index) => (_jsxs("tr", { className: "bg-white border-b hover:bg-gray-50", children: [_jsx("td", { className: "px-4 py-4 border", children: indexOfFirstData + index + 1 }), _jsx("td", { className: "px-4 py-4 border", children: getPenyakitName(relasi.id_penyakit) }), _jsx("td", { className: "px-4 py-4 border", children: getGejalaName(relasi.id_gejala) }), _jsx("td", { className: "px-4 py-4 border", children: relasi.bobot }), _jsx("td", { className: "px-4 py-4 border flex flex-col items-center gap-2", children: _jsxs("button", { onClick: () => {
                                                setRelasiToDelete(relasi);
                                                setIsDeleteModalOpen(true);
                                            }, className: "border border-red-700 text-red-700 px-3 py-2 rounded-md w-24 flex items-center justify-center gap-1 hover:bg-red-700 hover:text-white transition", children: [_jsx(FiTrash, {}), " Hapus"] }) })] }, relasi.id_relasi))) })] }) }), _jsxs("div", { className: "flex justify-center mt-4 gap-2", children: [_jsx("button", { onClick: () => handlePageChange(currentPage - 1), disabled: currentPage === 1, className: `px-3 py-1 rounded-md ${currentPage === 1
                            ? "bg-gray-300"
                            : "bg-[#4F81C7] text-white hover:bg-[#2E5077]"}`, children: "\u2B9C" }), _jsxs("span", { className: "px-4 py-1 bg-gray-100 rounded-md", children: ["Halaman ", currentPage, " dari ", totalPages] }), _jsx("button", { onClick: () => handlePageChange(currentPage + 1), disabled: currentPage === totalPages, className: `px-3 py-1 rounded-md ${currentPage === totalPages
                            ? "bg-gray-300"
                            : "bg-[#4F81C7] text-white hover:bg-[#2E5077]"}`, children: "\u2B9E" })] }), _jsx(ModalTambahRelasi, { isOpen: isModalTambahOpen, onClose: () => setIsModalTambahOpen(false), onSave: handleAddData }), relasiToDelete && (_jsx(ModalKonfirmasi, { isOpen: isDeleteModalOpen, message: `Apakah Anda yakin ingin menghapus relasi ini?`, onConfirm: () => handleDelete(relasiToDelete.id_relasi), onCancel: () => setIsDeleteModalOpen(false) }))] }));
};
export default DataRelasiGejala;
