const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API de Dreaming Flowers',
      version: '1.0.0',
      description: 'API REST para gestión de florerías con autenticación JWT',
      contact: {
        name: 'Rafael Villegas',
        email: 'rvillegas@utcancun.edu.mx'
      }
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 3000}`,
        description: 'Servidor de desarrollo'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Ingrese el token JWT'
        }
      },
      schemas: {
        Usuario: {
          type: 'object',
          required: ['nombre', 'correo_electronico', 'contrasenia'],
          properties: {
            id: { type: 'integer', example: 1 },
            nombre: { type: 'string', example: 'Juan Pérez' },
            correo_electronico: { type: 'string', format: 'email', example: 'juan@example.com' },
            contrasenia: { type: 'string', format: 'password', example: 'password123' },
            rol: { type: 'string', enum: ['admin', 'user'], example: 'user' },
            estatus: { type: 'integar', example: 1 }
          }
        },
        Floreria: {
          type: 'object',
          required: ['nombre', 'id_ciudad'],
          properties: {
            id: { type: 'integer', example: 1 },
            nombre: { type: 'string', example: 'Girasoles de LITIID' },
            descripcion: { type: 'string', example: 'Especialistas en arreglos florales de fin cuatrimestral' },
            logo: { type: 'string', example: 'logo_1234567890.jpg' },
            direccion: { type: 'string', example: 'BLvd Luis Donaldo Colosio' },
            telefono: { type: 'string', example: '998 1298 000' },
            correo_electronico: { type: 'string', format: 'email', example: 'contacto@girasoles.com' },
            horario: { type: 'string', example: 'Lun-Sab: 9:00-19:00' },
            estatus: { type: 'integer', enum: [0,1,2], example: '1' },
            id_ciudad: { type: 'integer', example: 1 }
          }
        },
        Error: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            message: { type: 'string', example: 'Error al procesar la petición' },
            statusCode: { type: 'integer', example: 400 }
          }
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ]
  },
  apis: ['./src/routes/*.js'] // OJO estos son los archivos donde están los comentarios de Swagger
};

const specs = swaggerJsdoc(options);

module.exports = { swaggerUi, specs };

