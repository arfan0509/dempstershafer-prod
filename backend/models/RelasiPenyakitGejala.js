const { DataTypes } = require("sequelize");
const db = require("../config/database");
const Penyakit = require("./Penyakit");
const Gejala = require("./Gejala");

const RelasiPenyakitGejala = db.define(
  "relasi_penyakit_gejala",
  {
    id_relasi: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    id_penyakit: { type: DataTypes.INTEGER, allowNull: false },
    id_gejala: { type: DataTypes.INTEGER, allowNull: false },
    bobot: { type: DataTypes.DECIMAL(3, 2), allowNull: false },
  },
  {
    tableName: "relasi_penyakit_gejala",
    timestamps: false,
  }
);

// Menambahkan asosiasi dengan CASCADE
RelasiPenyakitGejala.associate = () => {
  // Menambahkan asosiasi antara RelasiPenyakitGejala dan Penyakit
  RelasiPenyakitGejala.belongsTo(Penyakit, {
    foreignKey: "id_penyakit",
    as: "penyakit", // Alias untuk model Penyakit
    onDelete: "CASCADE",
  });

  // Menambahkan asosiasi antara RelasiPenyakitGejala dan Gejala
  RelasiPenyakitGejala.belongsTo(Gejala, {
    foreignKey: "id_gejala",
    as: "gejala", // Alias untuk model Gejala
    onDelete: "CASCADE",
  });
};

module.exports = RelasiPenyakitGejala;
