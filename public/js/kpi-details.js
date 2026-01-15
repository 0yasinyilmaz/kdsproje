const KPIDetails = {
    servisKarsilama: {
        title: "Servis Karşılama Oranı",
        description: "Mevcut servis kapasitesinin toplam araç sayısına oranını gösterir. Her servisin ortalama 500 araç kapasitesi olduğu varsayılmaktadır.",
        target: "%120",
        recommendations: [
            "Oran %100'ün altındaysa yeni servis açılması düşünülmeli",
            "Bölgesel dağılım kontrol edilmeli",
            "Yoğun bölgelerde kapasite artırımı yapılmalı"
        ]
    },
    servisVerimlilik: {
        title: "Servis Verimliliği",
        description: "Her servise düşen ortalama araç sayısını gösterir. Bu değerin çok yüksek olması servislerin aşırı yüklendiğini, çok düşük olması ise verimsiz kullanıldığını gösterir.",
        target: "300-400 araç",
        recommendations: [
            "300'ün altındaysa servis optimizasyonu yapılmalı",
            "400'ün üzerindeyse yeni servis açılması değerlendirilmeli",
            "Bölgesel dağılım göz önünde bulundurulmalı"
        ]
    },
    kritikIl: {
        title: "Kritik İl Sayısı",
        description: "Servis ağı açısından acil müdahale gerektiren illerin toplam sayısını gösterir. Bu değer, servis yeterliliği 'Yetersiz' olan ve hiç teknik servisi bulunmayan illerin toplamından oluşur.",
        target: "3 ve altı",
        recommendations: [
            "Kritik durumda olan illerde öncelikli olarak yeni servis açılması planlanmalı",
            "Komşu illerdeki servislerin kapasitesi ve hizmet alanı genişletilmeli",
            "Mobil servis çözümleri ile geçici destek sağlanmalı"
        ]
    },
    servisSimulasyon: {
        title: "Servis Planlama Simülasyonu",
        description: "Bu simülasyon, yeni açılacak teknik servislerin en optimum lokasyonlarını belirlemek için geliştirilmiş bir karar destek aracıdır. Her il için kapsamlı bir puanlama sistemi kullanılarak öncelik sıralaması yapılır.",
        target: "Optimum servis dağılımı",
        recommendations: [
            "Araç yoğunluğu yüksek olan bölgelere öncelik verilir",
            "Mevcut servis kapasitesi yetersiz olan iller değerlendirilir",
            "Teknik servis bulunmayan iller araç sayılarına göre değerlendirilir",
            "Her servis için 500 araçlık optimum kapasite hedeflenir",
            "Bölgesel dağılım dengesi gözetilir"
        ],
        puanlamaSistemi: [
            "Araç Sayısı Puanı (0-100): Araç sayısına göre temel puan (her 1000 araç için 20 puan)",
            "Kapasite Aşım Puanı (0-100): Mevcut kapasite üzerindeki araç sayısına göre ek puan",
            "Servis Yokluğu Puanı (0-80): Servis olmayan illerde araç sayısına bağlı puan",
            "Yeterlilik Durumu Puanı: Teknik Servis Yok (max 70), Yetersiz (60), Geliştirilmeli (40), Yeterli (20)",
            "Servis/Araç Oranı Puanı (0-50): Optimal kapasiteden sapma oranına göre ek puan"
        ],
        statusMessages: {
            success: "Simülasyon hazır",
            warning: "Simülasyon çalışıyor",
            danger: "Simülasyon hatası"
        }
    },
    bolgeKarsilastirma: {
        title: "Bölgesel Performans ve Kapasite Karşılaştırması",
        currentValue: "Aktif",
        targetValue: "Sürekli İzleme",
        description: `Bu analiz modülü, Türkiye'nin yedi coğrafi bölgesinin servis ağı performansını 
            karşılaştırmalı olarak değerlendirir. Üç temel metrik üzerinden analiz yapılır:
            
            1. Genel Performans Değerlendirmesi
            2. Servis ve İl Dağılımı
            3. Servis Verimliliği`,
        recommendations: [
            "Seçilen bölgelerin performans metriklerini karşılaştırmalı olarak inceleyin",
            "Bölgeler arası dengesizlikleri tespit edin",
            "Düşük performanslı bölgeler için iyileştirme planları oluşturun",
            "Yüksek performanslı bölgelerin başarı faktörlerini analiz edin",
            "Bölgesel kapasite kullanım oranlarını optimize edin"
        ]
    }
};

function showKPIDetail(element) {
    const kpiId = element.dataset.kpiId;
    const details = KPIDetails[kpiId];
    
    document.getElementById('kpiDetailTitle').textContent = details.title;
    
    if (kpiId === 'servisSimulasyon') {
        document.querySelector('.current-value').style.display = 'none';
        document.querySelector('.target-value').style.display = 'none';
        
        document.getElementById('kpiDescription').innerHTML = `
            ${details.description}
            <div class="mt-4">
                <h6>Puanlama Sistemi:</h6>
                <ul class="simulation-scoring">
                    ${details.puanlamaSistemi.map(puan => `<li>${puan}</li>`).join('')}
                </ul>
            </div>
        `;
    } else {
        document.querySelector('.current-value').style.display = 'block';
        document.querySelector('.target-value').style.display = 'block';
        document.getElementById('kpiCurrentValue').textContent = document.getElementById(getValueElementId(kpiId))?.textContent || '-';
        document.getElementById('kpiTargetValue').textContent = details.target;
        document.getElementById('kpiDescription').textContent = details.description;
    }
    
    const recommendationsList = document.getElementById('kpiRecommendations');
    recommendationsList.innerHTML = details.recommendations
        .map(rec => `<li>${rec}</li>`)
        .join('');
    
    new bootstrap.Modal(document.getElementById('kpiDetailModal')).show();
}

function getValueElementId(kpiId) {
    switch(kpiId) {
        case 'servisKarsilama': return 'servisKarsilamaOrani';
        case 'servisVerimlilik': return 'servisVerimliligi';
        case 'kritikIl': return 'kritikIlSayisi';
        default: return null;
    }
}
function evaluatePerformance(skor) {
    if (skor === 0) return {
        class: 'servis-yok',
        text: 'Teknik Servis Yok',
        color: '#6c757d'
    };
    if (skor > 1.5) return {
        class: 'mükemmel',
        text: 'Mükemmel',
        color: '#28a745'
    };
    if (skor > 1.0) return {
        class: 'yeterli',
        text: 'Yeterli',
        color: '#17a2b8'
    };
    if (skor > 0.6) return {
        class: 'geliştirilmeli',
        text: 'Geliştirilmeli',
        color: '#ffc107'
    };
    return {
        class: 'yetersiz',
        text: 'Yetersiz',
        color: '#dc3545'
    };
} 