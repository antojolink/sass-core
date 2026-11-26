const db = require('../db/knex');

function mapRestaurante(row) {
  if (!row) {
    return null;
  }
  return {
    id: row.id,
    nombre: row.nombre,
    slug: row.slug,
    temaColor: row.tema_color,
    plantilla: row.plantilla || 'trattoria',
    logoUrl: row.logo_url,
    telefono: row.telefono,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

async function findById(id) {
  const row = await db('restaurantes').where({ id }).first();
  return mapRestaurante(row);
}

async function findBySlug(slug) {
  const row = await db('restaurantes').where({ slug }).first();
  return mapRestaurante(row);
}

async function create({ nombre, slug, temaColor, plantilla, logoUrl = null, telefono = null }) {
  const payload = {
    nombre,
    slug,
    logo_url: logoUrl,
    telefono,
  };
  if (temaColor !== undefined) {
    payload.tema_color = temaColor;
  }
  if (plantilla !== undefined) {
    payload.plantilla = plantilla;
  }
  const [row] = await db('restaurantes').insert(payload).returning('*');
  return mapRestaurante(row);
}

async function update(id, data) {
  const updates = { updated_at: db.fn.now() };
  if (data.nombre !== undefined) {
    updates.nombre = data.nombre;
  }
  if (data.temaColor !== undefined) {
    updates.tema_color = data.temaColor;
  }
  if (data.plantilla !== undefined) {
    updates.plantilla = data.plantilla;
  }
  if (data.logoUrl !== undefined) {
    updates.logo_url = data.logoUrl;
  }
  if (data.telefono !== undefined) {
    updates.telefono = data.telefono;
  }

  const [row] = await db('restaurantes').where({ id }).update(updates).returning('*');
  return mapRestaurante(row);
}

module.exports = {
  mapRestaurante,
  findById,
  findBySlug,
  create,
  update,
};
