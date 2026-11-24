const { AppError, notFoundError } = require('../utils/errors');

function notFoundHandler(req, res, next) {
  next(notFoundError(`Route ${req.method} ${req.originalUrl} not found`));
}

function errorHandler(err, req, res, _next) {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      error: {
        code: err.code,
        message: err.message,
        details: err.details || [],
      },
    });
  }

  if (req.log && typeof req.log.error === 'function') {
    req.log.error({ err }, 'Unhandled application error');
  }

  return res.status(500).json({
    error: {
      code: 'INTERNAL_ERROR',
      message: 'Internal server error',
      details: [],
    },
  });
}

module.exports = {
  notFoundHandler,
  errorHandler,
};
