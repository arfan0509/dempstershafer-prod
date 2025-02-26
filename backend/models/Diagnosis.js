const { DataTypes } = require("sequelize");
const db = require("../config/database");

const Diagnosis = db.define(
  "diagnosis",
  {
    id_diagnosis: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    id_pasien: { type: DataTypes.INTEGER, allowNull: false },
    nama_kucing: { type: DataTypes.STRING, allowNull: false },
    jenis_kelamin: { type: DataTypes.ENUM("Jantan", "Betina"), allowNull: false },
    usia: { type: DataTypes.STRING(50), allowNull: false },
    warna_bulu: { type: DataTypes.STRING(100), allowNull: false },
    tanggal_diagnosis: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    hasil_diagnosis: { type: DataTypes.JSON, allowNull: false },
  },
  {
    tableName: "diagnosis",
    timestamps: false,
  }
);

module.exports = Diagnosis;
