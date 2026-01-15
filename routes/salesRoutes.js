const express = require('express');
const router = express.Router();
const SalesController = require('../controllers/salesController');

router.get('/', SalesController.getAll);
router.get('/bolge-ozeti', SalesController.getRegionSummary);
router.get('/yillik/:il', SalesController.getYearlyByCity);

// Moving the debug route here or to a separate debug route?
// App.js had /api/debug/satislar-yapisi. I'll put it here but maybe underscore it.
// Or just put it under /debug/ structure?
// I'll keep it simple:
// Note: The original path was /api/debug/... 
// If this file is mounted at /api/satislar, the path would be /api/satislar/debug...
// I'll handle mount points in `routes/index.js` or `app.js`. 
// If I mount this at `/api/satislar`, then I can't easily put `/api/debug` here without it being `/api/satislar/debug`.
// I'll create a separate `debugRoutes` if I want to replicate exact paths, OR update the frontend to point to new paths.
// Since I can't touch frontend code in `public/`, I MUST maintain the exact API routes.
// /api/satislar -> GET /
// /api/satislar/bolge-ozeti -> GET /bolge-ozeti
// /api/debug/satislar-yapisi -> This is tricky.
// I will create `routes/debugRoutes.js`.

module.exports = router;
