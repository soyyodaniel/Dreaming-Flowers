
const { query } = require('../config/database');

class Floreria {
  // crear florería
  static async create(floreriaData) {
    const {
      nombre,
      descripcion,
      logo,
      ubicacion,
      /*telefono,
      email,
      horario,*/
      estatus = 'activo',
      id_ciudad,
      id_usuario
    } = floreriaData;

    const sql = `
      INSERT INTO florerias 
      (nombre, descripcion, logo, ubicacion, estatus, id_ciudad, id_usuario) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const result = await query(sql, [
      nombre, descripcion, logo, ubicacion, telefono, correo, horario, estatus, id_ciudad, id_usuario
    ]);

    return this.findById(result.insertId);
  }

  // buscar por ID con información completa
  static async findById(id) {
    const sql = `
      SELECT 
        f.*,
        c.nombre AS ciudad_nombre,
        c.estado AS ciudad_estado,
        u.nombre AS usuario_nombre,
        u.correo_electronico AS usuario_email
      FROM florerias f
      INNER JOIN ciudades c ON f.id_ciudad = c.id
      INNER JOIN usuarios u ON f.id_usuario = u.id
      WHERE f.id = ?
      LIMIT 1
    `;
    const florerias = await query(sql, [id]);
    return florerias[0] || null;
  }

  // listar todas las florerías con paginación
  static async findAll(page = 1, limit = 10, filters = {}) {
    const offset = (page - 1) * limit;
    const conditions = [];
    const params = [];

    // filtros opcionales
    if (filters.estatus) {
      conditions.push('f.estatus = ?');
      params.push(filters.estatus);
    }

    if (filters.id_ciudad) {
      conditions.push('f.id_ciudad = ?');
      params.push(filters.id_ciudad);
    }

    if (filters.search) {
      conditions.push('(f.nombre LIKE ? OR f.descripcion LIKE ?)');
      params.push(`%${filters.search}%`, `%${filters.search}%`);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    // contar total
    const countSql = `SELECT COUNT(*) as total FROM florerias f ${whereClause}`;
    const [countResult] = await query(countSql, params);
    const total = countResult.total;

    // Obtener registros
    const sql = `
      SELECT 
        f.*,
        c.nombre AS ciudad_nombre,
        c.estado AS ciudad_estado,
        u.nombre AS usuario_nombre
      FROM florerias f
      INNER JOIN ciudades c ON f.id_ciudad = c.id
      INNER JOIN usuarios u ON f.id_usuario = u.id
      ${whereClause}
      LIMIT ? OFFSET ?
    `;

    const florerias = await query(sql, [...params, limit, offset]);

    return { florerias, total };
  }

  // buscar por ciudad
  static async findByCiudad(idCiudad) {
    const sql = `
      SELECT 
        f.*,
        c.nombre AS ciudad_nombre,
        u.nombre AS usuario_nombre
      FROM florerias f
      INNER JOIN ciudades c ON f.id_ciudad = c.id
      INNER JOIN usuarios u ON f.id_usuario = u.id
      WHERE f.id_ciudad = ?
      ORDER BY f.nombre
    `;
    return await query(sql, [idCiudad]);
  }

  // actualizar florería
  static async update(id, floreriaData) {
    const fields = [];
    const values = [];

    const allowedFields = [
      'nombre', 'descripcion', 'logo', 'ubicacion', 
      'telefono', 'email', 'horario', 'estatus', 'id_ciudad'
    ];

    allowedFields.forEach(field => {
      if (floreriaData[field] !== undefined) {
        fields.push(`${field} = ?`);
        values.push(floreriaData[field]);
      }
    });

    if (fields.length === 0) {
      return this.findById(id);
    }

    values.push(id);

    const sql = `UPDATE florerias SET ${fields.join(', ')} WHERE id = ?`;
    await query(sql, values);
    
    return this.findById(id);
  }

  // eliminar florería
  static async delete(id) {
    const sql = `DELETE FROM florerias WHERE id = ?`;
    const result = await query(sql, [id]);
    return result.affectedRows > 0;
  }

  // verificar si existe
  static async exists(id) {
    const sql = `SELECT id FROM florerias WHERE id = ? LIMIT 1`;
    const result = await query(sql, [id]);
    return result.length > 0;
  }

  // estadísticas
  static async getStats() {
    const sql = `
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN estatus = 1 THEN 1 ELSE 0 END) as activas,
        SUM(CASE WHEN estatus = 2 THEN 1 ELSE 0 END) as inactivas
      FROM florerias
    `;
    const [result] = await query(sql);
    return result;
  }
}

module.exports = Floreria;