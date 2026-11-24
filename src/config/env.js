require('dotenv').config();

function parseCorsOrigins(raw) {
  if (!raw) {
    return [];
  }
  return raw
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);
}

function getEnv() {
  return {
    nodeEnv: process.env.NODE_ENV || 'development',
    appEnv: process.env.APP_ENV || 'dev',
    port: Number(process.env.PORT) || 3000,
    databaseUrl: process.env.DATABASE_URL || 'postgres://antojolink:antojolink@localhost:5432/antojolink',
    cognitoUserPoolId: process.env.COGNITO_USER_POOL_ID || '',
    cognitoClientId: process.env.COGNITO_CLIENT_ID || '',
    awsRegion: process.env.AWS_REGION || 'us-east-1',
    imagesBucket: process.env.IMAGES_BUCKET || '',
    imagesBaseUrl: process.env.IMAGES_BASE_URL || '',
    corsOrigins: parseCorsOrigins(process.env.CORS_ORIGINS),
    awsXrayDaemonAddress: process.env.AWS_XRAY_DAEMON_ADDRESS || '',
    devAuthBypass: process.env.DEV_AUTH_BYPASS === 'true',
  };
}

module.exports = {
  getEnv,
  parseCorsOrigins,
};
