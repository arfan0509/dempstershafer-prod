/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import axiosInstance from "../../api/axiosInstance";
import { useNavigate } from "react-router-dom";
import NavbarComponent from "../../components/user/NavbarComponent";
import {
  FiArrowLeft,
  FiChevronDown,
  FiChevronUp,
  FiPrinter,
} from "react-icons/fi";
import { FaStethoscope, FaHeartbeat } from "react-icons/fa";
import PrintSingleDiagnosis from "../../components/user/PrintSingleDiagnosis";

const RiwayatDiagnosisPage: React.FC = () => {
  const [diagnosisList, setDiagnosisList] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [sortOrder, setSortOrder] = useState<string>("baru");
  const [currentPage, setCurrentPage] = useState<number>(1);

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
      } catch (error) {
        console.error("Error fetching diagnosis data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDiagnosis();
  }, [sortOrder]);

  const sortDiagnoses = (data: any[], order: string) => {
    return data.sort((a, b) =>
      order === "baru"
        ? new Date(b.tanggal_diagnosis).getTime() -
          new Date(a.tanggal_diagnosis).getTime()
        : new Date(a.tanggal_diagnosis).getTime() -
          new Date(b.tanggal_diagnosis).getTime()
    );
  };

  const toggleDropdown = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  const handlePrint = (diagnosis: any) => {
    PrintSingleDiagnosis(diagnosis);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = diagnosisList.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(diagnosisList.length / itemsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  return (
    <>
      <NavbarComponent />
      <div className="container mx-auto pt-20 px-4 sm:px-6 lg:px-8">
        {/* 🔙 Tombol Kembali dan Filter */}
        <div className="mb-6 flex justify-between items-center">
          <button
            onClick={() => navigate("/sistem-pakar")}
            className="flex items-center text-[#4F81C7] hover:text-[#3e6b99] font-semibold text-lg"
          >
            <FiArrowLeft className="mr-2" size={20} />
            Kembali
          </button>
          <div className="flex items-center gap-2">
            <label className="text-gray-700 font-medium">Urutkan:</label>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-[#4F81C7]"
            >
              <option value="baru">Terbaru</option>
              <option value="lama">Terlama</option>
            </select>
          </div>
        </div>

        {/* 📝 Judul Halaman */}
        <div className="mb-6 text-center">
          <h2 className="text-3xl font-bold text-gray-800">
            Riwayat Diagnosis
          </h2>
          <p className="text-lg text-gray-600">
            Lihat riwayat diagnosis kucing Anda disini.
          </p>
        </div>

        {/* 🔄 Loading */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin border-4 border-[#4F81C7] border-t-transparent rounded-full w-16 h-16"></div>
          </div>
        ) : currentItems.length === 0 ? (
          <div className="text-center py-20">
            <img
              src="/assets/no-diagnosis-cats.svg"
              alt="Belum ada diagnosis"
              className="mx-auto w-72 mb-6"
            />
            <p className="text-xl text-gray-700">
              Anda belum memiliki riwayat diagnosis.
            </p>
            <button
              onClick={() => navigate("/sistem-pakar")}
              className="mt-4 text-white bg-[#4F81C7] hover:bg-[#3e6b99] py-2 px-6 rounded-lg"
            >
              Mulai Diagnosis
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-1 gap-6">
              {currentItems.map((diagnosis, index) => (
                <div
                  key={diagnosis.id_diagnosis}
                  className="bg-white shadow-lg rounded-lg p-6 hover:shadow-2xl transition duration-300 flex flex-col justify-between"
                >
                  {/* 🐾 Identitas Kucing */}
                  <div className="mb-4 space-y-2">
                    <p className="text-gray-600">
                      <strong>Nama Kucing:</strong> {diagnosis.nama_kucing}
                    </p>
                    <p className="text-gray-600">
                      <strong>Jenis Kelamin:</strong> {diagnosis.jenis_kelamin}
                    </p>
                    <p className="text-gray-600">
                      <strong>Usia:</strong> {diagnosis.usia}
                    </p>
                    <p className="text-gray-600">
                      <strong>Warna Bulu:</strong> {diagnosis.warna_bulu}
                    </p>
                  </div>

                  {/* 💉 Diagnosis Utama */}
                  <div className="bg-[#4F81C7] text-white py-5 px-6 rounded-lg shadow-lg mb-6 flex justify-between items-center">
                    <div>
                      <h3 className="text-3xl font-bold flex items-center">
                        <FaStethoscope className="mr-3" />
                        {diagnosis.hasil_diagnosis.penyakit}
                      </h3>
                      <p className="text-sm opacity-80">
                        Hasil diagnosis utama
                      </p>
                    </div>
                    <button
                      onClick={() => handlePrint(diagnosis)}
                      className="bg-white text-[#4F81C7] rounded-full p-3 shadow hover:bg-gray-200 transition"
                      title="Cetak Diagnosis"
                    >
                      <FiPrinter size={24} />
                    </button>
                  </div>

                  {/* 📝 Gejala Dipilih */}
                  <div className="mb-6">
                    <h4 className="text-xl font-semibold text-gray-700 mb-2">
                      Gejala yang Dipilih
                    </h4>
                    <div className="flex flex-wrap gap-3 mt-2">
                      {diagnosis.hasil_diagnosis.gejala_terdeteksi.map(
                        (gejala: string, idx: number) => (
                          <span
                            key={idx}
                            className="bg-[#4F81C7] text-white text-sm py-1 px-4 rounded-full shadow-sm"
                          >
                            {gejala}
                          </span>
                        )
                      )}
                    </div>
                  </div>

                  {/* 💡 Solusi */}
                  <div className="bg-[#E3F2FD] text-[#4F81C7] p-6 rounded-lg shadow-md">
                    <h4 className="text-xl font-semibold mb-2">
                      Solusi yang Disarankan:
                    </h4>
                    <p className="leading-relaxed">
                      {diagnosis.hasil_diagnosis.solusi}
                    </p>
                  </div>

                  {/* 🌟 Kemungkinan Penyakit Lain */}
                  {diagnosis.hasil_diagnosis.kemungkinan_penyakit_lain &&
                    diagnosis.hasil_diagnosis.kemungkinan_penyakit_lain.length >
                      0 && (
                      <div className="mt-6">
                        <button
                          onClick={() => toggleDropdown(index)}
                          className="w-full flex justify-between items-center text-[#4F81C7] font-semibold text-lg bg-gray-100 py-2 px-4 rounded-lg hover:bg-gray-200 transition"
                        >
                          Kemungkinan Penyakit Lain
                          {expandedIndex === index ? (
                            <FiChevronUp size={20} />
                          ) : (
                            <FiChevronDown size={20} />
                          )}
                        </button>

                        {expandedIndex === index && (
                          <div className="mt-4 space-y-4">
                            {diagnosis.hasil_diagnosis.kemungkinan_penyakit_lain.map(
                              (penyakit: any, idx: number) => (
                                <div
                                  key={idx}
                                  className="bg-gray-100 p-4 rounded-lg shadow-sm"
                                >
                                  <h5 className="text-lg font-semibold text-[#4F81C7] flex items-center">
                                    <FaHeartbeat className="mr-2" />
                                    {penyakit.penyakit}
                                  </h5>
                                  <p className="text-gray-600 mt-2">
                                    <strong>Gejala Terdeteksi:</strong>{" "}
                                    {penyakit.gejalaCocok &&
                                    Array.isArray(penyakit.gejalaCocok)
                                      ? penyakit.gejalaCocok.join(", ")
                                      : "Tidak tersedia"}
                                  </p>
                                  <p className="text-gray-600">
                                    <strong>Solusi:</strong> {penyakit.solusi}
                                  </p>
                                </div>
                              )
                            )}
                          </div>
                        )}
                      </div>
                    )}

                  {/* 🕒 Tanggal & Waktu */}
                  <div className="mt-6 text-sm text-gray-500 flex items-center justify-start space-x-2">
                    <p>
                      {new Date(diagnosis.tanggal_diagnosis).toLocaleDateString(
                        "id-ID",
                        {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        }
                      )}
                    </p>
                    <span>|</span>
                    <p>
                      {new Date(diagnosis.tanggal_diagnosis).toLocaleTimeString(
                        "id-ID",
                        {
                          hour: "2-digit",
                          minute: "2-digit",
                        }
                      )}{" "}
                      WIB
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* 🔢 Pagination */}
            <div className="flex justify-center items-center mt-8 pb-5 space-x-4">
              <button
                disabled={currentPage === 1}
                onClick={handlePrevPage}
                className={`px-4 py-2 rounded-lg ${
                  currentPage === 1
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-[#4F81C7] text-white hover:bg-[#3e6b99]"
                }`}
              >
                ⮜
              </button>
              <p className="text-gray-700">
                Halaman {currentPage} dari {totalPages}
              </p>
              <button
                disabled={currentPage === totalPages}
                onClick={handleNextPage}
                className={`px-4 py-2 rounded-lg ${
                  currentPage === totalPages
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-[#4F81C7] text-white hover:bg-[#3e6b99]"
                }`}
              >
                ⮞
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default RiwayatDiagnosisPage;
