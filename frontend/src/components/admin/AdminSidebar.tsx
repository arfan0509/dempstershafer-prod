import React, { useState } from "react";
import {
  FiMenu,
  FiHome,
  FiDatabase,
  FiFileText,
  FiActivity,
  FiBookOpen,
  FiClock,
  FiLogOut,
} from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";

const Sidebar = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const [isMasterOpen, setIsMasterOpen] = useState(false);
  const toggleMaster = () => setIsMasterOpen(!isMasterOpen);
  const navigate = useNavigate();

  // Fungsi Logout
  const handleLogout = () => {
    localStorage.removeItem("accessToken"); // ✅ Hapus access token
    localStorage.removeItem("refreshToken"); // ✅ Hapus refresh token
    navigate("/"); // ✅ Arahkan kembali ke halaman login admin
  };

  return (
    <>
      {/* Overlay background when sidebar is open */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={onClose}
        ></div>
      )}

      <div
        className={`fixed inset-y-0 left-0 w-64 bg-[#4F81C7] text-white p-4 transform transition-transform duration-300 ease-in-out z-50
    ${isOpen ? "translate-x-0" : "-translate-x-full"} 
    md:static md:translate-x-0 h-screen`}
      >
        {/* Header Sidebar: Logo & Admin Menu */}
        <div className="flex items-center gap-2 p-2 mb-4 border-b border-white">
          <img
            src="/assets/logo-admin.svg"
            alt="Logo"
            className="h-10 w-auto"
          />
          <span className="text-lg font-semibold">Admin Menu</span>
        </div>

        <ul>
          <li>
            <Link
              to="/admin-dashboard"
              className="block p-2 hover:bg-[#3A6BA8] flex items-center"
              onClick={onClose}
            >
              <FiHome className="mr-2" /> Dashboard
            </Link>
          </li>

          {/* Master Data Toggle */}
          <li
            className="p-2 hover:bg-[#3A6BA8] flex justify-between items-center cursor-pointer"
            onClick={toggleMaster}
          >
            <span className="flex items-center">
              <FiDatabase className="mr-2" /> Master Data
            </span>
            <span>{isMasterOpen ? "−" : "+"}</span>
          </li>

          {/* Submenu Master Data dengan animasi */}
          <div
            className={`overflow-hidden transition-all duration-500 ease-in-out ${
              isMasterOpen ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
            }`}
          >
            <ul className="pl-4">
              <li>
                <Link
                  to="/data-penyakit-dan-solusi"
                  className="block p-2 hover:bg-[#3A6BA8] flex items-center"
                  onClick={onClose}
                >
                  <FiFileText className="mr-2" /> Penyakit dan Solusi
                </Link>
              </li>
              <li>
                <Link
                  to="/data-gejala"
                  className="block p-2 hover:bg-[#3A6BA8] flex items-center"
                  onClick={onClose}
                >
                  <FiActivity className="mr-2" /> Data Gejala
                </Link>
              </li>
            </ul>
          </div>

          <li className="p-2 hover:bg-[#3A6BA8] flex items-center">
            <Link
              to="/data-relasi-gejala"
              className="flex items-center text-white w-full"
              onClick={onClose} // Menutup sidebar setelah diklik
            >
              <FiBookOpen className="mr-2" /> Rule Dempster Shafer
            </Link>
          </li>
          <li className="p-2 hover:bg-[#3A6BA8] flex items-center">
            <Link
              to="/riwayatdiagnosis-admin"
              className="flex items-center text-white w-full"
              onClick={onClose} // Menutup sidebar setelah diklik
            >
              <FiClock className="mr-2" /> Riwayat Diagnosis Kucing
            </Link>
          </li>

          {/* Tombol Logout */}
          <li
            className="p-2 hover:bg-[#3A6BA8] flex items-center cursor-pointer"
            onClick={handleLogout}
          >
            <FiLogOut className="mr-2" /> Logout
          </li>
        </ul>
      </div>
    </>
  );
};

const AdminSidebar = ({ children }: { children: React.ReactNode }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen">
      {/* Sidebar tetap di tempat saat scroll */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* Konten utama yang bisa di-scroll */}
      <div className="flex-1 min-w-0 h-screen overflow-y-auto">
        {/* ✅ Navbar mobile dengan logo + Admin Menu di kiri */}
        <div className="md:hidden bg-[#4F81C7] text-white p-4 flex items-center gap-2 sticky top-0 z-50">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="focus:outline-none"
          >
            <FiMenu size={24} />
          </button>
          <img src="/assets/logo-admin.svg" alt="Logo" className="h-8 w-auto" />
          <span className="text-lg font-semibold">Admin Menu</span>
        </div>

        {/* Main Content dengan scroll terpisah */}
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
};

export default AdminSidebar;
