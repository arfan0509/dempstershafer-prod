const express = require("express");
const { verifyToken, adminOnly } = require("../middleware/authMiddleware");
const { tambahGejala, getGejala, updateGejala, hapusGejala } = require("../controllers/gejalaController");

const router = express.Router();

router.post("/tambah", verifyToken, adminOnly, tambahGejala);
router.get("/", getGejala);
router.put("/update/:id", verifyToken, adminOnly, updateGejala);
router.delete("/hapus/:id", verifyToken, adminOnly, hapusGejala);

module.exports = router;
