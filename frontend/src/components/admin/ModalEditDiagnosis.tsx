import React, { useState, useEffect } from "react";
import { FiX, FiPlus, FiTrash2 } from "react-icons/fi";

interface ModalEditDiagnosisProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedData: any) => void;
  data: any;
}

const ModalEditDiagnosis: React.FC<ModalEditDiagnosisProps> = ({
  isOpen,
  onClose,
  onSave,
  data,
}) => {
  const [formData, setFormData] = useState({
    nama_kucing: "",
    jenis_kelamin: "",
    usia: "",
    warna_bulu: "",
    penyakit: "",
    solusi: "",
    gejala_terdeteksi: "",
    kemungkinan_penyakit_lain: [],
  });

  useEffect(() => {
    if (data) {
      const { hasil_diagnosis } = data;
      setFormData({
        nama_kucing: data.nama_kucing,
        jenis_kelamin: data.jenis_kelamin,
        usia: data.usia,
        warna_bulu: data.warna_bulu,
        penyakit: hasil_diagnosis?.penyakit || "",
        solusi: hasil_diagnosis?.solusi || "",
        gejala_terdeteksi: hasil_diagnosis?.gejala_terdeteksi?.join(", ") || "",
        kemungkinan_penyakit_lain:
          hasil_diagnosis?.kemungkinan_penyakit_lain || [],
      });
    }
  }, [data]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleKemungkinanChange = (
    index: number,
    field: string,
    value: string
  ) => {
    const updated = [...formData.kemungkinan_penyakit_lain];
    updated[index][field] = value;
    setFormData({ ...formData, kemungkinan_penyakit_lain: updated });
  };

  const addKemungkinanPenyakit = () => {
    setFormData({
      ...formData,
      kemungkinan_penyakit_lain: [
        ...formData.kemungkinan_penyakit_lain,
        { penyakit: "", solusi: "", gejala_terdeteksi: "" },
      ],
    });
  };

  const removeKemungkinanPenyakit = (index: number) => {
    const updated = formData.kemungkinan_penyakit_lain.filter(
      (_, i) => i !== index
    );
    setFormData({ ...formData, kemungkinan_penyakit_lain: updated });
  };

  const handleSubmit = () => {
    const updatedData = {
      nama_kucing: formData.nama_kucing,
      jenis_kelamin: formData.jenis_kelamin,
      usia: formData.usia,
      warna_bulu: formData.warna_bulu,
      hasil_diagnosis: {
        penyakit: formData.penyakit,
        solusi: formData.solusi,
        gejala_terdeteksi: formData.gejala_terdeteksi
          .split(",")
          .map((g) => g.trim()),
        kemungkinan_penyakit_lain: formData.kemungkinan_penyakit_lain.map(
          (item: any) => ({
            penyakit: item.penyakit,
            solusi: item.solusi,
            gejala_terdeteksi: item.gejala_terdeteksi
              .split(",")
              .map((g) => g.trim()),
          })
        ),
      },
      id_diagnosis: data.id_diagnosis,
    };
    onSave(updatedData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 overflow-auto">
      <div className="bg-white w-full max-w-3xl max-h-screen overflow-y-auto rounded-lg shadow-lg p-6 my-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-[#4F81C7]">
            Edit Diagnosis
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <FiX size={24} />
          </button>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Nama Kucing
              </label>
              <input
                type="text"
                name="nama_kucing"
                value={formData.nama_kucing}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4F81C7]"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Jenis Kelamin
              </label>
              <select
                name="jenis_kelamin"
                value={formData.jenis_kelamin}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4F81C7]"
              >
                <option value="">Pilih Jenis Kelamin</option>
                <option value="Jantan">Jantan</option>
                <option value="Betina">Betina</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Usia
              </label>
              <input
                type="text"
                name="usia"
                value={formData.usia}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4F81C7]"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Warna Bulu
              </label>
              <input
                type="text"
                name="warna_bulu"
                value={formData.warna_bulu}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4F81C7]"
              />
            </div>
          </div>

          {/* Bagian hasil diagnosis */}
          <h3 className="text-xl font-semibold text-[#4F81C7] mt-6">
            Hasil Diagnosis
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Penyakit
              </label>
              <input
                type="text"
                name="penyakit"
                value={formData.penyakit}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4F81C7]"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Solusi
              </label>
              <textarea
                rows={1}
                name="solusi"
                value={formData.solusi}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4F81C7]"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-gray-700 font-medium mb-1">
                Gejala Terdeteksi (pisahkan dengan koma)
              </label>
              <textarea
                name="gejala_terdeteksi"
                value={formData.gejala_terdeteksi}
                onChange={handleChange}
                rows={2}
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4F81C7]"
              />
            </div>
          </div>

          {/* Kemungkinan Penyakit Lain */}
          <h3 className="text-xl font-semibold text-[#4F81C7] mt-6 flex justify-between items-center">
            Kemungkinan Penyakit Lain
            <button
              onClick={addKemungkinanPenyakit}
              className="bg-[#4F81C7] hover:bg-[#3e6b99] text-white px-3 py-1 rounded-lg flex items-center gap-1"
            >
              <FiPlus /> Tambah Penyakit
            </button>
          </h3>

          {formData.kemungkinan_penyakit_lain.map((item: any, index: number) => (
            <div
              key={index}
              className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-100 p-4 rounded-lg relative"
            >
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Penyakit
                </label>
                <input
                  type="text"
                  value={item.penyakit}
                  onChange={(e) =>
                    handleKemungkinanChange(index, "penyakit", e.target.value)
                  }
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4F81C7]"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Solusi
                </label>
                <textarea
                  rows={1}
                  value={item.solusi}
                  onChange={(e) =>
                    handleKemungkinanChange(index, "solusi", e.target.value)
                  }
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4F81C7]"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Gejala Terdeteksi (pisahkan dengan koma)
                </label>
                <textarea
                  value={item.gejala_terdeteksi}
                  onChange={(e) =>
                    handleKemungkinanChange(
                      index,
                      "gejala_terdeteksi",
                      e.target.value
                    )
                  }
                  rows={2}
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4F81C7]"
                />
              </div>
              <button
                onClick={() => removeKemungkinanPenyakit(index)}
                className="absolute top-2 right-2 text-red-500 hover:text-red-700"
              >
                <FiTrash2 size={20} />
              </button>
            </div>
          ))}
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-lg"
          >
            Batal
          </button>
          <button
            onClick={handleSubmit}
            className="bg-[#4F81C7] hover:bg-[#3e6b99] text-white px-4 py-2 rounded-lg"
          >
            Simpan Perubahan
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalEditDiagnosis;
