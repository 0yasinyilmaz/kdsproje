const iller = [
    'Adana', 'Adıyaman', 'Afyonkarahisar', 'Ağrı', 'Amasya', 'Ankara', 'Antalya', 'Artvin',
    'Aydın', 'Balıkesir', 'Bilecik', 'Bingöl', 'Bitlis', 'Bolu', 'Burdur', 'Bursa', 'Çanakkale',
    'Çankırı', 'Çorum', 'Denizli', 'Diyarbakır', 'Edirne', 'Elazığ', 'Erzincan', 'Erzurum',
    'Eskişehir', 'Gaziantep', 'Giresun', 'Gümüşhane', 'Hakkari', 'Hatay', 'Isparta', 'Mersin',
    'İstanbul', 'İzmir', 'Kars', 'Kastamonu', 'Kayseri', 'Kırklareli', 'Kırşehir', 'Kocaeli',
    'Konya', 'Kütahya', 'Malatya', 'Manisa', 'Kahramanmaraş', 'Mardin', 'Muğla', 'Muş', 'Nevşehir',
    'Niğde', 'Ordu', 'Rize', 'Sakarya', 'Samsun', 'Siirt', 'Sinop', 'Sivas', 'Tekirdağ', 'Tokat',
    'Trabzon', 'Tunceli', 'Şanlıurfa', 'Uşak', 'Van', 'Yozgat', 'Zonguldak', 'Aksaray', 'Bayburt',
    'Karaman', 'Kırıkkale', 'Batman', 'Şırnak', 'Bartın', 'Ardahan', 'Iğdır', 'Yalova', 'Karabük',
    'Kilis', 'Osmaniye', 'Düzce'
];
document.addEventListener('DOMContentLoaded', async function() {
    console.log("Sayfa yüklendi");
    await createWelcomePage();
    document.querySelectorAll('.menu-item').forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const pageId = item.dataset.page;
            sayfaYukle(pageId);
        });
    });
    const logoLink = document.querySelector('.logo-link');
    if (logoLink) {
        logoLink.addEventListener('click', async (e) => {
            e.preventDefault();
            await sayfaYukle('welcome');
        });
    }
    document.querySelectorAll('.page').forEach(page => {
        page.style.display = 'none';
    });
    const welcomePage = document.getElementById('welcome');
    if (welcomePage) {
        welcomePage.style.display = 'block';
        initializeHomeSlider();
    }
});
async function createWelcomePage() {
    const welcomeDiv = document.getElementById('welcome');
    if (!welcomeDiv) return;

    welcomeDiv.innerHTML = `
        <div class="welcome-container">
            <div class="welcome-content">
                <img src="/chery-logo.png" alt="Chery Logo" class="welcome-logo">
                <h1>Chery Servis Ağı Karar Destek Sistemi</h1>
                <p class="welcome-description">
                    Veri odaklı karar verme süreçleri ile Türkiye genelindeki teknik servis ağını optimize eden, 
                    geleceğe yönelik planlamalar sunan ve taktiksel karar almayı destekleyen akıllı yönetim platformu
                </p>
                
                <div class="welcome-features">
                    <div class="feature-card">
                        <div class="feature-icon">
                            <i class="fas fa-brain"></i>
                        </div>
                        <h3>Akıllı Karar Desteği</h3>
                        <p>Veri analitiği destekli karar önerileri</p>
                    </div>

                    <div class="feature-card">
                        <div class="feature-icon">
                            <i class="fas fa-chart-line"></i>
                        </div>
                        <h3>Performans Analizi</h3>
                        <p>Servis ağı performansının detaylı analizi ve optimizasyonu</p>
                    </div>

                    <div class="feature-card">
                        <div class="feature-icon">
                            <i class="fas fa-map-marked-alt"></i>
                        </div>
                        <h3>Taktiksel Planlama</h3>
                        <p>Servis lokasyonları için akıllı simülasyon ve öneriler</p>
                    </div>
                </div>
                
                <div class="welcome-slider">
                    <div class="slider-container">
                        <div class="slide">
                            <img src="/slider/dashboard.png" alt="Dashboard">
                            <h3>Kapsamlı Dashboard</h3>
                            <p>Tüm önemli metrikleri tek ekranda görüntüleyin</p>
                        </div>
                        <div class="slide">
                            <img src="/slider/analysis.png" alt="Analiz">
                            <h3>Detaylı Analizler</h3>
                            <p>Haritalar ile il bazında incelemeler yapın</p>
                        </div>
                        <div class="slide">
                            <img src="/slider/simulation.png" alt="Simülasyon">
                            <h3>Gelecek Planlaması</h3>
                            <p>Simülasyonlarla geleceğe yönelik kararlar alın</p>
                        </div>
                    </div>
                    <div class="slider-nav">
                        <button class="nav-dot active" data-slide="0"></button>
                        <button class="nav-dot" data-slide="1"></button>
                        <button class="nav-dot" data-slide="2"></button>
                    </div>
                </div>
                
                <div class="welcome-actions">
                    <button onclick="showPage('raporlar')" class="welcome-btn primary">
                        <i class="fas fa-chart-bar"></i>
                        Keşfetmeye Başla
                    </button>
                </div>
            </div>
        </div>
    `;
    initializeHomeSlider();
}
async function sayfaYukle(pageId) {
    try {
        document.querySelectorAll('.page').forEach(page => {
            page.style.display = 'none';
        });
        const currentPage = document.getElementById(pageId);
        if (currentPage) {
            currentPage.style.display = 'block';
        }
        document.querySelectorAll('.menu-item').forEach(item => {
            item.classList.remove('active');
            if (item.dataset.page === pageId) {
                item.classList.add('active');
            }
        });
        if (!window.appData) {
            const [servisData, satisData, ilYeterlilik] = await Promise.all([
                fetch('/api/teknik-servisler').then(res => res.json()),
                fetch('/api/satislar').then(res => res.json()),
                fetch('/api/il-yeterlilik').then(res => res.json())
            ]);

            window.appData = {
                servisData,
                satisData,
                ilYeterlilik
            };
        }
        switch(pageId) {
            case 'welcome':
                initializeHomeSlider();
                break;
            case 'raporlar':
                destroyCharts();
                await createCharts(window.appData);
                break;
            case 'satislar':
                await satislarTablosuOlustur();
                await bolgeselOzetTablosuOlustur();
                break;
            case 'birimler':
                await teknikServisHaritasiOlustur();
                break;
            case 'kds':
                if (!window.appData) {
                    const [servisData, satisData, ilYeterlilik] = await Promise.all([
                        fetch('/api/teknik-servisler').then(res => res.json()),
                        fetch('/api/satislar').then(res => res.json()),
                        fetch('/api/il-yeterlilik').then(res => res.json())
                    ]);
                    window.appData = { servisData, satisData, ilYeterlilik };
                }
                await updateKPIs(window.appData);
                await initializeKDS();
                break;
        }

    } catch (error) {
        console.error('Sayfa yükleme hatası:', error);
    }
}
function destroyCharts() {
    const chartIds = [
        'bolgeselSatislar', 
        'bolgeselPasta', 
        'top10Iller', 
        'bolgeselServisPasta'
    ];
    chartIds.forEach(id => {
        const canvas = document.getElementById(id);
        if (canvas) {
            const ctx = canvas.getContext('2d');
            const chart = Chart.getChart(canvas);
            if (chart) {
                chart.destroy();
            }
        }
    });
}
async function createCharts(data = null) {
    try {
        if (!data) {
            const [servisData, satisData, ilYeterlilik] = await Promise.all([
                fetch('/api/teknik-servisler').then(res => res.json()),
                fetch('/api/satislar').then(res => res.json()),
                fetch('/api/il-yeterlilik').then(res => res.json())
            ]);
            data = { servisData, satisData, ilYeterlilik };
        }
        await updateKPIs(data);
        const ilYeterlilikResponse = await fetch('/api/il-yeterlilik');
        const ilYeterlilik = await ilYeterlilikResponse.json();
        console.log('İl Yeterlilik Verileri:', ilYeterlilik);
        const toplamSkor = ilYeterlilik.reduce((acc, il) => {
            console.log(`İl: ${il.il_adi}, Skor: ${il.yeterlilik_orani}`);
            return acc + (il.yeterlilik_orani || 0); // yeterlilik_skoru yerine yeterlilik_orani kullan
        }, 0);
        
        console.log('Toplam Skor:', toplamSkor);
        console.log('İl Sayısı:', ilYeterlilik.length);

        const ortalamaSkor = (toplamSkor / ilYeterlilik.length).toFixed(3);
        console.log('Ortalama Skor:', ortalamaSkor);
        document.getElementById('ortalamaServisSkor').textContent = ortalamaSkor;
        const servisResponse = await fetch('/api/teknik-servisler');
        const servisData = await servisResponse.json();
        document.getElementById('toplamServis').textContent = servisData.length;
        const satisResponse = await fetch('/api/satislar');
        const satisData = await satisResponse.json();
        const bolgeselResponse = await fetch('/api/satislar/bolge-ozeti');
        const bolgeselData = await bolgeselResponse.json();
        const toplamSatis = satisData.reduce((total, satis) => total + satis.satistoplam, 0);
        document.getElementById('toplamSatis').textContent = toplamSatis.toLocaleString();
        function yillikSatisHesapla(yil) {
            const yillikToplam = satisData
                .filter(satis => satis.yıl === parseInt(yil))
                .reduce((total, satis) => total + satis.satistoplam, 0);
            document.getElementById('yillikToplamSatis').textContent = yillikToplam.toLocaleString();
        }
        document.getElementById('yilSecimi').addEventListener('change', (e) => {
            yillikSatisHesapla(e.target.value);
        });
        yillikSatisHesapla(document.getElementById('yilSecimi').value);
        const bolgeRenkleri = {
            'Marmara': 'rgba(255, 99, 132, 0.8)',
            'Ege': 'rgba(54, 162, 235, 0.8)',
            'İç Anadolu': 'rgba(255, 206, 86, 0.8)',
            'Akdeniz': 'rgba(75, 192, 192, 0.8)',
            'Karadeniz': 'rgba(153, 102, 255, 0.8)',
            'Doğu Anadolu': 'rgba(255, 159, 64, 0.8)',
            'Güneydoğu Anadolu': 'rgba(199, 199, 199, 0.8)'
        };
        new Chart(document.getElementById('bolgeselSatislar'), {
            type: 'bar',
            data: {
                labels: bolgeselData.map(item => item.bolge_adi),
                datasets: [{
                    label: 'Bölgesel Satışlar',
                    data: bolgeselData.map(item => item.toplam_satis),
                    backgroundColor: 'rgba(207, 14, 14, 0.5)',
                    borderColor: '#CF0E0E',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: 'Bölgelere Göre Toplam Satışlar',
                        font: {
                            size: 16
                        }
                    },
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
        new Chart(document.getElementById('bolgeselPasta'), {
            type: 'pie',
            data: {
                labels: bolgeselData.map(item => item.bolge_adi),
                datasets: [{
                    data: bolgeselData.map(item => item.toplam_satis),
                    backgroundColor: bolgeselData.map(item => bolgeRenkleri[item.bolge_adi])
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: 'Bölgesel Satış Dağılımı (%)',
                        font: {
                            size: 16
                        }
                    },
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
        const top10 = satisData
            .sort((a, b) => b.satistoplam - a.satistoplam)
            .slice(0, 10);

        new Chart(document.getElementById('top10Iller'), {
            type: 'bar',
            data: {
                labels: top10.map(item => item.il_adi),
                datasets: [{
                    label: 'Satış Adedi',
                    data: top10.map(item => item.satistoplam),
                    backgroundColor: 'rgba(207, 14, 14, 0.5)',
                    borderColor: '#CF0E0E',
                    borderWidth: 1
                }]
            },
            options: {
                indexAxis: 'y',
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: 'En Çok Satış Yapılan 10 İl',
                        font: {
                            size: 16
                        }
                    },
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
        const bolgeServisSayilari = {};
        servisData.forEach(servis => {
            const bolge = servisData.find(s => s.il_adi === servis.il_adi)?.bolge_adi;
            if (bolge) {
                bolgeServisSayilari[bolge] = (bolgeServisSayilari[bolge] || 0) + 1;
            }
        });
        new Chart(document.getElementById('bolgeselServisPasta'), {
            type: 'pie',
            data: {
                labels: Object.keys(bolgeServisSayilari),
                datasets: [{
                    data: Object.values(bolgeServisSayilari),
                    backgroundColor: Object.keys(bolgeServisSayilari).map(bolge => bolgeRenkleri[bolge])
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: 'Bölgesel Teknik Servis Dağılımı',
                        font: {
                            size: 16
                        }
                    },
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
        const durumlar = {
            'Mükemmel': 0,
            'Yeterli': 0,
            'Geliştirilmeli': 0,
            'Yetersiz': 0,
            'Teknik Servis Yok': 0
        };

        ilYeterlilik.forEach(il => {
            durumlar[il.yeterlilik_durumu]++;
        });
        const durumRenkleri = {
            'Mükemmel': '#d32f2f',
            'Yeterli': '#ff8a80',
            'Geliştirilmeli': '#5c6bc0',
            'Yetersiz': '#9fa8da',
            'Teknik Servis Yok': '#eceff1'
        };

        new Chart(document.getElementById('ilDurumlariChart'), {
            type: 'bar',
            data: {
                labels: Object.keys(durumlar),
                datasets: [{
                    label: 'İl Sayısı',
                    data: Object.values(durumlar),
                    backgroundColor: Object.keys(durumlar).map(durum => durumRenkleri[durum]),
                    borderColor: Object.keys(durumlar).map(durum => durumRenkleri[durum]),
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: 'İl Bazlı Servis Durumu Dağılımı',
                        font: {
                            size: 16
                        }
                    },
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            stepSize: 1
                        }
                    }
                }
            }
        });

    } catch (error) {
        console.error('Grafik oluşturma hatası:', error);
    }
}
async function satislarTablosuOlustur() {
    try {
        const response = await fetch('/api/satislar');
        const data = await response.json();
        console.log('Satış tablosu verileri:', data);

        if ($.fn.DataTable.isDataTable('#satislarTable')) {
            $('#satislarTable').DataTable().destroy();
        }

        $('#satislarTable').DataTable({
            data: data,
            columns: [
                { data: 'il_adi', title: 'İl' },
                { data: 'bolge_adi', title: 'Bölge' },
                { data: 'yıl', title: 'Yıl' },
                { data: 'satistoplam', title: 'Toplam Satış' }
            ],
            language: {
                url: '//cdn.datatables.net/plug-ins/1.11.5/i18n/tr.json'
            },
            responsive: true,
            order: [[3, 'desc']]
        });
    } catch (error) {
        console.error('Tablo oluşturma hatası:', error);
    }
}
async function bolgeselOzetTablosuOlustur() {
    try {
        const satisResponse = await fetch('/api/satislar/bolge-ozeti');
        const satisData = await satisResponse.json();
        const servisResponse = await fetch('/api/teknik-servisler');
        const servisData = await servisResponse.json();
        const bolgeServisSayilari = {};
        servisData.forEach(servis => {
            const bolge = servisData.find(s => s.il_adi === servis.il_adi)?.bolge_adi;
            if (bolge) {
                bolgeServisSayilari[bolge] = (bolgeServisSayilari[bolge] || 0) + 1;
            }
        });
        const combinedData = satisData.map(bolge => ({
            ...bolge,
            servis_sayisi: bolgeServisSayilari[bolge.bolge_adi] || 0
        }));

        if ($.fn.DataTable.isDataTable('#bolgeselOzetTable')) {
            $('#bolgeselOzetTable').DataTable().destroy();
        }

        $('#bolgeselOzetTable').DataTable({
            data: combinedData,
            columns: [
                { data: 'bolge_adi', title: 'Bölge' },
                { data: 'toplam_satis', title: 'Toplam Satış' },
                { data: 'il_sayisi', title: 'İl Sayısı' },
                { data: 'servis_sayisi', title: 'Teknik Servis Sayısı' },
                { 
                    data: null,
                    title: 'İl Başına Ortalama',
                    render: function(data) {
                        return Math.round(data.toplam_satis / data.il_sayisi);
                    }
                }
            ],
            language: {
                url: '//cdn.datatables.net/plug-ins/1.11.5/i18n/tr.json'
            },
            responsive: true,
            order: [[1, 'desc']]
        });
    } catch (error) {
        console.error('Bölgesel özet tablosu oluşturma hatası:', error);
    }
}
async function teknikServisHaritasiOlustur() {
    try {
        const servisResponse = await fetch('/api/teknik-servisler');
        const servisler = await servisResponse.json();
        const satisResponse = await fetch('/api/satislar');
        const satislar = await satisResponse.json();
        const servisSayilari = {};
        const satisSayilari = {};
        
        servisler.forEach(servis => {
            if (servis.il_adi) {
                servisSayilari[servis.il_adi] = (servisSayilari[servis.il_adi] || 0) + 1;
            }
        });

        satislar.forEach(satis => {
            if (satis.il_adi) {
                satisSayilari[satis.il_adi] = (satisSayilari[satis.il_adi] || 0) + satis.satistoplam;
            }
        });
        const haritaResponse = await fetch('/turkiye.svg');
        let haritaSVG = await haritaResponse.text();
        
        const haritaContainer = document.getElementById('turkiye-haritasi');
        haritaContainer.innerHTML = haritaSVG;
        const svg = haritaContainer.querySelector('svg');
        svg.style.width = '100%';
        svg.style.height = '100%';
        svg.setAttribute('viewBox', '0 0 1007.478 527.322');
        
        const paths = svg.querySelectorAll('path');
        const ilKodlari = {
            "TR01": "Adana", "TR02": "Adıyaman", "TR03": "Afyonkarahisar", "TR04": "Ağrı",
            "TR05": "Amasya", "TR06": "Ankara", "TR07": "Antalya", "TR08": "Artvin",
            "TR09": "Aydın", "TR10": "Balıkesir", "TR11": "Bilecik", "TR12": "Bingöl",
            "TR13": "Bitlis", "TR14": "Bolu", "TR15": "Burdur", "TR16": "Bursa",
            "TR17": "Çanakkale", "TR18": "Çankırı", "TR19": "Çorum", "TR20": "Denizli",
            "TR21": "Diyarbakır", "TR22": "Edirne", "TR23": "Elazığ", "TR24": "Erzincan",
            "TR25": "Erzurum", "TR26": "Eskişehir", "TR27": "Gaziantep", "TR28": "Giresun",
            "TR29": "Gümüşhane", "TR30": "Hakkari", "TR31": "Hatay", "TR32": "Isparta",
            "TR33": "Mersin", "TR34": "İstanbul", "TR35": "İzmir", "TR36": "Kars",
            "TR37": "Kastamonu", "TR38": "Kayseri", "TR39": "Kırklareli", "TR40": "Kırşehir",
            "TR41": "Kocaeli", "TR42": "Konya", "TR43": "Kütahya", "TR44": "Malatya",
            "TR45": "Manisa", "TR46": "Kahramanmaraş", "TR47": "Mardin", "TR48": "Muğla",
            "TR49": "Muş", "TR50": "Nevşehir", "TR51": "Niğde", "TR52": "Ordu",
            "TR53": "Rize", "TR54": "Sakarya", "TR55": "Samsun", "TR56": "Siirt",
            "TR57": "Sinop", "TR58": "Sivas", "TR59": "Tekirdağ", "TR60": "Tokat",
            "TR61": "Trabzon", "TR62": "Tunceli", "TR63": "Şanlıurfa", "TR64": "Uşak",
            "TR65": "Van", "TR66": "Yozgat", "TR67": "Zonguldak", "TR68": "Aksaray",
            "TR69": "Bayburt", "TR70": "Karaman", "TR71": "Kırıkkale", "TR72": "Batman",
            "TR73": "Şırnak", "TR74": "Bartın", "TR75": "Ardahan", "TR76": "Iğdır",
            "TR77": "Yalova", "TR78": "Karabük", "TR79": "Kilis", "TR80": "Osmaniye",
            "TR81": "Düzce"
        };
        document.querySelectorAll('.servis-count-circle').forEach(el => el.remove());
        paths.forEach(path => {
            const ilKodu = path.id;
            const ilAdi = ilKodlari[ilKodu];
            const servisSayisi = servisSayilari[ilAdi] || 0;
            const satisSayisi = satisSayilari[ilAdi] || 0;
            const bbox = path.getBBox();
            const centerX = bbox.x + bbox.width/2;
            const centerY = bbox.y + bbox.height/2;
            const tooltip = document.createElement('div');
            tooltip.className = 'il-tooltip';
            document.querySelector('.map-container').appendChild(tooltip);
            path.addEventListener('mouseover', (e) => {
                tooltip.style.display = 'block';
                tooltip.textContent = ilAdi;
                const svgRect = svg.getBoundingClientRect();
                const pathRect = path.getBoundingClientRect();
                const centerX = pathRect.left + (pathRect.width / 2);
                const centerY = pathRect.top + (pathRect.height / 2);
                const scrollX = window.pageXOffset || document.documentElement.scrollLeft;
                const scrollY = window.pageYOffset || document.documentElement.scrollTop;
                tooltip.style.left = `${centerX}px`;
                tooltip.style.top = `${centerY - 30}px`; // Tooltip'i biraz yukarıda göster
                if (!path.classList.contains('selected')) {
                    path.style.fill = '#e6f0ff';
                }
            });

            path.addEventListener('mouseout', (e) => {
                tooltip.style.display = 'none';
                if (!path.classList.contains('selected')) {
                    path.style.fill = '#f0f0f0';
                }
            });
            path.addEventListener('click', async (e) => {
                paths.forEach(p => {
                    p.classList.remove('selected');
                    p.style.fill = '#f0f0f0';
                });
                path.classList.add('selected');
                path.style.fill = '#0066ff';
                const ilKodu = path.id;
                const ilAdi = ilKodlari[ilKodu];
                document.getElementById('secili-il').textContent = ilAdi;
                document.getElementById('servis-sayisi').textContent = servisSayisi;
                document.getElementById('satis-sayisi').textContent = satisSayisi.toLocaleString();
                const table = $('#servislerTable').DataTable();
                table.column(1).search(ilAdi).draw();
                try {
                    const response = await fetch(`/api/satis/yillik/${ilAdi}`);
                    const yillikVeriler = await response.json();
                    const yillikSatisListesi = document.getElementById('yillik-satis-listesi');
                    yillikSatisListesi.innerHTML = '';
                    
                    if (yillikVeriler.length > 0) {
                        yillikVeriler.forEach(veri => {
                            const satisItem = document.createElement('div');
                            satisItem.className = 'info-item yillik-satis-item';
                            satisItem.innerHTML = `
                                <label>${veri.yil}:</label>
                                <span>${veri.satis_sayisi.toLocaleString()}</span>
                            `;
                            yillikSatisListesi.appendChild(satisItem);
                        });
                    } else {
                        yillikSatisListesi.innerHTML = `
                            <div class="info-item no-data">
                                <span>Bu il için satış verisi bulunmamaktadır.</span>
                            </div>
                        `;
                    }
                } catch (error) {
                    console.error('Yıllık satış verisi çekme hatası:', error);
                    document.getElementById('yillik-satis-listesi').innerHTML = `
                        <div class="info-item error">
                            <span>Veriler yüklenirken bir hata oluştu.</span>
                        </div>
                    `;
                }
                const ilInfo = document.querySelector('.il-info');
                ilInfo.classList.add('active');
            });

            if (servisSayisi > 0) {
                const bbox = path.getBBox();
                const circle = document.createElementNS("http://www.w3.org/2000/svg", "g");
                circle.setAttribute('class', 'servis-count-circle');
                const circleBackground = document.createElementNS("http://www.w3.org/2000/svg", "circle");
                circleBackground.setAttribute('cx', bbox.x + bbox.width/2);
                circleBackground.setAttribute('cy', bbox.y + bbox.height/2);
                circleBackground.setAttribute('r', '15');
                circleBackground.setAttribute('rx', '12');
                circleBackground.setAttribute('ry', '12');
                circleBackground.setAttribute('class', 'count-circle-bg');
                const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
                text.setAttribute('x', bbox.x + bbox.width/2);
                text.setAttribute('y', bbox.y + bbox.height/2);
                text.setAttribute('dy', '0.35em');
                text.setAttribute('class', 'count-text');
                text.textContent = servisSayisi;
                
                circle.appendChild(circleBackground);
                circle.appendChild(text);
                path.parentNode.appendChild(circle);
            }
        });
        if ($.fn.DataTable.isDataTable('#servislerTable')) {
            $('#servislerTable').DataTable().destroy();
            $('#servislerTable thead th select').remove();
        }
        const table = $('#servislerTable').DataTable({
            ajax: {
                url: '/api/teknik-servisler',
                dataSrc: '',
                dataFilter: function(data) {
                    let json = JSON.parse(data);
                    json = json.map(item => ({
                        ...item,
                        adres: item.adres || '',
                        telefon: item.telefon || ''
                    }));
                    return JSON.stringify(json);
                }
            },
            columns: [
                { 
                    data: 'servis_adi',
                    defaultContent: '',
                    orderable: true
                },
                { 
                    data: 'il_adi',
                    defaultContent: '',
                    orderable: true,
                    render: function(data, type, row) {
                        if (type === 'display') {
                            return `<div class="il-wrapper">${data}</div>`;
                        }
                        return data;
                    }
                },
                { 
                    data: 'ilce_adi',
                    defaultContent: '',
                    orderable: true
                },
                {
                    data: null,
                    orderable: false,
                    className: 'text-center',
                    render: function(data, type, row) {
                        return `
                            <button class="btn btn-danger btn-sm delete-servis" data-id="${row.servis_adi}">
                                <i class="fas fa-trash"></i> Sil
                            </button>
                        `;
                    }
                }
            ],
            language: {
                url: '//cdn.datatables.net/plug-ins/1.13.7/i18n/tr.json'
            },
            responsive: true,
            dom: '<"table-top-controls"Bf>rt<"bottom"lip>',
            buttons: [
                {
                    extend: 'collection',
                    text: 'Dışa Aktar',
                    buttons: ['copy', 'excel', 'pdf', 'print']
                }
            ],
            pageLength: 100,  // Sayfa başına 100 satır göster
            lengthChange: false, // Sayfa uzunluğu değiştirme seçeneğini kaldır
            order: [[1, 'asc']],
            initComplete: function() {
                const column = this.api().column(1);
                const headerCell = $(column.header());
                if (headerCell.find('select').length === 0) {
                    const select = $('<select class="form-select"><option value="">Tüm İller</option></select>')
                        .appendTo(headerCell)
                        .on('change', function() {
                            const val = $.fn.dataTable.util.escapeRegex($(this).val());
                            column.search(val ? '^'+val+'$' : '', true, false).draw();
                            const paths = document.querySelectorAll('#turkiye-haritasi path');
                            paths.forEach(path => {
                                const ilKodu = path.id;
                                const ilAdi = ilKodlari[ilKodu];
                                
                                if (ilAdi === val) {
                                    paths.forEach(p => {
                                        p.classList.remove('selected');
                                        p.style.fill = '#f0f0f0';
                                    });
                                    path.classList.add('selected');
                                    path.style.fill = '#0066ff';
                                }
                            });
                        });
                    const iller = column.data().unique().sort().toArray();
                    iller.forEach(il => {
                        if (il) {
                            select.append(`<option value="${il}">${il}</option>`);
                        }
                    });
                }
                $('#servislerTable').on('click', '.delete-servis', function() {
                    const id = $(this).data('id');
                    Swal.fire({
                        title: 'Emin misiniz?',
                        text: "Bu teknik servis kaydı silinecek!",
                        icon: 'warning',
                        showCancelButton: true,
                        confirmButtonColor: '#d33',
                        cancelButtonColor: '#3085d6',
                        confirmButtonText: 'Evet, sil!',
                        cancelButtonText: 'İptal'
                    }).then(async (result) => {
                        if (result.isConfirmed) {
                            try {
                                const response = await fetch(`/api/teknik-servis/sil/${id}`, {
                                    method: 'DELETE'
                                });

                                if (response.ok) {
                                    Swal.fire(
                                        'Silindi!',
                                        'Teknik servis başarıyla silindi.',
                                        'success'
                                    );
                                    table.ajax.reload();
                                    teknikServisHaritasiOlustur();
                                } else {
                                    throw new Error('Silme işlemi başarısız oldu');
                                }
                            } catch (error) {
                                console.error('Silme hatası:', error);
                                Swal.fire(
                                    'Hata!',
                                    'Silme işlemi sırasında bir hata oluştu.',
                                    'error'
                                );
                            }
                        }
                    });
                });
            }
        });
        paths.forEach(path => {
            path.addEventListener('click', async () => {
                const ilKodu = path.id;
                const ilAdi = ilKodlari[ilKodu];
                table.column(1).search(ilAdi).draw();
                const ilSelect = document.querySelector('#servislerTable thead th select');
                if (ilSelect) {
                    ilSelect.value = ilAdi;
                }
                await ilBilgileriniGoster(ilAdi);
                document.querySelector('.servis-listesi').scrollIntoView({ 
                    behavior: 'smooth' 
                });
            });
        });
        async function ilBilgileriniGoster(ilAdi) {
            try {
                const servisResponse = await fetch('/api/teknik-servisler');
                const servisler = await servisResponse.json();
                
                const satisResponse = await fetch('/api/satislar');
                const satislar = await satisResponse.json();
                const ilServisleri = servisler.filter(s => s.il_adi === ilAdi);
                const ilSatislari = satislar.filter(s => s.il_adi === ilAdi);

                const servisSayisi = ilServisleri.length;
                const toplamSatis = ilSatislari.reduce((total, satis) => total + satis.satistoplam, 0);
                const kapasite = servisSayisi * 500;
                const dagilimPuani = servisSayisi > 1 ? 0.8 : 0.4;
                const sonuc = hesaplaServisYeterliligi(
                    toplamSatis || 1,
                    servisSayisi,
                    kapasite,
                    dagilimPuani
                );
                const renkler = {
                    'Mükemmel': 'success',
                    'Yeterli': 'info',
                    'Geliştirilmeli': 'warning',
                    'Yetersiz': 'danger'
                };
                document.getElementById('secili-il').textContent = ilAdi;
                document.getElementById('servis-sayisi').textContent = servisSayisi;
                document.getElementById('satis-sayisi').textContent = toplamSatis.toLocaleString();
                document.getElementById('yeterlilik-skoru').textContent = sonuc ? sonuc.skor.toFixed(2) : '0.00';
                
                const degerlendirmeSpan = document.getElementById('degerlendirme');
                degerlendirmeSpan.innerHTML = `<span class="badge bg-${renkler[sonuc?.degerlendirme] || 'secondary'}">
                    ${sonuc?.degerlendirme || 'Hesaplanamadı'}
                </span>`;
                const satis2023 = ilSatislari
                    .filter(s => s.yil === 2023)
                    .reduce((total, satis) => total + satis.satistoplam, 0);
                const yillikSatisListesi = document.getElementById('yillik-satis-listesi');
                yillikSatisListesi.innerHTML = `
                    <div class="info-item">
                        <label>2023:</label>
                        <span>${satis2023.toLocaleString()}</span>
                    </div>
                `;

            } catch (error) {
                console.error('İl bilgileri gösterme hatası:', error);
            }
        }
        await ilBilgileriniGuncelle();
        await servisIstatistikleriTablosunuOlustur();

    } catch (error) {
        console.error('Harita oluşturma hatası:', error);
        console.error(error.stack);
    }
}
async function ilBilgileriniGuncelle() {
    try {
        const servisResponse = await fetch('/api/teknik-servisler');
        const servisler = await servisResponse.json();
        
        const satisResponse = await fetch('/api/satislar');
        const satislar = await satisResponse.json();
        const ilVerileri = {};
        satislar.forEach(satis => {
            if (!ilVerileri[satis.il_adi]) {
                ilVerileri[satis.il_adi] = {
                    aracSayisi: 0,
                    servisSayisi: 0,
                    kapasite: 0,
                    dagilimPuani: 0.5
                };
            }
            ilVerileri[satis.il_adi].aracSayisi += satis.satistoplam;
        });
        servisler.forEach(servis => {
            if (!ilVerileri[servis.il_adi]) {
                ilVerileri[servis.il_adi] = {
                    aracSayisi: 0,
                    servisSayisi: 0,
                    kapasite: 0,
                    dagilimPuani: 0.5
                };
            }
            ilVerileri[servis.il_adi].servisSayisi += 1;
            ilVerileri[servis.il_adi].kapasite += 500;
        });
        Object.keys(ilVerileri).forEach(il => {
            const servisSayisi = ilVerileri[il].servisSayisi;
            ilVerileri[il].dagilimPuani = servisSayisi > 1 ? 0.8 : 0.4;
        });
        const ilGrid = document.getElementById('ilGrid');
        ilGrid.innerHTML = '';
        let toplamSkor = 0;
        let ilSayisi = 0;
        
        Object.entries(ilVerileri).forEach(([il, veri]) => {
            const sonuc = hesaplaServisYeterliligi(
                veri.aracSayisi || 1,
                veri.servisSayisi,
                veri.kapasite,
                veri.dagilimPuani
            );
            if (sonuc && sonuc.skor) {
                toplamSkor += sonuc.skor;
                ilSayisi++;
            }
            
            const card = document.createElement('div');
            card.className = 'il-card';
            card.setAttribute('data-il', il);

            const renkler = {
                'Mükemmel': 'success',
                'Yeterli': 'info',
                'Geliştirilmeli': 'warning',
                'Yetersiz': 'danger'
            };

            card.innerHTML = `
                <h3>${il}</h3>
                <p><span>Servis Sayısı:</span> <span>${veri.servisSayisi || 0}</span></p>
                <p><span>Toplam Satış:</span> <span>${veri.aracSayisi || 0}</span></p>
                <p><span>Yeterlilik Skoru:</span> <span>${sonuc ? sonuc.skor.toFixed(2) : '0.00'}</span></p>
                <span class="badge bg-${renkler[sonuc?.degerlendirme] || 'secondary'}">
                    ${sonuc?.degerlendirme || 'Hesaplanamadı'}
                </span>
            `;

            ilGrid.appendChild(card);
        });
        const ortalamaSkor = ilSayisi > 0 ? toplamSkor / ilSayisi : 0;
        document.getElementById('ilAnalizOrtalamaSkor').textContent = ortalamaSkor.toFixed(2);

    } catch (error) {
        console.error('İl bilgileri güncelleme hatası:', error);
    }
}
function logPathData() {
    const svg = document.querySelector('#turkiye-haritasi svg');
    const paths = svg.querySelectorAll('path');
    paths.forEach((path, index) => {
        console.log(`Path ${index}:`, {
            d: path.getAttribute('d'),
            bbox: path.getBBox()
        });
    });
}
document.querySelectorAll('.menu-item').forEach(item => {
    item.addEventListener('click', async (e) => {
        e.preventDefault();
        const pageId = item.dataset.page;
        await sayfaYukle(pageId);
    });
});
const logoLink = document.querySelector('.logo-link');
if (logoLink) {
    logoLink.addEventListener('click', async (e) => {
        e.preventDefault();
        await sayfaYukle('welcome');
    });
}
    document.addEventListener('DOMContentLoaded', async () => {
        try {
            const [servisData, satisData, ilYeterlilik] = await Promise.all([
                fetch('/api/teknik-servisler').then(res => res.json()),
                fetch('/api/satislar').then(res => res.json()),
                fetch('/api/il-yeterlilik').then(res => res.json())
            ]);

            window.appData = {
                servisData,
                satisData,
                ilYeterlilik
            };
            await sayfaYukle('welcome');
            document.querySelectorAll('.menu-item').forEach(item => {
                item.addEventListener('click', async (e) => {
                    e.preventDefault();
                    const pageId = item.dataset.page;
                    await sayfaYukle(pageId);
                });
            });
            const logoLink = document.querySelector('.logo-link');
            if (logoLink) {
                logoLink.addEventListener('click', async (e) => {
                    e.preventDefault();
                    await sayfaYukle('welcome');
                });
            }

        } catch (error) {
            console.error('Başlangıç verisi yükleme hatası:', error);
        }
    });

    function servisSayilariniGoster(servisVerileri) {
        const ilServisSayilari = {};
        servisVerileri.forEach(servis => {
            const il = servis.il_adi;
            ilServisSayilari[il] = (ilServisSayilari[il] || 0) + 1;
        });
        const iller = document.querySelectorAll('#turkiye-haritasi path');
        iller.forEach(il => {
            const ilAdi = il.getAttribute('title');
            const servisSayisi = ilServisSayilari[ilAdi] || 0;
            const bbox = il.getBBox();
            const merkezX = bbox.x + bbox.width/2;
            const merkezY = bbox.y + bbox.height/2;
            const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
            text.setAttribute('x', merkezX);
            text.setAttribute('y', merkezY);
            text.setAttribute('dy', '0.35em');
            text.setAttribute('class', 'servis-sayisi');
            text.textContent = servisSayisi;
            document.querySelector('#turkiye-haritasi').appendChild(text);
        });
    }
    document.addEventListener('DOMContentLoaded', async () => {
        try {
            const response = await fetch('/api/servisler');
            const servisVerileri = await response.json();
            servisSayilariniGoster(servisVerileri);
        } catch (error) {
            console.error('Servis verileri yüklenirken hata:', error);
        }
    });
    const yeniServisBtn = document.querySelector('.yeni-servis-btn');
    const servisKaydetBtn = document.getElementById('servisKaydet');
    const modal = new bootstrap.Modal(document.getElementById('yeniServisModal'));
    yeniServisBtn.addEventListener('click', () => {
        const ilSelect = document.getElementById('il');
        ilSelect.innerHTML = '<option value="">İl Seçiniz</option>'; // Önce temizle
        const siraliIller = iller.sort((a, b) => 
            a.localeCompare(b, 'tr')
        );
        siraliIller.forEach(il => {
            const option = document.createElement('option');
            option.value = il;
            option.textContent = il;
            ilSelect.appendChild(option);
        });
        document.getElementById('yeniServisForm').reset();
        modal.show();
    });
    servisKaydetBtn.addEventListener('click', async () => {
        const form = document.getElementById('yeniServisForm');
        if (form.checkValidity()) {
            try {
                const yeniServis = {
                    servis_adi: document.getElementById('servisAdi').value.trim(),
                    il_adi: document.getElementById('il').value,
                    ilce_adi: document.getElementById('ilce').value.trim() || null
                };
                servisKaydetBtn.disabled = true;
                servisKaydetBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Kaydediliyor...';

                const response = await fetch('/api/teknik-servis/ekle', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(yeniServis)
                });

                const data = await response.json();

                if (response.ok) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Başarılı!',
                        text: 'Teknik servis başarıyla eklendi.',
                        confirmButtonText: 'Tamam'
                    });
                    if (typeof table !== 'undefined') {
                        await table.ajax.reload();
                    }
                    await teknikServisHaritasiOlustur();
                    modal.hide();
                } else {
                    throw new Error(data.message || 'Bir hata oluştu');
                }
            } catch (error) {
                console.error('Servis ekleme hatası:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Hata!',
                    text: `Servis eklenirken bir hata oluştu: ${error.message}`,
                    confirmButtonText: 'Tamam'
                });
            } finally {
                servisKaydetBtn.disabled = false;
                servisKaydetBtn.innerHTML = 'Kaydet';
            }
        } else {
            Swal.fire({
                icon: 'warning',
                title: 'Uyarı!',
                text: 'Lütfen tüm alanları doğru şekilde doldurun.',
                confirmButtonText: 'Tamam'
            });
            form.reportValidity();
        }
    });
    document.getElementById('haritaModal').addEventListener('shown.bs.modal', async function () {
        try {
            const buyukHaritaContainer = document.getElementById('buyuk-harita');
            const originalContainer = document.getElementById('turkiye-haritasi');
            buyukHaritaContainer.innerHTML = originalContainer.outerHTML;
            const modalHarita = buyukHaritaContainer.querySelector('#turkiye-haritasi');
            modalHarita.style.height = 'calc(100vh - 150px)';
            modalHarita.style.width = '100%';
            const servisBilgi = document.getElementById('servis-bilgi').cloneNode(true);
            buyukHaritaContainer.appendChild(servisBilgi);
            const response = await fetch('/api/servisler');
            const servisVerileri = await response.json();
            const ilServisSayilari = {};
            servisVerileri.forEach(servis => {
                const il = servis.il_adi;
                ilServisSayilari[il] = (ilServisSayilari[il] || 0) + 1;
            });
            const paths = modalHarita.querySelectorAll('path');
            paths.forEach(path => {
                const ilAdi = path.getAttribute('title');
                const servisSayisi = ilServisSayilari[ilAdi] || 0;
                const bbox = path.getBBox();
                const merkezX = bbox.x + bbox.width/2;
                const merkezY = bbox.y + bbox.height/2;
                
                if (servisSayisi > 0) {
                    const circle = document.createElementNS("http://www.w3.org/2000/svg", "g");
                    circle.setAttribute('class', 'servis-count-circle');
                    
                    const circleBackground = document.createElementNS("http://www.w3.org/2000/svg", "circle");
                    circleBackground.setAttribute('cx', merkezX);
                    circleBackground.setAttribute('cy', merkezY);
                    circleBackground.setAttribute('r', '15');
                    circleBackground.setAttribute('rx', '12');
                    circleBackground.setAttribute('ry', '12');
                    circleBackground.setAttribute('class', 'count-circle-bg');
                    
                    const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
                    text.setAttribute('x', merkezX);
                    text.setAttribute('y', merkezY);
                    text.setAttribute('dy', '0.35em');
                    text.setAttribute('class', 'count-text');
                    text.textContent = servisSayisi;
                    
                    circle.appendChild(circleBackground);
                    circle.appendChild(text);
                    modalHarita.appendChild(circle);
                }
                path.addEventListener('mousemove', function(e) {
                    const ilAdi = this.getAttribute('title');
                    const servisBilgiDiv = buyukHaritaContainer.querySelector('#servis-bilgi');
                    
                    if (servisBilgiDiv) {
                        const rect = modalHarita.getBoundingClientRect();
                        const x = e.clientX - rect.left + 10;
                        const y = e.clientY - rect.top + 10;
                        
                        servisBilgiDiv.style.left = x + 'px';
                        servisBilgiDiv.style.top = y + 'px';
                        servisBilgiDiv.style.display = 'block';
                        
                        servisBilgiDiv.innerHTML = `
                            <h4>${ilAdi}</h4>
                            <p>Teknik Servis Sayısı: ${servisSayisi}</p>
                        `;
                    }
                });

                path.addEventListener('mouseleave', function() {
                    const servisBilgiDiv = buyukHaritaContainer.querySelector('#servis-bilgi');
                    if (servisBilgiDiv) {
                        servisBilgiDiv.style.display = 'none';
                    }
                });
            });
            
        } catch (error) {
            console.error('Harita büyütme hatası:', error);
        }
    });
    document.getElementById('haritaModal').addEventListener('hidden.bs.modal', function () {
        const modalServisBilgi = document.getElementById('modal-servis-bilgi');
        if (modalServisBilgi) {
            modalServisBilgi.remove();
        }
    });
    const tooltipStyle = document.createElement('style');
    tooltipStyle.textContent = `
        .il-tooltip {
            position: fixed;
            transform: translate(-50%, -100%);
            margin-top: -5px;
        }
    `;
    document.head.appendChild(tooltipStyle);
    async function loadDashboardStats() {
        try {
            const response = await fetch('/api/dashboard/stats');
            const data = await response.json();
            document.getElementById('toplam-satis').textContent = data.totalSales.toLocaleString();
            document.getElementById('aktif-servis').textContent = data.activeServices;
            document.getElementById('yillik-satis').textContent = data.yearlySales.toLocaleString();
        } catch (error) {
            console.error('Stats loading error:', error);
        }
    }
    async function loadPerformanceChart() {
        try {
            const response = await fetch('/api/dashboard/performance');
            const data = await response.json();
            
            const ctx = document.getElementById('salesChart').getContext('2d');
            new Chart(ctx, {
                type: 'line',
                data: {
                    labels: data.map(item => item.year.toString()),
                    datasets: [{
                        label: 'Yıllık Satış',
                        data: data.map(item => item.total),
                        borderColor: '#0066ff',
                        tension: 0.4
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'top',
                        }
                    }
                }
            });
        } catch (error) {
            console.error('Chart loading error:', error);
        }
    }
    document.addEventListener('DOMContentLoaded', () => {
        loadDashboardStats();
        loadPerformanceChart();
    });
    function initializeHomeSlider() {
        const slider = document.querySelector('.slider-container');
        const slides = document.querySelectorAll('.slide');
        const dots = document.querySelectorAll('.nav-dot');
        let currentSlide = 0;
        let slideInterval;

        function updateSlider() {
            const slideWidth = slider.parentElement.offsetWidth;
            slider.style.transform = `translateX(-${currentSlide * slideWidth}px)`;
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === currentSlide);
            });
        }

        function startSlideShow() {
            stopSlideShow();
            slideInterval = setInterval(() => {
                currentSlide = (currentSlide + 1) % slides.length;
                updateSlider();
            }, 5000);
        }

        function stopSlideShow() {
            if (slideInterval) {
                clearInterval(slideInterval);
            }
        }
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                currentSlide = index;
                updateSlider();
                stopSlideShow();
                startSlideShow();
            });
        });
        window.addEventListener('resize', updateSlider);
        slider.addEventListener('mouseenter', stopSlideShow);
        slider.addEventListener('mouseleave', startSlideShow);
        updateSlider();
        startSlideShow();
    }
    function hesaplaServisYeterliligi(aracSayisi, servisSayisi, kapasite, dagilimPuani) {
        try {
            const idealServisSayisi = aracSayisi / 500; // Her 500 araç için 1 servis
            const normalizeServisOrani = Math.min(1, servisSayisi / idealServisSayisi);
            const kapasitePuani = Math.min(1, kapasite / aracSayisi);
            const skor = (0.5 * normalizeServisOrani) + (0.3 * dagilimPuani) + (0.2 * kapasitePuani);
            let degerlendirme = '';
            if (skor >= 0.8) {
                degerlendirme = 'Mükemmel';
            } else if (skor >= 0.6) {
                degerlendirme = 'Yeterli';
            } else if (skor >= 0.4) {
                degerlendirme = 'Geliştirilmeli';
            } else {
                degerlendirme = 'Yetersiz';
            }

            return {
                skor: parseFloat(skor.toFixed(2)),
                degerlendirme,
                detaylar: {
                    servisOrani: parseFloat(normalizeServisOrani.toFixed(2)),
                    kapasitePuani: parseFloat(kapasitePuani.toFixed(2)),
                    dagilimPuani: parseFloat(dagilimPuani.toFixed(2))
                }
            };
        } catch (error) {
            console.error('Servis yeterliliği hesaplama hatası:', error);
            return null;
        }
    }
    async function testIlServisYeterliligi() {
        try {
            const servisResponse = await fetch('/api/teknik-servisler');
            const servisler = await servisResponse.json();
            const satisResponse = await fetch('/api/satislar');
            const satislar = await satisResponse.json();
            const ilVerileri = {};
            satislar.forEach(satis => {
                if (!ilVerileri[satis.il_adi]) {
                    ilVerileri[satis.il_adi] = {
                        aracSayisi: 0,
                        servisSayisi: 0,
                        kapasite: 0,
                        dagilimPuani: 0.5 // Varsayılan değer
                    };
                }
                ilVerileri[satis.il_adi].aracSayisi += satis.satistoplam;
            });
            servisler.forEach(servis => {
                if (!ilVerileri[servis.il_adi]) {
                    ilVerileri[servis.il_adi] = {
                        aracSayisi: 0,
                        servisSayisi: 0,
                        kapasite: 0,
                        dagilimPuani: 0.5
                    };
                }
                ilVerileri[servis.il_adi].servisSayisi += 1;
                ilVerileri[servis.il_adi].kapasite += 500;
            });
            Object.keys(ilVerileri).forEach(il => {
                const servisSayisi = ilVerileri[il].servisSayisi;
                ilVerileri[il].dagilimPuani = servisSayisi > 1 ? 0.8 : 0.4;
            });
            console.group('İl Bazında Servis Yeterlilik Analizi');
            
            const sonuclar = Object.entries(ilVerileri)
                .map(([il, veri]) => {
                    const sonuc = hesaplaServisYeterliligi(
                        veri.aracSayisi || 1, // 0'a bölünmeyi önlemek için
                        veri.servisSayisi,
                        veri.kapasite,
                        veri.dagilimPuani
                    );
                    
                    return {
                        il,
                        ...veri,
                        sonuc
                    };
                })
                .sort((a, b) => (b.sonuc?.skor || 0) - (a.sonuc?.skor || 0));
            console.table(sonuclar.map(s => ({
                İl: s.il,
                'Araç Sayısı': s.aracSayisi,
                'Servis Sayısı': s.servisSayisi,
                'Kapasite': s.kapasite,
                'Skor': s.sonuc?.skor || 0,
                'Değerlendirme': s.sonuc?.degerlendirme || 'Hesaplanamadı'
            })));
            const skorlar = sonuclar.map(s => s.sonuc?.skor || 0);
            const ortalamaSkor = skorlar.reduce((a, b) => a + b, 0) / skorlar.length;
            
            console.log('\nÖzet İstatistikler:');
            console.log(`Ortalama Skor: ${ortalamaSkor.toFixed(2)}`);
            console.log(`En Yüksek Skor: ${Math.max(...skorlar).toFixed(2)}`);
            console.log(`En Düşük Skor: ${Math.min(...skorlar).toFixed(2)}`);
            const degerlendirmeDagilimi = sonuclar.reduce((acc, s) => {
                const deg = s.sonuc?.degerlendirme || 'Hesaplanamadı';
                acc[deg] = (acc[deg] || 0) + 1;
                return acc;
            }, {});
            
            console.log('\nDeğerlendirme Dağılımı:');
            console.table(degerlendirmeDagilimi);

            console.groupEnd();

        } catch (error) {
            console.error('İl bazlı servis yeterliliği analizi hatası:', error);
        }
    }
    async function servisIstatistikleriTablosunuOlustur() {
        try {
            const response = await fetch('/api/il-yeterlilik');
            const ilYeterlilikleri = await response.json();
            if ($.fn.DataTable.isDataTable('#servisIstatistikleriTable')) {
                $('#servisIstatistikleriTable').DataTable().destroy();
            }

            initServisIstatistikleriTable(ilYeterlilikleri);
            const skorlar = ilYeterlilikleri.map(il => il.yeterlilik_orani);
            const ortalamaSkor = skorlar.reduce((a, b) => a + b, 0) / skorlar.length;
            const degerlendirmeDagilimi = ilYeterlilikleri.reduce((acc, il) => {
                acc[il.yeterlilik_durumu] = (acc[il.yeterlilik_durumu] || 0) + 1;
                return acc;
            }, {});
            document.getElementById('ortalamaSkor').textContent = ortalamaSkor.toFixed(2);
            document.getElementById('mukemmelSayi').textContent = degerlendirmeDagilimi['Mükemmel'] || 0;
            document.getElementById('yeterliSayi').textContent = degerlendirmeDagilimi['Yeterli'] || 0;
            document.getElementById('gelistirilmeliSayi').textContent = degerlendirmeDagilimi['Geliştirilmeli'] || 0;
            document.getElementById('yetersizSayi').textContent = (degerlendirmeDagilimi['Yetersiz'] || 0) + (degerlendirmeDagilimi['Teknik Servis Yok'] || 0);

        } catch (error) {
            console.error('Servis istatistikleri tablosu oluşturma hatası:', error);
        }
    }
    function getDegerlendirmeSirasi(degerlendirme) {
        const siralama = {
            'Mükemmel': 1,
            'Yeterli': 2,
            'Geliştirilmeli': 3,
            'Yetersiz': 4,
            'Hesaplanamadı': 5
        };
        return siralama[degerlendirme] || 6;
    }
    async function showPage(pageId) {
        try {
            document.querySelectorAll('.page').forEach(page => {
                page.style.display = 'none';
            });
            const selectedPage = document.getElementById(pageId);
            if (selectedPage) {
                selectedPage.style.display = 'block';
                if (pageId === 'raporlar') {
                    destroyCharts();
                    await createCharts();
                    await initializeIlDurumlariChart();
                }
            }
            document.querySelectorAll('.menu-item').forEach(item => {
                item.classList.remove('active');
                if (item.dataset.page === pageId) {
                    item.classList.add('active');
                }
            });

        } catch (error) {
            console.error('Sayfa geçiş hatası:', error);
        }
    }
    document.querySelector('.welcome-btn.primary').addEventListener('click', async () => {
        await showPage('raporlar');
    });

    document.addEventListener('DOMContentLoaded', () => {
        showPage('dashboard');
        document.querySelectorAll('[data-page]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const pageId = e.currentTarget.getAttribute('data-page');
                showPage(pageId);
            });
        });
    });

    document.addEventListener('DOMContentLoaded', () => {
        const tumIllerModal = document.getElementById('tumIllerModal');
        tumIllerModal.addEventListener('hidden.bs.modal', function () {
            document.body.classList.remove('modal-open');
            const backdrop = document.querySelector('.modal-backdrop');
            if (backdrop) {
                backdrop.remove();
            }
        });
    });

    document.addEventListener('DOMContentLoaded', () => {
        const tumIllerBtn = document.getElementById('tumIllerBtn');
        const geriDonBtn = document.getElementById('geriDonBtn');
        
        tumIllerBtn.addEventListener('click', () => {
            document.getElementById('birimler').style.display = 'none';
            document.getElementById('il-analiz').style.display = 'block';
            ilBilgileriniGuncelle(); // İl grid'ini güncelle
        });
        
        geriDonBtn.addEventListener('click', () => {
            document.getElementById('il-analiz').style.display = 'none';
            document.getElementById('birimler').style.display = 'block';
        });
    });

    document.addEventListener('DOMContentLoaded', () => {
        document.getElementById('sortByName').addEventListener('click', () => {
            const ilGrid = document.getElementById('ilGrid');
            const cards = Array.from(ilGrid.children);
            
            cards.sort((a, b) => {
                const nameA = a.querySelector('h3').textContent;
                const nameB = b.querySelector('h3').textContent;
                return nameA.localeCompare(nameB);
            });
            
            cards.forEach(card => ilGrid.appendChild(card));
        });

        document.getElementById('sortByScore').addEventListener('click', () => {
            const ilGrid = document.getElementById('ilGrid');
            const cards = Array.from(ilGrid.children);
            
            cards.sort((a, b) => {
                const scoreA = parseFloat(a.querySelector('p:nth-child(4)').textContent.split(': ')[1]);
                const scoreB = parseFloat(b.querySelector('p:nth-child(4)').textContent.split(': ')[1]);
                return scoreB - scoreA;
            });
            
            cards.forEach(card => ilGrid.appendChild(card));
        });

        document.getElementById('sortByServiceCount').addEventListener('click', () => {
            const ilGrid = document.getElementById('ilGrid');
            const cards = Array.from(ilGrid.children);
            
            cards.sort((a, b) => {
                const countA = parseInt(a.querySelector('p:nth-child(2)').textContent.split(': ')[1]);
                const countB = parseInt(b.querySelector('p:nth-child(2)').textContent.split(': ')[1]);
                return countB - countA;
            });
            
            cards.forEach(card => ilGrid.appendChild(card));
        });
    });

    document.addEventListener('DOMContentLoaded', () => {
        const sortDirections = {
            name: 'asc',
            score: 'desc',
            serviceCount: 'desc'
        };
        document.getElementById('sortByName').addEventListener('click', () => {
            const ilGrid = document.getElementById('ilGrid');
            const cards = Array.from(ilGrid.children);
            
            cards.sort((a, b) => {
                const nameA = a.querySelector('h3').textContent;
                const nameB = b.querySelector('h3').textContent;
                return sortDirections.name === 'asc' 
                    ? nameA.localeCompare(nameB) 
                    : nameB.localeCompare(nameA);
            });
            
            cards.forEach(card => ilGrid.appendChild(card));
            const button = document.getElementById('sortByName');
            sortDirections.name = sortDirections.name === 'asc' ? 'desc' : 'asc';
            button.querySelector('i').className = `fas fa-sort-alpha-${sortDirections.name}`;
        });

        document.getElementById('sortByScore').addEventListener('click', () => {
            const ilGrid = document.getElementById('ilGrid');
            const cards = Array.from(ilGrid.children);
            
            cards.sort((a, b) => {
                const scoreA = parseFloat(a.querySelector('p:nth-child(4)').textContent.split(': ')[1]);
                const scoreB = parseFloat(b.querySelector('p:nth-child(4)').textContent.split(': ')[1]);
                return sortDirections.score === 'desc' 
                    ? scoreB - scoreA 
                    : scoreA - scoreB;
            });
            
            cards.forEach(card => ilGrid.appendChild(card));
            const button = document.getElementById('sortByScore');
            sortDirections.score = sortDirections.score === 'desc' ? 'asc' : 'desc';
            button.querySelector('i').className = `fas fa-sort-numeric-${sortDirections.score}`;
        });

        document.getElementById('sortByServiceCount').addEventListener('click', () => {
            const ilGrid = document.getElementById('ilGrid');
            const cards = Array.from(ilGrid.children);
            
            cards.sort((a, b) => {
                const countA = parseInt(a.querySelector('p:nth-child(2)').textContent.split(': ')[1]);
                const countB = parseInt(b.querySelector('p:nth-child(2)').textContent.split(': ')[1]);
                return sortDirections.serviceCount === 'desc' 
                    ? countB - countA 
                    : countA - countB;
            });
            
            cards.forEach(card => ilGrid.appendChild(card));
            const button = document.getElementById('sortByServiceCount');
            sortDirections.serviceCount = sortDirections.serviceCount === 'desc' ? 'asc' : 'desc';
            button.querySelector('i').className = `fas fa-sort-amount-${sortDirections.serviceCount}`;
        });
    });
    async function initializeIlDurumlariChart() {
        try {
            const response = await fetch('/api/il-yeterlilik');
            const ilVerileri = await response.json();
            const durumlar = {
                'Mükemmel': 0,
                'Yeterli': 0,
                'Geliştirilmeli': 0,
                'Yetersiz': 0,
                'Teknik Servis Yok': 0
            };

            ilVerileri.forEach(il => {
                durumlar[il.yeterlilik_durumu]++;
            });
            const baseColor = '#d32f2f'; // Ana kırmızı renk
            const backgroundColor = 'rgba(211, 47, 47, 0.7)'; // Yarı saydam kırmızı

            const ctx = document.getElementById('ilDurumlariChart').getContext('2d');
            new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: Object.keys(durumlar),
                    datasets: [{
                        label: 'İl Sayısı',
                        data: Object.values(durumlar),
                        backgroundColor: backgroundColor,
                        borderColor: baseColor,
                        borderWidth: 1,
                        maxBarThickness: 50, // Sütun maksimum genişliği
                        barPercentage: 0.7 // Sütunların birbirine göre genişlik oranı
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        title: {
                            display: true,
                            text: 'İl Bazlı Servis Durumu Dağılımı',
                            font: {
                                size: 16,
                                weight: 600
                            },
                            color: '#1a2b4c',
                            padding: 20
                        },
                        legend: {
                            display: false
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: {
                                stepSize: 1,
                                color: '#64748b'
                            },
                            grid: {
                                color: '#e5e9f2'
                            }
                        },
                        x: {
                            ticks: {
                                color: '#64748b'
                            },
                            grid: {
                                display: false
                            }
                        }
                    }
                }
            });
        } catch (error) {
            console.error('İl durumları grafiği oluşturma hatası:', error);
        }
    }
    function initializeDashboardCharts() {
        initializeIlDurumlariChart();
    }
    async function updateKPIs(data = null) {
        try {
            if (!data) {
                const [servisData, satisData, ilYeterlilik] = await Promise.all([
                    fetch('/api/teknik-servisler').then(res => res.json()),
                    fetch('/api/satislar').then(res => res.json()),
                    fetch('/api/il-yeterlilik').then(res => res.json())
                ]);
                data = { servisData, satisData, ilYeterlilik };
            }
            const karsilamaOrani = KPICalculator.calculateServisKarsilamaOrani(data.servisData, data.satisData);
            document.getElementById('servisKarsilamaOrani').textContent = `%${karsilamaOrani}`;
            const verimlilik = KPICalculator.calculateServisVerimliligi(data.servisData, data.satisData);
            document.getElementById('servisVerimliligi').textContent = verimlilik;
            const kritikIlSayisi = KPICalculator.calculateKritikIlSayisi(data.ilYeterlilik);
            document.getElementById('kritikIlSayisi').textContent = kritikIlSayisi;
            updateTrend('servisKarsilamaTrend', 5.2);
            updateTrend('servisVerimlilikTrend', -2.1);
            updateTrend('kritikIlTrend', -1);

        } catch (error) {
            console.error('KPI güncelleme hatası:', error);
        }
    }
    function updateTrend(elementId, value) {
        const trendElement = document.getElementById(elementId);
        if (!trendElement) return;

        const icon = value >= 0 ? '↑' : '↓';
        const cssClass = value >= 0 ? 'positive' : 'negative';
        
        trendElement.className = `kpi-trend ${cssClass}`;
        trendElement.innerHTML = `
            <span class="trend-icon">${icon}</span>
            <span class="trend-value">%${Math.abs(value)}</span>
        `;
    }
    async function initializeKDS(data = null) {
        try {
            if (!data) {
                const [servisData, satisData, ilYeterlilik] = await Promise.all([
                    fetch('/api/teknik-servisler').then(res => res.json()),
                    fetch('/api/satislar').then(res => res.json()),
                    fetch('/api/il-yeterlilik').then(res => res.json())
                ]);
                data = { servisData, satisData, ilYeterlilik };
            }
            await updateKPIs(data);
            updateBolgeselKarsilamaTable(data.servisData, data.satisData);
            updateServisVerimlilikTable(data.servisData, data.satisData);
            updateKritikIlTable(data.ilYeterlilik, data.servisData);
        } catch (error) {
            console.error('KDS başlatma hatası:', error);
        }
    }
    function updateIlDurumlariTable(data) {
        const table = $('#ilDurumlariTable').DataTable();
        table.clear();

        const baseColor = '#3b82f6'; // Ana mavi renk
        const backgroundColor = 'rgba(59, 130, 246, 0.7)'; // Yarı saydam mavi

        Object.entries(data).forEach(([durum, sayi]) => {
            table.row.add([
                durum,
                {
                    display: `<div class="progress">
                        <div class="progress-bar" role="progressbar" 
                            style="width: ${(sayi/81*100).toFixed(1)}%; background-color: ${backgroundColor};" 
                            aria-valuenow="${sayi}" aria-valuemin="0" aria-valuemax="81">
                            ${sayi} il (${(sayi/81*100).toFixed(1)}%)
                        </div>
                    </div>`,
                    value: sayi
                }
            ]);
        });

        table.draw();
    }
    function initServisIstatistikleriTable(ilYeterlilikleri) {
        $('#servisIstatistikleriTable').DataTable({
            data: ilYeterlilikleri.map(il => {
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

                return {
                    ...il,
                    yeterlilik_orani: oran,
                    yeterlilik_durumu: durum
                };
            }),
            autoWidth: false,
            columns: [
                { 
                    data: 'il_adi',
                    title: 'İl',
                    width: '15%'
                },
                { 
                    data: 'satis',
                    title: 'Araç Sayısı',
                    width: '15%',
                    render: function(data) {
                        return data.toLocaleString();
                    }
                },
                { 
                    data: 'servis_sayisi',
                    title: 'Servis Sayısı',
                    width: '15%'
                },
                { 
                    data: null,
                    title: 'Toplam Kapasite',
                    width: '15%',
                    render: function(data) {
                        return (data.servis_sayisi * 500).toLocaleString();
                    }
                },
                { 
                    data: 'yeterlilik_orani',
                    title: 'Yeterlilik Skoru',
                    width: '15%',
                    render: function(data) {
                        return data.toFixed(2);
                    }
                },
                { 
                    data: 'yeterlilik_durumu',
                    title: 'Değerlendirme',
                    width: '25%',
                    render: function(data) {
                        const renkler = {
                            'Mükemmel': 'success',
                            'Yeterli': 'info',
                            'Geliştirilmeli': 'warning',
                            'Yetersiz': 'danger',
                            'Teknik Servis Yok': 'secondary'
                        };
                        const renk = renkler[data] || 'secondary';
                        return `<span class="badge bg-${renk}">${data}</span>`;
                    }
                }
            ],
            scrollX: true,
            scrollCollapse: true,
            language: {
                url: '//cdn.datatables.net/plug-ins/1.13.7/i18n/tr.json'
            },
            responsive: true,
            dom: '<"table-top-controls"Bf>rt<"bottom"lip>',
            buttons: [
                {
                    extend: 'collection',
                    text: 'Dışa Aktar',
                    buttons: ['copy', 'excel', 'pdf', 'print']
                }
            ],
            pageLength: 100,  // Sayfa başına 100 satır göster
            lengthChange: false, // Sayfa uzunluğu değiştirme seçeneğini kaldır
            order: [[4, 'desc']], // Yeterlilik skoruna göre sırala
            initComplete: function() {
                const column = this.api().column(0); // İl sütunu
                const headerCell = $(column.header());
                
                if (headerCell.find('select').length === 0) {
                    const select = $('<select class="form-select"><option value="">Tüm İller</option></select>')
                        .appendTo(headerCell)
                        .on('change', function() {
                            const val = $.fn.dataTable.util.escapeRegex($(this).val());
                            column.search(val ? '^'+val+'$' : '', true, false).draw();
                        });
                    const iller = column.data().unique().sort().toArray();
                    iller.forEach(il => {
                        if (il) {
                            select.append(`<option value="${il}">${il}</option>`);
                        }
                    });
                }
            }
        });
    }
    function updateIlDurumlariGrafik(ilYeterlilikleri) {
        const ilDurumlari = ilYeterlilikleri.map(il => {
            const kapasite = il.servis_sayisi * 500;
            const oran = il.servis_sayisi === 0 ? 0 : kapasite / il.satis;
            
            if (il.servis_sayisi === 0) {
                return 'Teknik Servis Yok';
            } else if (oran >= 1.5) {
                return 'Mükemmel';
            } else if (oran >= 1.0 && oran < 1.5) {
                return 'Yeterli';
            } else if (oran >= 0.6 && oran < 1.0) {
                return 'Geliştirilmeli';
            } else {
                return 'Yetersiz';
            }
        });
        const durumSayilari = {
            'Mükemmel': 0,
            'Yeterli': 0,
            'Geliştirilmeli': 0,
            'Yetersiz': 0,
            'Teknik Servis Yok': 0
        };

        ilDurumlari.forEach(durum => {
            durumSayilari[durum]++;
        });
        const ctx = document.getElementById('ilDurumlariGrafik').getContext('2d');
        if (window.ilDurumlariChart) {
            window.ilDurumlariChart.destroy();
        }

        window.ilDurumlariChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: Object.keys(durumSayilari),
                datasets: [{
                    label: 'İl Sayısı',
                    data: Object.values(durumSayilari),
                    backgroundColor: [
                        '#28a745', // Mükemmel - Yeşil
                        '#17a2b8', // Yeterli - Mavi
                        '#ffc107', // Geliştirilmeli - Sarı
                        '#dc3545', // Yetersiz - Kırmızı
                        '#6c757d'  // Teknik Servis Yok - Gri
                    ]
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            stepSize: 1
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        });
        updateIlDurumlariTable(durumSayilari);
    }
