const restauranteService = require('../services/restauranteService');

async function createRestaurante(req, res, next) {
  try {
    const result = await restauranteService.createRestaurante(req.user, req.body);
    return res.status(201).json(result);
  } catch (err) {
    return next(err);
  }
}

async function getMyRestaurante(req, res, next) {
  try {
    const result = await restauranteService.getMyRestaurante(req.tenantId);
    return res.status(200).json(result);
  } catch (err) {
    return next(err);
  }
}

async function updateMyRestaurante(req, res, next) {
  try {
    const result = await restauranteService.updateMyRestaurante(req.tenantId, req.body);
    return res.status(200).json(result);
  } catch (err) {
    return next(err);
  }
}

async function getPublicMenu(req, res, next) {
  try {
    const result = await restauranteService.getPublicMenuBySlug(req.params.slug);
    return res.status(200).json(result);
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  createRestaurante,
  getMyRestaurante,
  updateMyRestaurante,
  getPublicMenu,
};
