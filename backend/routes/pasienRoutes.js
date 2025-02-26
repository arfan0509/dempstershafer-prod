const express = require("express");
const {
  registerPasien,
  loginPasien,
  getLoggedInPasien,
  getAllPasien,
  editPasien,
  changePassword,
  deletePasienById,
} = require("../controllers/pasienController");

const {
  verifyToken,
  adminOnly,
  pasienOnly,
} = require("../middleware/authMiddleware");

const router = express.Router();

// ✅ Akses Umum
router.post("/register", registerPasien);
router.post("/login", loginPasien);

// ✅ Akses Pasien
router.get("/me", verifyToken, pasienOnly, getLoggedInPasien);
router.put("/edit", verifyToken, pasienOnly, editPasien);
router.put("/change-password", verifyToken, pasienOnly, changePassword);

// ✅ Akses Admin
router.get("/all", verifyToken, adminOnly, getAllPasien);
router.delete("/delete/:id", verifyToken, adminOnly, deletePasienById);

module.exports = router;
