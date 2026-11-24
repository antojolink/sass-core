const { S3Client } = require('@aws-sdk/client-s3');
const { getEnv } = require('./env');
const { captureAWSv3Client } = require('./xray');

let cachedClient = null;
let cachedRegion = '';

function getS3Client() {
  const env = getEnv();
  if (!cachedClient || cachedRegion !== env.awsRegion) {
    const rawClient = new S3Client({
      region: env.awsRegion,
    });
    cachedClient = captureAWSv3Client(rawClient);
    cachedRegion = env.awsRegion;
  }
  return cachedClient;
}

module.exports = {
  getS3Client,
};
