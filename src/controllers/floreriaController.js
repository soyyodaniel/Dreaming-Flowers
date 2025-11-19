const Floreria = require('../models/Floreria');
const { successResponse, errorResponse, paginatedResponse } = require('../utils/response');
const { deleteFile, getFilePath, getFileUrl } = require('../utils/fileHandler');

const floreriaController = {

  //. listar las florerias
  getAll: async (req, res, next) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      
      // filtros opcionales
      const filters = {
        estatus: req.query.estatus,
        id_ciudad: req.query.id_ciudad,
        search: req.query.search
      };

      const { florerias, total } = await Floreria.findAll(page, limit, filters);

      // agregar url completa del logo
      const floreriasWithUrls = florerias.map(floreria => ({
        ...floreria,
        logo_url: floreria.logo ? getFileUrl(req, floreria.logo) : null
      }));

      res.json(paginatedResponse(floreriasWithUrls, page, limit, total));
    } catch (error) {
      next(error);
    }
  },

  // detalles de una floreria
  getById: async (req, res, next) => {
    try {
      const { id } = req.params;
      const floreria = await Floreria.findById(id);

      if (!floreria) {
        return res.status(404).json(
          errorResponse('Florería no encontrada', 404)
        );
      }

      // agregar url del logo
      floreria.logo_url = floreria.logo ? getFileUrl(req, floreria.logo) : null;

      res.json(successResponse(floreria, 'Florería encontrada'));
    } catch (error) {
      next(error);
    }
  },

  // crear floreria
  create: async (req, res, next) => {
    try {
      const floreriaData = {
        ...req.body,
        logo: req.file ? req.file.filename : null, // nombre del archivo subido
        id_usuario: req.user.userId //viene del middleware auth
      };

      const newFloreria = await Floreria.create(floreriaData);

      // agrega url del logo
      newFloreria.logo_url = newFloreria.logo ? getFileUrl(req, newFloreria.logo) : null;

      res.status(201).json(
        successResponse(newFloreria, 'Florería creada exitosamente')
      );
    } catch (error) {
      // si surge un error, eliminar el archivo subido
      if (req.file) {
        deleteFile(getFilePath(req.file.filename));
      }
      next(error);
    }
  },

  // actualizar floreria
  update: async (req, res, next) => {
    try {
      const { id } = req.params;

      // verificar que la florería existe
      const floreria = await Floreria.findById(id);
      if (!floreria) {
        // si hay nuevo archivo se elimina el anterior
        if (req.file) {
          deleteFile(getFilePath(req.file.filename));
        }
        return res.status(404).json(
          errorResponse('Florería no encontrada', 404)
        );
      }

      // verificar que solo el que lo creó lo puede editar
      if (req.user.rol !== 'admin' && floreria.id_usuario !== req.user.userId) {
        if (req.file) {
          deleteFile(getFilePath(req.file.filename));
        }
        return res.status(403).json(
          errorResponse('No tienes permisos para editar esta florería', 403)
        );
      }

      const updateData = { ...req.body };

      // si hay nuevo logo, actualizar y eliminar el anterior
      if (req.file) {
        // eliminar logo anterior si existe
        if (floreria.logo) {
          deleteFile(getFilePath(floreria.logo));
        }
        updateData.logo = req.file.filename;
      }

      const updatedFloreria = await Floreria.update(id, updateData);

      // agregar url del logo
      updatedFloreria.logo_url = updatedFloreria.logo 
        ? getFileUrl(req, updatedFloreria.logo) 
        : null;

      res.json(
        successResponse(updatedFloreria, 'Florería actualizada exitosamente')
      );
    } catch (error) {
      // si hay error, eliminar el nuevo archivo
      if (req.file) {
        deleteFile(getFilePath(req.file.filename));
      }
      next(error);
    }
  },

  // eliminar floreria
  delete: async (req, res, next) => {
    try {
      const { id } = req.params;

      // verificar que la florería existe
      const floreria = await Floreria.findById(id);
      if (!floreria) {
        return res.status(404).json(
          errorResponse('Florería no encontrada', 404)
        );
      }

      // verificar permisos de liminacion
      if (req.user.rol !== 'admin' && floreria.id_usuario !== req.user.userId) {
        return res.status(403).json(
          errorResponse('No tienes permisos para eliminar esta florería', 403)
        );
      }

      // eliminar logo si existe
      if (floreria.logo) {
        deleteFile(getFilePath(floreria.logo));
      }

      // eliminar florería
      await Floreria.delete(id);

      res.json(
        successResponse(null, 'Florería eliminada exitosamente')
      );
    } catch (error) {
      next(error);
    }
  },
 
 
};

module.exports = floreriaController;