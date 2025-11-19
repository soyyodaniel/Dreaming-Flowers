const express = require('express');
const cors = require('cors');
const path = require('path');
const authRoutes = require('./routes/authRoutes');
const floreriaRoutes = require('./routes/floreriaRoutes');
const errorHandler = require('./middlewares/errorHandler');
const { swaggerUi, specs } = require('./config/swagger');

const app = express(); 

// CORS
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true
}));

// formatos soportados
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ruta de logos
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// logger
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.path}`);
  next();
});

// SWAGGER
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: "API Florerías - Documentación"
}));


// ruta raíz
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Bienvenio a la API de Dreaming Flowers',
    version: '1.0.0',
    documentation: '/api-docs',
    endpoints: {
      auth: '/api/auth',
      florerias: '/api/florerias'
    }
  });
});
 

// rutas de la API
app.use('/api/auth', authRoutes);
app.use('/api/florerias', floreriaRoutes);
 

// middleware de errores - siembre va al final del códig
app.use(errorHandler);

module.exports = app;