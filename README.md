# Proyecto panel concesionarias



## Instalar MySQL
1. Instalar MySQL 
2. Configurar una nueva conexión con los siguientes parámetros: `conecction name = root` y `username = root`
3. Crear la base de datos llamada `curso_sequelize`

## Instalar xampp
Instala xampp e inicializar MySQL apretando start (Se inicializa por defecto en el puero 3306)

## En Visual Studio Code
1. Abrir la terminarl y ejecutar ` npm install ` para instalar las dependencias del proyecto
2. Ejecutar ` npm run dev ` (Si lo anterior de mysql y xampp estan hechos debería aparecer `Conexión DB OK`)
3. Ir a la ruta /sources/models y en los archivos `Sucursales.js` y `Usuarios.js` Descomentar las funciones asincronas que se encuentran al final para crear las tablas y luego volverlas a comentar
4. Ir a `localhost:3078/admin` y utilizar la app

# Fin