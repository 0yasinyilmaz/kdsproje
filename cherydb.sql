-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Anamakine: 127.0.0.1:3306
-- Üretim Zamanı: 27 Kas 2024, 10:38:25
-- Sunucu sürümü: 8.3.0
-- PHP Sürümü: 8.2.18

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Veritabanı: `cherydb`
--

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `chery_teknik_servis`
--

DROP TABLE IF EXISTS `chery_teknik_servis`;
CREATE TABLE IF NOT EXISTS `chery_teknik_servis` (
  `servis_adi` varchar(100) DEFAULT NULL,
  `ilce_adi` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `il_adi` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `il_id` int DEFAULT NULL,
  KEY `il_id` (`il_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Tablo döküm verisi `chery_teknik_servis`
--

INSERT INTO `chery_teknik_servis` (`servis_adi`, `ilce_adi`, `il_adi`, `il_id`) VALUES
('Tekbaş', 'Seyhan', 'Adana', 1),
('Tan Oto Yenimahalle', 'Yenimahalle', 'Ankara', 6),
('Mengerler Ankara', 'Etimesgut', 'Ankara', 6),
('Antoto', 'Kepez', 'Antalya', 7),
('HMT Aydın', 'Efeler', 'Aydın', 9),
('Akkaş', 'Edremit', 'Balıkesir', 10),
('Karahallılar', 'Karesi', 'Balıkesir', 10),
('Gönye', 'Osmangazi', 'Bursa', 16),
('Gönye Nilüfer', 'Nilüfer', 'Bursa', 16),
('Aydoğan', 'Merkez', 'Çanakkale', 17),
('Evlüce', 'Merkez', 'Çorum', 19),
('Özpam', 'Pamukkale', 'Denizli', 20),
('Odabaşı', 'Yenişehir', 'Diyarbakır', 21),
('Kervan', 'Merkez', 'Düzce', 81),
('Karabulut', 'Merkez', 'Elazığ', 23),
('Erdemir', 'Yakutiye', 'Erzurum', 25),
('BZL', 'Şehitkamil', 'Gaziantep', 27),
('Aslanbey', 'Antakya', 'Hatay', 31),
('Aceavto', 'Sarıyer', 'İstanbul', 34),
('Aldatmaz', 'Esenler', 'İstanbul', 34),
('Atmo', 'Ümraniye', 'İstanbul', 34),
('Bostancıoğlu', 'Kartal', 'İstanbul', 34),
('Çetaş', 'Silivri', 'İstanbul', 34),
('Kıyı', 'Sultanbeyli', 'İstanbul', 34),
('Mengerler Davutpaşa', 'Zeytinburnu', 'İstanbul', 34),
('Mezcar', 'Esenyurt', 'İstanbul', 34),
('Park', 'Bahçelievler', 'İstanbul', 34),
('Tepretoğulları', 'Kadıköy', 'İstanbul', 34),
('Yüzbaşıoğlu', 'Çekmeköy', 'İstanbul', 34),
('ERC', 'Gaziemir', 'İzmir', 35),
('HMT İzmir', 'Bornova', 'İzmir', 35),
('Sarpel Otomotiv', 'Dulkadiroğlu', 'Kahramanmaraş', 46),
('İncar', 'Melikgazi', 'Kayseri', 38),
('Kocaeli Kaya', 'İzmit', 'Kocaeli', 41),
('Efsane', 'Gebze', 'Kocaeli', 41),
('Atsanlar', 'Karatay', 'Konya', 42),
('Yiğitvar', 'Yeşilyurt', 'Malatya', 44),
('Nas Oto', 'Kızıltepe', 'Mardin', 47),
('Gürsoy', 'Mezitli', 'Mersin', 33),
('Kasapoğlu', 'Bodrum', 'Muğla', 48),
('Yön', 'Fethiye', 'Muğla', 48),
('Ernaz', 'Erenler', 'Sakarya', 54),
('BLF', 'Tekkeköy', 'Samsun', 55),
('Oflaz', 'Merkez', 'Sivas', 58),
('Bertansa', 'Karaköprü', 'Şanlıurfa', 63),
('Köşkdere', 'Süleymanpaşa', 'Tekirdağ', 59),
('Adnan', 'Ortahisar', 'Trabzon', 61),
('Sadıkoğlu', 'Merkez', 'Uşak', 64),
('Berk', 'Edremit', 'Van', 65);

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `iller`
--

DROP TABLE IF EXISTS `iller`;
CREATE TABLE IF NOT EXISTS `iller` (
  `il_adi` varchar(50) NOT NULL,
  `bolge_adi` varchar(50) NOT NULL,
  `il_id` int NOT NULL,
  PRIMARY KEY (`il_id`),
  UNIQUE KEY `il_adi` (`il_adi`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Tablo döküm verisi `iller`
--

INSERT INTO `iller` (`il_adi`, `bolge_adi`, `il_id`) VALUES
('Adana', 'Akdeniz', 1),
('Adıyaman', 'Güneydoğu Anadolu', 2),
('Afyonkarahisar', 'Ege', 3),
('Ağrı', 'Doğu Anadolu', 4),
('Amasya', 'Karadeniz', 5),
('Ankara', 'İç Anadolu', 6),
('Antalya', 'Akdeniz', 7),
('Artvin', 'Karadeniz', 8),
('Aydın', 'Ege', 9),
('Balıkesir', 'Marmara', 10),
('Bilecik', 'Marmara', 11),
('Bingöl', 'Doğu Anadolu', 12),
('Bitlis', 'Doğu Anadolu', 13),
('Bolu', 'Karadeniz', 14),
('Burdur', 'Akdeniz', 15),
('Bursa', 'Marmara', 16),
('Çanakkale', 'Marmara', 17),
('Çankırı', 'İç Anadolu', 18),
('Çorum', 'Karadeniz', 19),
('Denizli', 'Ege', 20),
('Diyarbakır', 'Güneydoğu Anadolu', 21),
('Edirne', 'Marmara', 22),
('Elazığ', 'Doğu Anadolu', 23),
('Erzincan', 'Doğu Anadolu', 24),
('Erzurum', 'Doğu Anadolu', 25),
('Eskişehir', 'İç Anadolu', 26),
('Gaziantep', 'Güneydoğu Anadolu', 27),
('Giresun', 'Karadeniz', 28),
('Gümüşhane', 'Karadeniz', 29),
('Hakkari', 'Doğu Anadolu', 30),
('Hatay', 'Akdeniz', 31),
('Isparta', 'Akdeniz', 32),
('Mersin', 'Akdeniz', 33),
('İstanbul', 'Marmara', 34),
('İzmir', 'Ege', 35),
('Kars', 'Doğu Anadolu', 36),
('Kastamonu', 'Karadeniz', 37),
('Kayseri', 'İç Anadolu', 38),
('Kırklareli', 'Marmara', 39),
('Kırşehir', 'İç Anadolu', 40),
('Kocaeli', 'Marmara', 41),
('Konya', 'İç Anadolu', 42),
('Kütahya', 'Ege', 43),
('Malatya', 'Doğu Anadolu', 44),
('Manisa', 'Ege', 45),
('Kahramanmaraş', 'Akdeniz', 46),
('Mardin', 'Güneydoğu Anadolu', 47),
('Muğla', 'Ege', 48),
('Muş', 'Doğu Anadolu', 49),
('Nevşehir', 'İç Anadolu', 50),
('Niğde', 'İç Anadolu', 51),
('Ordu', 'Karadeniz', 52),
('Rize', 'Karadeniz', 53),
('Sakarya', 'Marmara', 54),
('Samsun', 'Karadeniz', 55),
('Siirt', 'Güneydoğu Anadolu', 56),
('Sinop', 'Karadeniz', 57),
('Sivas', 'İç Anadolu', 58),
('Tekirdağ', 'Marmara', 59),
('Tokat', 'Karadeniz', 60),
('Trabzon', 'Karadeniz', 61),
('Tunceli', 'Doğu Anadolu', 62),
('Şanlıurfa', 'Güneydoğu Anadolu', 63),
('Uşak', 'Ege', 64),
('Van', 'Doğu Anadolu', 65),
('Yozgat', 'İç Anadolu', 66),
('Zonguldak', 'Karadeniz', 67),
('Aksaray', 'İç Anadolu', 68),
('Bayburt', 'Karadeniz', 69),
('Karaman', 'İç Anadolu', 70),
('Kırıkkale', 'İç Anadolu', 71),
('Batman', 'Güneydoğu Anadolu', 72),
('Şırnak', 'Güneydoğu Anadolu', 73),
('Bartın', 'Karadeniz', 74),
('Ardahan', 'Doğu Anadolu', 75),
('Iğdır', 'Doğu Anadolu', 76),
('Yalova', 'Marmara', 77),
('Karabük', 'Karadeniz', 78),
('Kilis', 'Güneydoğu Anadolu', 79),
('Osmaniye', 'Akdeniz', 80),
('Düzce', 'Karadeniz', 81);

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `satislar`
--

DROP TABLE IF EXISTS `satislar`;
CREATE TABLE IF NOT EXISTS `satislar` (
  `satis_id` int NOT NULL AUTO_INCREMENT,
  `il_id` int DEFAULT NULL,
  `yıl` int DEFAULT NULL,
  `satistoplam` int DEFAULT NULL,
  PRIMARY KEY (`satis_id`),
  KEY `il_id` (`il_id`)
) ENGINE=InnoDB AUTO_INCREMENT=82 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Tablo döküm verisi `satislar`
--

INSERT INTO `satislar` (`satis_id`, `il_id`, `yıl`, `satistoplam`) VALUES
(1, 1, 2023, 1190),
(2, 2, 2023, 55),
(3, 3, 2023, 61),
(4, 68, 2023, 36),
(5, 5, 2023, 52),
(6, 6, 2023, 2521),
(7, 7, 2023, 859),
(8, 75, 2023, 35),
(9, 8, 2023, 59),
(10, 9, 2023, 481),
(11, 4, 2023, 53),
(12, 10, 2023, 556),
(13, 74, 2023, 20),
(14, 72, 2023, 78),
(15, 69, 2023, 25),
(16, 11, 2023, 28),
(17, 12, 2023, 66),
(18, 13, 2023, 29),
(19, 14, 2023, 43),
(20, 15, 2023, 24),
(21, 16, 2023, 1441),
(22, 20, 2023, 650),
(23, 21, 2023, 611),
(24, 81, 2023, 54),
(25, 22, 2023, 98),
(26, 23, 2023, 243),
(27, 24, 2023, 70),
(28, 25, 2023, 273),
(29, 26, 2023, 78),
(30, 27, 2023, 638),
(31, 28, 2023, 87),
(32, 29, 2023, 29),
(33, 30, 2023, 9),
(34, 31, 2023, 150),
(35, 32, 2023, 65),
(36, 76, 2023, 15),
(37, 46, 2023, 165),
(38, 78, 2023, 44),
(39, 70, 2023, 43),
(40, 36, 2023, 48),
(41, 37, 2023, 46),
(42, 38, 2023, 488),
(43, 79, 2023, 12),
(44, 41, 2023, 1380),
(45, 42, 2023, 713),
(46, 43, 2023, 49),
(47, 39, 2023, 83),
(48, 71, 2023, 36),
(49, 40, 2023, 20),
(50, 44, 2023, 101),
(51, 45, 2023, 213),
(52, 47, 2023, 143),
(53, 33, 2023, 852),
(54, 48, 2023, 670),
(55, 49, 2023, 50),
(56, 50, 2023, 65),
(57, 51, 2023, 56),
(58, 52, 2023, 184),
(59, 80, 2023, 81),
(60, 53, 2023, 136),
(61, 54, 2023, 427),
(62, 55, 2023, 708),
(63, 56, 2023, 50),
(64, 57, 2023, 65),
(65, 58, 2023, 56),
(66, 59, 2023, 184),
(67, 60, 2023, 81),
(68, 61, 2023, 136),
(69, 62, 2023, 427),
(70, 64, 2023, 708),
(71, 65, 2023, 50),
(72, 77, 2023, 65),
(73, 66, 2023, 56),
(74, 67, 2023, 184),
(75, 17, 2023, 81),
(76, 18, 2023, 136),
(77, 19, 2023, 427),
(78, 34, 2023, 708),
(79, 35, 2023, 50),
(80, 63, 2023, 65),
(81, 73, 2023, 56);

--
-- Dökümü yapılmış tablolar için kısıtlamalar
--

--
-- Tablo kısıtlamaları `chery_teknik_servis`
--
ALTER TABLE `chery_teknik_servis`
  ADD CONSTRAINT `chery_teknik_servis_ibfk_1` FOREIGN KEY (`il_id`) REFERENCES `iller` (`il_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Tablo kısıtlamaları `satislar`
--
ALTER TABLE `satislar`
  ADD CONSTRAINT `satislar_ibfk_1` FOREIGN KEY (`il_id`) REFERENCES `iller` (`il_id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
