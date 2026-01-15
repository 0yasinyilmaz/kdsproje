document.addEventListener('DOMContentLoaded', async function() {
    const style = document.createElement('style');
    style.textContent = `
        #harita-container {
            width: 100%;
            height: 800px;
            margin: 20px auto;
            position: relative;
        }
        .tooltip {
            position: fixed;
            background-color: rgba(0, 0, 0, 0.9);
            color: white;
            padding: 8px 12px;
            border-radius: 4px;
            font-size: 14px;
            pointer-events: none;
            z-index: 9999;
            box-shadow: 0 2px 4px rgba(0,0,0,0.2);
            min-width: 150px;
            line-height: 1.4;
        }
        .il-etiketi {
            pointer-events: none;
            font-family: 'Helvetica', 'Arial', sans-serif;
            font-weight: 500;
            font-size: 5px;
            user-select: none;
            fill: white;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        .il-etiketi-bg {
            fill: rgba(0, 0, 0, 0.7);
            rx: 1.2;
            ry: 1.2;
        }
    `;
    document.head.appendChild(style);
    const tumIllerBtn = document.getElementById('tumIllerBtn');
    if (tumIllerBtn) {
        tumIllerBtn.addEventListener('click', async function() {
            document.getElementById('birimler').style.display = 'none';
            document.getElementById('il-analiz').style.display = 'block';
            const haritaContainer = document.getElementById('analiz-haritasi');
            haritaContainer.innerHTML = ''; // Mevcut içeriği temizle
            
            try {
                const response = await fetch('/api/il-yeterlilik');
                const ilYeterlilik = await response.json();
                const svgResponse = await fetch('/analiz.svg');
                const svgText = await svgResponse.text();
                haritaContainer.innerHTML = svgText;
                const renkler = {
                    'Mükemmel': '#d32f2f',    // Kırmızı
                    'Yeterli': '#ff8a80',     // Açık kırmızı
                    'Geliştirilmeli': '#5c6bc0', // Mavi
                    'Yetersiz': '#9fa8da',    // Açık mavi
                    'Teknik Servis Yok': '#eceff1'  // Gri
                };
                const svg = haritaContainer.querySelector('svg');
                if (!svg) {
                    throw new Error('SVG elementi bulunamadı');
                }
                svg.style.width = '100%';
                svg.style.height = '100%';
                svg.setAttribute('viewBox', '0 0 1007.478 527.322');
                svg.style.preserveAspectRatio = 'xMidYMid meet';
                svg.style.position = 'relative';
                svg.style.zIndex = '1';
                const paths = svg.querySelectorAll('path');
                console.log('Bulunan path sayısı:', paths.length);
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
                paths.forEach(path => {
                    const ilKodu = path.id;
                    if (!ilKodu) return;

                    const ilAdi = ilKodlari[ilKodu];
                    if (!ilAdi) return;
                    const bbox = path.getBBox();
                    const centerX = bbox.x + bbox.width / 2;
                    const centerY = bbox.y + bbox.height / 2;
                    const bg = document.createElementNS("http://www.w3.org/2000/svg", "rect");
                    const padding = 2.5; // Metin etrafındaki boşluk
                    const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
                    text.setAttribute('x', centerX.toString());
                    text.setAttribute('y', centerY.toString());
                    text.setAttribute('text-anchor', 'middle');
                    text.setAttribute('class', 'il-etiketi');
                    text.setAttribute('dominant-baseline', 'middle');
                    text.textContent = ilAdi;
                    svg.appendChild(text);
                    const textBox = text.getBBox();
                    bg.setAttribute('x', (textBox.x - padding).toString());
                    bg.setAttribute('y', (textBox.y - padding).toString());
                    bg.setAttribute('width', (textBox.width + padding * 2).toString());
                    bg.setAttribute('height', (textBox.height + padding * 2).toString());
                    bg.setAttribute('class', 'il-etiketi-bg');
                    svg.appendChild(bg);
                    svg.appendChild(text); // Text'i tekrar en üste getir
                });
                paths.forEach(path => {
                    const ilKodu = path.id;
                    if (!ilKodu) return;

                    const ilAdi = ilKodlari[ilKodu];
                    if (!ilAdi) return;
                    const il = ilYeterlilik.find(il => {
                        const normalizeText = (text) => {
                            return text
                                .toUpperCase()
                                .replace(/İ/g, 'I')
                                .replace(/Ğ/g, 'G')
                                .replace(/Ü/g, 'U')
                                .replace(/Ş/g, 'S')
                                .replace(/Ö/g, 'O')
                                .replace(/Ç/g, 'C')
                                .replace(/Â/g, 'A')
                                .trim();
                        };
                        
                        return normalizeText(il.il_adi) === normalizeText(ilAdi);
                    });
                    
                    if (il) {
                        const kapasite = il.servis_sayisi * 500;
                        const oran = il.servis_sayisi === 0 ? 0 : kapasite / il.satis;
                        let durum;

                        if (il.servis_sayisi === 0) {
                            durum = 'Teknik Servis Yok';
                        } else if (oran >= 1.5) {
                            durum = 'Mükemmel';
                        } else if (oran >= 1.0 && oran < 1.5) {
                            durum = 'Yeterli';
                        } else if (oran >= 0.6 && oran < 1.0) {
                            durum = 'Geliştirilmeli';
                        } else {
                            durum = 'Yetersiz';
                        }
                        path.style.fill = renkler[durum];
                        path.addEventListener('mouseover', (e) => {
                            path.style.opacity = '0.7';
                            
                            const tooltip = document.createElement('div');
                            tooltip.className = 'tooltip';
                            tooltip.innerHTML = getIlBilgiHTML(ilAdi, il);
                            document.body.appendChild(tooltip);
                            
                            tooltip.style.left = (e.pageX + 10) + 'px';
                            tooltip.style.top = (e.pageY + 10) + 'px';
                        });

                        path.addEventListener('mousemove', (e) => {
                            const tooltip = document.querySelector('.tooltip');
                            if (tooltip) {
                                tooltip.style.left = (e.pageX + 10) + 'px';
                                tooltip.style.top = (e.pageY + 10) + 'px';
                            }
                        });

                        path.addEventListener('mouseout', () => {
                            path.style.opacity = '1';
                            const tooltip = document.querySelector('.tooltip');
                            if (tooltip) {
                                tooltip.remove();
                            }
                        });
                    }
                });
                
            } catch (error) {
                console.error('Harita yükleme hatası:', error);
            }
        });
    }
    const geriDonBtn = document.getElementById('geriDonBtn');
    if (geriDonBtn) {
        geriDonBtn.addEventListener('click', function() {
            document.getElementById('il-analiz').style.display = 'none';
            document.getElementById('birimler').style.display = 'block';
        });
    }
    const analizModal = document.getElementById('analizHaritaModal');
    if (analizModal) {
        analizModal.addEventListener('show.bs.modal', function () {
            const originalSvg = document.querySelector('#analiz-haritasi svg');
            const modalContainer = document.getElementById('buyuk-analiz-harita');
            if (originalSvg && modalContainer) {
                const clonedSvg = originalSvg.cloneNode(true);
                clonedSvg.style.width = '100%';
                clonedSvg.style.height = '100%';
                clonedSvg.setAttribute('viewBox', '0 0 1007.478 527.322');
                clonedSvg.style.preserveAspectRatio = 'xMidYMid meet';
                modalContainer.innerHTML = '';
                modalContainer.appendChild(clonedSvg);
            }
        });
    }
});
function getIlRengi(ilVeri) {
    const { servis_sayisi, satistoplam } = ilVeri;
    if (servis_sayisi === 0) {
        return '#eceff1'; // Teknik Servis Yok - Gri
    }
    if (!satistoplam || satistoplam === 0) {
        return '#d32f2f'; // Kırmızı (Mükemmel)
    }
    const kapasite = servis_sayisi * 500;
    const oran = kapasite / satistoplam;
    if (oran >= 1.5) {
        return '#d32f2f'; // Mükemmel - Kırmızı
    } else if (oran >= 1.0 && oran < 1.5) {
        return '#ff8a80'; // Yeterli - Açık kırmızı
    } else if (oran >= 0.6 && oran < 1.0) {
        return '#5c6bc0'; // Geliştirilmeli - Mavi
    } else {
        return '#9fa8da'; // Yetersiz - Açık mavi
    }
}
function getIlBilgiHTML(ilAdi, ilVeri) {
    const kapasite = ilVeri.servis_sayisi * 500;
    const oran = ilVeri.servis_sayisi === 0 ? 0 : kapasite / ilVeri.satistoplam;
    let durum;

    if (ilVeri.servis_sayisi === 0) {
        durum = 'Teknik Servis Yok';
    } else if (oran >= 1.5) {
        durum = 'Mükemmel';
    } else if (oran >= 1.0 && oran < 1.5) {
        durum = 'Yeterli';
    } else if (oran >= 0.6 && oran < 1.0) {
        durum = 'Geliştirilmeli';
    } else {
        durum = 'Yetersiz';
    }

    return `
        <strong>${ilAdi}</strong><br>
        <div style="margin-top: 5px;">
            <div>Servis Sayısı: ${ilVeri.servis_sayisi}</div>
            <div>Toplam Satış: ${ilVeri.satistoplam.toLocaleString()}</div>
            <div>Kapasite: ${kapasite.toLocaleString()}</div>
            <div>Oran: ${oran.toFixed(2)}</div>
            <div>Durum: <span style="color: ${getIlRengi(ilVeri)}">${durum}</span></div>
        </div>
    `;
} 