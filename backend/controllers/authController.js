const jwt = require("jsonwebtoken");

// Fungsi untuk menangani refresh token
exports.refreshToken = (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken)
    return res.status(401).json({ message: "Token refresh tidak ditemukan" });

  // Verifikasi Refresh Token
  jwt.verify(refreshToken, process.env.JWT_SECRET, (err, decoded) => {
    if (err)
      return res.status(403).json({ message: "Refresh token tidak valid" });

    // Buat Access Token baru
    const accessToken = jwt.sign(
      { id: decoded.id, email: decoded.email, role: decoded.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" } // Access Token berlaku selama 1 jam
    );

    res.json({ accessToken });
  });
};
