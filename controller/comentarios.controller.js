const Comentario = require("../model/comentario.model");
const Usuario = require("../model/usuario.model");
const Pelicula = require("../model/pelicula.model");

const insert = async (req, res) => {
    try {
        const id = req.params.id;
        const peliculaId = req.params.pelicula;
        if (req.usuario.id !== id && req.usuario.rol !== "ADMON") return res.status(403).send("No puedes comentar como otro usuario");
        if (!req.body.comentario) return res.status(400).send("El comentario es obligatorio");

        const usuario = await Usuario.findById(id);
        const pelicula = await Pelicula.findById(peliculaId);
        if (!usuario || !pelicula) return res.status(404).send("Usuario o película no encontrados");

        const nuevoComentario = new Comentario({ usuario: id, pelicula: peliculaId, comentario: req.body.comentario });
        const result = await nuevoComentario.save();
        res.status(201).send(result);
    } catch (error) {
        res.status(400).send("Error al crear comentario");
    }
};

const edit = async (req, res) => {
    try {
        const comentario = await Comentario.findById(req.params.id);
        if (!comentario) return res.status(404).send("Comentario no encontrado");

        const esPropietario = comentario.usuario.toString() === req.usuario.id;
        if (!esPropietario && req.usuario.rol !== "ADMON") return res.status(403).send("No puedes editar este comentario");
        if (!req.body.comentario) return res.status(400).send("El comentario es obligatorio");

        comentario.comentario = req.body.comentario;
        await comentario.save();
        res.status(200).send(comentario);
    } catch (error) {
        res.status(400).send("Error al editar comentario");
    }
};

const deleteComment = async (req, res) => {
    try {
        const comentario = await Comentario.findById(req.params.id);
        if (!comentario) return res.status(404).send("Comentario no encontrado");

        const esPropietario = comentario.usuario.toString() === req.usuario.id;
        const puedeEliminarAjeno = req.usuario.rol === "MOD" || req.usuario.rol === "ADMON";
        if (!esPropietario && !puedeEliminarAjeno) return res.status(403).send("No puedes eliminar este comentario");

        await Comentario.findByIdAndDelete(req.params.id);
        res.status(204).send();
    } catch (error) {
        res.status(400).send("Error al eliminar comentario");
    }
};

const findAll = async (req, res) => {
    try {
        const result = await Comentario.find().populate("usuario", "username").populate("pelicula", "titulo");
        res.status(200).send(result);
    } catch (error) {
        res.status(500).send("Error al consultar comentarios");
    }
};

const findById = async (req, res) => {
    try {
        const result = await Comentario.findById(req.params.id).populate("usuario", "username").populate("pelicula", "titulo");
        if (!result) return res.status(404).send("Comentario no encontrado");
        res.status(200).send(result);
    } catch (error) {
        res.status(400).send("Error al buscar comentario");
    }
};

module.exports = { insert, edit, deleteComment, findAll, findById };