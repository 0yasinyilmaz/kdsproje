const SalesModel = require('../models/salesModel');
const ServiceModel = require('../models/serviceModel');
const AnalyticsModel = require('../models/analyticsModel');
const { hesaplaServisYeterliligi, hesaplaBolgePerformansi } = require('../utils/calculations');

class DashboardController {
    static async getStats(req, res) {
        try {
            const [totalSales, yearlySales, activeServices] = await Promise.all([
                SalesModel.getTotalSales(),
                SalesModel.getCurrentYearSales(),
                ServiceModel.getCount()
            ]);

            res.json({
                totalSales: totalSales || 0,
                yearlySales: yearlySales || 0,
                activeServices: activeServices || 0
            });
        } catch (error) {
            console.error('Dashboard stats error:', error);
            res.status(500).json({ error: 'Veritabanı hatası' });
        }
    }

    static async getPerformance(req, res) {
        try {
            const results = await SalesModel.getPerformanceData();
            res.json(results);
        } catch (error) {
            console.error('Performance data error:', error);
            res.status(500).json({ error: 'Veritabanı hatası' });
        }
    }

    static async getCityAdequacy(req, res) {
        try {
            const results = await AnalyticsModel.getCityAdequacy();
            const processedResults = results.map(il => {
                const aracSayisi = il.satis;
                const servisSayisi = il.servis_sayisi;
                const kapasite = servisSayisi * 500;
                const dagilimPuani = servisSayisi > 1 ? 0.8 : 0.4;

                const sonuc = hesaplaServisYeterliligi(
                    aracSayisi || 1,
                    servisSayisi,
                );

                return {
                    ...il,
                    yeterlilik_durumu: sonuc?.degerlendirme || 'Teknik Servis Yok',
                    yeterlilik_orani: sonuc?.skor || 0
                };
            });

            res.json(processedResults);
        } catch (error) {
            console.error('İl yeterlilik hesaplama hatası:', error);
            res.status(500).json({ error: 'Veritabanı hatası' });
        }
    }

    static async getRegionComparison(req, res) {
        try {
            const bolgeler = req.query.bolgeler ? req.query.bolgeler.split(',') : [];

            if (bolgeler.length === 0) {
                return res.status(400).json({ error: 'En az bir bölge seçilmelidir' });
            }

            const results = await AnalyticsModel.getRegionComparison(bolgeler);

            const detayliSonuclar = results.map(bolge => {
                const performansSkor = hesaplaBolgePerformansi(
                    bolge.toplam_satis,
                    bolge.servis_sayisi,
                    bolge.il_sayisi,
                    bolge.toplam_arac
                );

                return {
                    bolge_adi: bolge.bolge_adi,
                    temel_metrikler: {
                        toplam_satis: bolge.toplam_satis,
                        servis_sayisi: bolge.servis_sayisi,
                        il_sayisi: bolge.il_sayisi,
                        toplam_arac: bolge.toplam_arac
                    },
                    performans_metrikleri: {
                        il_basina_servis: parseFloat((bolge.servis_sayisi / bolge.il_sayisi).toFixed(2)),
                        servis_basina_satis: Math.round(bolge.toplam_satis / (bolge.servis_sayisi || 1)),
                        kapasite_kullanim: parseFloat(((bolge.toplam_arac / (bolge.servis_sayisi * 500)) * 100).toFixed(2))
                    },
                    performans_skoru: performansSkor
                };
            });

            res.json(detayliSonuclar);
        } catch (error) {
            console.error('Bölge karşılaştırma hatası:', error);
            res.status(500).json({ error: 'Veritabanı hatası: ' + error.message });
        }
    }
}

module.exports = DashboardController;
