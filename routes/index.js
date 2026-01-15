const express = require('express');
const router = express.Router();

const locationRoutes = require('./locationRoutes');
const serviceRoutes = require('./serviceRoutes');
const salesRoutes = require('./salesRoutes');
const dashboardRoutes = require('./dashboardRoutes');
const analyticsRoutes = require('./analyticsRoutes');
const debugRoutes = require('./debugRoutes');
const SalesController = require('../controllers/salesController'); // For the odd one out

// Mount sub-routers
router.use('/iller', locationRoutes);
router.use('/teknik-servisler', (req, res, next) => {
    // Original: /api/teknik-servisler (GET)
    // But duplicate logic: /api/teknik-servisler/il/:ilId
    // AND /api/teknik-servis/ekle is different singular vs plural.
    // Let's look at app.js again.
    next();
}, require('./serviceRoutes')); // I'll fix serviceRoutes to handle /api/teknik-servisler paths

// Re-analyzing app.js paths:
// /api/iller -> locationRoutes
// /api/iller/bolge/:bolge -> locationRoutes

// /api/teknik-servisler -> GET (list)
// /api/teknik-servisler/il/:ilId -> GET (by city)

// /api/teknik-servis/ekle -> POST (add) !! Singular 'servis'
// /api/teknik-servis/sil/:id -> DELETE !! Singular 'servis'

// /api/satislar -> GET (list)
// /api/satislar/bolge-ozeti -> GET

// /api/satis/yillik/:il -> GET !! Singular 'satis'

// /api/dashboard/stats
// /api/dashboard/performance

// /api/il-yeterlilik
// /api/bolge-karsilastirma
// /api/debug/satislar-yapisi

// Strategy:
// Mount locationRoutes at /iller
// Mount serviceRoutes at /teknik-servisler
// MANUALLY handle /teknik-servis/ekle and /sil in the main api router or a separate 'singleServiceRouter' mounted at /teknik-servis
// Mount salesRoutes at /satislar
// MANUALLY handle /satis/yillik in api router or 'singleSalesRouter' mounted at /satis.

router.use('/iller', locationRoutes);

// Services (Plural)
const serviceListRouter = require('express').Router();
const ServiceController = require('../controllers/serviceController');
serviceListRouter.get('/', ServiceController.getAll);
serviceListRouter.get('/il/:ilId', ServiceController.getByCity);
router.use('/teknik-servisler', serviceListRouter);

// Service (Singular)
const serviceActionRouter = require('express').Router();
serviceActionRouter.post('/ekle', ServiceController.create);
serviceActionRouter.delete('/sil/:id', ServiceController.delete);
serviceActionRouter.put('/guncelle/:id', ServiceController.update);
router.use('/teknik-servis', serviceActionRouter);

// Sales (List - Plural)
router.use('/satislar', salesRoutes);

// Sales (Singular)
router.get('/satis/yillik/:il', SalesController.getYearlyByCity);

// Dashboard
router.use('/dashboard', dashboardRoutes);

// Analytics & Debug
router.use('/', analyticsRoutes); // Mounted at root of API so /api/il-yeterlilik works
router.use('/debug', debugRoutes);

module.exports = router;
