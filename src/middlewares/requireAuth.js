const { CognitoJwtVerifier } = require('aws-jwt-verify');
const { getEnv } = require('../config/env');
const usuarioRepo = require('../repositories/usuarioRepo');
const { unauthorizedError } = require('../utils/errors');

let cachedVerifier = null;
let cachedKey = '';

function getVerifier(env) {
  const key = `${env.cognitoUserPoolId}:${env.cognitoClientId}`;
  if (!cachedVerifier || cachedKey !== key) {
    cachedVerifier = CognitoJwtVerifier.create({
      userPoolId: env.cognitoUserPoolId,
      tokenUse: null,
      clientId: env.cognitoClientId || null,
    });
    cachedKey = key;
  }
  return cachedVerifier;
}

async function resolveIdentity(req, env) {
  // DEV_AUTH_BYPASS is strictly allowed ONLY in development
  if (env.nodeEnv === 'development' && env.devAuthBypass && req.headers['x-dev-sub']) {
    return {
      sub: String(req.headers['x-dev-sub']),
      email: req.headers['x-dev-email']
        ? String(req.headers['x-dev-email'])
        : 'dev@antojolink.local',
    };
  }

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw unauthorizedError('Missing or invalid Authorization header');
  }

  const token = authHeader.slice(7).trim();
  if (!token) {
    throw unauthorizedError('Missing Bearer token');
  }

  try {
    const verifier = getVerifier(env);
    const payload = await verifier.verify(token);
    return {
      sub: payload.sub,
      email: payload.email || `${payload.sub}@cognito.local`,
    };
  } catch {
    throw unauthorizedError('Invalid or expired token');
  }
}

async function requireAuth(req, res, next) {
  try {
    const env = getEnv();
    const { sub, email } = await resolveIdentity(req, env);

    let usuario = await usuarioRepo.findByCognitoSub(sub);
    if (!usuario) {
      usuario = await usuarioRepo.create({
        cognitoSub: sub,
        email,
        rol: 'ADMIN',
      });
    }

    req.user = usuario;
    req.tenantId = usuario.restauranteId || null;
    return next();
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  requireAuth,
};
