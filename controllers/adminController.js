let { check, validationResult, body } = require("express-validator");
let Usuarios = require('../sources/models/Usuarios.js')
let session = require("express-session");
const bcrypt = require("bcrypt");

let adminController = {
  registro: function (req, res) {
    /* Si el usuario ya inició sesion entonces no se puede cargar el registro */
    if (req.session.userLogueado !== undefined) {
      return res.redirect("/panel");
    } 

    res.render("admin-registro", {
      title: "Panel: Registro",
    });
  },
  bienvenido: function (req, res) {
    /* Si el usuario ya inició sesion entonces no se puede cargar el admin */
    if (req.session.userLogueado !== undefined) {
      return res.redirect("/panel");
    } 

    // Verificar si el registro se ha completado en la sesión
    const registroCompleto = req.session.registroCompleto || false;
    

    let message;
    if (registroCompleto) {
      message =
        "El registro fué exitoso, por favor, inicia sesión para continuar";
    } else {
      message = undefined;
    }

    // Borrar el indicador de registro de la sesión para evitar repetición
    delete req.session.registroCompleto;

    res.render("admin", { title: "Panel", message: message });
  },
  crear: async function (req, res) {
    
    let errors = validationResult(req);
    
    if (errors.isEmpty()) {

      /* Obtengo la ubicación del archivo y le recorto una parte de la url para que pueda ser usada por las vistas */
      if (req.file === undefined) {
        return res.render("admin-registro", {
          title: "Panel: Error de Registro",
          img: 'No se encuentra una foto seleccionada',
          errors: errors.errors,
        });
      }

      let file = req.file.destination;
      let ubicacion = `${file.slice(6)}/${req.file.filename}`;
      /* console.log(ubicacion); */
      
      /* Obtengo los datos enviados por parámetro */
      const { nombre, apellido, dni, nacimiento, email, password } = req.body;
      
      /* Traigo los mails de mi base de datos para ver si coincide con el que voy a registrar */

      const usuario = await Usuarios.findAll({
        attributes: ['mail','dni']
      });
      /* console.log(usuario[0]); */

      /* Creo un array de todos los mails */
      const emails = await usuario.map((user) => user.mail);
      /* console.log(emails); */
      /* Creo un array de todos los dni */
      const dnis = await usuario.map((user) => user.dni);
      /* console.log(dnis) */

      let mismoMail = false;
      for (let i = 0; i < emails.length; i++){
        if (emails[i] === email) {
          mismoMail = true;
        }
      }
      /* console.log(email)
      console.log(mismoMail); */

      let mismoDNI = false;
      for (let i = 0; i < dnis.length; i++){
        if (dnis[i] === parseInt(dni)) {
          mismoDNI= true;
        }
      }
      /*
      console.log(dni)
      console.log(dnis[0])
      console.log(mismoDNI) */


      
      if (mismoMail || mismoDNI) {
        return res.render("admin-registro", {
          title: "Panel: Error de Registro",
          mail: "EL usuario ya se encuentra registrado",
          errors: errors.errors,
        });
      } 
        
        
        
        /* Por el momento no creo usuarios */
      try {

      const newUsuario = await Usuarios.create({
        nombre,
        apellido,
        dni,
        nacimiento,
        mail: email,
        contrasenia: bcrypt.hashSync(password, 10),
        foto: ubicacion,
      });
      } catch (error) {
        console.log(error)
      }



      res.redirect("/admin");
      
    } else {
      res.render('admin-registro', {
        title: 'Panel: Error de Registro',
        errors: errors.errors
      })
    }

  },
  logueo: async function (req, res) {
    /* Me fijo que no tenga errores de validación */
    let errors = validationResult(req);
    if (errors.isEmpty()) {
      /* Obtengo los datos enviados por parámetro */
      const { email, password } = req.body;

      /* Comparo las credenciales y busco si están en mi base de datos */

      /* const usuario = await Usuarios.findOne({
        where: {
          mail: email,
          contrasenia: password,
        },
      }); */

      const usuario = await Usuarios.findOne({
        where: {
          mail: email,
        },
      });

      var userLogueado;
      /* Si el mail del usuario se encontró, compara las contraseñas */
      if (usuario) {
        const contraseniaCoincide = await bcrypt.compare(password, usuario.contrasenia);

        if (contraseniaCoincide) {
          /* La contraseña es correcta, el usuario ha iniciado sesión exitosamente */
          userLogueado = usuario;
          /* Voy a estar guardando la persona a loguearse, si todo lo anterior salió todo bien, guardo en la sesion la persona a loguearse, aca abajo en esta línea, el usuario ya quedo en session con lo cual lo puedo compartir en un montón de vistas en toda mi aplicacion por que es un middleware a nivel aplicación */
          req.session.userLogueado = userLogueado;
          res.redirect("/panel");
        } else {
          /* La contraseña es incorrecta */
          res.render("admin", {
            title: "Panel: Error de Logueo",
            message: "Contraseña incorrecta",
          });
        }
      } else {
        /* No se encontró un usuario con el correo electrónico proporcionado */
        res.render("admin", {
          title: "Panel: Error de Logueo",
          message: "El email ingresado no se encuentra en nuestra base de datos",
        });
      }


      
    } else {
      res.render('admin', {
        title: 'Panel: Error de Logueo',
        errors: errors.errors
      })
    }
  }
};

module.exports = adminController;
