const SalesModel = require('../models/salesModel');

class SalesController {
    static async getAll(req, res) {
        try {
            const results = await SalesModel.getAll();
            res.json(results);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    static async getRegionSummary(req, res) {
        try {
            const results = await SalesModel.getRegionSummary();
            res.json(results);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    static async getYearlyByCity(req, res) {
        try {
            const results = await SalesModel.getYearlyByCity(req.params.il);
            res.json(results);
        } catch (err) {
            console.error('Yıllık satış verisi hatası:', err);
            res.status(500).json({ error: 'Veritabanı hatası' });
        }
    }

    // Debug endpoint from app.js
    static async getStructure(req, res) {
        // This was 'DESCRIBE satislar' in app.js
        // Ideally this shouldn't be in prod code, but I'll keep it as requested to maintain functionality
        const db = require('../config/db'); // Direct access just for this debug
        try {
            const [results] = await db.query('DESCRIBE satislar');
            res.json(results);
        } catch (err) {
            console.error('Tablo yapısı sorgulama hatası:', err);
            res.status(500).json({ error: 'Veritabanı hatası' });
        }
    }
}

module.exports = SalesController;
