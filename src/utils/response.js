const successResponse = (data, message = 'Operación exitosa', meta = {}) => {
  return {
    success: true,
    message,
    data,
    ...meta
  };
};

const errorResponse = (message = 'Error', statusCode = 500, errors = []) => {
  return {
    success: false,
    message,
    statusCode,
    ...(errors.length > 0 && { errors })
  };
};

const paginatedResponse = (data, page, limit, total) => {
  return {
    success: true,
    data,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total: total,
      totalPages: Math.ceil(total / limit)
    }
  };
};

module.exports = {
  successResponse,
  errorResponse,
  paginatedResponse
};