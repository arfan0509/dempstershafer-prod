const Admin = require("../models/Admin");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.registerAdmin = async (req, res) => {
  const { nama, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    await Admin.create({ nama, email, password: hashedPassword });
    res.json({ message: "Registrasi admin berhasil" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.loginAdmin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const admin = await Admin.findOne({ where: { email } });
    if (!admin)
      return res.status(400).json({ message: "Email tidak ditemukan" });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(400).json({ message: "Password salah" });

    // ✅ Pastikan role dimasukkan ke dalam token
    const accessToken = jwt.sign(
      { id: admin.id_admin, email: admin.email, role: "admin" },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    const refreshToken = jwt.sign(
      { id: admin.id_admin, email: admin.email, role: "admin" },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({ message: "Login berhasil", accessToken, refreshToken });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
