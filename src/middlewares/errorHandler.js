const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  // error de Multer al  subir archivos
  if (err.name === 'MulterError') {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'El archivo es demasiado grande a 5MB' // cambiar si has decidido aceptar tamñano más grande
      });
    }
    return res.status(400).json({
      success: false,
      message: `Error al subir archivo: ${err.message}`
    });
  }

  // error de MySQL
  if (err.code && err.code.startsWith('ER_')) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({
        success: false,
        message: 'El registro ya existe (correo duplicado)'
      });
    }
    return res.status(500).json({
      success: false,
      message: 'Error de base de datos'
    });
  }

  // error por defecto
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Error interno del servidor';

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && {
      stack: err.stack
    })
  });
};

module.exports = errorHandler;