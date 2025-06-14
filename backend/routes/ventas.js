const express = require('express');
const router = express.Router();
const controller = require('../controllers/ventasControllers');

router.post('/', controller.registrarVenta);

module.exports = router;
