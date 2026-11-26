const db = require('../db/knex');

function mapUsuario(row) {
  if (!row) {
    return null;
  }
  return {
    id: row.id,
    cognitoSub: row.cognito_sub,
    email: row.email,
    rol: row.rol,
    restauranteId: row.restaurante_id,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

async function findByCognitoSub(cognitoSub) {
  const row = await db('usuarios').where({ cognito_sub: cognitoSub }).first();
  return mapUsuario(row);
}

async function findByEmail(email) {
  if (!email) {
    return null;
  }
  const row = await db('usuarios').where({ email: String(email).toLowerCase() }).first();
  return mapUsuario(row);
}

async function create({ cognitoSub, email, rol = 'ADMIN', restauranteId = null }) {
  const [row] = await db('usuarios')
    .insert({
      cognito_sub: cognitoSub,
      email: String(email).toLowerCase(),
      rol,
      restaurante_id: restauranteId,
    })
    .returning('*');
  return mapUsuario(row);
}

async function updateCognitoSub(userId, cognitoSub) {
  const [row] = await db('usuarios')
    .where({ id: userId })
    .update({
      cognito_sub: cognitoSub,
      updated_at: db.fn.now(),
    })
    .returning('*');
  return mapUsuario(row);
}

async function updateRestauranteId(userId, restauranteId) {
  const [row] = await db('usuarios')
    .where({ id: userId })
    .update({
      restaurante_id: restauranteId,
      updated_at: db.fn.now(),
    })
    .returning('*');
  return mapUsuario(row);
}

module.exports = {
  mapUsuario,
  findByCognitoSub,
  findByEmail,
  create,
  updateCognitoSub,
  updateRestauranteId,
};
