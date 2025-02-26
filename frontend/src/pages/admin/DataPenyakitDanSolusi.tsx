import React, { useState, useEffect } from "react";
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
      if (!headers) return;
      const response = await axiosInstance.get("/penyakit", headers);
      setPenyakitData(response.data);
      setFilteredData(response.data);
    } catch (error) {
      console.error(
        "Error fetching penyakit data:",
        error.response?.data || error.message
      );
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
      filtered = filtered.filter(
        (item) =>
          item.kode_penyakit
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          item.nama_penyakit.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredData(filtered);
    setCurrentPage(1); // Reset ke halaman pertama saat filter berubah
  }, [searchQuery, kodeFilter, penyakitData]);

  const handleSearch = () => setSearchQuery(searchInput);

  const handleAddData = async (newData) => {
    try {
      const headers = getAuthHeaders();
      if (!headers) return;
      await axiosInstance.post("/penyakit/tambah", newData, headers);
      fetchPenyakit();
      setIsModalTambahOpen(false);
    } catch (error) {
      console.error(
        "Error adding penyakit:",
        error.response?.data || error.message
      );
    }
  };

  const handleDelete = async (id) => {
    try {
      const headers = getAuthHeaders();
      if (!headers) return;
      await axiosInstance.delete(`/penyakit/hapus/${id}`, headers);
      fetchPenyakit();
      setIsDeleteModalOpen(false);
    } catch (error) {
      console.error(
        "Error deleting penyakit:",
        error.response?.data || error.message
      );
    }
  };

  const handleEdit = async (updatedData) => {
    try {
      const headers = getAuthHeaders();
      if (!headers) return;
      await axiosInstance.put(
        `/penyakit/update/${updatedData.id_penyakit}`,
        updatedData,
        headers
      );
      fetchPenyakit();
      setIsModalEditOpen(false);
    } catch (error) {
      console.error(
        "Error updating penyakit:",
        error.response?.data || error.message
      );
    }
  };

  // ✅ Pagination Logic
  const indexOfLastData = currentPage * dataPerPage;
  const indexOfFirstData = indexOfLastData - dataPerPage;
  const currentData = filteredData.slice(indexOfFirstData, indexOfLastData);
  const totalPages = Math.ceil(filteredData.length / dataPerPage);

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="p-2 pt-4 w-full">
      <h1 className="text-3xl font-bold text-[#4F81C7] mb-6">
        Data Penyakit dan Solusi
      </h1>

      {/* 🔍 Search, Filter & Data Per Halaman */}
      <div className="flex flex-col md:flex-row gap-4 mb-4 items-center w-full">
        <div className="flex gap-2 w-full md:w-auto">
          <input
            type="text"
            placeholder="Cari Kode/Nama Penyakit..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="border px-4 py-2 rounded-md focus:outline-none w-full"
          />
          <button
            onClick={handleSearch}
            className="bg-[#4F81C7] text-white px-4 py-2 rounded-md hover:bg-[#2E5077] transition"
          >
            <FiSearch />
          </button>
        </div>

        <select
          value={kodeFilter}
          onChange={(e) => setKodeFilter(e.target.value)}
          className="border px-4 py-2 rounded-md focus:outline-none w-full md:w-64"
        >
          <option value="">Filter Kode Penyakit</option>
          {penyakitData.map((item) => (
            <option key={item.kode_penyakit} value={item.kode_penyakit}>
              {item.kode_penyakit}
            </option>
          ))}
        </select>

        <input
          type="number"
          min="1"
          value={dataPerPage}
          onChange={(e) => setDataPerPage(Number(e.target.value))}
          className="border px-4 py-2 rounded-md w-full md:w-32"
          placeholder="Jumlah per halaman"
        />
      </div>

      {/* ➕ Tombol Tambah Data */}
      <button
        onClick={() => setIsModalTambahOpen(true)}
        className="mb-4 bg-[#4F81C7] text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-[#2E5077] transition"
      >
        <FiPlus /> Tambah Data
      </button>

      {/* 📋 Tabel Data Penyakit */}
      <div className="relative overflow-x-auto md:overflow-visible shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-center text-gray-500 border-collapse">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th className="px-4 py-3 border">No</th>
              <th className="px-4 py-3 border">Kode Penyakit</th>
              <th className="px-4 py-3 border">Nama Penyakit</th>
              <th className="px-4 py-3 border">Deskripsi</th>
              <th className="px-4 py-3 border">Solusi</th>
              <th className="px-4 py-3 border text-center">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {currentData.map((penyakit, index) => (
              <tr
                key={penyakit.id_penyakit}
                className="bg-white border-b hover:bg-gray-50"
              >
                <td className="px-4 py-4 border">
                  {indexOfFirstData + index + 1}
                </td>
                <td className="px-4 py-4 border">{penyakit.kode_penyakit}</td>
                <td className="px-4 py-4 border">{penyakit.nama_penyakit}</td>
                <td className="px-4 py-4 border">{penyakit.deskripsi}</td>
                <td className="px-4 py-4 border">{penyakit.solusi}</td>
                <td className="px-4 py-4 border">
                  <div className="flex flex-col items-center gap-2">
                    <button
                      onClick={() => {
                        setSelectedPenyakit(penyakit);
                        setIsModalEditOpen(true);
                      }}
                      className="border border-blue-500 text-blue-500 px-3 py-2 rounded-md w-24 flex items-center justify-center gap-1 hover:bg-blue-500 hover:text-white transition"
                    >
                      <FiEdit /> Edit
                    </button>
                    <button
                      onClick={() => {
                        setPenyakitToDelete(penyakit);
                        setIsDeleteModalOpen(true);
                      }}
                      className="border border-red-700 text-red-700 px-3 py-2 rounded-md w-24 flex items-center justify-center gap-1 hover:bg-red-700 hover:text-white transition"
                    >
                      <FiTrash /> Hapus
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 🔄 Pagination */}
      <div className="flex justify-center mt-4 gap-2">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`px-3 py-1 rounded-md ${
            currentPage === 1
              ? "bg-gray-300"
              : "bg-[#4F81C7] text-white hover:bg-[#2E5077]"
          }`}
        >
          ⮜
        </button>
        <span className="px-4 py-1 bg-gray-100 rounded-md">
          Halaman {currentPage} dari {totalPages}
        </span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`px-3 py-1 rounded-md ${
            currentPage === totalPages
              ? "bg-gray-300"
              : "bg-[#4F81C7] text-white hover:bg-[#2E5077]"
          }`}
        >
          ⮞
        </button>
      </div>

      {/* 📝 Modal Tambah Data */}
      <ModalTambahPenyakit
        isOpen={isModalTambahOpen}
        onClose={() => setIsModalTambahOpen(false)}
        onSave={handleAddData}
      />

      {/* 📝 Modal Edit Data */}
      {selectedPenyakit && (
        <ModalEditPenyakit
          isOpen={isModalEditOpen}
          onClose={() => setIsModalEditOpen(false)}
          onSave={handleEdit}
          data={selectedPenyakit}
        />
      )}

      {/* 🗑️ Modal Konfirmasi Hapus */}
      {penyakitToDelete && (
        <ModalKonfirmasi
          isOpen={isDeleteModalOpen}
          message={`Apakah Anda yakin ingin menghapus penyakit ${penyakitToDelete.nama_penyakit}?`}
          onConfirm={() => handleDelete(penyakitToDelete.id_penyakit)}
          onCancel={() => setIsDeleteModalOpen(false)}
        />
      )}
    </div>
  );
};

export default DataPenyakit;
