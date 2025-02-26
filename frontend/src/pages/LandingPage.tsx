import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ModalLogin from "../components/ModalLogin";

const LandingPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false); // State untuk modal login
  const navigate = useNavigate();

  // Fungsi untuk mengarahkan ke halaman login
  const handleLogin = () => {
    setIsModalOpen(true); // Menampilkan modal login saat tombol login ditekan
  };

  // Fungsi untuk mengarahkan ke halaman register
  const handleRegister = () => {
    navigate("/register"); // Ganti dengan route halaman register yang sesuai
  };

  // Fungsi untuk menutup modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div
      className="relative h-screen bg-cover bg-center"
      style={{ backgroundImage: 'url("/assets/kucing2.jpg")' }}
    >
      {/* Overlay Gelap untuk Kontras */}
      <div className="absolute inset-0 bg-black opacity-40"></div>

      {/* Konten Utama */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-white text-center px-4">
        <h1 className="text-5xl font-bold mb-6">
          Selamat Datang di Sistem Pakar Identifikasi Penyakit Kucing
        </h1>
        <p className="text-xl mb-8">
          Sistem pakar untuk membantu mendiagnosis penyakit pada kucing
          menggunakan metode Dempster Shafer
        </p>

        {/* Tombol Login dan Register (Desktop) */}
        <div className="absolute top-4 right-8 hidden sm:block">
          <button
            className="px-8 py-2 text-white bg-[#4F81C7] border-2 border-[#4F81C7] rounded-lg shadow-md hover:bg-[#3A6BA8] transition duration-300 mr-4"
            onClick={handleLogin}
          >
            Login
          </button>
          <button
            className="px-5 py-2 text-white bg-transparent border-2 border-white rounded-lg shadow-md hover:bg-[#4F81C7] hover:text-white transition duration-300"
            onClick={handleRegister}
          >
            Register
          </button>
        </div>

        {/* Tombol Login dan Register (Mobile) - Pastikan tombol selalu terlihat */}
        <div className="absolute sm:block bottom-10 left-1/2 transform -translate-x-1/2 flex space-x-4 mt-6 sm:hidden">
          <button
            className="px-8 py-2 text-white bg-[#4F81C7] border-2 border-[#4F81C7] rounded-lg shadow-md hover:bg-[#3A6BA8] transition duration-300"
            onClick={handleLogin}
          >
            Login
          </button>
          <button
            className="px-5 py-2 text-white bg-transparent border-2 border-white rounded-lg shadow-md hover:bg-[#4F81C7] hover:text-white transition duration-300"
            onClick={handleRegister}
          >
            Register
          </button>
        </div>
      </div>

      {/* Penjelasan Sistem Pakar Identifikasi Penyakit Kucing */}
      <div className="relative z-10 bg-white text-gray-800 py-16 px-6 mt-12 rounded-t-3xl shadow-xl max-w-4xl mx-auto">
        <h2 className="text-3xl font-semibold text-center mb-6">
          Apa Itu Sistem Pakar Identifikasi Penyakit Kucing?
        </h2>
        <p className="text-lg leading-relaxed text-justify">
          Sistem Pakar Identifikasi Penyakit Kucing adalah sebuah sistem
          berbasis komputer yang dirancang untuk membantu mendiagnosis penyakit
          pada kucing dengan menggunakan pendekatan Dempster Shafer. Sistem ini
          menggabungkan berbagai informasi dan gejala yang dialami oleh kucing
          untuk menentukan kemungkinan penyakit yang diderita.
        </p>
        <p className="text-lg leading-relaxed text-justify mt-4">
          Dengan menggunakan metode Dempster Shafer, sistem ini dapat menangani
          ketidakpastian dan informasi yang tidak lengkap dari gejala-gejala
          yang ada. Metode ini menggabungkan bukti dari berbagai sumber dan
          menghasilkan keputusan yang lebih akurat dalam mengidentifikasi
          penyakit, meskipun informasi yang diberikan tidak selalu lengkap atau
          sepenuhnya jelas.
        </p>
        <p className="text-lg leading-relaxed text-justify mt-4">
          Sistem ini sangat berguna bagi pemilik kucing atau dokter hewan untuk
          membantu mendiagnosis penyakit secara lebih cepat dan tepat. Dengan
          memasukkan gejala yang terlihat pada kucing, sistem ini akan
          memberikan hasil berupa kemungkinan penyakit yang sesuai dengan bukti
          yang diberikan.
        </p>
      </div>

      {/* Modal Login */}
      <ModalLogin isOpen={isModalOpen} onClose={handleCloseModal} />
    </div>
  );
};

export default LandingPage;
