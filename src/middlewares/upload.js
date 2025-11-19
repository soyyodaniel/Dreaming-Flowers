const upload = require('../config/multer');
const { errorResponse } = require('../utils/response');

// middleware para manejar errores de multer específicamente
const handleUpload = (fieldName) => {
  return (req, res, next) => {
    const uploadSingle = upload.single(fieldName);
    
    uploadSingle(req, res, (err) => {
      if (err) {
        // error de Multer
        if (err.name === 'MulterError') {
          if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json(
              errorResponse('El archivo es demasiado grande a 5MB', 400)
            );
          }
          if (err.code === 'LIMIT_UNEXPECTED_FILE') {
            return res.status(400).json(
              errorResponse('Campo de archivo inesperado', 400)
            );
          }
          return res.status(400).json(
            errorResponse(`Error al subir archivo: ${err.message}`, 400)
          );
        }
        
        // otros errores (ej, tipo de archivo no permitido)
        return res.status(400).json(
          errorResponse(err.message, 400)
        );
      }
      
      // No hay error, continuar
      next();
    });
  };
};

module.exports = { handleUpload };