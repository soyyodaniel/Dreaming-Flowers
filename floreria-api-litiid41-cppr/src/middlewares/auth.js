const { verifyToken } = require('../utils/jwt');
const { errorResponse } = require('../utils/response');
const User = require('../models/User');

// middleware para verificar JWT
const authenticateToken = async (req, res, next) => {
  try {
    // obtener token del header Authorization
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json(
        errorResponse('Token no proporcionado', 401)
      );
    }

    // verificar token
    const decoded = verifyToken(token);

    // verificar que el usuario existe y está activo
    const user = await User.findById(decoded.userId);

    if (!user || user.estatus != 1) {
      return res.status(401).json(
        errorResponse('Usuario no autorizado', 401)
      );
    }

    // agregar información del usuario al request
    req.user = {
      userId: user.id,
      email: user.email,
      nombre: user.nombre,
      rol: user.rol
    };

    next();
  } catch (error) {
    return res.status(401).json(
      errorResponse('Token inválido o expirado', 401)
    );
  }
};

// middleware para verificar rol de administrador
const isAdmin = (req, res, next) => {
  if (req.user && req.user.rol === 'admin') {
    next();
  } else {
    return res.status(403).json(
      errorResponse('Acceso denegado. Debes ser administrador', 403)
    );
  }
};

module.exports = {
  authenticateToken,
  isAdmin
};