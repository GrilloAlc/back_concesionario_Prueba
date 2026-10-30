const mongoose = require("mongoose");

const appPeliculasSchema = new mongoose.Schema({
    titulo: { type: String, required: true },
    director: { type: String, required: true },
    genero: { type: String, required: true },
    anio: { type: Number, required: true, min: 1900, max: 2026, default: 2026 },
    duracion: { type: Number, required: true },
    puntuacion: { type: Number, min: 0, max: 10 },
    disponible: { type: Boolean, default: true }
}, {
    timestamps: true
});

const Pelicula = mongoose.model("pelicula", appPeliculasSchema);
module.exports = Pelicula;