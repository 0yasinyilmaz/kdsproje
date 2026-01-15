const express = require('express');
const router = express.Router();
const ServiceController = require('../controllers/serviceController');

router.get('/', ServiceController.getAll);
router.get('/il/:ilId', ServiceController.getByCity);
router.post('/ekle', ServiceController.create);
router.delete('/sil/:id', ServiceController.delete);
router.put('/guncelle/:id', ServiceController.update); // New missing feature

module.exports = router;
