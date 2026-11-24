const productoService = require('../services/productoService');

async function listProductos(req, res, next) {
  try {
    const items = await productoService.listProductos(req.tenantId, {
      categoriaId: req.query.categoriaId,
    });
    return res.status(200).json(items);
  } catch (err) {
    return next(err);
  }
}

async function createProducto(req, res, next) {
  try {
    const item = await productoService.createProducto(req.tenantId, req.body);
    return res.status(201).json(item);
  } catch (err) {
    return next(err);
  }
}

async function updateProducto(req, res, next) {
  try {
    const item = await productoService.updateProducto(req.tenantId, req.params.id, req.body);
    return res.status(200).json(item);
  } catch (err) {
    return next(err);
  }
}

async function setDisponibilidad(req, res, next) {
  try {
    const item = await productoService.setDisponibilidad(
      req.tenantId,
      req.params.id,
      req.body.disponible
    );
    return res.status(200).json(item);
  } catch (err) {
    return next(err);
  }
}

async function deleteProducto(req, res, next) {
  try {
    await productoService.deleteProducto(req.tenantId, req.params.id);
    return res.status(204).send();
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  listProductos,
  createProducto,
  updateProducto,
  setDisponibilidad,
  deleteProducto,
};
