const Penyakit = require("../models/Penyakit");

// ✅ Fungsi untuk generate kode penyakit jika tidak diisi oleh admin
const generateKodePenyakit = async () => {
  const count = await Penyakit.count();
  return `P${String(count + 1).padStart(3, "0")}`;
};

// ✅ Tambah Penyakit (Cek Duplikasi)
exports.tambahPenyakit = async (req, res) => {
  try {
    let { kode_penyakit, nama_penyakit, deskripsi, solusi } = req.body;

    // 🔍 Cek apakah penyakit dengan nama atau kode sudah ada
    const existingPenyakit = await Penyakit.findOne({
      where: { nama_penyakit },
    });

    const existingKode = await Penyakit.findOne({
      where: { kode_penyakit },
    });

    if (existingPenyakit) {
      return res.status(400).json({ message: "Nama penyakit sudah digunakan" });
    }

    if (existingKode) {
      return res.status(400).json({ message: "Kode penyakit sudah digunakan" });
    }

    // Jika kode tidak diberikan, buat otomatis
    if (!kode_penyakit) {
      kode_penyakit = await generateKodePenyakit();
    }

    // ✅ Tambahkan penyakit baru
    const penyakit = await Penyakit.create({
      kode_penyakit,
      nama_penyakit,
      deskripsi,
      solusi,
    });
    res.json({ message: "Penyakit berhasil ditambahkan", penyakit });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Ambil Semua Penyakit
exports.getPenyakit = async (req, res) => {
  try {
    const penyakit = await Penyakit.findAll();
    res.json(penyakit);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Update Penyakit (Admin Bisa Edit Semua Kecuali Kode)
exports.updatePenyakit = async (req, res) => {
  try {
    const { id } = req.params;
    const { nama_penyakit, deskripsi, solusi } = req.body;

    const penyakit = await Penyakit.update(
      { nama_penyakit, deskripsi, solusi },
      { where: { id_penyakit: id } }
    );

    if (penyakit[0] === 1) {
      res.json({ message: "Penyakit berhasil diperbarui" });
    } else {
      res.status(404).json({ message: "Penyakit tidak ditemukan" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Hapus Penyakit
exports.hapusPenyakit = async (req, res) => {
  try {
    const { id } = req.params;
    const penyakit = await Penyakit.destroy({ where: { id_penyakit: id } });

    if (penyakit) {
      res.json({ message: "Penyakit berhasil dihapus" });
    } else {
      res.status(404).json({ message: "Penyakit tidak ditemukan" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
