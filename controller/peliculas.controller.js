const peliculas = require("../bbdd/peliculas");
const Pelicula = require("../model/pelicula.model");

const cargaInicial = async (req, res) => {
    try {
        await Pelicula.insertMany(peliculas);
        res.status(201).send("Carga completa");
    } catch (error) {
        res.status(500).send("Error al cargar películas");
    }
};

const findAll = async (req, res) => {
    try {
        const result = await Pelicula.find();
        res.status(200).send(result);
    } catch (error) {
        res.status(500).send("Error al consultar películas");
    }
};

const findById = async (req, res) => {
    try {
        const result = await Pelicula.findById(req.params.id);
        if (!result) return res.status(404).send("Película no encontrada");
        res.status(200).send(result);
    } catch (error) {
        res.status(400).send("ID de película inválido");
    }
};

const findByGenero = async (req, res) => {
    try {
        const result = await Pelicula.find({ genero: req.params.genero });
        res.status(200).send(result);
    } catch (error) {
        res.status(500).send("Error al buscar por género");
    }
};

const findByPuntuacion = async (req, res) => {
    const nota = Number(req.params.nota);
    if (isNaN(nota)) return res.status(400).send("La nota debe ser un número");
    try {
        const result = await Pelicula.find({ puntuacion: { $gt: nota } });
        res.status(200).send(result);
    } catch (error) {
        res.status(500).send("Error al buscar por puntuación");
    }
};

const findByDirector = async (req, res) => {
    try {
        const result = await Pelicula.find({ director: req.params.director });
        res.status(200).send(result);
    } catch (error) {
        res.status(500).send("Error al buscar por director");
    }
};

const findByDuracion = async (req, res) => {
    const minutos = Number(req.params.minutos);
    if (isNaN(minutos)) return res.status(400).send("Los minutos deben ser un número");
    try {
        const result = await Pelicula.find({ duracion: { $lt: minutos } });
        res.status(200).send(result);
    } catch (error) {
        res.status(500).send("Error al buscar por duración");
    }
};

const insertOne = async (req, res) => {
    try {
        const pelicula = new Pelicula(req.body);
        const result = await pelicula.save();
        res.status(201).send(result);
    } catch (error) {
        res.status(400).send("Error al crear película");
    }
};

const updateById = async (req, res) => {
    try {
        const result = await Pelicula.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        if (!result) return res.status(404).send("Película no encontrada");
        res.status(200).send(result);
    } catch (error) {
        res.status(400).send("Error al actualizar película");
    }
};

const deleteById = async (req, res) => {
    try {
        const result = await Pelicula.findByIdAndDelete(req.params.id);
        if (!result) return res.status(404).send("Película no encontrada");
        res.status(204).send();
    } catch (error) {
        res.status(400).send("Error al eliminar película");
    }
};

const consultaAvanzada = async (req, res) => {
    try {
        const filtroPeliculas = {};

        if (req.query.genero) {
            filtroPeliculas.genero = req.query.genero;
        }
        if (req.query.puntuacionMinima) {
            const minima = Number(req.query.puntuacionMinima);
            if (isNaN(minima)) return res.status(400).send("La puntuación mínima debe ser un número");
            filtroPeliculas.puntuacion = { $gte: minima };
        }

        const pagina = Number(req.query.pagina) || 1;
        const limite = Number(req.query.limite) || 5;
        const orden = req.query.orden === "desc" ? -1 : 1;

        const result = await Pelicula.find(filtroPeliculas)
            .sort({ puntuacion: orden })
            .skip((pagina - 1) * limite)
            .limit(limite);

        res.status(200).send(result);
    } catch (error) {
        res.status(500).send("Error en la consulta avanzada");
    }
};

module.exports = {
    cargaInicial, 
    findAll, 
    findById, 
    findByGenero, 
    findByPuntuacion,
    findByDirector, 
    findByDuracion, 
    insertOne, 
    updateById, 
    deleteById,
    consultaAvanzada
};