const ServiceModel = require('../models/serviceModel');
const LocationModel = require('../models/locationModel');

class ServiceController {
    static async getAll(req, res) {
        try {
            const services = await ServiceModel.getAll();
            res.json(services);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    static async getByCity(req, res) {
        try {
            const services = await ServiceModel.getByCityId(req.params.ilId);
            res.json(services);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    static async create(req, res) {
        try {
            const { servis_adi, il_adi, ilce_adi } = req.body;
            console.log('Gelen veri:', req.body);

            if (!servis_adi || !il_adi || !ilce_adi) {
                return res.status(400).json({
                    success: false,
                    message: 'Tüm alanlar doldurulmalıdır'
                });
            }

            const il = await LocationModel.getByName(il_adi);
            if (!il) {
                return res.status(400).json({
                    success: false,
                    message: 'Geçersiz il adı'
                });
            }

            const newServiceId = await ServiceModel.create({
                servis_adi,
                il_id: il.il_id,
                ilce_adi
            });

            res.json({
                success: true,
                message: 'Teknik servis başarıyla eklendi',
                data: {
                    id: newServiceId,
                    servis_adi,
                    il_adi,
                    ilce_adi
                }
            });
        } catch (err) {
            console.error('Servis ekleme hatası:', err);
            res.status(500).json({
                success: false,
                message: 'Servis eklenirken bir hata oluştu',
                error: err.message
            });
        }
    }

    static async delete(req, res) {
        try {
            const servisAdi = req.params.id; // Note: app.js uses req.params.id generally for the name in 'delete/:id' route per original logic
            const affectedRows = await ServiceModel.deleteByName(servisAdi);

            if (affectedRows === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Servis bulunamadı'
                });
            }

            res.json({
                success: true,
                message: 'Teknik servis başarıyla silindi'
            });
        } catch (err) {
            console.error('Servis silme hatası:', err);
            res.status(500).json({
                success: false,
                message: 'Servis silinirken bir hata oluştu',
                error: err.message
            });
        }
    }

    static async update(req, res) {
        try {
            const { id } = req.params;
            const { servis_adi, ilce_adi } = req.body;

            const affectedRows = await ServiceModel.update(id, { servis_adi, ilce_adi });

            if (affectedRows === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Servis bulunamadı'
                });
            }

            res.json({
                success: true,
                message: 'Teknik servis başarıyla güncellendi'
            });
        } catch (err) {
            console.error('Servis güncelleme hatası:', err);
            res.status(500).json({
                success: false,
                message: 'Servis güncellenirken bir hata oluştu',
                error: err.message
            });
        }
    }
}

module.exports = ServiceController;
