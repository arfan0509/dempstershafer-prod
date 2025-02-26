const express = require("express");
const { verifyToken, pasienOnly, adminOnly } = require("../middleware/authMiddleware");
const { tambahDiagnosis, getAllDiagnosis, getDiagnosisByPasienId, updateDiagnosis, deleteDiagnosis } = require("../controllers/diagnosisController");

const router = express.Router();

// ✅ Endpoint untuk menambah diagnosis (Hanya Pasien yang bisa mengakses)
router.post("/tambah", verifyToken, pasienOnly, tambahDiagnosis);

// ✅ Get Semua Diagnosis (Bisa diakses tanpa token)
router.get("/", getAllDiagnosis);

// ✅ Get Diagnosis berdasarkan ID Pasien (Bisa diakses tanpa token)
router.get("/:id_pasien", getDiagnosisByPasienId);  // 🔥 Ubah di sini

// ✅ Update Diagnosis (Hanya Admin yang bisa mengakses)
router.put("/:id", verifyToken, adminOnly, updateDiagnosis);

// ✅ Delete Diagnosis (Hanya Admin yang bisa mengakses)
router.delete("/:id", verifyToken, adminOnly, deleteDiagnosis);

module.exports = router;
