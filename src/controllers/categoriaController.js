const categoriaService = require('../services/categoriaService');

async function listCategorias(req, res, next) {
  try {
    const items = await categoriaService.listCategorias(req.tenantId);
    return res.status(200).json(items);
  } catch (err) {
    return next(err);
  }
}

async function createCategoria(req, res, next) {
  try {
    const item = await categoriaService.createCategoria(req.tenantId, req.body);
    return res.status(201).json(item);
  } catch (err) {
    return next(err);
  }
}

async function updateCategoria(req, res, next) {
  try {
    const item = await categoriaService.updateCategoria(req.tenantId, req.params.id, req.body);
    return res.status(200).json(item);
  } catch (err) {
    return next(err);
  }
}

async function deleteCategoria(req, res, next) {
  try {
    await categoriaService.deleteCategoria(req.tenantId, req.params.id);
    return res.status(204).send();
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  listCategorias,
  createCategoria,
  updateCategoria,
  deleteCategoria,
};
