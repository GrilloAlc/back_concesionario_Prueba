const jwt = require("jsonwebtoken");

const verificarToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).send("Token no proporcionado");

    const token = authHeader.split(" ")[1];
    try {
        req.usuario = jwt.verify(token, process.env.TOKEN_PASSWORD);
    } catch (error) {
        return res.status(401).send("Token inválido o caducado");
    }
    next();
};

const permitirRoles = (...roles) => {
    return (req, res, next) => {
        const authHeader = req.headers.authorization;
        if (!authHeader) return res.status(401).send("Token no proporcionado");
        const token = authHeader.split(" ")[1];
        try {
            req.usuario = jwt.verify(token, process.env.TOKEN_PASSWORD);
        } catch (error) {
            return res.status(401).send(error);
        }
        if (!roles.includes(req.usuario.rol)) {
            return res.status(403).send("No tienes permisos");
        }
        next();
    };
};

module.exports = { verificarToken, permitirRoles };