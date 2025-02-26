const express = require("express");
const { verifyToken } = require("../middleware/authMiddleware");

const router = express.Router();

// ✅ Endpoint untuk mendapatkan profil pengguna (Admin atau Pasien)
router.get("/profile", verifyToken, (req, res) => {
  if (req.admin) {
    res.json({
      message: "Profil Admin",
      data: {
        id: req.admin.id,
        email: req.admin.email,
        role: "admin",
      },
    });
  } else if (req.pasien) {
    res.json({
      message: "Profil Pasien",
      data: {
        id: req.pasien.id,
        email: req.pasien.email,
        role: "pasien",
      },
    });
  } else {
    res.status(403).json({ message: "Role tidak valid" });
  }
});

module.exports = router;
