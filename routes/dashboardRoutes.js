const express = require('express');
const router = express.Router();
const DashboardController = require('../controllers/dashboardController');

router.get('/stats', DashboardController.getStats);
router.get('/performance', DashboardController.getPerformance);

module.exports = router;
