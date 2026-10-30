const express = require("express");
const ruta = express.Router();
const usuarioController = require("../controller/usuarios.controller");
const { verificarToken, permitirRoles } = require("../middleware/auth.middleware");

ruta.post("/signup", usuarioController.signUp);
ruta.post("/login", usuarioController.logIn);
ruta.get("/", verificarToken, permitirRoles("ADMON"), usuarioController.getTodos);
ruta.put("/updateuser/:id", verificarToken, usuarioController.updateUser);
ruta.delete("/delete/:id", verificarToken, permitirRoles("ADMON"), usuarioController.deleteUser);
ruta.post("/:id/favorites", verificarToken, usuarioController.addFavorite);
ruta.get("/favorites/:id", verificarToken, usuarioController.getFavorites);
ruta.get("/comments/:id", verificarToken, usuarioController.getComments);

module.exports = ruta;