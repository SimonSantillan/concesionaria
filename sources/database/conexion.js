/* Con este archivo me voy a conectar a mi base de datos, para eso, tengo que importar  */

/* import { Sequelize } from 'sequelize'; */

const Sequelize = require('sequelize');

/* Voy a poner todas las credenciales que necesito para ingresar desde aca hacia la base de datos */

/* primer parametro nombre de la base de datos, segundo parametro nombre de usuario, en mi caso: root */
/* Tercer parametro la contraseña, pongo string vacío porq no tengo la contraseña */
/* Como cuarto parametro un objeto donde voy a poner que base de datos estoy utilizando y el puerto*/
const sequelize = new Sequelize('curso_sequelize', 'root', '', {
  dialect: 'mysql',
  port: 3306
});
/* En la línea de arriba exporto la instancia de la clase Sequelize para importarlo en app.js */

module.exports = sequelize;