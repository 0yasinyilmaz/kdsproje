const ilKodlari = {
    'TR01': 'ADANA', 'TR02': 'ADIYAMAN', 'TR03': 'AFYONKARAHİSAR', 'TR04': 'AĞRI',
    'TR05': 'AMASYA', 'TR06': 'ANKARA', 'TR07': 'ANTALYA', 'TR08': 'ARTVİN',
    'TR09': 'AYDIN', 'TR10': 'BALIKESİR', 'TR11': 'BİLECİK', 'TR12': 'BİNGÖL',
    'TR13': 'BİTLİS', 'TR14': 'BOLU', 'TR15': 'BURDUR', 'TR16': 'BURSA',
    'TR17': 'ÇANAKKALE', 'TR18': 'ÇANKIRI', 'TR19': 'ÇORUM', 'TR20': 'DENİZLİ',
    'TR21': 'DİYARBAKIR', 'TR22': 'EDİRNE', 'TR23': 'ELAZIĞ', 'TR24': 'ERZİNCAN',
    'TR25': 'ERZURUM', 'TR26': 'ESKİŞEHİR', 'TR27': 'GAZİANTEP', 'TR28': 'GİRESUN',
    'TR29': 'GÜMÜŞHANE', 'TR30': 'HAKKARİ', 'TR31': 'HATAY', 'TR32': 'ISPARTA',
    'TR33': 'MERSİN', 'TR34': 'İSTANBUL', 'TR35': 'İZMİR', 'TR36': 'KARS',
    'TR37': 'KASTAMONU', 'TR38': 'KAYSERİ', 'TR39': 'KIRKLARELİ', 'TR40': 'KIRŞEHİR',
    'TR41': 'KOCAELİ', 'TR42': 'KONYA', 'TR43': 'KÜTAHYA', 'TR44': 'MALATYA',
    'TR45': 'MANİSA', 'TR46': 'KAHRAMANMARAŞ', 'TR47': 'MARDİN', 'TR48': 'MUĞLA',
    'TR49': 'MUŞ', 'TR50': 'NEVŞEHİR', 'TR51': 'NİĞDE', 'TR52': 'ORDU',
    'TR53': 'RİZE', 'TR54': 'SAKARYA', 'TR55': 'SAMSUN', 'TR56': 'SİİRT',
    'TR57': 'SİNOP', 'TR58': 'SİVAS', 'TR59': 'TEKİRDAĞ', 'TR60': 'TOKAT',
    'TR61': 'TRABZON', 'TR62': 'TUNCELİ', 'TR63': 'ŞANLIURFA', 'TR64': 'UŞAK',
    'TR65': 'VAN', 'TR66': 'YOZGAT', 'TR67': 'ZONGULDAK', 'TR68': 'AKSARAY',
    'TR69': 'BAYBURT', 'TR70': 'KARAMAN', 'TR71': 'KIRIKKALE', 'TR72': 'BATMAN',
    'TR73': 'ŞIRNAK', 'TR74': 'BARTIN', 'TR75': 'ARDAHAN', 'TR76': 'IĞDIR',
    'TR77': 'YALOVA', 'TR78': 'KARABÜK', 'TR79': 'KİLİS', 'TR80': 'OSMANİYE',
    'TR81': 'DÜZCE'
};
async function teknikServisHaritasiOlustur() {
    try {
        const haritaResponse = await fetch('/turkiye.svg');
        const haritaSVG = await haritaResponse.text();
        
        const haritaContainer = document.getElementById('turkiye-haritasi');
        haritaContainer.innerHTML = haritaSVG;
        
        const svg = haritaContainer.querySelector('svg');
        svg.style.width = '100%';
        svg.style.height = '100%';
        svg.setAttribute('viewBox', '0 0 1007.478 527.322');
        svg.style.position = 'relative';
        svg.style.zIndex = '1';
    } catch (error) {
        console.error('Ana harita oluşturma hatası:', error);
    }
}
function getIlRengi(ilVeri) {
    const { servis_sayisi, satistoplam } = ilVeri;
    if (servis_sayisi === 0) {
        return '#ffffff'; // Beyaz - Teknik Servis Yok
    }
    if (!satistoplam || satistoplam === 0) {
        return '#d32f2f'; // Kırmızı (Mükemmel) - çünkü servis var ama satış yok
    }
    const kapasite = servis_sayisi * 500;
    const oran = kapasite / satistoplam;
    if (oran >= 1.5) {
        return '#d32f2f'; // Kırmızı (Mükemmel)
    } else if (oran >= 1.0 && oran < 1.5) {
        return '#ff8a80'; // Açık kırmızı (Yeterli)
    } else if (oran >= 0.6 && oran < 1.0) {
        return '#5c6bc0'; // Mavi (Geliştirilmeli)
    } else {
        return '#9fa8da'; // Açık mavi (Yetersiz)
    }
}
function getIlBilgiHTML(ilAdi, ilVeri) {
    const kapasite = ilVeri.servis_sayisi * 500;
    const oran = ilVeri.servis_sayisi === 0 ? 0 : kapasite / ilVeri.satistoplam;
    let durum;
    let renk;

    if (ilVeri.servis_sayisi === 0) {
        durum = 'Teknik Servis Yok';
        renk = '#ffffff';
    } else if (oran >= 1.5) {
        durum = 'Mükemmel';
        renk = '#d32f2f';
    } else if (oran >= 1.0 && oran < 1.5) {
        durum = 'Yeterli';
        renk = '#ff8a80';
    } else if (oran >= 0.6 && oran < 1.0) {
        durum = 'Geliştirilmeli';
        renk = '#5c6bc0';
    } else {
        durum = 'Yetersiz';
        renk = '#9fa8da';
    }

    return `
        <strong>${ilAdi}</strong><br>
        <div style="margin-top: 5px;">
            <div>Servis Sayısı: ${ilVeri.servis_sayisi}</div>
            <div>Toplam Satış: ${ilVeri.satistoplam.toLocaleString()}</div>
            <div>Kapasite: ${kapasite.toLocaleString()}</div>
            <div>Oran: ${oran.toFixed(2)}</div>
            <div>Durum: <span style="color: ${renk}">${durum}</span></div>
        </div>
    `;
}
document.addEventListener('DOMContentLoaded', function() {
    teknikServisHaritasiOlustur();
    const tumIllerBtn = document.getElementById('tumIllerBtn');
    if (tumIllerBtn) {
        tumIllerBtn.addEventListener('click', function() {
            console.log('Tüm İller butonuna tıklandı');
            document.getElementById('birimler').style.display = 'none';
            document.getElementById('il-analiz').style.display = 'block';
            analizHaritasiOlustur();
        });
    } else {
        console.error('Tüm İller butonu bulunamadı');
    }
});
async function analizHaritasiOlustur() {
    try {
        console.log('Analiz haritası oluşturuluyor...');
        const haritaResponse = await fetch('/analiz.svg');
        if (!haritaResponse.ok) {
            throw new Error(`Harita yüklenemedi: ${haritaResponse.status}`);
        }
        const haritaSVG = await haritaResponse.text();
        console.log('SVG içeriği yüklendi, uzunluk:', haritaSVG.length);
        const haritaContainer = document.getElementById('analiz-haritasi');
        if (!haritaContainer) {
            throw new Error('Harita container bulunamadı');
        }
        console.log('Container bulundu');
        haritaContainer.innerHTML = haritaSVG;
        const svg = haritaContainer.querySelector('svg');
        if (!svg) {
            throw new Error('SVG elementi bulunamadı');
        }
        svg.style.width = '100%';
        svg.style.height = '100%';
        svg.setAttribute('viewBox', '0 0 1007.478 527.322');
        svg.style.preserveAspectRatio = 'xMidYMid meet';
        const response = await fetch('/api/iller/yeterlilik-skorlari');
        if (!response.ok) {
            throw new Error('İl verileri alınamadı');
        }
        const ilVerileri = await response.json();
        console.log('Alınan il verileri:', ilVerileri);
        const paths = svg.querySelectorAll('path');
        console.log('Bulunan path sayısı:', paths.length);
        paths.forEach(path => {
            const ilKodu = path.id;
            const ilAdi = ilKodlari[ilKodu];
            
            if (!ilAdi) {
                console.warn(`İl bulunamadı: ${ilKodu}`);
                path.style.fill = '#ffffff';  // Veri olmayan iller için beyaz
                return;
            }

            const ilVeri = ilVerileri.find(il => il.il_adi === ilAdi);
            if (ilVeri) {
                const renk = getIlRengi(ilVeri);
                path.style.fill = renk;
                console.log(`${ilAdi} için renk atandı:`, renk, ilVeri);
                path.addEventListener('mouseover', () => {
                    path.style.opacity = '0.7';
                });

                path.addEventListener('mouseout', () => {
                    path.style.opacity = '1';
                });
                path.addEventListener('click', () => {
                    ilBilgileriniGoster(ilAdi);
                });
            } else {
                path.style.fill = '#ffffff';
                console.warn(`${ilAdi} için veri bulunamadı`);
            }
        });

    } catch (error) {
        console.error('Analiz haritası oluşturma hatası:', error);
        console.error('Hata detayı:', error.stack);
    }
}
function getPerformanceColor(skor) {
    if (skor > 1.5) return '#d32f2f';     // Kırmızı (Mükemmel)
    if (skor > 1.0) return '#ff8a80';     // Açık kırmızı (Yeterli)
    if (skor > 0.6) return '#5c6bc0';     // Mavi (Geliştirilmeli)
    if (skor > 0) return '#9fa8da';       // Açık mavi (Yetersiz)
    return '#ffffff';                      // Beyaz (Teknik Servis Yok)
}
function getPerformanceText(skor) {
    if (skor === 0) return 'Teknik Servis Yok';
    if (skor > 1.5) return 'Mükemmel';
    if (skor > 1.0) return 'Yeterli';
    if (skor > 0.6) return 'Geliştirilmeli';
    return 'Yetersiz';
}
  