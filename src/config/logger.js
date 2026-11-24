const pino = require('pino');
const pinoHttp = require('pino-http');

function createLogger(options = {}) {
  const isTest = (process.env.NODE_ENV || 'development') === 'test';

  return pino(
    {
      level: options.level || (isTest ? 'silent' : 'info'),
      formatters: {
        level(label) {
          return { level: label };
        },
      },
      ...options.pinoOptions,
    },
    options.destination
  );
}

function createHttpLogger(loggerInstance) {
  return pinoHttp({
    logger: loggerInstance,
    customProps(req) {
      return {
        traceId: req.headers['x-amzn-trace-id'] || req.traceId || null,
      };
    },
    serializers: {
      req(req) {
        return {
          method: req.method,
          url: req.url,
        };
      },
      res(res) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  });
}

const logger = createLogger();

module.exports = {
  logger,
  createLogger,
  createHttpLogger,
};
