import React, { useState, useEffect } from "react";
import axiosInstance from "../../api/axiosInstance";
import { FiEdit, FiTrash, FiPlus, FiSearch } from "react-icons/fi";
import ModalTambahGejala from "../../components/admin/ModalTambahGejala";
import ModalEditGejala from "../../components/admin/ModalEditGejala";
import ModalKonfirmasi from "../../components/ModalKonfirmasi";

const DataGejala = () => {
  const [isModalTambahOpen, setIsModalTambahOpen] = useState(false);
  const [isModalEditOpen, setIsModalEditOpen] = useState(false);
  const [gejalaData, setGejalaData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedGejala, setSelectedGejala] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [gejalaToDelete, setGejalaToDelete] = useState(null);

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

  const fetchGejala = async () => {
    try {
      const headers = getAuthHeaders();
      if (!headers) return;
      const response = await axiosInstance.get("/gejala", headers);
      setGejalaData(response.data);
      setFilteredData(response.data);
    } catch (error) {
      console.error("Error fetching gejala data:", error.response?.data || error.message);
    }
  };

  useEffect(() => {
    fetchGejala();
  }, []);

  // ✅ Search & Filter Handler
  useEffect(() => {
    let filtered = [...gejalaData];

    if (kodeFilter) {
      filtered = filtered.filter((item) => item.kode_gejala === kodeFilter);
    }

    if (searchQuery) {
      filtered = filtered.filter(
        (item) =>
          item.kode_gejala.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.nama_gejala.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredData(filtered);
    setCurrentPage(1); // Reset ke halaman pertama saat filter berubah
  }, [searchQuery, kodeFilter, gejalaData]);

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
      if (!headers) return;
      await axiosInstance.post("/gejala/tambah", newData, headers);
      fetchGejala();
      setIsModalTambahOpen(false);
    } catch (error) {
      console.error("Error adding gejala:", error.response?.data || error.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      const headers = getAuthHeaders();
      if (!headers) return;
      await axiosInstance.delete(`/gejala/hapus/${id}`, headers);
      fetchGejala();
      setIsDeleteModalOpen(false);
    } catch (error) {
      console.error("Error deleting gejala:", error.response?.data || error.message);
    }
  };

  const handleEdit = async (updatedData) => {
    try {
      const headers = getAuthHeaders();
      if (!headers) return;
      await axiosInstance.put(`/gejala/update/${updatedData.id_gejala}`, updatedData, headers);
      fetchGejala();
      setIsModalEditOpen(false);
    } catch (error) {
      console.error("Error updating gejala:", error.response?.data || error.message);
    }
  };

  return (
    <div className="p-2 pt-4 w-full">
      <h1 className="text-3xl font-bold text-[#4F81C7] mb-6">
        Data Gejala dan Bobot
      </h1>

      {/* 🔍 Search, Filter & Data Per Halaman */}
      <div className="flex flex-col md:flex-row gap-4 mb-4 items-center w-full">
        <div className="flex gap-2 w-full md:w-auto">
          <input
            type="text"
            placeholder="Cari Kode/Nama Gejala..."
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
          <option value="">Filter Kode Gejala</option>
          {gejalaData.map((item) => (
            <option key={item.kode_gejala} value={item.kode_gejala}>
              {item.kode_gejala}
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

      {/* 📋 Tabel Data Gejala */}
      <div className="relative overflow-x-auto md:overflow-visible shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-center text-gray-500 border-collapse">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th className="px-4 py-3 border">No</th>
              <th className="px-4 py-3 border">Kode Gejala</th>
              <th className="px-4 py-3 border">Nama Gejala</th>
              <th className="px-4 py-3 border">Bobot</th>
              <th className="px-4 py-3 border text-center">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {currentData.map((gejala, index) => (
              <tr key={gejala.id_gejala} className="bg-white border-b hover:bg-gray-50">
                <td className="px-4 py-4 border">{indexOfFirstData + index + 1}</td>
                <td className="px-4 py-4 border">{gejala.kode_gejala}</td>
                <td className="px-4 py-4 border">{gejala.nama_gejala}</td>
                <td className="px-4 py-4 border">
                  {new Intl.NumberFormat("en-US", {
                    minimumFractionDigits: 1,
                    maximumFractionDigits: 2,
                  }).format(gejala.bobot)}
                </td>
                <td className="px-4 py-4 border flex flex-col items-center gap-2">
                  <button
                    onClick={() => {
                      setSelectedGejala(gejala);
                      setIsModalEditOpen(true);
                    }}
                    className="border border-blue-500 text-blue-500 px-3 py-2 rounded-md w-24 h-7 flex items-center justify-center gap-1 hover:bg-blue-500 hover:text-white transition"
                  >
                    <FiEdit /> Edit
                  </button>
                  <button
                    onClick={() => {
                      setGejalaToDelete(gejala);
                      setIsDeleteModalOpen(true);
                    }}
                    className="border border-red-700 text-red-700 px-3 py-2 rounded-md w-24 h-7 flex items-center justify-center gap-1 hover:bg-red-700 hover:text-white transition"
                  >
                    <FiTrash /> Hapus
                  </button>
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
            currentPage === 1 ? "bg-gray-300" : "bg-[#4F81C7] text-white hover:bg-[#2E5077]"
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
            currentPage === totalPages ? "bg-gray-300" : "bg-[#4F81C7] text-white hover:bg-[#2E5077]"
          }`}
        >
          ⮞
        </button>
      </div>

      {/* 📝 Modal Tambah Data */}
      <ModalTambahGejala
        isOpen={isModalTambahOpen}
        onClose={() => setIsModalTambahOpen(false)}
        onSave={handleAddData}
      />

      {/* 📝 Modal Edit Data */}
      {selectedGejala && (
        <ModalEditGejala
          isOpen={isModalEditOpen}
          onClose={() => setIsModalEditOpen(false)}
          onSave={handleEdit}
          data={selectedGejala}
        />
      )}

      {/* 🗑️ Modal Konfirmasi Hapus */}
      {gejalaToDelete && (
        <ModalKonfirmasi
          isOpen={isDeleteModalOpen}
          message={`Apakah Anda yakin ingin menghapus gejala ${gejalaToDelete.nama_gejala}?`}
          onConfirm={() => handleDelete(gejalaToDelete.id_gejala)}
          onCancel={() => setIsDeleteModalOpen(false)}
        />
      )}
    </div>
  );
};

export default DataGejala;
