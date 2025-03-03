/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import axiosInstance from "../../api/axiosInstance";
import {
  FiSearch,
  FiTrash,
  FiPrinter,
  FiEdit,
  FiChevronDown,
  FiChevronUp,
  FiUser,
  FiMapPin,
  FiPhone,
  FiHeart,
  FiCalendar,
  FiTag,
  FiFeather,
  FiAlertCircle,
  FiThermometer,
  FiClock,
} from "react-icons/fi";
import ModalKonfirmasi from "../../components/ModalKonfirmasi";
import SuccessModal from "../../components/SuccessModal";
import PrintSingleDiagnosis from "../../components/user/PrintSingleDiagnosis";
import ModalEditDiagnosis from "../../components/admin/ModalEditDiagnosis";

const RiwayatDiagnosisAdmin: React.FC = () => {
  const [diagnosisList, setDiagnosisList] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [dataPerPage] = useState<number>(10);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [diagnosisToDelete, setDiagnosisToDelete] = useState<any>(null);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [sortOrder, setSortOrder] = useState<string>("baru");
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [selectedPatient, setSelectedPatient] = useState<string>("");
  const [patients, setPatients] = useState<any[]>([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedDiagnosis, setSelectedDiagnosis] = useState<any>(null);

  useEffect(() => {
    fetchDiagnosis();
  }, [sortOrder, selectedPatient]);

  const fetchDiagnosis = async () => {
    try {
      const response = await axiosInstance.get("/diagnosis");
      const sortedData = sortDiagnoses(response.data, sortOrder);
      setDiagnosisList(sortedData);
      setFilteredData(
        selectedPatient
          ? sortedData.filter((item) => item.pasien.nama === selectedPatient)
          : sortedData
      );
      setPatients([...new Set(response.data.map((d) => d.pasien.nama))]);
    } catch (error) {
      console.error("Error fetching diagnosis data:", error);
    } finally {
      setLoading(false);
    }
  };

  const sortDiagnoses = (data: any[], order: string) => {
    return data.sort((a, b) =>
      order === "baru"
        ? new Date(b.tanggal_diagnosis).getTime() -
          new Date(a.tanggal_diagnosis).getTime()
        : new Date(a.tanggal_diagnosis).getTime() -
          new Date(b.tanggal_diagnosis).getTime()
    );
  };

  const handleSearch = () => {
    const filtered = diagnosisList.filter(
      (item) =>
        item.nama_kucing.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.hasil_diagnosis.penyakit
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        item.pasien.nama.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredData(filtered);
    setCurrentPage(1);
  };

  const handleDelete = async (id: string) => {
    try {
      await axiosInstance.delete(`/diagnosis/${id}`);
      setIsDeleteModalOpen(false);
      setSuccessMessage("Diagnosis berhasil dihapus!");
      setIsSuccessModalOpen(true);
      fetchDiagnosis(); // Refresh data
    } catch (error) {
      console.error("Error deleting diagnosis:", error);
    }
  };

  const handlePrint = (diagnosis: any) => {
    PrintSingleDiagnosis(diagnosis);
  };

  const indexOfLastData = currentPage * dataPerPage;
  const indexOfFirstData = indexOfLastData - dataPerPage;
  const currentData = filteredData.slice(indexOfFirstData, indexOfLastData);
  const totalPages = Math.ceil(filteredData.length / dataPerPage);

  const toggleDropdown = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  // ✅ Handler untuk membuka modal edit
  const openEditModal = (diagnosis: any) => {
    setSelectedDiagnosis(diagnosis);
    setIsEditModalOpen(true);
  };

  // ✅ Handler untuk menyimpan hasil edit
  const handleEditSave = async (updatedData: any) => {
    try {
      await axiosInstance.put(
        `/diagnosis/${updatedData.id_diagnosis}`,
        updatedData
      );
      setSuccessMessage("Diagnosis berhasil diperbarui!");
      setIsSuccessModalOpen(true);
      setIsEditModalOpen(false);
      fetchDiagnosis(); // Refresh data
    } catch (error) {
      console.error("Error updating diagnosis:", error);
    }
  };

  return (
    <div className="flex-1 p-2 min-h-screen">
      <h1 className="text-3xl font-bold text-[#4F81C7] mb-6">
        Riwayat Diagnosis
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Cari nama pasien/kucing/penyakit..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="p-2 border rounded-lg w-full focus:ring-[#4F81C7]"
          />
          <button
            onClick={handleSearch}
            className="bg-[#4F81C7] text-white px-4 py-2 rounded-lg hover:bg-[#3e6b99]"
          >
            <FiSearch size={18} />
          </button>
        </div>

        <select
          value={selectedPatient}
          onChange={(e) => setSelectedPatient(e.target.value)}
          className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4F81C7]"
        >
          <option value="">Semua Pasien</option>
          {patients.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>

        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4F81C7]"
        >
          <option value="baru">Urutkan: Terbaru</option>
          <option value="lama">Urutkan: Terlama</option>
        </select>
      </div>
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin border-4 border-[#4F81C7] border-t-transparent rounded-full w-16 h-16"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {currentData.map((diagnosis, index) => (
            <div
              key={diagnosis.id_diagnosis}
              className="bg-[#F8FAFC] p-6 rounded-lg shadow-md hover:shadow-xl border-l-4 border-[#4F81C7] transition duration-300"
            >
              <div className="space-y-3">
                <p className="flex items-center gap-2">
                  <FiUser className="text-[#4F81C7]" />
                  <strong>Nama Pasien:</strong> {diagnosis.pasien.nama}
                </p>
                <p className="flex items-center gap-2">
                  <FiMapPin className="text-[#4F81C7]" />
                  <strong>Alamat:</strong> {diagnosis.pasien.alamat}
                </p>
                <p className="flex items-center gap-2">
                  <FiPhone className="text-[#4F81C7]" />
                  <strong>No. Telepon:</strong> {diagnosis.pasien.no_telp}
                </p>
                <p className="flex items-center gap-2">
                  <FiHeart className="text-[#4F81C7]" />
                  <strong>Nama Kucing:</strong> {diagnosis.nama_kucing}
                </p>

                <div className="border-t border-gray-300 my-2"></div>

                <p className="flex items-center gap-2">
                  <FiCalendar className="text-[#4F81C7]" />
                  <strong>Usia:</strong> {diagnosis.usia}
                </p>
                <p className="flex items-center gap-2">
                  <FiTag className="text-[#4F81C7]" />
                  <strong>Jenis Kelamin:</strong> {diagnosis.jenis_kelamin}
                </p>
                <p className="flex items-center gap-2">
                  <FiFeather className="text-[#4F81C7]" />
                  <strong>Warna Bulu:</strong> {diagnosis.warna_bulu}
                </p>

                <div className="border-t border-gray-300 my-2"></div>

                <p className="flex items-center gap-2">
                  <FiAlertCircle className="text-[#4F81C7]" />
                  <strong>Penyakit:</strong>{" "}
                  {diagnosis.hasil_diagnosis.penyakit}
                </p>
                <p className="flex items-center gap-2">
                  <FiThermometer className="text-[#4F81C7]" />
                  <strong>Gejala Terdeteksi:</strong>{" "}
                  {diagnosis.hasil_diagnosis.gejala_terdeteksi.join(", ")}
                </p>

                {diagnosis.hasil_diagnosis.kemungkinan_penyakit_lain &&
                  diagnosis.hasil_diagnosis.kemungkinan_penyakit_lain.length >
                    0 && (
                    <div className="mt-4">
                      <button
                        onClick={() => toggleDropdown(index)}
                        className="w-full flex justify-between items-center text-[#4F81C7] font-semibold bg-gray-200 py-2 px-4 rounded-lg hover:bg-gray-300 transition"
                      >
                        Kemungkinan Penyakit Lain
                        {expandedIndex === index ? (
                          <FiChevronUp size={20} />
                        ) : (
                          <FiChevronDown size={20} />
                        )}
                      </button>

                      {expandedIndex === index && (
                        <div className="mt-2 space-y-2">
                          {diagnosis.hasil_diagnosis.kemungkinan_penyakit_lain.map(
                            (penyakit: any, idx: number) => (
                              <div
                                key={idx}
                                className="bg-white p-3 rounded-lg border border-[#4F81C7] shadow-md"
                              >
                                <p>
                                  <strong>Penyakit:</strong> {penyakit.penyakit}
                                </p>
                                <p>
                                  <strong>Gejala Terdeteksi:</strong>{" "}
                                  {penyakit.gejalaCocok &&
                                  Array.isArray(penyakit.gejalaCocok)
                                    ? penyakit.gejalaCocok.join(", ")
                                    : "Tidak tersedia"}
                                </p>
                                <p>
                                  <strong>Solusi:</strong> {penyakit.solusi}
                                </p>
                              </div>
                            )
                          )}
                        </div>
                      )}
                    </div>
                  )}

                <p className="flex items-center gap-2 text-sm text-gray-500">
                  <FiClock className="text-[#4F81C7]" />
                  {new Date(diagnosis.tanggal_diagnosis).toLocaleString(
                    "id-ID"
                  )}
                </p>
              </div>

              <div className="flex justify-center md:justify-end mt-4 gap-2">
                <button
                  onClick={() => handlePrint(diagnosis)}
                  className="border border-blue-500 text-blue-500 px-3 py-2 rounded-md w-24 flex items-center justify-center gap-1 hover:bg-[#4F81C7] hover:text-white transition"
                >
                  <FiPrinter /> Cetak
                </button>
                <button
                  onClick={() => openEditModal(diagnosis)}
                  className="bg-[#4F81C7] text-white px-3 py-2 rounded-lg hover:bg-[#3e6b99] flex items-center gap-1"
                >
                  <FiEdit /> Edit
                </button>
                <button
                  onClick={() => {
                    setDiagnosisToDelete(diagnosis);
                    setIsDeleteModalOpen(true);
                  }}
                  className="bg-red-800 text-white px-3 py-2 rounded-lg hover:bg-red-900 flex items-center gap-1"
                >
                  <FiTrash /> Hapus
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      <div className="flex justify-center mt-6 gap-2">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="px-3 py-1 bg-[#4F81C7] text-white rounded-lg disabled:bg-gray-300"
        >
          ⮜
        </button>
        <span className="text-gray-700 py-1 px-3 bg-gray-100 rounded-lg">
          Halaman {currentPage} dari {totalPages}
        </span>
        <button
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
          className="px-3 py-1 bg-[#4F81C7] text-white rounded-lg disabled:bg-gray-300"
        >
          ⮞
        </button>
      </div>
      <ModalEditDiagnosis
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleEditSave}
        data={selectedDiagnosis}
      />
      ;
      {diagnosisToDelete && (
        <ModalKonfirmasi
          isOpen={isDeleteModalOpen}
          message={`Apakah Anda yakin ingin menghapus diagnosis kucing bernama ${diagnosisToDelete.nama_kucing}?`}
          onConfirm={() => handleDelete(diagnosisToDelete.id_diagnosis)}
          onCancel={() => setIsDeleteModalOpen(false)}
        />
      )}
      <SuccessModal
        isOpen={isSuccessModalOpen}
        message={successMessage}
        onClose={() => setIsSuccessModalOpen(false)}
      />
    </div>
  );
};

export default RiwayatDiagnosisAdmin;
