async function runServiceSimulation() {
    try {
        const newServiceCount = parseInt(document.getElementById('newServiceCount').value);
        const selectedRegion = document.getElementById('regionSelect').value;

        if (!newServiceCount || newServiceCount < 1) {
            Swal.fire({
                icon: 'warning',
                title: 'Geçersiz Değer',
                text: 'Lütfen açılacak servis sayısını giriniz.'
            });
            return;
        }
        const [servisData, satisData, ilYeterlilik] = await Promise.all([
            fetch('/api/teknik-servisler').then(res => res.json()),
            fetch('/api/satislar').then(res => res.json()),
            fetch('/api/il-yeterlilik').then(res => res.json())
        ]);
        if (!servisData?.length || !satisData?.length || !ilYeterlilik?.length) {
            throw new Error('Veri alınamadı');
        }
        let filteredData = {
            servisData: servisData,
            satisData: satisData,
            ilYeterlilik: ilYeterlilik
        };

        if (selectedRegion !== 'all') {
            filteredData = {
                servisData: servisData.filter(s => s.bolge_adi === selectedRegion),
                satisData: satisData.filter(s => s.bolge_adi === selectedRegion),
                ilYeterlilik: ilYeterlilik.filter(il => {
                    const ilBolgesi = servisData.find(s => s.il_adi === il.il_adi)?.bolge_adi || 
                                    satisData.find(s => s.il_adi === il.il_adi)?.bolge_adi;
                    return ilBolgesi === selectedRegion;
                })
            };
        }
        window.appData = filteredData;
        const ilAnalizi = analyzeProvinces(
            filteredData.servisData, 
            filteredData.satisData, 
            filteredData.ilYeterlilik
        );
        const oneriler = generateRecommendations(ilAnalizi, newServiceCount);
        displaySimulationResults(oneriler, selectedRegion);
        await Promise.all([
            updateBolgeselKarsilamaTable(servisData, satisData),
            updateServisVerimlilikTable(servisData, satisData),
            updateKPIs(window.appData)
        ]).catch(err => console.warn('Tablo güncelleme hatası:', err));
        const bolgeMesaji = selectedRegion === 'all' ? 'Tüm Türkiye' : selectedRegion;
        Swal.fire({
            icon: 'success',
            title: 'Simülasyon Tamamlandı',
            text: `${bolgeMesaji} için öneriler başarıyla oluşturuldu.`,
            timer: 1500,
            showConfirmButton: false,
            position: 'top-end',
            toast: true,
            width: 'auto',
            padding: '0.75em',
            customClass: {
                popup: 'simulation-toast',
                title: 'simulation-toast-title',
                content: 'simulation-toast-content'
            }
        });

    } catch (error) {
        console.error('Simülasyon hatası:', error);
        if (error.message === 'Veri alınamadı') {
            Swal.fire({
                icon: 'error',
                title: 'Hata',
                text: 'Simülasyon için gerekli veriler alınamadı. Lütfen tekrar deneyin.'
            });
        }
    }
}

function analyzeProvinces(servisData, satisData, ilYeterlilik) {
    const ilAnalizi = {};
    ilYeterlilik.forEach(il => {
        const mevcutServis = servisData.filter(s => s.il_adi === il.il_adi).length;
        const ilSatislari = satisData
            .filter(s => s.il_adi === il.il_adi)
            .reduce((acc, s) => acc + s.satistoplam, 0);

        ilAnalizi[il.il_adi] = {
            mevcutServis,
            aracSayisi: ilSatislari,
            servisAracOrani: mevcutServis > 0 ? ilSatislari / mevcutServis : Infinity,
            yeterlilikDurumu: il.yeterlilik_durumu
        };
    });

    return ilAnalizi;
}

