import React, { useState } from "react";

const ModalTambahPenyakit = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    kode_penyakit: "",
    nama_penyakit: "",
    deskripsi: "",
    solusi: "",
  });

  if (!isOpen) return null;

  const handleSubmit = () => {
    onSave(formData);
    setFormData({
      kode_penyakit: "",
      nama_penyakit: "",
      deskripsi: "",
      solusi: "",
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4">
      <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-lg">
        <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center">
          Tambah Penyakit
        </h2>

        {/* Input Kode Penyakit */}
        <div className="mb-3">
          <label className="block text-gray-700 font-medium mb-1">
            Kode Penyakit
          </label>
          <input
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#4F81C7]"
            type="text"
            value={formData.kode_penyakit}
            onChange={(e) =>
              setFormData({ ...formData, kode_penyakit: e.target.value })
            }
          />
        </div>

        {/* Input Nama Penyakit */}
        <div className="mb-3">
          <label className="block text-gray-700 font-medium mb-1">
            Nama Penyakit
          </label>
          <input
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#4F81C7]"
            type="text"
            value={formData.nama_penyakit}
            onChange={(e) =>
              setFormData({ ...formData, nama_penyakit: e.target.value })
            }
          />
        </div>

        {/* Input Deskripsi Penyakit */}
        <div className="mb-3">
          <label className="block text-gray-700 font-medium mb-1">
            Deskripsi Penyakit
          </label>
          <textarea
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#4F81C7] resize-none"
            rows={3}
            value={formData.deskripsi}
            onChange={(e) =>
              setFormData({ ...formData, deskripsi: e.target.value })
            }
          />
        </div>

        {/* Input Solusi Penyakit */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-1">
            Solusi Penyakit
          </label>
          <textarea
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#4F81C7] resize-none"
            rows={3}
            value={formData.solusi}
            onChange={(e) =>
              setFormData({ ...formData, solusi: e.target.value })
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

export default ModalTambahPenyakit;
