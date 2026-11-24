const express = require('express');
const restauranteController = require('../controllers/restauranteController');

const router = express.Router();

router.get('/restaurantes/:slug/menu', restauranteController.getPublicMenu);

module.exports = router;
