let Usuarios = require("../sources/models/Usuarios.js");
let session = require("express-session");
let Sucursales = require('../sources/models/Sucursales.js');
let Autos = require("../sources/models/Autos.js");

let panelController = {
  panel: function (req, res) {
    if (req.session.userLogueado === undefined) {
      return res.render("admin", {
        title: "Panel: Error de Logueo",
        message: "Por favor logueate",
      });
    }
    res.render("panel.ejs", { title: "Panel de Administración" });
  },
  datos: function (req, res) {
    if (req.session.userLogueado === undefined) {
      return res.render("admin", {
        title: "Panel: Error de Logueo",
        message: "Por favor logueate",
      });
    }
    let usuario = req.session.userLogueado;
    res.render("panel-datos", { title: "Panel: Datos", usuario: usuario });
  },
  salir: function (req, res) {
    req.session.userLogueado = undefined;
    res.redirect("/admin");
  },
  sucursalA: function (req, res) {
    /* Renderizar la sucursal */

    /* Si el usuario inicio sesion se puede ver esta vista */
    if (req.session.userLogueado === undefined) {
      return res.render("admin", {
        title: "Panel: Error de Logueo",
        message: "Por favor logueate",
      });
    }

    /* Verifico si hay datos almacenados en la url */
    if (req.session.sucursalAgregada !== undefined) {
      /* Renderizo la misma plantilla y utilizo los datos procesados */
      res.render("panel-a-sucursal", {
        title: "Panel: Sucursal agregada",
        datos: req.session.sucursalAgregada,
      });
    } else {
      res.render("panel-a-sucursal", { title: "Panel: Agregar sucursal" });
    }
  },
  sucursalAform: async function (req, res) {
    /* Enviar información a la base de datos por los parametros */

    /* Si el usuario inicio sesion, puede ver esta vista */
    if (req.session.userLogueado === undefined) {
      return res.render("admin", {
        title: "Panel: Error de Logueo",
        message: "Por favor logueate",
      });
    }

    /* Si el usuario no ingreso una imagen se recarga el form */
    if (req.file === undefined) {
      req.session.sucursalAgregada = undefined;
      return res.redirect("/panel/sucursal-a");
    }

    /* Obtengo la ubicación del archivo y le recorto una parte de la url para que pueda ser usada por las vistas */
    let file = req.file.destination;
    let ubicacion = `${file.slice(6)}/${req.file.filename}`;

    /* Obtengo los datos enviados por parámetro */
    const { link, sucursal, direccion, telefono } = req.body;
    /* Los guardo en un objeto para almacenarlo en la sesion */

    try {
      const newSucursal = await Sucursales.create({
        link,
        sucursal,
        direccion,
        telefono,
        foto: ubicacion,
      });
    } catch (error) {
      console.log(error);
    }

    req.session.sucursalAgregada = req.body;
    res.redirect("/panel/sucursal-a");
  },
  sucursalQ: async function (req, res) {
    /* Si el usuario inicio sesion, puede ver esta vista */
    if (req.session.userLogueado === undefined) {
      return res.render("admin", {
        title: "Panel: Error de Logueo",
        message: "Por favor logueate",
      });
    }
    const sucursales = await Sucursales.findAll();

    /* Lo convierto a objeto JSON */
    let sucursales1 = JSON.stringify(sucursales);
    /* Lo convierto a objeto JS */
    sucursales1 = JSON.parse(sucursales1);

    res.render("panel-q-sucursal", {
      title: "Panel: Quitar Sucursal",
      sucursales1: sucursales1,
    });
  },
  sucursalQdelete: async function (req, res) {
    try {
      const { id } = req.params;
      await Sucursales.destroy({
        where: { id },
      });
      res.redirect("/panel/sucursal-q");
    } catch (error) {
      console.log(error);
    }
  },
  sucursalAc: async function (req, res) {
    /* Si el usuario inicio sesion, puede ver esta vista */
    if (req.session.userLogueado === undefined) {
      return res.render("admin", {
        title: "Panel: Error de Logueo",
        message: "Por favor logueate",
      });
    }
    const sucursales = await Sucursales.findAll();

    /* Lo convierto a objeto JSON */
    let sucursales1 = JSON.stringify(sucursales);
    /* Lo convierto a objeto JS */
    sucursales1 = JSON.parse(sucursales1);

    res.render("panel-ac-sucursal", {
      title: "Panel: Actualizar Sucursal",
      sucursales1: sucursales1,
    });
  },
  sucursalAcUpdate: async function (req, res) {
    const { id } = req.params;
    const { sucursal, direccion, telefono } = req.body;
    /* console.log(req.body);
    console.log(id); */

    const sucursalA = await Sucursales.findByPk(id);

    if (sucursal !== "") {
      sucursalA.set("sucursal", sucursal);
    }
    if (direccion !== "") {
      sucursalA.set("direccion", direccion);
    }
    if (telefono !== "") {
      sucursalA.set("telefono", telefono);
    }


    /* Guardo la informacion  */
    await sucursalA.save();
    res.redirect("/panel/sucursal-ac");
  },
  verSucursales: async function (req, res) {
    if (req.session.userLogueado === undefined) {
      return res.render("admin", {
        title: "Panel: Error de Logueo",
        message: "Por favor logueate",
      });
    }
    const sucursalesBD = await Sucursales.findAll();

    /* Lo convierto a objeto JSON */
    let sucursales = JSON.stringify(sucursalesBD);
    /* Lo convierto a objeto JS */
    sucursales = JSON.parse(sucursales);
    

    res.render("panel-ver-sucursal", {
      title: "Panel: Sucursales",
      sucursales: sucursales,
    });
  },
  autosA: async function (req, res) {

    if (req.session.userLogueado === undefined) {
      return res.render("admin", {
        title: "Panel: Error de Logueo",
        message: "Por favor logueate",
      });
    }
    const sucursalesBD = await Sucursales.findAll();

    /* Lo convierto a objeto JSON */
    let sucursales = JSON.stringify(sucursalesBD);
    /* Lo convierto a objeto JS */
    sucursales = JSON.parse(sucursales);

    /* Verifico si hay datos almacenados en la url */
    if (req.session.autoAgregado !== undefined) {
      /* Renderizo la misma plantilla y utilizo los datos procesados */
      res.render("panel-a-autos", {
        title: "Panel: Auto agregado",
        datos: req.session.autoAgregado,
        sucursales: sucursales,
      });
    } else {
      res.render("panel-a-autos", {
        title: "Panel: Agregar auto",
        sucursales: sucursales,
      });
    }
  },
  autosAform: async function (req, res) {
    /* Enviar información a la base de datos por los parametros */

    /* Si el usuario inicio sesion, puede ver esta vista */
    if (req.session.userLogueado === undefined) {
      return res.render("admin", {
        title: "Panel: Error de Logueo",
        message: "Por favor logueate",
      });
    }

    /* Si el usuario no ingreso una imagen se recarga el form */
    if (req.file === undefined) {
      req.session.autoAgregado = undefined;
      return res.redirect("/panel/autos-a");
    }

    /* Obtengo la ubicación del archivo y le recorto una parte de la url para que pueda ser usada por las vistas */
    let file = req.file.destination;
    
    let ubicacion = `${file.slice(6)}/${req.file.filename}`;

    /* Obtengo los datos enviados por parámetro */
    const { marca, modelo, anio, color, sucursalId } = req.body;
    /* Los guardo en un objeto para almacenarlo en la sesion */

    try {
      const newAuto = await Autos.create({
        marca,
        modelo,
        anio,
        color,
        foto: ubicacion,
        sucursalId,
      });
    } catch (error) {
      console.log(error);
    }

    req.session.autoAgregado = req.body;
    res.redirect("/panel/autos-a");
  },
  autosQ: async function (req, res) {
    /* Si el usuario inicio sesion, puede ver esta vista */
    if (req.session.userLogueado === undefined) {
      return res.render("admin", {
        title: "Panel: Error de Logueo",
        message: "Por favor logueate",
      });
    }

    /* Acá lo que quiero es la interseccion de la sucursal con sus autos correspondientes */

    /* Lo convierto a objeto JSON */
    /* Lo convierto a objeto JS */
    
    const sucursalAutos = await Sucursales.findAll({
      include: {
        model: Autos,
      },
    });
    let sucursalYautos = JSON.stringify(sucursalAutos);
    sucursalYautos = JSON.parse(sucursalYautos);


    /* Le envío todos los autos que existen */
    const autos = await Autos.findAll();
    let todosAutos = JSON.stringify(autos);
    todosAutos = JSON.parse(todosAutos);


    /* console.log(sucursalYautos);
    console.log(todosAutos); */

    res.render("panel-q-autos", {
      title: "Panel: Quitar Autos",
      sucursalYautos: sucursalYautos,
      todosAutos: todosAutos
    });
  },
  autosQdelete: async function (req, res) {
    try {
      const { id } = req.params;
      await Autos.destroy({
        where: { id },
      });
      res.redirect("/panel/autos-q");
    } catch (error) {
      console.log(error);
    }
  },
  autosAc: async function (req, res) {
    /* Si el usuario inicio sesion, puede ver esta vista */
    if (req.session.userLogueado === undefined) {
      return res.render("admin", {
        title: "Panel: Error de Logueo",
        message: "Por favor logueate",
      });
    }

    const sucursalAutos = await Sucursales.findAll({
      include: {
        model: Autos,
      },
    });
    let sucursalYautos = JSON.stringify(sucursalAutos);
    sucursalYautos = JSON.parse(sucursalYautos);


    /* Le envío todos los autos que existen */
    const autos = await Autos.findAll();
    let todosAutos = JSON.stringify(autos);
    todosAutos = JSON.parse(todosAutos);


    /* console.log(sucursalYautos);
    console.log(todosAutos); */

    res.render("panel-ac-autos", {
      title: "Panel: Actualizar Autos",
      sucursalYautos: sucursalYautos,
      todosAutos: todosAutos
    });
  },
  autosAcUpdate: async function (req, res) {
    const { id } = req.params;
    const { marca,modelo,anio,color } = req.body;
    /* console.log(req.body);
    console.log(id); */

    const autosA = await Autos.findByPk(id);
    
    if (marca !== "") {
      autosA.set("marca", marca);
    }
    if (modelo !== "") {
      autosA.set("modelo", modelo);
    }
    if (anio !== "") {
      autosA.set("anio", anio);
    }
    if (color !== "") {
      autosA.set("color", color);
    }

    /* Guardo la informacion  */
    await autosA.save();
    res.redirect("/panel/autos-ac");
  },
  verAutos: async function (req, res) {
    if (req.session.userLogueado === undefined) {
      return res.render("admin", {
        title: "Panel: Error de Logueo",
        message: "Por favor logueate",
      });
    }

    /* Le envío todos los autos que existen */
    const autos = await Autos.findAll();
    let todosAutos = JSON.stringify(autos);
    todosAutos = JSON.parse(todosAutos);


    /* console.log(sucursalYautos);
    console.log(todosAutos); */

    res.render("panel-ver-autos", {
      title: "Panel: Autos",
      todosAutos: todosAutos
    });
  },
};

module.exports = panelController;
