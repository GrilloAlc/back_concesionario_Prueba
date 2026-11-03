const mongoose = require("mongoose");

const appUsuariosSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: false },
    favoritas: [{ type: mongoose.Schema.Types.ObjectId, ref: "pelicula" }],
    rol: { type: String, enum: ["USER", "MOD", "ADMON"], default: "USER" },
  },
  {
    timestamps: true,
  },
);

const Usuario = mongoose.model("usuario", appUsuariosSchema);
module.exports = Usuario;
