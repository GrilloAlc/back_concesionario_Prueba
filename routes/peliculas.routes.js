const express = require("express");
const ruta = express.Router();
const peliculaController = require("../controller/peliculas.controller");
const { verificarToken, permitirRoles } = require("../middleware/auth.middleware");

ruta.get("/carga-inicial", peliculaController.cargaInicial);
ruta.get("/todas", peliculaController.findAll);
ruta.get("/buscar", peliculaController.consultaAvanzada);
ruta.get("/id/:id", peliculaController.findById);
ruta.get("/genero/:genero", peliculaController.findByGenero);
ruta.get("/puntuacion/:nota", peliculaController.findByPuntuacion);
ruta.get("/director/:director", peliculaController.findByDirector);
ruta.get("/duracion/:minutos", peliculaController.findByDuracion);

ruta.post("/", verificarToken, permitirRoles("ADMON"), peliculaController.insertOne);
ruta.put("/:id", verificarToken, permitirRoles("ADMON"), peliculaController.updateById);
ruta.delete("/:id", verificarToken, permitirRoles("ADMON"), peliculaController.deleteById);

module.exports = ruta;
