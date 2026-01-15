const express = require('express');
const router = express.Router();
const DashboardController = require('../controllers/dashboardController');

// These will be mounted at /api/
router.get('/il-yeterlilik', DashboardController.getCityAdequacy);
router.get('/bolge-karsilastirma', DashboardController.getRegionComparison);

module.exports = router;
