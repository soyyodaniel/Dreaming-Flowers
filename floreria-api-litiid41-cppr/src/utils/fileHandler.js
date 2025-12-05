const fs = require('fs');
const path = require('path');

// Definir la ruta física donde se guardan los archivos
// Subimos 2 niveles desde 'src/utils' para llegar a la raíz y entrar a 'uploads/logos'
const uploadDir = path.join(__dirname, '../../uploads/logos');

// 1. Eliminar archivo físico
const deleteFile = (filename) => {
  try {
    // Si viene la ruta completa, extraemos solo el nombre del archivo
    const name = path.basename(filename);
    const filePath = path.join(uploadDir, name);

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

// 2. Obtener ruta física (para uso interno del servidor)
const getFilePath = (filename) => {
  return path.join(uploadDir, filename);
};

// 3. Verificar si el archivo existe
const fileExists = (filename) => {
  const filePath = getFilePath(filename);
  return fs.existsSync(filePath);
};

// 4. Obtener URL pública (CORREGIDO)
// Ahora devolvemos una ruta RELATIVA (empieza con /)
// El frontend se encargará de ponerle el http://localhost:3000 antes.
const getFileUrl = (req, filename) => {
  if (!filename) return null;
  // Esto genera: "/uploads/logos/mi-imagen.jpg"
  return `/uploads/logos/${filename}`;
};

module.exports = {
  deleteFile,
  getFilePath,
  fileExists,
  getFileUrl
};