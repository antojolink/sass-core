const { getEnv } = require('./env');

function isXrayEnabled() {
  const nodeEnv = process.env.NODE_ENV || 'development';
  if (nodeEnv === 'test') {
    return false;
  }
  if (process.env.AWS_XRAY_DISABLED === 'true') {
    return false;
  }
  return true;
}

function getXray() {
  return require('aws-xray-sdk');
}

function openSegmentMiddleware() {
  if (!isXrayEnabled()) {
    return (req, res, next) => next();
  }
  const env = getEnv();
  const AWSXRay = getXray();
  return AWSXRay.express.openSegment(`antojolink-api-${env.appEnv || 'dev'}`);
}

function closeSegmentMiddleware() {
  if (!isXrayEnabled()) {
    return (req, res, next) => next();
  }
  const AWSXRay = getXray();
  return AWSXRay.express.closeSegment();
}

function capturePostgres(pgModule) {
  if (!isXrayEnabled()) {
    return pgModule;
  }
  const AWSXRay = getXray();
  return AWSXRay.capturePostgres(pgModule);
}

function captureAWSv3Client(client) {
  if (!isXrayEnabled()) {
    return client;
  }
  const AWSXRay = getXray();
  return AWSXRay.captureAWSv3Client(client);
}

module.exports = {
  isXrayEnabled,
  openSegmentMiddleware,
  closeSegmentMiddleware,
  capturePostgres,
  captureAWSv3Client,
};
