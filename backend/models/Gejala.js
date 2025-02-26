const { DataTypes } = require("sequelize");
const db = require("../config/database");

const Gejala = db.define(
  "gejala",
  {
    id_gejala: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    kode_gejala: { type: DataTypes.STRING(10), allowNull: false, unique: true },
    nama_gejala: { type: DataTypes.STRING, allowNull: false, unique: true },
    bobot: { type: DataTypes.DECIMAL(3, 2), allowNull: true },
  },
  {
    tableName: "gejala",
    timestamps: false,
  }
);

// Menambahkan metode associate untuk model Gejala
Gejala.associate = (models) => {
  // Relasi dengan RelasiPenyakitGejala
  Gejala.hasMany(models.RelasiPenyakitGejala, {
    foreignKey: "id_gejala",
    onDelete: "CASCADE",
  });
};

module.exports = Gejala;
