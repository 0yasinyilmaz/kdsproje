const express = require('express');
const router = express.Router();
const SalesController = require('../controllers/salesController');

router.get('/satislar-yapisi', SalesController.getStructure);

module.exports = router;