function generateRecommendations(ilAnalizi, yeniServisSayisi) {
    let kalanServisSayisi = yeniServisSayisi;
    const oneriler = [];
    const ilPuanlari = Object.entries(ilAnalizi).map(([il, data]) => {
        let puan = 0;
        const aracPuani = Math.min(100, (data.aracSayisi / 1000) * 20);
        puan += aracPuani;

        if (data.mevcutServis === 0) {
            puan += Math.min(80, (data.aracSayisi / 500) * 40);
        } else {
            const kapasite = data.mevcutServis * 500;
            const fazlaArac = data.aracSayisi - kapasite;
            if (fazlaArac > 0) {
                puan += Math.min(100, (fazlaArac / 500) * 50);
            }
        }
        switch(data.yeterlilikDurumu) {
            case 'Teknik Servis Yok':
                puan += Math.min(70, (data.aracSayisi / 300) * 30);
                break;
            case 'Yetersiz':
                puan += 60;
                break;
            case 'Geliştirilmeli':
                puan += 40;
                break;
            case 'Yeterli':
                puan += 20;
                break;
        }

        if (data.servisAracOrani !== Infinity) {
            const optimal = 500;
            const sapma = Math.abs(data.servisAracOrani - optimal);
            const oranPuani = Math.min(50, (sapma / optimal) * 100);
            puan += oranPuani;
        }
        const gerekliServisSayisi = Math.ceil(data.aracSayisi / 500);
        const ihtiyacServisSayisi = Math.max(0, gerekliServisSayisi - data.mevcutServis);

        return {
            il,
            puan: Math.round(puan),
            puanDetay: {
                aracPuani: Math.round(aracPuani),
                yeterlilikPuani: Math.round(puan - aracPuani)
            },
            ihtiyacServisSayisi,
            ...data
        };
    }).sort((a, b) => b.puan - a.puan);
    for (const il of ilPuanlari) {
        if (kalanServisSayisi <= 0) break;
        
        if (il.ihtiyacServisSayisi > 0) {
            const verilecekServis = Math.min(il.ihtiyacServisSayisi, kalanServisSayisi);
            kalanServisSayisi -= verilecekServis;
            
            oneriler.push({
                ...il,
                onerilenServisSayisi: verilecekServis
            });
        }
    }

    return oneriler;
}

