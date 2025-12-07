API de Florerías - Dreaming Flowers

Información del Proyecto
Cliente: Dreaming Flowers
Equipo: 6 floreria-api-litiid41-cppr
Director: Rafael Villegas
Fecha Inicio: 17/11/2025

Equipo de Desarrollo
Tech Lead: Daniel Astudillo
Hector Partido Flores
David Pirin Solis
Victor Manuel Canche Che

Estructura del Proyecto

Páginas Web (Frontend)
frontend/index.html - Página principal (Catálogo público y florería aleatoria)
frontend/login.html - Acceso de usuarios y administradores
frontend/register.html - Registro de usuarios
frontend/admin.html - Panel de control y gestión (Dashboard)

Estilos CSS
frontend/css/public.css - Estilos para la vista del cliente (Diseño Rosa)
frontend/css/admin.css - Estilos para el panel administrativo
frontend/css/styles.css - Estilos generales y login

Scripts JavaScript
frontend/js/public.js - Lógica del catálogo, paginación y ruleta
frontend/js/admin.js - Lógica del dashboard, estadísticas y CRUD
frontend/js/login.js - Autenticación y manejo de tokens
frontend/js/register.js - Creación de usuarios y administradores

Backend (API REST)
src/app.js - Configuración principal del servidor Express
src/controllers/ - Controladores de lógica de negocio (Florerías, Auth)
src/models/ - Modelos de acceso a datos (MySQL Queries)
src/routes/ - Definición de endpoints de la API

Base de Datos
database/schema.sql - Esquema de tablas y datos iniciales

Configuración
src/config/database.js - Conexión a MySQL
src/config/multer.js - Configuración de subida de archivos
.env - Variables de entorno (Credenciales)

Objetivos del Sprint
[x] Setup del repositorio y estructura de carpetas
[x] Implementación de API REST con Node.js y Express
[x] Base de Datos MySQL con relaciones
[x] Autenticación segura con JWT (Login/Admin)
[x] Frontend Público con módulo de "Florería aleatoria"
[x] Panel Administrativo con CRUD y Estadísticas
[x] Integración final y pruebas

📞 Contacto
Director de Desarrollo: 24393225@utcancun.edu.mx