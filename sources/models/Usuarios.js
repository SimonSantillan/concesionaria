/* import { DataTypes } from "sequelize"; */
const { DataTypes } = require('sequelize');
/* import { sequelize } from "../database/conexion.js"; */
const sequelize = require('../database/conexion.js');

const Usuario = sequelize.define(
  "Usuario",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nombre: {
      type: DataTypes.STRING,
    },
    apellido: {
      type: DataTypes.STRING,
    },
    dni: {
      type: DataTypes.INTEGER,
    },
    nacimiento: {
      type: DataTypes.DATE,
    },
    mail: {
      type: DataTypes.STRING
    },
    contrasenia: {
      type: DataTypes.STRING
    },
    foto: {
      type: DataTypes.STRING
    }
  },
  {
    timestamps: false,
  }
);

/* Comentar luego de crear */
/* async function crearTabla() {
  
  await Usuario.sync();
}
crearTabla(); */
module.exports = Usuario;