function displaySimulationResults(oneriler, selectedRegion) {
    const tableBody = document.getElementById('simulationResultsTable');
    tableBody.innerHTML = '';

    if (oneriler.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="6" class="text-center">
                    <div class="alert alert-info m-3">
                        ${selectedRegion === 'all' ? 'Türkiye genelinde' : selectedRegion + ' bölgesinde'} 
                        yeni servis önerisi bulunmamaktadır.
                    </div>
                </td>
            </tr>
        `;
        return;
    }

    oneriler.forEach((oneri, index) => {
        const priorityClass = index < 3 ? 'priority-high' : 
                            index < 6 ? 'priority-medium' : 'priority-low';

        const gerekliServisSayisi = Math.ceil(oneri.aracSayisi / 500);
        const ekGerekliServis = Math.max(0, gerekliServisSayisi - oneri.mevcutServis);

        const row = `
            <tr>
                <td>
                    <div class="priority-cell">
                        <span class="priority-indicator ${priorityClass}">${index + 1}</span>
                    </div>
                </td>
                <td>${oneri.il}</td>
                <td>
                    <div class="servis-info">
                        <span>Mevcut: ${oneri.mevcutServis}</span>
                        <span class="servis-gerekli">Gerekli: ${gerekliServisSayisi}</span>
                        <span class="servis-ek">Önerilen: +${oneri.onerilenServisSayisi}</span>
                    </div>
                </td>
                <td>${oneri.aracSayisi.toLocaleString()}</td>
                <td>${Math.round(oneri.servisAracOrani).toLocaleString()}</td>
                <td>
                    <div class="recommendation-detail">
                        ${generateDetailedRecommendation(oneri)}
                    </div>
                </td>
            </tr>
        `;
        tableBody.innerHTML += row;
    });
}

function generateDetailedRecommendation(oneri) {
    const puanDetay = `
        <div class="puan-detay">
            <span>Toplam Puan: ${oneri.puan}</span> | 
            <span>Araç Puanı: ${oneri.puanDetay.aracPuani}</span> | 
            <span>Yeterlilik Puan: ${oneri.puanDetay.yeterlilikPuani}</span>
        </div>
    `;
    
    if (oneri.mevcutServis === 0) {
        return `
            <div>Acil servis ihtiyacı. ${oneri.aracSayisi.toLocaleString()} araç için ${oneri.onerilenServisSayisi} yeni servis önerildi.</div>
            <div>(Toplam ihtiyaç: ${oneri.ihtiyacServisSayisi})</div>
            ${puanDetay}
        `;
    }

    const kapasite = oneri.mevcutServis * 500;
    const fazlaArac = oneri.aracSayisi - kapasite;

    if (fazlaArac > 0) {
        return `
            <div>Mevcut ${oneri.mevcutServis} servis toplam ${kapasite.toLocaleString()} araç kapasiteli.</div>
            <div>${fazlaArac.toLocaleString()} araç için ${oneri.onerilenServisSayisi} yeni servis önerildi.</div>
            <div>(Toplam ihtiyaç: ${oneri.ihtiyacServisSayisi})</div>
            ${puanDetay}
        `;
    }

    const kapasite_kullanim_orani = Math.round((oneri.aracSayisi / kapasite) * 100);
    return `
        <div>Mevcut ${oneri.mevcutServis} servis yeterli</div>
        <div>(Kapasite kullanımı: %${kapasite_kullanim_orani})</div>
        <div>Optimizasyon önerilir</div>
        ${puanDetay}
    `;
} 
let bolgeKarsilastirmaInstance = null;

class BolgeKarsilastirma {
    constructor() {
        if (bolgeKarsilastirmaInstance) {
            return bolgeKarsilastirmaInstance;
        }

        this.selectedBolgeler = new Set();
        this.charts = [];
        this.initializeEventListeners();
        this.createBolgeTickbar();
        bolgeKarsilastirmaInstance = this;
    }

    createBolgeTickbar() {
        const bolgeler = [
            { id: 'MARMARA', name: 'Marmara', icon: 'map-marker' },
            { id: 'EGE', name: 'Ege', icon: 'map-marker' },
            { id: 'AKDENIZ', name: 'Akdeniz', icon: 'map-marker' },
            { id: 'İÇ ANADOLU', name: 'İç Anadolu', icon: 'map-marker' },
            { id: 'KARADENİZ', name: 'Karadeniz', icon: 'map-marker' },
            { id: 'DOĞU ANADOLU', name: 'Doğu Anadolu', icon: 'map-marker' },
            { id: 'GÜNEYDOĞU ANADOLU', name: 'Güneydoğu Anadolu', icon: 'map-marker' }
        ];

        const tickbarDiv = document.querySelector('.bolge-tickbar');
        if (!tickbarDiv) return;
        tickbarDiv.innerHTML = bolgeler.map(bolge => `
            <div class="bolge-tick" data-bolge="${bolge.id}">
                <input type="checkbox" id="bolge-${bolge.id}" value="${bolge.id}">
                <label for="bolge-${bolge.id}">
                    ${bolge.name}
                </label>
            </div>
        `).join('');
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        const tickbar = document.getElementById('bolge-tickbar');
        const karsilastirBtn = document.getElementById('karsilastir-btn');
        
        if (!tickbar || !karsilastirBtn) return;

        tickbar.addEventListener('change', (e) => {
            if (e.target.type === 'checkbox') {
                if (e.target.checked) {
                    this.selectedBolgeler.add(e.target.value);
                } else {
                    this.selectedBolgeler.delete(e.target.value);
                }
            }
        });

        karsilastirBtn.addEventListener('click', () => this.karsilastirBolgeler());
        document.querySelectorAll('.kds-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                document.querySelectorAll('.kds-tab').forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                const tabId = tab.dataset.tab;
                document.querySelectorAll('.kds-tab-content').forEach(content => {
                    content.classList.remove('active');
                    if (content.dataset.tab === tabId) {
                        content.classList.add('active');
                    }
                });
            });
        });
    }

    async karsilastirBolgeler() {
        if (this.selectedBolgeler.size === 0) {
            Swal.fire({
                icon: 'warning',
                title: 'Seçim Yapılmadı',
                text: 'Lütfen en az bir bölge seçin'
            });
            return;
        }

        try {
            const response = await fetch(`/api/bolge-karsilastirma?bolgeler=${Array.from(this.selectedBolgeler).join(',')}`);
            if (!response.ok) throw new Error('Veri alınamadı');
            
            const data = await response.json();
            this.renderKarsilastirma(data);
        } catch (error) {
            console.error('Karşılaştırma hatası:', error);
            Swal.fire({
                icon: 'error',
                title: 'Hata',
                text: 'Karşılaştırma yapılırken bir hata oluştu'
            });
        }
    }

    renderKarsilastirma(data) {
        this.charts.forEach(chart => chart.destroy());
        this.charts = [];

        const grafiklerDiv = document.getElementById('bolge-grafikleri');
        const detaylarDiv = document.getElementById('bolge-detaylari');

        if (!grafiklerDiv || !detaylarDiv) return;

        grafiklerDiv.innerHTML = `
            <div class="chart-container">
                <canvas id="performansGrafigi"></canvas>
            </div>
            <div class="chart-container">
                <canvas id="servisKarsilamaGrafigi"></canvas>
            </div>
            <div class="chart-container">
                <canvas id="satisServisOranGrafigi"></canvas>
            </div>
        `;
        this.createPerformanceChart(data, document.getElementById('performansGrafigi'));
        this.createServiceCoverageChart(data, document.getElementById('servisKarsilamaGrafigi'));
        this.createSalesServiceRatioChart(data, document.getElementById('satisServisOranGrafigi'));
        this.showDetailedInfo(data, detaylarDiv);
    }

    createPerformanceChart(data, canvas) {
        const chart = new Chart(canvas, {
            type: 'bar',
            data: {
                labels: data.map(d => d.bolge_adi),
                datasets: [{
                    label: 'Performans Skoru',
                    data: data.map(d => d.performans_skoru.genel_skor * 100),
                    backgroundColor: data.map(d => this.getPerformanceColor(d.performans_skoru.genel_skor)),
                    borderRadius: 8,
                    maxBarThickness: 50
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: 'Bölgelerin Genel Performans Değerlendirmesi',
                        padding: {
                            top: 10,
                            bottom: 20
                        },
                        font: {
                            size: 16,
                            weight: '500'
                        }
                    },
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return `Performans: %${context.raw.toFixed(1)}`;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 150,
                        title: {
                            display: true,
                            text: 'Performans (%)',
                            font: {
                                size: 12
                            }
                        },
                        ticks: {
                            callback: value => `%${value}`
                        }
                    },
                    x: {
                        ticks: {
                            maxRotation: 45,
                            minRotation: 45
                        }
                    }
                }
            }
        });
        this.charts.push(chart);
    }

    createDetailedMetricsChart(data, canvas) {
        const pieData = data.map(bolge => ({
            bolge: bolge.bolge_adi,
            servisOrani: (bolge.temel_metrikler.servis_sayisi / bolge.temel_metrikler.il_sayisi).toFixed(2),
            satisOrani: (bolge.temel_metrikler.toplam_satis / 
                data.reduce((acc, curr) => acc + curr.temel_metrikler.toplam_satis, 0) * 100).toFixed(1),
            kapasiteKullanimi: Math.min(100, Math.round((bolge.temel_metrikler.toplam_satis / 
                (bolge.temel_metrikler.servis_sayisi * 500)) * 100))
        }));

        const chart = new Chart(canvas, {
            type: 'doughnut',
            data: {
                labels: pieData.map(d => d.bolge),
                datasets: [{
                    data: pieData.map(d => d.satisOrani),
                    backgroundColor: this.getPerformanceColors(data),
                    borderWidth: 2,
                    borderColor: '#ffffff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '60%',
                plugins: {
                    title: {
                        display: true,
                        text: 'Bölgesel Satış Dağılımı (%)',
                        padding: {
                            top: 25,
                            bottom: 25
                        },
                        font: {
                            size: 20,
                            weight: '500'
                        }
                    },
                    legend: {
                        position: 'right',
                        labels: {
                            padding: 20,
                            usePointStyle: true,
                            pointStyle: 'circle',
                            font: {
                                size: 14,
                                weight: '500'
                            },
                            generateLabels: function(chart) {
                                const dataset = chart.data.datasets[0];
                                return chart.data.labels.map((label, i) => {
                                    const value = dataset.data[i];
                                    const meta = chart.getDatasetMeta(0);
                                    const style = meta.controller.getStyle(i);

                                    return {
                                        text: `${label} (${value}%)`,
                                        fillStyle: style.backgroundColor,
                                        strokeStyle: '#fff',
                                        lineWidth: 2,
                                        hidden: isNaN(dataset.data[i]) || meta.data[i].hidden,
                                        index: i
                                    };
                                });
                            }
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const currentPieData = pieData[context.dataIndex];
                                return [
                                    `Satış Oranı: %${currentPieData.satisOrani}`,
                                    `İl Başına Servis: ${currentPieData.servisOrani}`,
                                    `Kapasite Kullanımı: %${currentPieData.kapasiteKullanimi}`
                                ];
                            }
                        }
                    }
                }
            }
        });

        this.charts.push(chart);
    }

    getPerformanceColor(skor) {
        if (skor > 1.5) return '#28a745';     // Yeşil (Mükemmel)
        if (skor > 1.0) return '#17a2b8';     // Mavi (Yeterli)
        if (skor > 0.6) return '#ffc107';     // Sarı (Geliştirilmeli)
        if (skor > 0) return '#dc3545';       // Kırmızı (Yetersiz)
        return '#6c757d';                     // Gri (Teknik Servis Yok)
    }

    getPerformanceColors(data) {
        return data.map(d => this.getPerformanceColor(d.performans_skoru.genel_skor));
    }

    showDetailedInfo(data, container) {
        container.innerHTML = data.map(bolge => `
            <div class="bolge-detay-card">
                <h3>
                    ${bolge.bolge_adi}
                    <span class="performans-seviyesi ${this.getPerformanceClass(bolge.performans_skoru.genel_skor)}">
                        ${this.getPerformanceText(bolge.performans_skoru.genel_skor)}
                    </span>
                </h3>
                <div class="metrikler">
                    <div class="metrik primary metrik-tooltip" data-tooltip="Toplam satış miktarı">
                        <label>Toplam Satış</label>
                        <span>${bolge.temel_metrikler.toplam_satis.toLocaleString()}</span>
                    </div>
                    <div class="metrik primary metrik-tooltip" data-tooltip="Aktif servis sayısı">
                        <label>Servis Sayısı</label>
                        <span>${bolge.temel_metrikler.servis_sayisi}</span>
                    </div>
                    <div class="metrik secondary metrik-tooltip" data-tooltip="Bölgedeki toplam il sayısı">
                        <label>İl Sayısı</label>
                        <span>${bolge.temel_metrikler.il_sayisi}</span>
                    </div>
                    <div class="metrik secondary metrik-tooltip" data-tooltip="İl başına düşen ortalama servis">
                        <label>İl Başına Servis</label>
                        <span>${bolge.performans_metrikleri.il_basina_servis}</span>
                    </div>
                    <div class="metrik primary metrik-tooltip" data-tooltip="Servis başına düşen ortalama satış">
                        <label>Servis Başına Satış</label>
                        <span>${Math.round(bolge.temel_metrikler.toplam_satis / bolge.temel_metrikler.servis_sayisi).toLocaleString()}</span>
                    </div>
                    <div class="metrik primary metrik-tooltip" data-tooltip="Kapasite kullanım oranı">
                        <label>Kapasite Kullanımı</label>
                        <span>${Math.round((bolge.temel_metrikler.toplam_satis / (bolge.temel_metrikler.servis_sayisi * 500)) * 100)}%</span>
                    </div>
                </div>
            </div>
        `).join('');
    }

    getPerformanceClass(skor) {
        if (skor === 0) return 'servis-yok';
        if (skor > 1.5) return 'mükemmel';
        if (skor > 1.0) return 'yeterli';
        if (skor > 0.6) return 'geliştirilmeli';
        return 'yetersiz';
    }

    getPerformanceText(skor) {
        if (skor === 0) return 'Teknik Servis Yok';
        if (skor > 1.5) return 'Mükemmel';
        if (skor > 1.0) return 'Yeterli';
        if (skor > 0.6) return 'Geliştirilmeli';
        return 'Yetersiz';
    }
    createServiceCoverageChart(data, canvas) {
        const chart = new Chart(canvas, {
            type: 'bar',
            data: {
                labels: data.map(d => d.bolge_adi),
                datasets: [
                    {
                        label: 'Servis Sayısı',
                        data: data.map(d => d.temel_metrikler.servis_sayisi),
                        backgroundColor: '#4CAF50',
                        borderRadius: 8,
                        maxBarThickness: 40
                    },
                    {
                        label: 'İl Sayısı',
                        data: data.map(d => d.temel_metrikler.il_sayisi),
                        backgroundColor: '#2196F3',
                        borderRadius: 8,
                        maxBarThickness: 40
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: 'Bölgelerin Servis ve İl Dağılımı',
                        padding: {
                            top: 10,
                            bottom: 20
                        },
                        font: {
                            size: 16,
                            weight: '500'
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Sayı',
                            font: {
                                size: 12
                            }
                        }
                    },
                    x: {
                        ticks: {
                            maxRotation: 45,
                            minRotation: 45
                        }
                    }
                }
            }
        });
        this.charts.push(chart);
    }

    createSalesServiceRatioChart(data, canvas) {
        const chart = new Chart(canvas, {
            type: 'line',
            data: {
                labels: data.map(d => d.bolge_adi),
                datasets: [{
                    label: 'Servis Başına Satış',
                    data: data.map(d => d.performans_metrikleri.servis_basina_satis),
                    borderColor: '#FF5722',
                    backgroundColor: 'rgba(255,87,34,0.1)',
                    fill: true,
                    tension: 0.4,
                    pointStyle: 'circle',
                    pointRadius: 6,
                    pointHoverRadius: 8
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: 'Bölgesel Servis Verimliliği Analizi',
                        padding: {
                            top: 10,
                            bottom: 20
                        },
                        font: {
                            size: 16,
                            weight: '500'
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Satış Sayısı',
                            font: {
                                size: 12
                            }
                        }
                    },
                    x: {
                        ticks: {
                            maxRotation: 45,
                            minRotation: 45
                        }
                    }
                }
            }
        });
        this.charts.push(chart);
    }
}
document.addEventListener('DOMContentLoaded', () => {
    const kdsMenuItem = document.querySelector('[data-page="kds"]');
    if (kdsMenuItem) {
        bolgeKarsilastirmaInstance = null;
        
        kdsMenuItem.addEventListener('click', () => {
            new BolgeKarsilastirma();
        });
    }
}); 