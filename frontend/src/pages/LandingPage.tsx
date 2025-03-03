import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ModalLogin from "../components/ModalLogin";

const LandingPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogin = () => {
    setIsModalOpen(true);
  };

  const handleRegister = () => {
    navigate("/pasien-register");
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="w-full">
      {/* HERO SECTION */}
      <section className="relative h-screen flex flex-col">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: 'url("/assets/kucing2.jpg")' }}
        />
        {/* Overlay Hitam */}
        <div className="absolute inset-0 bg-black opacity-40" />

        {/* Konten Hero */}
        <div className="relative z-10 flex flex-col items-center justify-center flex-1 px-4 text-center text-white">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 max-w-3xl leading-tight">
            Selamat Datang di Sistem Pakar Identifikasi Penyakit Kucing
          </h1>
          <p className="text-lg md:text-xl max-w-xl mb-8">
            Sistem pakar untuk membantu mendiagnosis penyakit pada kucing
            menggunakan metode Dempster Shafer
          </p>
        </div>

        {/* Tombol Login & Register (Desktop) */}
        <div className="absolute top-4 right-8 hidden sm:block z-10">
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

        {/* Tombol Login & Register (Mobile) */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex space-x-4 sm:hidden z-10">
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
      </section>

      {/* KONTEN PENJELASAN */}
      {/* Jika ingin efek 'overlap' dengan hero, bisa tambahkan class: '-mt-20 rounded-t-3xl shadow-xl' */}
      <section className="bg-white text-gray-800 py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-semibold text-center mb-6">
            Apa Itu Sistem Pakar Identifikasi Penyakit Kucing?
          </h2>
          <p className="text-lg leading-relaxed text-justify mb-4">
            Sistem Pakar Identifikasi Penyakit Kucing adalah sebuah sistem
            berbasis komputer yang dirancang untuk membantu mendiagnosis
            penyakit pada kucing dengan menggunakan pendekatan Dempster Shafer.
            Sistem ini menggabungkan berbagai informasi dan gejala yang dialami
            oleh kucing untuk menentukan kemungkinan penyakit yang diderita.
          </p>
          <p className="text-lg leading-relaxed text-justify mb-4">
            Dengan menggunakan metode Dempster Shafer, sistem ini dapat
            menangani ketidakpastian dan informasi yang tidak lengkap dari
            gejala-gejala yang ada. Metode ini menggabungkan bukti dan
            menghasilkan keputusan yang lebih akurat dalam mengidentifikasi
            penyakit, meskipun informasi yang diberikan tidak selalu lengkap
            atau sepenuhnya jelas.
          </p>
          <p className="text-lg leading-relaxed text-justify">
            Sistem ini sangat berguna bagi pemilik kucing atau dokter hewan
            untuk membantu mendiagnosis penyakit secara lebih cepat dan tepat.
            Dengan memasukkan gejala yang terlihat pada kucing, sistem ini akan
            memberikan hasil berupa kemungkinan penyakit yang sesuai dengan
            bukti yang diberikan.
          </p>
        </div>
      </section>

      {/* Modal Login */}
      <ModalLogin isOpen={isModalOpen} onClose={handleCloseModal} />
    </div>
  );
};

export default LandingPage;
