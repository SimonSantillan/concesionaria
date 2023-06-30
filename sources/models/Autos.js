const { DataTypes } = require("sequelize");
/* import { sequelize } from "../database/conexion.js"; */
const sequelize = require("../database/conexion.js");

const Autos = sequelize.define(
  "Autos",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    marca: {
      type: DataTypes.STRING,
    },
    modelo: {
      type: DataTypes.STRING,
    },
    anio: {
      type: DataTypes.STRING,
    },
    color: {
      type: DataTypes.STRING,
    },
    foto: {
      type: DataTypes.STRING,
    },
  },
  {
    timestamps: false,
  }
);



module.exports = Autos;
