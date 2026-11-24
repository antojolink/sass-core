const express = require('express');
const { requireAuth } = require('../middlewares/requireAuth');
const { requireTenant } = require('../middlewares/requireTenant');
const { validate } = require('../middlewares/validate');
const { uuidParamSchema } = require('../validators/common');
const {
  createCategoriaSchema,
  updateCategoriaSchema,
} = require('../validators/categoriaValidator');
const categoriaController = require('../controllers/categoriaController');

const router = express.Router();

router.use(requireAuth, requireTenant);

router.get('/', categoriaController.listCategorias);

router.post('/', validate({ body: createCategoriaSchema }), categoriaController.createCategoria);

router.put(
  '/:id',
  validate({ params: uuidParamSchema, body: updateCategoriaSchema }),
  categoriaController.updateCategoria
);

router.delete('/:id', validate({ params: uuidParamSchema }), categoriaController.deleteCategoria);

module.exports = router;
