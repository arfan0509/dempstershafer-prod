// 🛡️ middleware/authMiddleware.js
const jwt = require("jsonwebtoken");

// ✅ Middleware untuk memverifikasi token
exports.verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Akses ditolak, token tidak ada" });
  }

  const token = authHeader.split(" ")[1]; // Ambil token dari format: Bearer <token>

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ message: "Token tidak valid" });

    // ✅ Simpan data user di request untuk digunakan di endpoint berikutnya
    if (decoded.role === "admin") {
      req.admin = decoded;
    } else if (decoded.role === "pasien") {
      req.pasien = decoded;
    } else {
      return res.status(403).json({ message: "Role tidak valid" });
    }

    next(); // ✅ Lanjut ke controller jika token valid
  });
};

// ✅ Middleware khusus admin
exports.adminOnly = (req, res, next) => {
  if (!req.admin) {
    return res.status(403).json({ message: "Akses hanya untuk admin" });
  }
  next();
};

// ✅ Middleware khusus pasien
exports.pasienOnly = (req, res, next) => {
  if (!req.pasien) {
    return res.status(403).json({ message: "Akses hanya untuk pasien" });
  }
  next();
};
