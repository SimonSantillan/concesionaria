var express = require("express");
var router = express.Router();
/* Controladores */
let admin = require('../controllers/adminController.js')
/* Multer para permitir la subida y el almacenamiento de archivos */
let path = require("path");
let multer = require('multer');
/* express-validator para validar los campos del formulario */
let { check, validationResult, body } = require("express-validator");
const { error } = require("console");


/* Configuración de multer */
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/images/panel/foto-usuarios");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now();
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});
const upload = multer({ storage: storage });

/* const validateFileUpload = (req, res, next) => {
  if (!req.file) {
    return res.status(400).json({ error: "Debes adjuntar un archivo" });
  }
  next();
}; */

router.get("/", admin.bienvenido);
// Tengo que hacer un método que procese el logueo del usuario YA registrado
router.post("/", [
  check('email').isEmail().withMessage('Ingrese un mail válido'),
  check('password').isLength({min:8}).withMessage('La contraseña debe ser de minimo 8 caracteres')
], admin.logueo);



router.get("/registro", admin.registro); 

// Tenemos que hacer un metodo que procese el registro del nuevo usuario
router.post("/registro", upload.single('foto'), [
  check('nombre').isLength({min:5}).withMessage('El nombre no puede estar vacío y debe tener minimo 5 caracteres'),
  check('apellido').isLength({min:3}).withMessage('El apellido no puede estar vacío y debe tener mínimo 3 caractere'),
  check('dni').isLength({min:8, max:8}).withMessage('Ingrese un dni válido'),
  check('nacimiento').isDate().withMessage('Fecha inválida'),
  check('email').isEmail().withMessage('Ingrese un mail válido'),
  check('password').isLength({min:8}).withMessage('La contraseña debe ser de minimo 8 caracteres'),
],admin.crear);




module.exports = router;