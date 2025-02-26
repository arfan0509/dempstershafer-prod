import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiEye, FiEyeOff } from "react-icons/fi";
import SuccessModal from "../../components/SuccessModal"; // ✅ Import modal berhasil
import axiosInstance from "../../api/axiosInstance";

const RegisterPasienPage: React.FC = () => {
  const [formData, setFormData] = useState({
    nama: "",
    alamat: "",
    no_telp: "",
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false); // ✅ State modal berhasil
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ Fungsi validasi email dengan regex
  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleRegister = async () => {
    if (
      !formData.nama ||
      !formData.alamat ||
      !formData.no_telp ||
      !formData.email ||
      !formData.password
    ) {
      setErrorMessage("Semua kolom harus diisi!");
      return;
    }

    if (!isValidEmail(formData.email)) {
      setErrorMessage("Format email tidak valid!");
      return;
    }

    try {
      await axiosInstance.post("/pasien/register", formData);
      setShowSuccessModal(true); // ✅ Tampilkan modal berhasil
    } catch (error: any) {
      console.error("Register error:", error);
      setErrorMessage(
        error.response?.data?.message || "Terjadi kesalahan saat mendaftar"
      );
    }
  };

  const handleCloseModal = () => {
    setShowSuccessModal(false);
    navigate("/pasien-login"); // ✅ Arahkan ke login setelah modal ditutup
  };

  return (
    <div
      className="relative flex items-center justify-center min-h-screen bg-cover bg-center"
      style={{ backgroundImage: 'url("/assets/register-pasien.jpg")' }}
    >
      <div className="absolute inset-0 bg-white bg-opacity-60 backdrop-blur-md"></div>
      <div className="relative z-10 w-full max-w-md lg:max-w-2xl p-8 bg-white bg-opacity-90 rounded-2xl shadow-2xl">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Daftar Pasien
        </h2>

        {errorMessage && (
          <div className="mb-4 text-center text-red-500 font-medium">
            {errorMessage}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 font-medium mb-1">Nama</label>
            <input
              type="text"
              name="nama"
              placeholder="Masukkan nama"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4F81C7]"
              value={formData.nama}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">
              No. Telepon
            </label>
            <input
              type="text"
              name="no_telp"
              placeholder="Masukkan no. telepon"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4F81C7]"
              value={formData.no_telp}
              onChange={handleChange}
            />
          </div>

          <div className="lg:col-span-2">
            <label className="block text-gray-700 font-medium mb-1">
              Alamat
            </label>
            <input
              type="text"
              name="alamat"
              placeholder="Masukkan alamat"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4F81C7]"
              value={formData.alamat}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              placeholder="Masukkan email"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4F81C7]"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div className="relative">
            <label className="block text-gray-700 font-medium mb-1">
              Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Masukkan password"
              className="w-full p-3 pr-14 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4F81C7]"
              value={formData.password}
              onChange={handleChange}
            />
            <div
              className="absolute top-[53px] right-4 transform -translate-y-1/2 cursor-pointer text-gray-600 hover:text-gray-900"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
            </div>
          </div>
        </div>

        <button
          className="w-full mt-6 py-3 text-white bg-[#4F81C7] rounded-lg hover:bg-[#3e6b99] transition duration-300 font-semibold shadow-md"
          onClick={handleRegister}
        >
          Daftar
        </button>

        <p className="text-center text-gray-600 mt-4">
          Sudah punya akun?{" "}
          <button
            className="text-[#4F81C7] font-semibold hover:underline"
            onClick={() => navigate("/pasien-login")}
          >
            Login di sini
          </button>
        </p>
      </div>

      {/* ✅ Modal Berhasil */}
      <SuccessModal
        isOpen={showSuccessModal}
        message="Pendaftaran berhasil! Silakan login untuk melanjutkan."
        onClose={handleCloseModal}
      />
    </div>
  );
};

export default RegisterPasienPage;
