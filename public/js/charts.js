async function createCharts() {
    try {
        if (!window.appData) {
            const [servisData, satisData, ilYeterlilik] = await Promise.all([
                fetch('/api/teknik-servisler').then(res => res.json()),
                fetch('/api/satislar').then(res => res.json()),
                fetch('/api/il-yeterlilik').then(res => res.json())
            ]);
            window.appData = { servisData, satisData, ilYeterlilik };
        }
        const bolgeselCtx = document.getElementById('bolgeselSatislar').getContext('2d');
        const pastaCtx = document.getElementById('bolgeselPasta').getContext('2d');
        const top10Ctx = document.getElementById('top10Iller').getContext('2d');
        const servisPastaCtx = document.getElementById('bolgeselServisPasta').getContext('2d');
        const ilDurumlari = {
            'Mükemmel': 0,
            'Yeterli': 0,
            'Geliştirilmeli': 0,
            'Yetersiz': 0,
            'Teknik Servis Yok': 0
        };

        window.appData.ilYeterlilik.forEach(il => {
            ilDurumlari[il.yeterlilik_durumu]++;
        });

        const ilDurumlariCtx = document.getElementById('ilDurumlariChart');
        if (ilDurumlariCtx) {
            createIlDurumlariChart(ilDurumlari);
        }
        const tahminlerCtx = document.getElementById('tahminlerChart');
        if (tahminlerCtx) {
            createTahminlerChart();
        }
        await updateKPIs(window.appData);

    } catch (error) {
        console.error('Grafik oluşturma hatası:', error);
    }
}

function destroyCharts() {
    const chartIds = [
        'bolgeselSatislar', 
        'bolgeselPasta', 
        'top10Iller', 
        'bolgeselServisPasta',
        'ilDurumlariChart',
        'tahminlerChart'  // Yeni grafiği ekle
    ];
    
    chartIds.forEach(id => {
        const canvas = document.getElementById(id);
        if (canvas) {
            const chart = Chart.getChart(canvas);
            if (chart) {
                chart.destroy();
            }
        }
    });
}
function createIlDurumlariChart(data) {
    const ctx = document.getElementById('ilDurumlariChart').getContext('2d');
    const baseColor = '#3b82f6'; // Ana mavi renk
    const backgroundColor = 'rgba(59, 130, 246, 0.7)'; // Yarı saydam mavi
    const borderColor = '#3b82f6'; // Kenar çizgisi için tam mavi

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: Object.keys(data),
            datasets: [{
                label: 'İl Sayısı',
                data: Object.values(data),
                backgroundColor: backgroundColor,
                borderColor: borderColor,
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
                        size: 16,
                        weight: 600
                    },
                    color: '#1a2b4c',
                    padding: 20
                },
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    titleColor: '#1a2b4c',
                    bodyColor: '#475569',
                    borderColor: '#e5e9f2',
                    borderWidth: 1,
                    padding: 12,
                    displayColors: true,
                    callbacks: {
                        label: function(context) {
                            return `${context.parsed.y} il`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1,
                        color: '#64748b',
                        font: {
                            size: 12
                        }
                    },
                    grid: {
                        color: '#e5e9f2'
                    }
                },
                x: {
                    ticks: {
                        color: '#64748b',
                        font: {
                            size: 12
                        }
                    },
                    grid: {
                        display: false
                    }
                }
            }
        }
    });
}
function createTahminlerChart() {
    console.log('Tahminler grafiği oluşturuluyor...');
    const ctx = document.getElementById('tahminlerChart').getContext('2d');
    if (!ctx) {
        console.error('tahminlerChart canvas bulunamadı');
        return;
    }
    
    const tahminData = {
        labels: ['3 Ay', '6 Ay', '9 Ay', '1 Yıl'],
        datasets: [
            {
                label: 'Tahmini Araç Sayısı',
                data: calculateGrowthProjection(window.appData.satisData),
                backgroundColor: 'rgba(211, 47, 47, 0.7)',
                borderColor: '#d32f2f',
                borderWidth: 1,
                yAxisID: 'y'
            },
            {
                label: 'Tahmini Servis İhtiyacı',
                data: calculateServiceNeeds(window.appData.servisData),
                backgroundColor: 'transparent',
                borderColor: '#2196f3',
                borderWidth: 2,
                type: 'line',
                yAxisID: 'y1'
            }
        ]
    };

    new Chart(ctx, {
        type: 'bar',
        data: tahminData,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'Gelecek Dönem Tahminleri',
                    font: {
                        size: 16,
                        weight: 600
                    },
                    color: '#1a2b4c',
                    padding: 20
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            if (context.dataset.type === 'bar') {
                                return `Araç Sayısı: ${context.parsed.y.toLocaleString()}`;
                            } else {
                                return `Gerekli Servis: ${context.parsed.y}`;
                            }
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Araç Sayısı'
                    },
                    grid: {
                        color: '#e5e9f2'
                    }
                },
                y1: {
                    position: 'right',
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Servis İhtiyacı'
                    },
                    grid: {
                        display: false
                    }
                }
            }
        }
    });
}
function calculateGrowthProjection(satisData) {
    const monthlyGrowth = calculateMonthlyGrowthRate(satisData);
    const currentTotal = satisData.reduce((acc, satis) => acc + satis.satistoplam, 0);
    return [3, 6, 9, 12].map(months => {
        return Math.round(currentTotal * Math.pow(1 + monthlyGrowth, months));
    });
}
function calculateServiceNeeds(servisData) {
    const currentServices = servisData.length;
    const projectedGrowth = calculateGrowthProjection(window.appData.satisData);
    return projectedGrowth.map(projected => Math.ceil(projected / 500));
}
function calculateMonthlyGrowthRate(satisData) {
    return 0.02;
} 