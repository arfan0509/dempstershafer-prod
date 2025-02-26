const express = require("express");
const router = express.Router();
const { refreshToken } = require("../controllers/authController"); // Pastikan ini mengarah ke controller yang tepat

// Route untuk Refresh Token
router.post("/refresh-token", refreshToken);

module.exports = router;
