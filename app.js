var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
/* session */
/* Configuro session como middleware en la aplicación */
const session = require("express-session");
/* importo sequelize */
const sequelize = require('./sources/database/conexion.js')
/* Ejecuto una vez para establecer la conexion con mi base de datos */
/* const Usuario = require('./sources/models/Usuario.js') */
/* const Sucursales = require('./sources/models/Sucursales.js') */
const methodOverride = require("method-override");


let adminsRouter = require('./routes/adminRouter');
let panelRouter = require('./routes/panelRouter')

var app = express();

/* conexión con mi base de datos */
async function conexionOk() {
  try {
    /* Espero la auntenticación de sequelize */
    await sequelize.authenticate();
    console.log("DB conexión OK");
  } catch (error) {
    console.log(error);
  }
}
conexionOk();


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
// Configurar el middleware method-override
app.use(methodOverride("_method"));

app.use(
  session({
    secret: "secret-key",
    resave: false,
    saveUninitialized: true,
  })
  );
  
  
  
  app.use('/admin', adminsRouter);
  app.use('/panel', panelRouter);
  
  
  // catch 404 and forward to error handler
  app.use(function(req, res, next) {
    next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  
  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
