const mongoose = require("mongoose");

const appComentariosSchema = new mongoose.Schema(
  {
    usuario: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "usuario",
      required: true,
    },
    pelicula: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "pelicula",
      required: true,
    },
    comentario: { type: String, required: true, maxlength: 500 },
  },
  {
    timestamps: true,
  },
);

const Comentario = mongoose.model("comentario", appComentariosSchema);
module.exports = Comentario;
