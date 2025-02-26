const Pasien = require("../models/Pasien");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// ✅ Get Pasien yang Login
exports.getLoggedInPasien = async (req, res) => {
  try {
    const pasien = await Pasien.findByPk(req.pasien.id, {
      attributes: { exclude: ["password"] },
    });
    if (!pasien)
      return res.status(404).json({ message: "Pasien tidak ditemukan" });
    res.json(pasien);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Get Semua Pasien (Hanya Admin)
exports.getAllPasien = async (req, res) => {
  try {
    const semuaPasien = await Pasien.findAll({
      attributes: { exclude: ["password"] },
      order: [["id_pasien", "ASC"]],
    });
    res.json(semuaPasien);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Edit Data Pasien (Hanya Pasien yang Login)
exports.editPasien = async (req, res) => {
  const { nama, alamat, no_telp } = req.body;
  try {
    const pasien = await Pasien.findByPk(req.pasien.id);
    if (!pasien)
      return res.status(404).json({ message: "Pasien tidak ditemukan" });

    await pasien.update({ nama, alamat, no_telp });
    res.json({ message: "Data pasien berhasil diperbarui", pasien });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Delete Pasien berdasarkan ID (Hanya Admin)
exports.deletePasienById = async (req, res) => {
  const { id } = req.params;
  try {
    const pasien = await Pasien.findByPk(id);
    if (!pasien)
      return res.status(404).json({ message: "Pasien tidak ditemukan" });

    await pasien.destroy();
    res.json({ message: `Pasien dengan ID ${id} berhasil dihapus` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Register Pasien (Tetap Sama)
exports.registerPasien = async (req, res) => {
  const { nama, alamat, no_telp, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    const existingPasien = await Pasien.findOne({ where: { email } });
    if (existingPasien) {
      return res.status(400).json({ message: "Email sudah digunakan" });
    }
    await Pasien.create({
      nama,
      alamat,
      no_telp,
      email,
      password: hashedPassword,
    });
    res.json({ message: "Registrasi pasien berhasil" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Login Pasien (Tetap Sama)
exports.loginPasien = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Cek apakah pasien dengan email tersebut ada
    const pasien = await Pasien.findOne({ where: { email } });

    if (!pasien) {
      return res.status(400).json({ message: "Email tidak ditemukan" });
    }

    // Cek apakah password yang dimasukkan benar
    const isMatch = await bcrypt.compare(password, pasien.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Password salah" });
    }

    // Generate access token
    const accessToken = jwt.sign(
      { id: pasien.id_pasien, email: pasien.email, role: "pasien" },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Generate refresh token
    const refreshToken = jwt.sign(
      { id: pasien.id_pasien, email: pasien.email, role: "pasien" },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Kirimkan token dan id pasien ke client
    res.json({
      message: "Login berhasil",
      accessToken,
      refreshToken,
      id_pasien: pasien.id_pasien, // Pastikan id pasien juga dikirimkan untuk kebutuhan frontend
    });
  } catch (error) {
    console.error("Login error:", error);
    res
      .status(500)
      .json({ error: "Terjadi kesalahan server, silakan coba lagi" });
  }
};

// ✅ Ganti Password Pasien (Hanya Pasien yang Login)
exports.changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  try {
    const pasien = await Pasien.findByPk(req.pasien.id);
    if (!pasien)
      return res.status(404).json({ message: "Pasien tidak ditemukan" });

    const isMatch = await bcrypt.compare(currentPassword, pasien.password);
    if (!isMatch)
      return res.status(400).json({ message: "Password lama salah" });

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    await pasien.update({ password: hashedNewPassword });

    res.json({ message: "Password berhasil diperbarui" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
