const express = require('express');
const { getHealth } = require('../controllers/healthController');
const publicRoutes = require('./publicRoutes');
const restauranteRoutes = require('./restauranteRoutes');
const categoriaRoutes = require('./categoriaRoutes');
const productoRoutes = require('./productoRoutes');

const router = express.Router();

router.get('/health', getHealth);
router.use('/public', publicRoutes);
router.use('/restaurantes', restauranteRoutes);
router.use('/categorias', categoriaRoutes);
router.use('/productos', productoRoutes);

module.exports = router;
