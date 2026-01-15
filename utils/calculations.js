function hesaplaServisYeterliligi(aracSayisi, servisSayisi) {
    try {
        if (servisSayisi === 0) {
            return {
                skor: 0,
                degerlendirme: 'Teknik Servis Yok',
                detaylar: {
                    kapasite: 0,
                    aracSayisi: aracSayisi,
                    kapasiteOrani: 0
                }
            };
        }
        const toplamKapasite = servisSayisi * 500;
        const kapasiteOrani = toplamKapasite / aracSayisi;
        let degerlendirme;
        if (servisSayisi === 0) {
            degerlendirme = 'Teknik Servis Yok';
        } else if (kapasiteOrani >= 0.85) {
            degerlendirme = 'Mükemmel';
        } else if (kapasiteOrani >= 0.65) {
            degerlendirme = 'Yeterli';
        } else if (kapasiteOrani >= 0.45) {
            degerlendirme = 'Geliştirilmeli';
        } else {
            degerlendirme = 'Yetersiz';
        }

        return {
            skor: parseFloat(kapasiteOrani.toFixed(2)),
            degerlendirme,
            detaylar: {
                kapasite: toplamKapasite,
                aracSayisi: aracSayisi,
                kapasiteOrani: parseFloat(kapasiteOrani.toFixed(2))
            }
        };
    } catch (error) {
        console.error('Servis yeterliliği hesaplama hatası:', error);
        return null;
    }
}

function getBolgePerformansLevel(kapasiteOrani) {
    if (kapasiteOrani === 0) return 'Teknik Servis Yok';
    if (kapasiteOrani >= 0.85) return 'Mükemmel';
    if (kapasiteOrani >= 0.65) return 'Yeterli';
    if (kapasiteOrani >= 0.45) return 'Geliştirilmeli';
    return 'Yetersiz';
}

function hesaplaBolgePerformansi(toplamSatis, servisSayisi, ilSayisi, aracSayisi) {
    try {
        if (servisSayisi === 0) {
            return {
                genel_skor: 0,
                detay_skorlar: {
                    kapasite: 0,
                    aracSayisi: aracSayisi,
                    kapasiteOrani: 0
                },
                performans_seviyesi: 'Teknik Servis Yok'
            };
        }
        const toplamKapasite = servisSayisi * 500;
        const kapasiteOrani = aracSayisi > 0 ? toplamKapasite / aracSayisi : 2; // Fixed: using logic from original app.js

        return {
            genel_skor: parseFloat(kapasiteOrani.toFixed(2)),
            detay_skorlar: {
                kapasite: toplamKapasite,
                aracSayisi: aracSayisi,
                kapasiteOrani: parseFloat(kapasiteOrani.toFixed(2))
            },
            performans_seviyesi: getBolgePerformansLevel(kapasiteOrani)
        };
    } catch (error) {
        console.error('Bölge performans hesaplama hatası:', error);
        return null;
    }
}

module.exports = {
    hesaplaServisYeterliligi,
    hesaplaBolgePerformansi,
    getBolgePerformansLevel
};
