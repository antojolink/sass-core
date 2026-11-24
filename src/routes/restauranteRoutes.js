const express = require('express');
const { requireAuth } = require('../middlewares/requireAuth');
const { requireTenant } = require('../middlewares/requireTenant');
const { validate } = require('../middlewares/validate');
const {
  createRestauranteSchema,
  updateRestauranteSchema,
} = require('../validators/restauranteValidator');
const restauranteController = require('../controllers/restauranteController');

const router = express.Router();

router.post(
  '/',
  requireAuth,
  validate({ body: createRestauranteSchema }),
  restauranteController.createRestaurante
);

router.get('/me', requireAuth, requireTenant, restauranteController.getMyRestaurante);

router.put(
  '/me',
  requireAuth,
  requireTenant,
  validate({ body: updateRestauranteSchema }),
  restauranteController.updateMyRestaurante
);

module.exports = router;
