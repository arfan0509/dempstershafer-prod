const { Op } = require("sequelize"); // Import Op
const Gejala = require("../models/Gejala");

// ✅ Fungsi untuk generate kode gejala jika tidak diisi oleh admin
const generateKodeGejala = async () => {
  const count = await Gejala.count();
  return `G${String(count + 1).padStart(3, "0")}`;
};

// ✅ Tambah Gejala (Cek Duplikasi)
exports.tambahGejala = async (req, res) => {
  try {
    let { kode_gejala, nama_gejala, bobot } = req.body;

    // Pastikan bobot ada dan valid
    if (bobot < 0 || bobot > 1 || !bobot) {
      return res.status(400).json({ message: "Bobot harus antara 0 dan 1" });
    }

    // 🔍 Cek apakah gejala dengan nama atau kode sudah ada
    const existingGejala = await Gejala.findOne({
      where: { nama_gejala },
    });

    const existingKode = await Gejala.findOne({
      where: { kode_gejala },
    });

    if (existingGejala) {
      return res.status(400).json({ message: "Nama gejala sudah digunakan" });
    }

    if (existingKode) {
      return res.status(400).json({ message: "Kode gejala sudah digunakan" });
    }

    // Jika kode tidak diberikan, buat otomatis
    if (!kode_gejala) {
      kode_gejala = await generateKodeGejala();
    }

    // ✅ Tambahkan gejala baru
    const gejala = await Gejala.create({ kode_gejala, nama_gejala, bobot });
    res.json({ message: "Gejala berhasil ditambahkan", gejala });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Ambil Semua Gejala
exports.getGejala = async (req, res) => {
  try {
    const gejala = await Gejala.findAll();
    res.json(gejala);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Update Gejala (Admin Bisa Edit Semua Kecuali Kode)
exports.updateGejala = async (req, res) => {
  try {
    const { id } = req.params;
    const { nama_gejala, bobot } = req.body;

    // Pastikan bobot ada dan valid
    if (bobot < 0 || bobot > 1 || !bobot) {
      return res.status(400).json({ message: "Bobot harus antara 0 dan 1" });
    }

    // Cek apakah nama gejala yang baru sudah ada
    const existingGejala = await Gejala.findOne({
      where: { nama_gejala, id_gejala: { [Op.ne]: id } },
    });

    if (existingGejala) {
      return res.status(400).json({ message: "Nama gejala sudah digunakan" });
    }

    // Update gejala
    const gejala = await Gejala.update(
      { nama_gejala, bobot },
      { where: { id_gejala: id } }
    );

    if (gejala[0] === 1) {
      res.json({ message: "Gejala berhasil diperbarui" });
    } else {
      res.status(404).json({ message: "Gejala tidak ditemukan" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Hapus Gejala
exports.hapusGejala = async (req, res) => {
  try {
    const { id } = req.params;
    const gejala = await Gejala.destroy({ where: { id_gejala: id } });

    if (gejala) {
      res.json({ message: "Gejala berhasil dihapus" });
    } else {
      res.status(404).json({ message: "Gejala tidak ditemukan" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
