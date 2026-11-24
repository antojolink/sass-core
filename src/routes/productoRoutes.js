const express = require('express');
const { requireAuth } = require('../middlewares/requireAuth');
const { requireTenant } = require('../middlewares/requireTenant');
const { validate } = require('../middlewares/validate');
const { uuidParamSchema } = require('../validators/common');
const {
  listProductosQuerySchema,
  createProductoSchema,
  updateProductoSchema,
  disponibilidadSchema,
} = require('../validators/productoValidator');
const productoController = require('../controllers/productoController');

const router = express.Router();

router.use(requireAuth, requireTenant);

router.get('/', validate({ query: listProductosQuerySchema }), productoController.listProductos);

router.post('/', validate({ body: createProductoSchema }), productoController.createProducto);

router.put(
  '/:id',
  validate({ params: uuidParamSchema, body: updateProductoSchema }),
  productoController.updateProducto
);

router.patch(
  '/:id/disponibilidad',
  validate({ params: uuidParamSchema, body: disponibilidadSchema }),
  productoController.setDisponibilidad
);

router.delete('/:id', validate({ params: uuidParamSchema }), productoController.deleteProducto);

module.exports = router;
