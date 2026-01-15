const express = require('express');
const router = express.Router();
const LocationController = require('../controllers/locationController');

router.get('/', LocationController.getAll);
router.get('/bolge/:bolge', LocationController.getByRegion);

module.exports = router;
