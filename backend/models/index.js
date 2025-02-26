const db = require("../config/database");
const Penyakit = require("./Penyakit");
const Gejala = require("./Gejala");
const RelasiPenyakitGejala = require("./RelasiPenyakitGejala");
const Diagnosis = require("./Diagnosis");
const Pasien = require("./Pasien");

// 🔗 Relasi Diagnosis dengan Pasien
Diagnosis.belongsTo(Pasien, { foreignKey: "id_pasien" });
Pasien.hasMany(Diagnosis, { foreignKey: "id_pasien" });

// Inisialisasi asosiasi lain
Penyakit.associate({ RelasiPenyakitGejala, Gejala });
Gejala.associate({ RelasiPenyakitGejala, Penyakit });
RelasiPenyakitGejala.associate({ Penyakit, Gejala });

module.exports = {
  db,
  Penyakit,
  Gejala,
  RelasiPenyakitGejala,
  Diagnosis,
  Pasien,
};
