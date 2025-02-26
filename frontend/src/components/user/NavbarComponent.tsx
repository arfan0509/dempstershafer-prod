import React, { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosInstance";
import { FiUser, FiLogOut, FiActivity, FiUserCheck } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const NavbarComponent: React.FC = () => {
  const [namaDepan, setNamaDepan] = useState<string>("User");
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
  const navigate = useNavigate();

  // ✅ Ambil nama pasien yang login
  const fetchPasienData = async () => {
    try {
      const response = await axiosInstance.get("/pasien/me", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      const fullName = response.data.nama || "User";
      const firstName = fullName.split(" ")[0]; // Ambil nama pertama
      setNamaDepan(firstName);
    } catch (error) {
      console.error("Error fetching pasien data:", error);
      navigate("/sistem-pakar"); // Redirect jika token invalid
    }
  };

  useEffect(() => {
    fetchPasienData();
  }, []);

  // ✅ Logout Handler
  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    navigate("/login-pasien");
  };

  return (
    <nav className="bg-[#4F81C7] p-4 shadow-md fixed top-0 left-0 w-full z-50">
      <div className="container mx-auto flex justify-between items-center">
        {/* ✅ Logo dan Judul */}
        <div className="flex items-center gap-2">
          <img src="/assets/nav-logo.png" alt="Logo" className="h-10 w-auto" />
          <h1 className="text-white text-2xl font-semibold">Sistem Pakar</h1>
        </div>

        {/* ✅ User Dropdown */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 text-white bg-[#3e6b99] p-2 rounded-lg hover:bg-[#355b80] transition"
          >
            <FiUser size={24} />
            <span className="font-medium">Halo, {namaDepan}</span>
          </button>

          {/* ✅ Dropdown Menu */}
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 bg-white rounded-lg shadow-lg w-48 z-50">
              <button
                onClick={() => {
                  navigate("/akun-saya");
                  setDropdownOpen(false);
                }}
                className="flex items-center gap-2 w-full px-4 py-2 hover:bg-gray-100"
              >
                <FiUserCheck /> Akun
              </button>

              <button
                onClick={() => {
                  navigate("/riwayat-diagnosis");
                  setDropdownOpen(false);
                }}
                className="flex items-center gap-2 w-full px-4 py-2 hover:bg-gray-100"
              >
                <FiActivity /> Riwayat Diagnosis
              </button>

              <button
                onClick={handleLogout}
                className="flex items-center gap-2 w-full px-4 py-2 hover:bg-red-100 text-red-600"
              >
                <FiLogOut /> Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavbarComponent;
