
const { DataTypes } = require("sequelize");
/* import { sequelize } from "../database/conexion.js"; */
const sequelize = require("../database/conexion.js");
const Autos = require('./Autos.js');

const Sucursales = sequelize.define(
  "Sucursales",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    link: {
      type: DataTypes.STRING,
    },
    sucursal: {
      type: DataTypes.STRING,
    },
    direccion: {
      type: DataTypes.STRING,
    },
    telefono: {
      type: DataTypes.STRING,
    },
    foto: {
      type: DataTypes.STRING,
    }
  },
  {
    timestamps: false,
  }
);

Sucursales.hasMany(Autos, {
  foreignKey: "sucursalId",
  sourceKey: "id",
});

Autos.belongsTo(Sucursales, {
  foreignKey: "sucursalId",
  targetKey: "id",
});

/* async function crearTabla() {
  
  await Sucursales.sync();
}
crearTabla();
async function crearTabla2() {
  await Autos.sync();
}
crearTabla2(); */

module.exports = Sucursales;