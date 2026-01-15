const db = require('../config/db');

class SalesModel {
    static async getAll() {
        const query = `
            SELECT s.*, i.il_adi, i.bolge_adi 
            FROM satislar s 
            JOIN iller i ON s.il_id = i.il_id 
            ORDER BY s.satistoplam DESC
        `;
        const [rows] = await db.query(query);
        return rows;
    }

    static async getRegionSummary() {
        const query = `
            SELECT i.bolge_adi, 
                   SUM(s.satistoplam) as toplam_satis,
                   COUNT(DISTINCT i.il_id) as il_sayisi
            FROM satislar s 
            JOIN iller i ON s.il_id = i.il_id 
            GROUP BY i.bolge_adi 
            ORDER BY toplam_satis DESC
        `;
        const [rows] = await db.query(query);
        return rows;
    }

    static async getYearlyByCity(ilAdi) {
        const query = `
            SELECT 
                yıl as yil,
                SUM(satistoplam) as satis_sayisi
            FROM satislar s
            JOIN iller i ON s.il_id = i.il_id
            WHERE i.il_adi = ?
            GROUP BY yıl
            ORDER BY yıl DESC
            LIMIT 5
        `;
        const [rows] = await db.query(query, [ilAdi]);
        return rows;
    }

    static async getTotalSales() {
        const [rows] = await db.query('SELECT SUM(satistoplam) as total FROM satislar');
        return rows[0].total;
    }

    static async getCurrentYearSales() {
        const query = 'SELECT SUM(satistoplam) as yearly FROM satislar WHERE yıl = YEAR(CURRENT_DATE)';
        const [rows] = await db.query(query);
        return rows[0].yearly;
    }

    static async getPerformanceData() {
        const query = `
            SELECT yıl as year, satistoplam as total
            FROM satislar
            WHERE yıl >= YEAR(CURRENT_DATE) - 1
            ORDER BY yıl ASC
        `;
        const [rows] = await db.query(query);
        return rows;
    }
}

module.exports = SalesModel;
