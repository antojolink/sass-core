const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const { getEnv } = require('./config/env');
const { logger: defaultLogger, createHttpLogger } = require('./config/logger');
const { openSegmentMiddleware, closeSegmentMiddleware } = require('./config/xray');
const routes = require('./routes');
const { notFoundHandler, errorHandler } = require('./middlewares/errorHandler');

function createApp(options = {}) {
  const env = getEnv();
  const appLogger = options.logger || defaultLogger;
  const app = express();

  app.use(openSegmentMiddleware());
  app.use(helmet());
  app.use(
    cors({
      origin(origin, callback) {
        if (!origin) {
          return callback(null, true);
        }
        if (env.corsOrigins.includes(origin)) {
          return callback(null, true);
        }
        return callback(null, false);
      },
    })
  );
  app.use(express.json());
  app.use(createHttpLogger(appLogger));

  app.use(routes);

  if (env.nodeEnv !== 'production') {
    app.get('/debug/error', () => {
      throw new Error('Controlled debug error for APM verification');
    });
  }

  if (typeof options.extraRoutes === 'function') {
    const extraRouter = express.Router();
    options.extraRoutes(extraRouter);
    app.use(extraRouter);
  }

  app.use(notFoundHandler);
  app.use(closeSegmentMiddleware());
  app.use(errorHandler);

  return app;
}

module.exports = {
  createApp,
};
