import React, { useState, useEffect } from "react";
import axios from "axios";

const ModalEditRelasi = ({ isOpen, onClose, onSave, data }) => {
  const [formData, setFormData] = useState({
    id_relasi: "",
    id_penyakit: "",
    id_gejala: "",
    bobot: "",
  });
  const [penyakitData, setPenyakitData] = useState([]);
  const [gejalaData, setGejalaData] = useState([]);

  useEffect(() => {
    if (isOpen && data) {
      setFormData({
        id_relasi: data.id_relasi,
        id_penyakit: data.id_penyakit,
        id_gejala: data.id_gejala,
        bobot: data.bobot,
      });

      // Ambil data penyakit dan gejala
      const fetchData = async () => {
        try {
          const penyakitResponse = await axios.get(
            "http://localhost:5000/api/penyakit"
          );
          const gejalaResponse = await axios.get(
            "http://localhost:5000/api/gejala"
          );
          setPenyakitData(penyakitResponse.data);
          setGejalaData(gejalaResponse.data);
        } catch (error) {
          console.error("Error fetching penyakit and gejala data:", error);
        }
      };
      fetchData();
    }
  }, [isOpen, data]);

  if (!isOpen) return null;

  const handleSubmit = () => {
    onSave(formData);
    setFormData({ id_relasi: "", id_penyakit: "", id_gejala: "", bobot: "" });
  };

  const handleBobotChange = (e) => {
    let value = e.target.value;

    // Pastikan nilai bobot tidak lebih dari 1 atau kurang dari 0
    if (parseFloat(value) > 1) {
      value = "1"; // Batas maksimal 1
    } else if (parseFloat(value) < 0) {
      value = "0"; // Batas minimal 0
    }

    if (value.length <= 4 && parseFloat(value) >= 0 && parseFloat(value) <= 1) {
      setFormData({ ...formData, bobot: value });
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4">
      <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-lg">
        <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center">
          Edit Relasi Gejala
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

        {/* Bobot */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-1">Bobot</label>
          <input
            className="w-full p-2 border rounded-md bg-gray-100 focus:outline-none"
            type="number"
            placeholder="Masukkan bobot (0-1)"
            value={formData.bobot}
            onChange={handleBobotChange}
            min="0"
            max="1"
            step="0.01"
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

export default ModalEditRelasi;
