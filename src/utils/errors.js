class AppError extends Error {
  constructor(statusCode, code, message, details = []) {
    super(message);
    this.name = 'AppError';
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
  }
}

function validationError(message = 'Validation error', details = []) {
  return new AppError(400, 'VALIDATION_ERROR', message, details);
}

function unauthorizedError(message = 'Unauthorized') {
  return new AppError(401, 'UNAUTHORIZED', message);
}

function tenantRequiredError(message = 'Restaurant tenant is required') {
  return new AppError(403, 'TENANT_REQUIRED', message);
}

function notFoundError(message = 'Resource not found') {
  return new AppError(404, 'NOT_FOUND', message);
}

function conflictError(message = 'Resource conflict', details = []) {
  return new AppError(409, 'CONFLICT', message, details);
}

module.exports = {
  AppError,
  validationError,
  unauthorizedError,
  tenantRequiredError,
  notFoundError,
  conflictError,
};
