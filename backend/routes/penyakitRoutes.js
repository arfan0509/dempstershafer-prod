const express = require("express");
const { verifyToken, adminOnly } = require("../middleware/authMiddleware");
const {
  tambahPenyakit,
  getPenyakit,
  updatePenyakit,
  hapusPenyakit,
} = require("../controllers/penyakitController");

const router = express.Router();

router.post("/tambah", verifyToken, adminOnly, tambahPenyakit);
router.get("/", getPenyakit);
router.put("/update/:id", verifyToken, adminOnly, updatePenyakit);
router.delete("/hapus/:id", verifyToken, adminOnly, hapusPenyakit);

module.exports = router;
