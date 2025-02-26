const express = require("express");
const { verifyToken, adminOnly } = require("../middleware/authMiddleware");
const { tambahRelasi, getRelasi, updateRelasi, hapusRelasi } = require("../controllers/relasiController");

const router = express.Router();

router.post("/tambah", verifyToken, adminOnly, tambahRelasi);
router.get("/", getRelasi);
router.put("/update/:id", verifyToken, adminOnly, updateRelasi);
router.delete("/hapus/:id", verifyToken, adminOnly, hapusRelasi);

module.exports = router;
