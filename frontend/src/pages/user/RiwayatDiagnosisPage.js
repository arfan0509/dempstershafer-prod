import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import axiosInstance from "../../api/axiosInstance";
import { useNavigate } from "react-router-dom";
import NavbarComponent from "../../components/user/NavbarComponent";
import { FiArrowLeft, FiChevronDown, FiChevronUp, FiPrinter, } from "react-icons/fi";
import { FaStethoscope, FaHeartbeat } from "react-icons/fa";
import PrintSingleDiagnosis from "../../components/user/PrintSingleDiagnosis";
const RiwayatDiagnosisPage = () => {
    const [diagnosisList, setDiagnosisList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedIndex, setExpandedIndex] = useState(null);
    const [sortOrder, setSortOrder] = useState("baru");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const navigate = useNavigate();
    useEffect(() => {
        const fetchDiagnosis = async () => {
            try {
                const id_pasien = localStorage.getItem("id_pasien");
                if (id_pasien) {
                    const response = await axiosInstance.get(`/diagnosis/${id_pasien}`);
                    const sortedData = sortDiagnoses(response.data, sortOrder);
                    setDiagnosisList(sortedData);
                }
            }
            catch (error) {
                console.error("Error fetching diagnosis data:", error);
            }
            finally {
                setLoading(false);
            }
        };
        fetchDiagnosis();
    }, [sortOrder]);
    const sortDiagnoses = (data, order) => {
        return data.sort((a, b) => order === "baru"
            ? new Date(b.tanggal_diagnosis).getTime() -
                new Date(a.tanggal_diagnosis).getTime()
            : new Date(a.tanggal_diagnosis).getTime() -
                new Date(b.tanggal_diagnosis).getTime());
    };
    const toggleDropdown = (index) => {
        setExpandedIndex(expandedIndex === index ? null : index);
    };
    const handlePrint = (diagnosis) => {
        PrintSingleDiagnosis(diagnosis);
    };
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = diagnosisList.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(diagnosisList.length / itemsPerPage);
    const handleNextPage = () => {
        if (currentPage < totalPages)
            setCurrentPage(currentPage + 1);
    };
    const handlePrevPage = () => {
        if (currentPage > 1)
            setCurrentPage(currentPage - 1);
    };
    return (_jsxs(_Fragment, { children: [_jsx(NavbarComponent, {}), _jsxs("div", { className: "container mx-auto pt-20 px-4 sm:px-6 lg:px-8", children: [_jsxs("div", { className: "mb-6 flex justify-between items-center", children: [_jsxs("button", { onClick: () => navigate("/sistem-pakar"), className: "flex items-center text-[#4F81C7] hover:text-[#3e6b99] font-semibold text-lg", children: [_jsx(FiArrowLeft, { className: "mr-2", size: 20 }), "Kembali"] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("label", { className: "text-gray-700 font-medium", children: "Urutkan:" }), _jsxs("select", { value: sortOrder, onChange: (e) => setSortOrder(e.target.value), className: "border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-[#4F81C7]", children: [_jsx("option", { value: "baru", children: "Terbaru" }), _jsx("option", { value: "lama", children: "Terlama" })] })] })] }), _jsxs("div", { className: "mb-6 text-center", children: [_jsx("h2", { className: "text-3xl font-bold text-gray-800", children: "Riwayat Diagnosis" }), _jsx("p", { className: "text-lg text-gray-600", children: "Lihat riwayat diagnosis kucing Anda disini." })] }), loading ? (_jsx("div", { className: "flex justify-center items-center py-20", children: _jsx("div", { className: "animate-spin border-4 border-[#4F81C7] border-t-transparent rounded-full w-16 h-16" }) })) : currentItems.length === 0 ? (_jsxs("div", { className: "text-center py-20", children: [_jsx("img", { src: "/assets/no-diagnosis-cats.svg", alt: "Belum ada diagnosis", className: "mx-auto w-72 mb-6" }), _jsx("p", { className: "text-xl text-gray-700", children: "Anda belum memiliki riwayat diagnosis." }), _jsx("button", { onClick: () => navigate("/sistem-pakar"), className: "mt-4 text-white bg-[#4F81C7] hover:bg-[#3e6b99] py-2 px-6 rounded-lg", children: "Mulai Diagnosis" })] })) : (_jsxs(_Fragment, { children: [_jsx("div", { className: "grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-1 gap-6", children: currentItems.map((diagnosis, index) => (_jsxs("div", { className: "bg-white shadow-lg rounded-lg p-6 hover:shadow-2xl transition duration-300 flex flex-col justify-between", children: [_jsxs("div", { className: "mb-4 space-y-2", children: [_jsxs("p", { className: "text-gray-600", children: [_jsx("strong", { children: "Nama Kucing:" }), " ", diagnosis.nama_kucing] }), _jsxs("p", { className: "text-gray-600", children: [_jsx("strong", { children: "Jenis Kelamin:" }), " ", diagnosis.jenis_kelamin] }), _jsxs("p", { className: "text-gray-600", children: [_jsx("strong", { children: "Usia:" }), " ", diagnosis.usia] }), _jsxs("p", { className: "text-gray-600", children: [_jsx("strong", { children: "Warna Bulu:" }), " ", diagnosis.warna_bulu] })] }), _jsxs("div", { className: "bg-[#4F81C7] text-white py-5 px-6 rounded-lg shadow-lg mb-6 flex justify-between items-center", children: [_jsxs("div", { children: [_jsxs("h3", { className: "text-3xl font-bold flex items-center", children: [_jsx(FaStethoscope, { className: "mr-3" }), diagnosis.hasil_diagnosis.penyakit] }), _jsx("p", { className: "text-sm opacity-80", children: "Hasil diagnosis utama" })] }), _jsx("button", { onClick: () => handlePrint(diagnosis), className: "bg-white text-[#4F81C7] rounded-full p-3 shadow hover:bg-gray-200 transition", title: "Cetak Diagnosis", children: _jsx(FiPrinter, { size: 24 }) })] }), _jsxs("div", { className: "mb-6", children: [_jsx("h4", { className: "text-xl font-semibold text-gray-700 mb-2", children: "Gejala yang Dipilih" }), _jsx("div", { className: "flex flex-wrap gap-3 mt-2", children: diagnosis.hasil_diagnosis.gejala_terdeteksi.map((gejala, idx) => (_jsx("span", { className: "bg-[#4F81C7] text-white text-sm py-1 px-4 rounded-full shadow-sm", children: gejala }, idx))) })] }), _jsxs("div", { className: "bg-[#E3F2FD] text-[#4F81C7] p-6 rounded-lg shadow-md", children: [_jsx("h4", { className: "text-xl font-semibold mb-2", children: "Solusi yang Disarankan:" }), _jsx("p", { className: "leading-relaxed", children: diagnosis.hasil_diagnosis.solusi })] }), diagnosis.hasil_diagnosis.kemungkinan_penyakit_lain &&
                                            diagnosis.hasil_diagnosis.kemungkinan_penyakit_lain.length >
                                                0 && (_jsxs("div", { className: "mt-6", children: [_jsxs("button", { onClick: () => toggleDropdown(index), className: "w-full flex justify-between items-center text-[#4F81C7] font-semibold text-lg bg-gray-100 py-2 px-4 rounded-lg hover:bg-gray-200 transition", children: ["Kemungkinan Penyakit Lain", expandedIndex === index ? (_jsx(FiChevronUp, { size: 20 })) : (_jsx(FiChevronDown, { size: 20 }))] }), expandedIndex === index && (_jsx("div", { className: "mt-4 space-y-4", children: diagnosis.hasil_diagnosis.kemungkinan_penyakit_lain.map((penyakit, idx) => (_jsxs("div", { className: "bg-gray-100 p-4 rounded-lg shadow-sm", children: [_jsxs("h5", { className: "text-lg font-semibold text-[#4F81C7] flex items-center", children: [_jsx(FaHeartbeat, { className: "mr-2" }), penyakit.penyakit] }), _jsxs("p", { className: "text-gray-600 mt-2", children: [_jsx("strong", { children: "Gejala Terdeteksi:" }), " ", penyakit.gejala_terdeteksi.join(", ")] }), _jsxs("p", { className: "text-gray-600", children: [_jsx("strong", { children: "Solusi:" }), " ", penyakit.solusi] })] }, idx))) }))] })), _jsxs("div", { className: "mt-6 text-sm text-gray-500 flex items-center justify-start space-x-2", children: [_jsx("p", { children: new Date(diagnosis.tanggal_diagnosis).toLocaleDateString("id-ID", {
                                                        weekday: "long",
                                                        year: "numeric",
                                                        month: "long",
                                                        day: "numeric",
                                                    }) }), _jsx("span", { children: "|" }), _jsxs("p", { children: [new Date(diagnosis.tanggal_diagnosis).toLocaleTimeString("id-ID", {
                                                            hour: "2-digit",
                                                            minute: "2-digit",
                                                        }), " ", "WIB"] })] })] }, diagnosis.id_diagnosis))) }), _jsxs("div", { className: "flex justify-center items-center mt-8 pb-5 space-x-4", children: [_jsx("button", { disabled: currentPage === 1, onClick: handlePrevPage, className: `px-4 py-2 rounded-lg ${currentPage === 1
                                            ? "bg-gray-300 cursor-not-allowed"
                                            : "bg-[#4F81C7] text-white hover:bg-[#3e6b99]"}`, children: "\u2B9C" }), _jsxs("p", { className: "text-gray-700", children: ["Halaman ", currentPage, " dari ", totalPages] }), _jsx("button", { disabled: currentPage === totalPages, onClick: handleNextPage, className: `px-4 py-2 rounded-lg ${currentPage === totalPages
                                            ? "bg-gray-300 cursor-not-allowed"
                                            : "bg-[#4F81C7] text-white hover:bg-[#3e6b99]"}`, children: "\u2B9E" })] })] }))] })] }));
};
export default RiwayatDiagnosisPage;
