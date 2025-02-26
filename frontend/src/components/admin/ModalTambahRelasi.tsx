import React, { useState, useEffect } from "react";
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
        } catch (error) {
          console.error("Error fetching penyakit and gejala data:", error);
        }
      };
      fetchData();
    }
  }, [isOpen]);

  // Update bobot berdasarkan gejala yang dipilih
  useEffect(() => {
    if (formData.id_gejala) {
      const selectedGejala = gejalaData.find(
        (gejala) => gejala.id_gejala === parseInt(formData.id_gejala, 10)
      );
      if (selectedGejala) {
        setFormData((prevState) => ({
          ...prevState,
          bobot: selectedGejala.bobot, // Set bobot berdasarkan gejala yang dipilih
        }));
      }
    }
  }, [formData.id_gejala, gejalaData]);

  if (!isOpen) return null;

  const handleSubmit = () => {
    onSave(formData);
    setFormData({ id_penyakit: "", id_gejala: "", bobot: "" }); // Reset form after submit
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4">
      <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-lg">
        <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center">
          Tambah Relasi Gejala
        </h2>

        {/* Dropdown Penyakit */}
        <div className="mb-3">
          <label className="block text-gray-700 font-medium mb-1">
            Penyakit
          </label>
          <select
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#4F81C7]"
            value={formData.id_penyakit}
            onChange={(e) =>
              setFormData({ ...formData, id_penyakit: e.target.value })
            }
          >
            <option value="">Pilih Penyakit</option>
            {penyakitData.map((penyakit) => (
              <option key={penyakit.id_penyakit} value={penyakit.id_penyakit}>
                {penyakit.kode_penyakit} | {penyakit.nama_penyakit}
              </option>
            ))}
          </select>
        </div>

        {/* Dropdown Gejala */}
        <div className="mb-3">
          <label className="block text-gray-700 font-medium mb-1">Gejala</label>
          <select
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#4F81C7]"
            value={formData.id_gejala}
            onChange={(e) =>
              setFormData({ ...formData, id_gejala: e.target.value })
            }
          >
            <option value="">Pilih Gejala</option>
            {gejalaData.map((gejala) => (
              <option key={gejala.id_gejala} value={gejala.id_gejala}>
                {gejala.kode_gejala} | {gejala.nama_gejala}
              </option>
            ))}
          </select>
        </div>

        {/* Menampilkan bobot */}
        <div className="mb-3">
          <label className="block text-gray-700 font-medium mb-1">Bobot</label>
          <input
            type="text"
            value={formData.bobot || ""} // Jika bobot kosong, tetap kosong
            readOnly
            className="w-full p-2 border rounded-md bg-gray-100 focus:outline-none"
          />
        </div>

        {/* Tombol Aksi */}
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-400 text-white rounded-md hover:bg-gray-500 transition"
          >
            Batal
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-[#4F81C7] text-white rounded-md hover:bg-[#3A6BA8] transition"
          >
            Simpan
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalTambahRelasi;
