const { DataTypes } = require("sequelize");
const db = require("../config/database");

const Admin = db.define(
  "admin",
  {
    id_admin: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    nama: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false },
  },
  {
    tableName: "admin",
    timestamps: false,
  }
);

module.exports = Admin;
