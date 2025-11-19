const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Crear una carpeta para guardar los logos si no existe
const uploadDir = process.env.UPLOAD_PATH || './uploads/logos';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configura el almacenamiento
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Formato de Nombre: logo_fecha_numrandom.ext
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, `logo_${uniqueSuffix}${ext}`);
  }
});

// Validación de tipos de archivos permitidos para el logo
const fileFilter = (req, file, cb) => {
  const allowedTypes = process.env.ALLOWED_FILE_TYPES?.split(',') || [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp'
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`El tipo de archivo no es permitido, se recomiendan ${allowedTypes.join(', ')}`), false);
  }
};

// Configuración de multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024 // esto equivale a 5mb
  }
});

module.exports = upload;