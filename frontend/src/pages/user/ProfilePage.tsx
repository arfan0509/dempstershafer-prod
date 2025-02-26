import React, { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosInstance";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft, FiEye, FiEyeOff } from "react-icons/fi";
import SuccessModal from "../../components/SuccessModal";
import NavbarComponent from "../../components/user/NavbarComponent";

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nama: "",
    email: "",
    alamat: "",
    no_telp: "",
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordVisibility, setPasswordVisibility] = useState({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false,
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [validationError, setValidationError] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const fetchProfileData = async () => {
    try {
      const response = await axiosInstance.get("/pasien/me", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      const { nama, email, alamat, no_telp } = response.data;
      setFormData({ nama, email, alamat, no_telp: no_telp || "" });
    } catch (error) {
      console.error("Error fetching profile data:", error);
      navigate("/login-pasien");
    }
  };

  useEffect(() => {
    fetchProfileData();
  }, []);

  const handleProfileChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const togglePasswordVisibility = (field: string) => {
    setPasswordVisibility({
      ...passwordVisibility,
      [field]: !passwordVisibility[field],
    });
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axiosInstance.put("/pasien/edit", formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      setModalMessage("Profil berhasil diperbarui!");
      setIsModalOpen(true);
      fetchProfileData();
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Gagal memperbarui profil.");
    }
  };

  const validatePassword = () => {
    let isValid = true;
    const errors = {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    };

    if (!passwordData.currentPassword) {
      errors.currentPassword = "Password saat ini tidak boleh kosong.";
      isValid = false;
    }
    if (!passwordData.newPassword) {
      errors.newPassword = "Password baru tidak boleh kosong.";
      isValid = false;
    } else if (passwordData.newPassword.length < 6) {
      errors.newPassword = "Password baru minimal 6 karakter.";
      isValid = false;
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      errors.confirmPassword = "Konfirmasi password baru tidak cocok.";
      isValid = false;
    }
    setValidationError(errors);
    return isValid;
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validatePassword()) return;

    try {
      await axiosInstance.put("/pasien/change-password", passwordData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      setModalMessage("Password berhasil diubah!");
      setIsModalOpen(true);
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      if (error.response && error.response.status === 400) {
        setValidationError({
          currentPassword: "Password Salah",
          newPassword: "",
          confirmPassword: "",
        });
      } else {
        console.error("Error changing password:", error);
        alert("Gagal mengubah password.");
      }
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    navigate("/pasien-login");
  };

  return (
    <>
      <NavbarComponent />
      <div className="container mx-auto pt-20 px-4 sm:px-6 lg:px-8">
        {/* 🔙 Tombol Kembali */}
        <button
          onClick={() => navigate("/sistem-pakar")}
          className="flex items-center text-[#4F81C7] hover:text-[#3e6b99] font-semibold text-lg pb-5"
        >
          <FiArrowLeft className="mr-2" size={20} />
          Kembali
        </button>

        {/* 📝 Form Profil */}
        <div className="bg-white bg-opacity-85 p-8 rounded-lg shadow-lg space-y-8">
          <h2 className="text-3xl font-bold text-center text-gray-700">
            Profil Saya
          </h2>

          {/* Form Edit Profil */}
          <form onSubmit={handleProfileSubmit} className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-600">Edit Profil</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="block text-gray-700 font-medium">
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  name="nama"
                  value={formData.nama}
                  onChange={handleProfileChange}
                  className="p-3 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-[#4F81C7]"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="block text-gray-700 font-medium">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  disabled
                  className="p-3 border rounded-lg w-full bg-gray-100 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-gray-700 font-medium">
                  Nomor Telepon
                </label>
                <input
                  type="text"
                  name="no_telp"
                  value={formData.no_telp}
                  onChange={handleProfileChange}
                  className="p-3 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-[#4F81C7]"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="block text-gray-700 font-medium">
                  Alamat
                </label>
                <input
                  type="text"
                  name="alamat"
                  value={formData.alamat}
                  onChange={handleProfileChange}
                  className="p-3 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-[#4F81C7]"
                  required
                />
              </div>
            </div>
            <button
              type="submit"
              className="w-full bg-[#4F81C7] hover:bg-[#3A6BA8] text-white py-3 rounded-lg transition duration-300"
            >
              Simpan Perubahan
            </button>
          </form>

          {/* Form Ubah Password */}
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-600">
              Ubah Password
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {["currentPassword", "newPassword", "confirmPassword"].map(
                (field, idx) => (
                  <div key={idx} className="space-y-1">
                    <label className="block text-gray-700 font-medium">
                      {field === "currentPassword"
                        ? "Password Saat Ini"
                        : field === "newPassword"
                        ? "Password Baru"
                        : "Konfirmasi Password Baru"}
                    </label>
                    <div className="relative">
                      <input
                        type={passwordVisibility[field] ? "text" : "password"}
                        name={field}
                        value={passwordData[field]}
                        onChange={handlePasswordChange}
                        className="p-3 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-[#4F81C7]"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility(field)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2"
                      >
                        {passwordVisibility[field] ? <FiEye /> : <FiEyeOff />}
                      </button>
                    </div>
                    {validationError[field] && (
                      <p className="text-red-500 text-sm">
                        {validationError[field]}
                      </p>
                    )}
                  </div>
                )
              )}
            </div>
            <button
              type="submit"
              className="w-full bg-[#4F81C7] hover:bg-[#3A6BA8] text-white py-3 rounded-lg transition duration-300"
            >
              Ubah Password
            </button>
          </form>
        </div>
      </div>

      <SuccessModal
        isOpen={isModalOpen}
        message={modalMessage}
        onClose={handleModalClose}
      />
    </>
  );
};

export default ProfilePage;
