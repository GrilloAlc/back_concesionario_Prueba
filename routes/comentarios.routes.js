const express = require("express");
const ruta = express.Router();
const comentarioController = require("../controller/comentarios.controller");
const { verificarToken } = require("../middleware/auth.middleware");

ruta.post("/insert/:id/:pelicula", verificarToken, comentarioController.insert);
ruta.put("/edit/:id", verificarToken, comentarioController.edit);
ruta.delete("/delete/:id", verificarToken, comentarioController.deleteComment);
ruta.get("/", comentarioController.findAll);
ruta.get("/:id", comentarioController.findById);

module.exports = ruta;
