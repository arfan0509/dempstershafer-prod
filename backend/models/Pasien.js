const { DataTypes } = require("sequelize");
const db = require("../config/database");

const Pasien = db.define(
  "pasien",
  {
    id_pasien: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    nama: { type: DataTypes.STRING, allowNull: false },
    alamat: { type: DataTypes.STRING, allowNull: false },
    no_telp: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false },
  },
  {
    tableName: "pasien",
    timestamps: false,
  }
);

module.exports = Pasien;
