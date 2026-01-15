const db = require('../config/db');

class LocationModel {
    static async getAll() {
        const [rows] = await db.query('SELECT * FROM iller ORDER BY il_adi');
        return rows;
    }

    static async getByRegion(bolge) {
        const [rows] = await db.query('SELECT * FROM iller WHERE bolge_adi = ? ORDER BY il_adi', [bolge]);
        return rows;
    }

    static async getByName(ilAdi) {
        const [rows] = await db.query('SELECT il_id FROM iller WHERE il_adi = ?', [ilAdi]);
        return rows[0];
    }
}

module.exports = LocationModel;
