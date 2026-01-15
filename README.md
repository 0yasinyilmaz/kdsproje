## KDS Proje - Chery Servis Ağı Yönetimi KDS

Bu proje, **Karar Destek Sistemleri** dersi kapsamında geliştirilmiş; MVC mimarisine dayalı, RESTful prensiplerine uygun bir backend uygulamasıdır.

## 📖 Proje Hakkında ve Senaryo

**Senaryo:** 
Bu proje, Chery markasının Türkiye’deki yeniden pazar girişi sonrasında yüksek satış oranlarının ortaya çıkardığı teknik servis ihtiyacını değerlendirmek üzerine tasarlanmıştır. Proje, karar vericilere taktiksel destek sağlamak amacıyla, teknik servis ağının mevcut durumunu analiz etmekte ve yeni teknik servis merkezleri için uygun lokasyonları önermektedir

### Temel Özellikler
* **Mimari:** %100 MVC (Model-View-Controller) yapısı.
* **Veri Tabanı:** MySQL
* **API:** REST standartlarına uygun Endpoint tasarımı.
* **Güvenlik:** Çevresel değişkenler (.env) ile konfigürasyon yönetimi.

---

## ⚙️ Kurulum Adımları

Projeyi yerel makinenizde çalıştırmak için aşağıdaki adımları izleyin:

1.  **Repoyu Klonlayın:**
    ```bash
    git clone [https://github.com/0yasinyilmaz/kdsproje.git](https://github.com/0yasinyilmaz/kdsproje.git)
    cd kdsproje
    ```

2.  **Bağımlılıkları Yükleyin:**
    ```bash
    npm install
    ```

3.  **Çevresel Değişkenleri Ayarlayın (.env):**
    * Ana dizinde bulunan `.env.example` dosyasının adını `.env` olarak değiştirin.
    * İçerisindeki veritabanı bağlantı bilgilerini ve port numarasını kendi sisteminize göre güncelleyin.
    * *Not: `.env` dosyası güvenlik nedeniyle GitHub'a yüklenmemiştir.*

4.  **Projeyi Başlatın:**
    ```bash
    npm start
    # Veya geliştirme modunda:
    npm run dev
    ```

---
## 💡 İş Kuralları ve Özel Senaryolar (Business Logic)

**Senaryo : Bölgesel Satış ve Servis Uygunluğu**
    * *Mantık:* Yeni bir servis merkezi eklenirken, o bölgedeki (il/ilçe) Chery araç satış yoğunluğu kontrol edilir. Eğer servis adedi belirlenen barajın üstündeyse , sistem "Yeterli servis sayısı" uyarısı vererek servis açılışını önermez.

## 📊 Veritabanı Tasarımı (ER Diyagramı)

Veritabanı varlık-ilişki yapısını gösteren diyagram, proje dosyaları içerisinde `/diagram.png` yolunda mevcuttur.

## 📂 Proje Klasör Yapısı (MVC)

Proje, sürdürülebilirlik ve okunabilirlik için katı MVC kurallarına göre yapılandırılmıştır:

```text
kdsproje/
├── src/
│   ├── controllers/  # İş mantığı ve request/response yönetimi
│   ├── models/       # Veritabanı şemaları ve veri yapısı
│   ├── routes/       # API yönlendirmeleri (Endpoint tanımları)
│   ├── config/       # Veritabanı bağlantı ayarları
│   └── app.js        # Ana uygulama dosyası
├── .env.example      # Örnek konfigürasyon dosyası
└── README.md         # Proje dokümantasyonu

