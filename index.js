require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");

const rutaPeliculas = require("./routes/peliculas.routes");
const rutaUsuarios = require("./routes/usuarios.routes");
const rutaComentarios = require("./routes/comentarios.routes");

const app = express();

app.use(express.json());

app.use("/api/peliculas", rutaPeliculas);
app.use("/api/usuarios", rutaUsuarios);
app.use("/api/comentarios", rutaComentarios);

mongoose
  .connect(process.env.MONGO_URL_LOCAL)
  .then(() => console.log("BBDD EN MARCHA"))
  .catch((error) => console.log("Error al conectar:", error));

const PUERTO = process.env.PORT || 3000;

app.listen(PUERTO, () => {
  console.log("App en puerto 3000");
});
