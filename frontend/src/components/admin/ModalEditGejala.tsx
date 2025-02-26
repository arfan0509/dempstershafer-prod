import React, { useState, useEffect } from "react";

const ModalEditGejala = ({ isOpen, onClose, onSave, data }) => {
  const [formData, setFormData] = useState({
    id_gejala: "",
    kode_gejala: "",
    nama_gejala: "",
    bobot: "",
  });

  // Mengisi data saat modal terbuka
  useEffect(() => {
    if (isOpen && data) {
      setFormData({
        id_gejala: data.id_gejala,
        kode_gejala: data.kode_gejala,
        nama_gejala: data.nama_gejala,
        bobot: data.bobot.toString(), // Konversi angka ke string untuk input
      });
    }
  }, [isOpen, data]); // Tambahkan isOpen agar form selalu direset saat modal dibuka kembali

  if (!isOpen) return null;

  const handleSubmit = () => {
    // Validasi
    if (!formData.nama_gejala.trim()) {
      return alert("Nama gejala harus diisi!");
    }

    if (formData.bobot === "") {
      return alert("Bobot harus diisi!");
    }

    const bobotValue = parseFloat(formData.bobot);
    if (isNaN(bobotValue) || bobotValue < 0 || bobotValue > 1) {
      return alert("Bobot harus berupa angka antara 0 dan 1");
    }

    onSave({ ...formData, bobot: bobotValue }); // Kirim bobot sebagai angka
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4">
      <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-lg">
        <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center">
          Edit Gejala
        </h2>

        {/* Kode Gejala (Readonly) */}
        <div className="mb-3">
          <label className="block text-gray-700 font-medium mb-1">
            Kode Gejala
          </label>
          <input
            className="w-full p-2 border rounded-md bg-gray-100 text-gray-600 cursor-not-allowed"
            type="text"
            value={formData.kode_gejala}
            readOnly
          />
        </div>

        {/* Nama Gejala */}
        <div className="mb-3">
          <label className="block text-gray-700 font-medium mb-1">
            Nama Gejala
          </label>
          <input
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#4F81C7]"
            type="text"
            placeholder="Masukkan nama gejala"
            value={formData.nama_gejala}
            onChange={(e) =>
              setFormData({ ...formData, nama_gejala: e.target.value })
            }
          />
        </div>

        {/* Bobot Gejala */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-1">Bobot</label>
          <input
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#4F81C7]"
            type="number"
            step="0.01"
            min="0"
            max="1"
            placeholder="Masukkan bobot"
            value={formData.bobot}
            onChange={(e) =>
              setFormData({ ...formData, bobot: e.target.value })
            }
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

export default ModalEditGejala;
