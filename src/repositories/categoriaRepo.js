const db = require('../db/knex');

function mapCategoria(row) {
  if (!row) {
    return null;
  }
  return {
    id: row.id,
    restauranteId: row.restaurante_id,
    nombre: row.nombre,
    orden: row.orden,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

async function findAllByTenant(tenantId) {
  const rows = await db('categorias')
    .where({ restaurante_id: tenantId })
    .orderBy([
      { column: 'orden', order: 'asc' },
      { column: 'created_at', order: 'asc' },
    ]);
  return rows.map(mapCategoria);
}

async function findByIdAndTenant(id, tenantId) {
  const row = await db('categorias').where({ id, restaurante_id: tenantId }).first();
  return mapCategoria(row);
}

async function create(tenantId, { nombre, orden = 0 }) {
  const [row] = await db('categorias')
    .insert({
      restaurante_id: tenantId,
      nombre,
      orden,
    })
    .returning('*');
  return mapCategoria(row);
}

async function update(id, tenantId, data) {
  const updates = { updated_at: db.fn.now() };
  if (data.nombre !== undefined) {
    updates.nombre = data.nombre;
  }
  if (data.orden !== undefined) {
    updates.orden = data.orden;
  }

  const [row] = await db('categorias')
    .where({ id, restaurante_id: tenantId })
    .update(updates)
    .returning('*');
  return mapCategoria(row);
}

async function remove(id, tenantId) {
  const count = await db('categorias').where({ id, restaurante_id: tenantId }).del();
  return count > 0;
}

module.exports = {
  mapCategoria,
  findAllByTenant,
  findByIdAndTenant,
  create,
  update,
  remove,
};
