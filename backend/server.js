const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { db } = require("./models"); // Mengimpor db dan model dari index.js

// Import Routes
const adminRoutes = require("./routes/adminRoutes");
const pasienRoutes = require("./routes/pasienRoutes");
const authRoutes = require("./routes/authRoutes");
const profileRoutes = require("./routes/profileRoutes");
const diagnosisRoutes = require("./routes/diagnosisRoutes");
const penyakitRoutes = require("./routes/penyakitRoutes");
const gejalaRoutes = require("./routes/gejalaRoutes");
const relasiRoutes = require("./routes/relasiRoutes");

const app = express();

// ✅ Konfigurasi CORS yang Benar
app.use(cors({
  origin: "http://localhost:5173", // Ganti jika frontend di port berbeda
  credentials: true,
  allowedHeaders: ["Authorization", "Content-Type"], // ✅ Pastikan Authorization diizinkan
}));

app.use(bodyParser.json());

// Gunakan Routes
app.use("/api/admin", adminRoutes);
app.use("/api/pasien", pasienRoutes);
app.use("/api/auth", authRoutes);
app.use("/api", profileRoutes);
app.use("/api/diagnosis", diagnosisRoutes);
app.use("/api/penyakit", penyakitRoutes);
app.use("/api/gejala", gejalaRoutes);
app.use("/api/relasi", relasiRoutes);

// Jalankan Server
const PORT = process.env.PORT || 5000;
db.sync()  // Memastikan koneksi berhasil sebelum menjalankan server
  .then(() => {
    console.log("Database Connected!");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.log("Database Connection Error:", err));
