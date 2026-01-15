const db = require('../config/db');

class AnalyticsModel {
    static async getCityAdequacy() {
        const query = `
            SELECT 
                i.il_id,
                i.il_adi,
                COALESCE(s.satistoplam, 0) as satis,
                (
                    SELECT COUNT(*) 
                    FROM chery_teknik_servis ts 
                    WHERE ts.il_id = i.il_id
                ) as servis_sayisi
            FROM iller i
            LEFT JOIN satislar s ON i.il_id = s.il_id
        `;
        const [rows] = await db.query(query);
        return rows;
    }

    static async getRegionComparison(bolgeler) {
        if (bolgeler.length === 0) return [];

        // Dynamic placeholder generation
        const placeholders = bolgeler.map(() => '?').join(',');

        const query = `
            SELECT 
                i.bolge_adi,
                COUNT(DISTINCT ts.servis_adi) as servis_sayisi,
                COUNT(DISTINCT i.il_id) as il_sayisi,
                COALESCE(SUM(s.satistoplam), 0) as toplam_satis,
                COALESCE(SUM(s.satistoplam), 0) as toplam_arac,
                (
                    SELECT COUNT(*) 
                    FROM chery_teknik_servis ts2 
                    JOIN iller i2 ON ts2.il_id = i2.il_id 
                    WHERE i2.bolge_adi = i.bolge_adi
                ) as toplam_servis
            FROM iller i
            LEFT JOIN satislar s ON i.il_id = s.il_id
            LEFT JOIN chery_teknik_servis ts ON i.il_id = ts.il_id
            WHERE i.bolge_adi IN (${placeholders})
            GROUP BY i.bolge_adi
        `;

        const [rows] = await db.query(query, bolgeler);
        return rows;
    }
}

module.exports = AnalyticsModel;
