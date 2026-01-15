const KPICalculator = {
    calculateServisKarsilamaOrani: (servisData, satisData) => {
        const toplamServisKapasitesi = servisData.length * 500; // Her servis 500 araç kapasiteli
        const toplamAracSayisi = satisData.reduce((acc, satis) => acc + satis.satistoplam, 0);
        return ((toplamServisKapasitesi / toplamAracSayisi) * 100).toFixed(1);
    },
    calculateServisVerimliligi: (servisData, satisData) => {
        const toplamAracSayisi = satisData.reduce((acc, satis) => acc + satis.satistoplam, 0);
        return (toplamAracSayisi / servisData.length).toFixed(1);
    },
    calculateKritikIlSayisi: (ilYeterlilik) => {
        return ilYeterlilik.filter(il => 
            il.yeterlilik_durumu === 'Yetersiz' || 
            il.yeterlilik_durumu === 'Teknik Servis Yok'
        ).length;
    }
}; 
const KPI_TARGETS = {
    servisKarsilama: 120, // %120
    servisVerimlilik: 350, // 350 araç/servis
    kritikIl: 3 // 3 il ve altı
};
function hesaplaYeterlilikDurumu(servisSayisi, aracSayisi) {
    if (servisSayisi === 0) return 'Teknik Servis Yok';
    const kapasite = servisSayisi * 500;
    const oran = kapasite / aracSayisi;
    if (oran >= 1.5) return 'Mükemmel';
    if (oran >= 1.0) return 'Yeterli';
    if (oran >= 0.6) return 'Geliştirilmeli';
    return 'Yetersiz';
}
function getYeterlilikRenk(durum) {
    switch (durum) {
        case 'Mükemmel':
            return '#28a745';
        case 'Yeterli':
            return '#17a2b8';
        case 'Geliştirilmeli':
            return '#ffc107';
        case 'Yetersiz':
            return '#dc3545';
        case 'Teknik Servis Yok':
            return '#6c757d';
        default:
            return '#6c757d';
    }
}
function getYeterlilikClass(durum) {
    switch (durum) {
        case 'Mükemmel':
            return 'mukemmel';
        case 'Yeterli':
            return 'yeterli';
        case 'Geliştirilmeli':
            return 'gelistirilmeli';
        case 'Yetersiz':
            return 'yetersiz';
        case 'Teknik Servis Yok':
            return 'servis-yok';
        default:
            return '';
    }
}
function hesaplaYeterlilikSkoru(servisSayisi, aracSayisi) {
    if (servisSayisi === 0) return 0;
    
    const kapasite = servisSayisi * 500;
    return kapasite / aracSayisi;
}
async function updateKPIs(data) {
    const karsilamaOrani = calculateServisKarsilamaOrani(data);
    const karsilamaElement = document.getElementById('servisKarsilamaOrani');
    const karsilamaTrend = document.getElementById('servisKarsilamaTrend');
    
    if (karsilamaElement) {
        karsilamaElement.innerHTML = `
            <div class="kpi-main-value">%${karsilamaOrani}</div>
            <div class="kpi-target-value">Hedef: %${KPI_TARGETS.servisKarsilama}</div>
        `;
        karsilamaElement.className = getKPIClass(karsilamaOrani, KPI_TARGETS.servisKarsilama);
    }
    updateTrendIcon(karsilamaTrend, karsilamaOrani, KPI_TARGETS.servisKarsilama);
    const verimlilik = calculateServisVerimliligi(data);
    const verimlilikElement = document.getElementById('servisVerimliligi');
    const verimlilikTrend = document.getElementById('servisVerimlilikTrend');
    
    if (verimlilikElement) {
        verimlilikElement.innerHTML = `
            <div class="kpi-main-value">${verimlilik} araç/servis</div>
            <div class="kpi-target-value">Hedef: ${KPI_TARGETS.servisVerimlilik} araç/servis</div>
        `;
        verimlilikElement.className = getKPIClass(verimlilik, KPI_TARGETS.servisVerimlilik, true);
    }
    updateTrendIcon(verimlilikTrend, verimlilik, KPI_TARGETS.servisVerimlilik, true);
    const kritikIlSayisi = calculateKritikIlSayisi(data);
    const kritikIlElement = document.getElementById('kritikIlSayisi');
    const kritikIlTrend = document.getElementById('kritikIlTrend');
    
    if (kritikIlElement) {
        kritikIlElement.innerHTML = `
            <div class="kpi-main-value">${kritikIlSayisi}</div>
            <div class="kpi-target-value">Hedef: ${KPI_TARGETS.kritikIl} ve altı</div>
        `;
        kritikIlElement.className = getKPIClass(kritikIlSayisi, KPI_TARGETS.kritikIl, true);
    }
    updateTrendIcon(kritikIlTrend, kritikIlSayisi, KPI_TARGETS.kritikIl, true);
}
function getKPIClass(value, target, isReverse = false) {
    if (isReverse) {
        if (value <= target) return 'kpi-value success';
        if (value <= target * 1.2) return 'kpi-value warning';
        return 'kpi-value danger';
    } else {
        if (value >= target) return 'kpi-value success';
        if (value >= target * 0.8) return 'kpi-value warning';
        return 'kpi-value danger';
    }
} 