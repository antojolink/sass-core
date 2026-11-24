const { createApp } = require('./app');
const { getEnv } = require('./config/env');
const { logger } = require('./config/logger');

const env = getEnv();
const app = createApp({ logger });

const server = app.listen(env.port, () => {
  logger.info({ port: env.port, env: env.nodeEnv }, 'AntojoLink API server started');
});

function shutdown(signal) {
  logger.info({ signal }, 'Shutting down server');
  server.close(() => {
    process.exit(0);
  });
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

module.exports = server;
