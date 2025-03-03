import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="bg-[#4F81C7] text-white py-8">
      <div className="container mx-auto px-4 flex flex-col md:flex-row md:justify-between items-start">
        {/* Bagian Kiri: Logo & Tagline */}
        <div className="mb-6 md:mb-0 flex items-center gap-3">
          <img
            src="/assets/nav-logo.png"
            alt="Logo Sistem Pakar Kucing"
            className="w-12 h-12 object-cover"
          />
          <div>
            <h2 className="text-lg font-bold">Sistem Pakar Kucing</h2>
            <p className="text-sm italic">
              "Analisis Cerdas untuk Sahabat Berbulu Anda"
            </p>
          </div>
        </div>

        {/* Bagian Tengah: Info Pembuat */}
        <div className="mb-6 md:mb-0 text-sm space-y-1">
          <p className="font-semibold">Creator: Arfan Astaraja</p>
          <p>
            Email:{" "}
            <a
              href="mailto:arfanraja89@gmail.com"
              className="underline hover:text-gray-200"
            >
              arfanraja89@gmail.com
            </a>
          </p>
          <p>
            Telepon:{" "}
            <a
              href="tel:085174248344"
              className="underline hover:text-gray-200"
            >
              085174248344
            </a>
          </p>
        </div>

        {/* Bagian Kanan: Alamat */}
        <div className="text-sm space-y-1">
          <p className="font-semibold">Alamat:</p>
          <p>Ds Wonosari, Kediri, Jawa Timur</p>
          <p>Kode Pos: 64119</p>
        </div>
      </div>

      {/* Batas Footer */}
      <div className="mt-6 border-t border-white/50">
        <p className="text-center text-xs md:text-sm mt-4 opacity-90">
          &copy; {new Date().getFullYear()} Sistem Pakar Kucing. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
