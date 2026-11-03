const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Usuario = require("../model/usuario.model");
const Pelicula = require("../model/pelicula.model");
const Comentario = require("../model/comentario.model");

const signUp = async (req, res) => {
  try {
    const passwordEncriptada = await bcrypt.hash(req.body.password, 10);
    const usuario = new Usuario({
      username: req.body.username,
      email: req.body.email,
      password: passwordEncriptada,
    });
    await usuario.save();
    res.status(201).send("Usuario registrado");
  } catch (error) {
    res.status(400).send("Error al registrar usuario");
  }
};

const logIn = async (req, res) => {
  try {
    const user = await Usuario.findOne({ username: req.body.username }).select(
      "+password",
    );
    if (!user) return res.status(401).send("Credenciales incorrectas");

    const correcta = await bcrypt.compare(req.body.password, user.password);
    if (!correcta) return res.status(401).send("Credenciales incorrectas");

    const token = jwt.sign(
      { id: user._id, username: user.username, rol: user.rol },
      process.env.TOKEN_PASSWORD,
      { expiresIn: "2h" },
    );
    res.status(200).send({ mensaje: "Inicio de sesión correcto", token });
  } catch (error) {
    res.status(500).send("Error al iniciar sesión");
  }
};

const getTodos = async (req, res) => {
  try {
    const result = await Usuario.find();
    res.status(200).send(result);
  } catch (error) {
    res.status(500).send("Error al consultar usuarios");
  }
};

const updateUser = async (req, res) => {
  try {
    const id = req.params.id;
    const esAdmin = req.usuario.rol === "ADMON";
    if (req.usuario.id !== id && !esAdmin)
      return res.status(403).send("No tienes permiso");
    if (req.body.rol && !esAdmin)
      return res.status(403).send("Solo ADMON puede cambiar roles");

    const usuario = await Usuario.findById(id).select("+password");
    if (!usuario) return res.status(404).send("Usuario no encontrado");

    const datos = { ...req.body };
    delete datos.currentPassword;

    if (datos.password) {
      if (!req.body.currentPassword)
        return res.status(400).send("Debes enviar la contraseña actual");
      const correcta = await bcrypt.compare(
        req.body.currentPassword,
        usuario.password,
      );
      if (!correcta)
        return res.status(401).send("Contraseña actual incorrecta");
      datos.password = await bcrypt.hash(datos.password, 10);
    }

    const result = await Usuario.findByIdAndUpdate(id, datos, {
      new: true,
      runValidators: true,
    });
    res.status(200).send(result);
  } catch (error) {
    res.status(400).send("Error al actualizar usuario");
  }
};

const deleteUser = async (req, res) => {
  try {
    const result = await Usuario.findByIdAndDelete(req.params.id);
    if (!result) return res.status(404).send("Usuario no encontrado");
    res.status(204).send();
  } catch (error) {
    res.status(400).send("Error al eliminar usuario");
  }
};

const addFavorite = async (req, res) => {
  try {
    const id = req.params.id;
    const peliculaId = req.body.peliculaId;
    if (req.usuario.id !== id && req.usuario.rol !== "ADMON")
      return res.status(403).send("No tienes permiso");

    const usuario = await Usuario.findById(id);
    const pelicula = await Pelicula.findById(peliculaId);
    if (!usuario || !pelicula)
      return res.status(404).send("Usuario o película no encontrados");

    if (usuario.favoritas.includes(peliculaId))
      return res.status(409).send("La película ya está en favoritos");

    usuario.favoritas.push(peliculaId);
    await usuario.save();
    res.status(200).send(usuario.favoritas);
  } catch (error) {
    res.status(400).send("Error al añadir favorito");
  }
};

const getFavorites = async (req, res) => {
  try {
    const id = req.params.id;
    if (req.usuario.id !== id && req.usuario.rol !== "ADMON")
      return res.status(403).send("No tienes permiso");

    const usuario = await Usuario.findById(id).populate("favoritas");
    if (!usuario) return res.status(404).send("Usuario no encontrado");
    res.status(200).send(usuario.favoritas);
  } catch (error) {
    res.status(500).send("Error al consultar favoritos");
  }
};

const getComments = async (req, res) => {
  try {
    const id = req.params.id;
    if (req.usuario.id !== id && req.usuario.rol !== "ADMON")
      return res.status(403).send("No tienes permiso");

    const result = await Comentario.find({ usuario: id }).populate(
      "pelicula",
      "titulo director",
    );
    res.status(200).send(result);
  } catch (error) {
    res.status(500).send("Error al consultar comentarios");
  }
};

module.exports = {
  signUp,
  logIn,
  getTodos,
  updateUser,
  deleteUser,
  addFavorite,
  getFavorites,
  getComments,
};
