const db = require('../config/db');

class ServiceModel {
    static async getAll() {
        const query = `
            SELECT ts.*, i.il_adi, i.bolge_adi 
            FROM chery_teknik_servis ts 
            JOIN iller i ON ts.il_id = i.il_id 
            ORDER BY i.il_adi, ts.servis_adi
        `;
        const [rows] = await db.query(query);
        return rows;
    }

    static async getByCityId(ilId) {
        const query = `
            SELECT ts.*, i.il_adi, i.bolge_adi 
            FROM chery_teknik_servis ts 
            JOIN iller i ON ts.il_id = i.il_id 
            WHERE ts.il_id = ?
        `;
        const [rows] = await db.query(query, [ilId]);
        return rows;
    }

    static async create({ servis_adi, il_id, ilce_adi }) {
        const query = 'INSERT INTO chery_teknik_servis (servis_adi, il_id, ilce_adi) VALUES (?, ?, ?)';
        const [result] = await db.query(query, [servis_adi, il_id, ilce_adi]);
        return result.insertId;
    }

    static async deleteByName(servis_adi) {
        const [result] = await db.query('DELETE FROM chery_teknik_servis WHERE servis_adi = ?', [servis_adi]);
        return result.affectedRows;
    }

    // New feature: Update
    static async update(id, { servis_adi, ilce_adi }) {
        // Assuming we update by ID mostly, but table structure from app.js suggests we might not have ID on frontend easily?
        // Wait, app.js insert returns `id: result.insertId`. So ID exists.
        const query = 'UPDATE chery_teknik_servis SET servis_adi = ?, ilce_adi = ? WHERE id = ?';
        const [result] = await db.query(query, [servis_adi, ilce_adi, id]);
        return result.affectedRows;
    }

    static async getCount() {
        const [rows] = await db.query('SELECT COUNT(*) as active FROM chery_teknik_servis');
        return rows[0].active;
    }

    static async getServiceStatsByRegion(bolgeler) {
        // Complex query handling for region comparison
        // Using '?' array expansion
        if (bolgeler.length === 0) return [];

        // This logic was in bolge-karsilastirma route, it involves joins.
        // Since it joins iller, satislar, and servis, it's a bit of an aggregate.
        // I might put this in a dedicated AnalyticsModel or keep it in ServiceModel if it's service-centric, 
        // but it aggregates sales too. 
        // Let's create `AnalyticsModel.js` for complex aggregations.
        return [];
    }
}

module.exports = ServiceModel;
