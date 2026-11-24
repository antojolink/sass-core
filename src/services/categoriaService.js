const categoriaRepo = require('../repositories/categoriaRepo');
const { notFoundError } = require('../utils/errors');

async function listCategorias(tenantId) {
  return categoriaRepo.findAllByTenant(tenantId);
}

async function createCategoria(tenantId, data) {
  return categoriaRepo.create(tenantId, data);
}

async function updateCategoria(tenantId, id, data) {
  const updated = await categoriaRepo.update(id, tenantId, data);
  if (!updated) {
    throw notFoundError('Category not found');
  }
  return updated;
}

async function deleteCategoria(tenantId, id) {
  const deleted = await categoriaRepo.remove(id, tenantId);
  if (!deleted) {
    throw notFoundError('Category not found');
  }
}

module.exports = {
  listCategorias,
  createCategoria,
  updateCategoria,
  deleteCategoria,
};
