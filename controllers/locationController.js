const LocationModel = require('../models/locationModel');

class LocationController {
    static async getAll(req, res) {
        try {
            const iller = await LocationModel.getAll();
            res.json(iller);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    static async getByRegion(req, res) {
        try {
            const iller = await LocationModel.getByRegion(req.params.bolge);
            res.json(iller);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
}

module.exports = LocationController;
