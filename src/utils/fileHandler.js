const fs = require('fs');
const path = require('path');

// eliminar archivo
const deleteFile = (filePath) => {
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log(`Archivo eliminado: ${filePath}`);
      return true;
    }
    return false;
  } catch (error) {
    console.error(`Error al eliminar archivo: ${error.message}`);
    return false;
  }
};

// obtener ruta completa del archivo
const getFilePath = (filename) => {
  const uploadDir = process.env.UPLOAD_PATH || './uploads/logos';
  return path.join(uploadDir, filename);
};

// verifica si el archivo existe
const fileExists = (filename) => {
  const filePath = getFilePath(filename);
  return fs.existsSync(filePath);
};

// obtener url pública del archivo
const getFileUrl = (req, filename) => {
  if (!filename) return null;
  const protocol = req.protocol;
  const host = req.get('host');
  return `${protocol}://${host}/uploads/logos/${filename}`;
};

module.exports = {
  deleteFile,
  getFilePath,
  fileExists,
  getFileUrl
};