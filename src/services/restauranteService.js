const restauranteRepo = require('../repositories/restauranteRepo');
const usuarioRepo = require('../repositories/usuarioRepo');
const categoriaRepo = require('../repositories/categoriaRepo');
const productoRepo = require('../repositories/productoRepo');
const { generateSlug } = require('../utils/slug');
const { conflictError, notFoundError, validationError } = require('../utils/errors');

async function generateUniqueSlug(nombre) {
  const baseSlug = generateSlug(nombre);
  if (!baseSlug) {
    throw validationError('nombre must contain alphanumeric characters');
  }

  let candidate = baseSlug;
  let suffix = 2;

  while (await restauranteRepo.findBySlug(candidate)) {
    candidate = `${baseSlug}-${suffix}`;
    suffix += 1;
  }

  return candidate;
}

async function createRestaurante(user, data) {
  if (user.restauranteId) {
    throw conflictError('User already has a restaurant');
  }

  const slug = await generateUniqueSlug(data.nombre);
  const restaurante = await restauranteRepo.create({
    nombre: data.nombre,
    slug,
    temaColor: data.temaColor,
    logoUrl: data.logoUrl ?? null,
    telefono: data.telefono ?? null,
  });

  await usuarioRepo.updateRestauranteId(user.id, restaurante.id);
  return restaurante;
}

async function getMyRestaurante(tenantId) {
  const restaurante = await restauranteRepo.findById(tenantId);
  if (!restaurante) {
    throw notFoundError('Restaurant not found');
  }
  return restaurante;
}

async function updateMyRestaurante(tenantId, data) {
  const payload = {
    nombre: data.nombre,
    temaColor: data.temaColor,
    logoUrl: data.logoUrl,
    telefono: data.telefono,
  };
  const updated = await restauranteRepo.update(tenantId, payload);
  if (!updated) {
    throw notFoundError('Restaurant not found');
  }
  return updated;
}

async function getPublicMenuBySlug(slug) {
  const restaurante = await restauranteRepo.findBySlug(slug);
  if (!restaurante) {
    throw notFoundError('Restaurant not found');
  }

  const [categorias, productos] = await Promise.all([
    categoriaRepo.findAllByTenant(restaurante.id),
    productoRepo.findAllByTenant(restaurante.id),
  ]);

  const productosByCategoria = new Map();
  for (const prod of productos) {
    if (!productosByCategoria.has(prod.categoriaId)) {
      productosByCategoria.set(prod.categoriaId, []);
    }
    productosByCategoria.get(prod.categoriaId).push(prod);
  }

  const categoriasWithProductos = categorias.map((cat) => ({
    ...cat,
    productos: productosByCategoria.get(cat.id) || [],
  }));

  return {
    restaurante,
    categorias: categoriasWithProductos,
  };
}

module.exports = {
  createRestaurante,
  getMyRestaurante,
  updateMyRestaurante,
  getPublicMenuBySlug,
};
