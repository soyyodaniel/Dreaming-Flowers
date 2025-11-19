require('dotenv').config();
const app = require('./src/app');

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => { 
  console.log(`Servidor activo en http://localhost:${PORT}`);
  console.log(`Documentación Swagger: http://localhost:${PORT}/api-docs`);
  console.log(`Entorno: ${process.env.NODE_ENV || 'development'}`); 
});