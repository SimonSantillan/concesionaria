var express = require("express");
var router = express.Router();
let panel = require('../controllers/panelController.js')
/* Multer para permitir la subida y el almacenamiento de archivos */
let path = require("path");
let multer = require('multer');
/* express-validator para validar los campos del formulario */
let { check, validationResult, body } = require("express-validator");

/* Configuración de multer */
const storage2 = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/images/concesionarias");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now();
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});
const upload = multer({ storage: storage2 });


router.get('/', panel.panel);
router.get('/logout', panel.salir);
router.get('/datos', panel.datos);

/* Sucursales */
/* Agregar Sucursales */
router.get('/sucursal-a', panel.sucursalA);
router.post('/sucursal-a', upload.single('foto'), panel.sucursalAform);
/* Quitar sucursales */
router.get('/sucursal-q', panel.sucursalQ);
router.delete('/sucursal-q/:id', panel.sucursalQdelete);
/* Actualizar sucursales */
router.get('/sucursal-ac', panel.sucursalAc);
router.put('/sucursal-ac/:id', panel.sucursalAcUpdate);
/* Ver sucursales */
router.get('/sucursales', panel.verSucursales)

/* Autos */
/* Agregar Autos */
router.get('/autos-a', panel.autosA);
router.post('/autos-a', upload.single('foto'), panel.autosAform);
/* Quitar autos */
router.get('/autos-q', panel.autosQ);
router.delete('/autos-q/:id', panel.autosQdelete);
/* Actualizar autos */
router.get('/autos-ac', panel.autosAc);
router.put('/autos-ac/:id', panel.autosAcUpdate);
/* Ver autos */
router.get('/autos', panel.verAutos);


module.exports = router;