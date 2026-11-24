const productoRepo = require('../repositories/productoRepo');
const categoriaRepo = require('../repositories/categoriaRepo');
const { notFoundError } = require('../utils/errors');

async function listProductos(tenantId, filters = {}) {
  return productoRepo.findAllByTenant(tenantId, filters);
}

async function createProducto(tenantId, data) {
  const categoria = await categoriaRepo.findByIdAndTenant(data.categoriaId, tenantId);
  if (!categoria) {
    throw notFoundError('Category not found');
  }
  return productoRepo.create(tenantId, data);
}

async function updateProducto(tenantId, id, data) {
  if (data.categoriaId !== undefined) {
    const categoria = await categoriaRepo.findByIdAndTenant(data.categoriaId, tenantId);
    if (!categoria) {
      throw notFoundError('Category not found');
    }
  }

  const updated = await productoRepo.update(id, tenantId, data);
  if (!updated) {
    throw notFoundError('Product not found');
  }
  return updated;
}

async function setDisponibilidad(tenantId, id, disponible) {
  const updated = await productoRepo.updateDisponibilidad(id, tenantId, disponible);
  if (!updated) {
    throw notFoundError('Product not found');
  }
  return updated;
}

async function deleteProducto(tenantId, id) {
  const deleted = await productoRepo.remove(id, tenantId);
  if (!deleted) {
    throw notFoundError('Product not found');
  }
}

module.exports = {
  listProductos,
  createProducto,
  updateProducto,
  setDisponibilidad,
  deleteProducto,
};
