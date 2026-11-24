const db = require('../db/knex');

function mapProducto(row) {
  if (!row) {
    return null;
  }
  return {
    id: row.id,
    categoriaId: row.categoria_id,
    restauranteId: row.restaurante_id,
    nombre: row.nombre,
    descripcion: row.descripcion,
    precio: Number(row.precio).toFixed(2),
    disponible: row.disponible,
    imagenUrl: row.imagen_url,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

async function findAllByTenant(tenantId, { categoriaId } = {}) {
  const query = db('productos').where({ restaurante_id: tenantId });
  if (categoriaId) {
    query.andWhere({ categoria_id: categoriaId });
  }
  const rows = await query.orderBy('created_at', 'asc');
  return rows.map(mapProducto);
}

async function findByIdAndTenant(id, tenantId) {
  const row = await db('productos').where({ id, restaurante_id: tenantId }).first();
  return mapProducto(row);
}

async function create(
  tenantId,
  { categoriaId, nombre, descripcion = null, precio, disponible = true, imagenUrl = null }
) {
  const [row] = await db('productos')
    .insert({
      restaurante_id: tenantId,
      categoria_id: categoriaId,
      nombre,
      descripcion,
      precio,
      disponible,
      imagen_url: imagenUrl,
    })
    .returning('*');
  return mapProducto(row);
}

async function update(id, tenantId, data) {
  const updates = { updated_at: db.fn.now() };
  if (data.categoriaId !== undefined) {
    updates.categoria_id = data.categoriaId;
  }
  if (data.nombre !== undefined) {
    updates.nombre = data.nombre;
  }
  if (data.descripcion !== undefined) {
    updates.descripcion = data.descripcion;
  }
  if (data.precio !== undefined) {
    updates.precio = data.precio;
  }
  if (data.disponible !== undefined) {
    updates.disponible = data.disponible;
  }
  if (data.imagenUrl !== undefined) {
    updates.imagen_url = data.imagenUrl;
  }

  const [row] = await db('productos')
    .where({ id, restaurante_id: tenantId })
    .update(updates)
    .returning('*');
  return mapProducto(row);
}

async function updateDisponibilidad(id, tenantId, disponible) {
  const [row] = await db('productos')
    .where({ id, restaurante_id: tenantId })
    .update({
      disponible,
      updated_at: db.fn.now(),
    })
    .returning('*');
  return mapProducto(row);
}

async function remove(id, tenantId) {
  const count = await db('productos').where({ id, restaurante_id: tenantId }).del();
  return count > 0;
}

module.exports = {
  mapProducto,
  findAllByTenant,
  findByIdAndTenant,
  create,
  update,
  updateDisponibilidad,
  remove,
};
