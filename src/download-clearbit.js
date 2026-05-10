import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// === ВСЕ 350+ ПОДПИСОК С ДОМЕНАМИ ===
const subscriptions = [
  // КИНО И ВИДЕО (20)
  { name: 'Яндекс Плюс', domain: 'yandex.ru', file: 'yandeks-plyus' },
  { name: 'Иви', domain: 'ivi.ru', file: 'ivi' },
  { name: 'Кинопоиск', domain: 'kinopoisk.ru', file: 'kinopoisk' },
  { name: 'Okko', domain: 'okko.tv', file: 'okko' },
  { name: 'Premier', domain: 'premier.one', file: 'premier' },
  { name: 'Wink', domain: 'wink.ru', file: 'wink' },
  { name: 'Amediateka', domain: 'amediateka.ru', file: 'amediateka' },
  { name: 'KION', domain: 'kion.ru', file: 'kion' },
  { name: 'Море ТВ', domain: 'more.tv', file: 'more-tv' },
  { name: 'Триколор', domain: 'tricolor.tv', file: 'tricolor' },
  { name: 'Start', domain: 'start.ru', file: 'start' },
  { name: 'Netflix', domain: 'netflix.com', file: 'netflix' },
  { name: 'Disney+', domain: 'disneyplus.com', file: 'disney-plus' },
  { name: 'Amazon Prime', domain: 'amazon.com', file: 'amazon-prime' },
  { name: 'YouTube Premium', domain: 'youtube.com', file: 'youtube-music' },
  { name: 'НТВ-Плюс', domain: 'ntvplus.ru', file: 'ntv-plyus' },
  { name: 'MTS ТВ', domain: 'mts.ru', file: 'mts-tv' },
  { name: 'Смотрёшка', domain: 'smotreshka.tv', file: 'smotreshka' },
  { name: 'Rutube', domain: 'rutube.ru', file: 'rutube' },
  { name: 'VK Видео', domain: 'vk.com', file: 'vk' },

  // МУЗЫКА (10)
  { name: 'Яндекс Музыка', domain: 'music.yandex.ru', file: 'yandeks-muzyka' },
  { name: 'VK Музыка', domain: 'vk.com', file: 'vk-muzyka' },
  { name: 'Звук', domain: 'zvuk.com', file: 'zvuk' },
  { name: 'Apple Music', domain: 'music.apple.com', file: 'apple-music' },
  { name: 'Spotify', domain: 'spotify.com', file: 'spotify' },
  { name: 'MTS Music', domain: 'mts.ru', file: 'mts-music' },
  { name: 'Tidal', domain: 'tidal.com', file: 'tidal' },
  { name: 'YouTube Music', domain: 'music.youtube.com', file: 'youtube-music' },
  { name: 'SoundCloud', domain: 'soundcloud.com', file: 'soundcloud' },
  { name: 'Deezer', domain: 'deezer.com', file: 'deezer' },

  // КНИГИ (8)
  { name: 'Литрес', domain: 'litres.ru', file: 'litres-podpiska' },
  { name: 'MyBook', domain: 'mybook.ru', file: 'mybook' },
  { name: 'Букмейт', domain: 'bookmate.com', file: 'bukmeyt' },
  { name: 'Storytel', domain: 'storytel.com', file: 'storytel' },
  { name: 'Литнет', domain: 'litnet.com', file: 'loudplay' },
  { name: 'Bookmate', domain: 'bookmate.com', file: 'bookmate' },
  { name: 'Альпина', domain: 'alpinabook.ru', file: 'alpinabook' },
  { name: 'Патефон', domain: 'patefon.me', file: 'patefon' },

  // ИНТЕРНЕТ (30)
  { name: 'Ростелеком', domain: 'rt.ru', file: 'rostelecom' },
  { name: 'МТС', domain: 'mts.ru', file: 'mts' },
  { name: 'Дом.ру', domain: 'domru.ru', file: 'domru' },
  { name: 'Билайн', domain: 'beeline.ru', file: 'beeline' },
  { name: 'МегаФон', domain: 'megafon.ru', file: 'megafon' },
  { name: 'Tele2', domain: 'tele2.ru', file: 'tele2' },
  { name: 'Yota', domain: 'yota.ru', file: 'yota' },
  { name: 'МГТС', domain: 'mgts.ru', file: 'mgts' },
  { name: 'ТТК', domain: 'ttk.ru', file: 'ttk' },
  { name: 'Онлайм', domain: 'onlime.ru', file: 'onlaym' },
  { name: 'Уфанет', domain: 'ufanet.ru', file: 'ufanet' },
  { name: 'SkyNet', domain: 'skynt.ru', file: 'skynet' },
  { name: 'Сибирские сети', domain: '211.ru', file: 'sibirskie-seti' },
  { name: 'Зелёная точка', domain: 'zelenaya.net', file: 'zelenaya-tochka' },
  { name: 'Интерсвязь', domain: 'intersvyaz.ru', file: 'intersvyaz' },
  { name: 'Инфолинк', domain: 'infolink.ru', file: 'infolink' },
  { name: 'NetByNet', domain: 'netbynet.ru', file: 'netbynet' },
  { name: 'Акадо', domain: 'akado.ru', file: 'akado' },
  { name: 'QWERTY', domain: 'qwerty.ru', file: 'qwerty' },
  { name: 'Реал', domain: 'real.ru', file: 'real' },
  { name: 'GoodLine', domain: 'goodline.ru', file: 'good-line' },
  { name: 'Миранда', domain: 'miranda-media.ru', file: 'miranda-media' },
  { name: 'ВестКолл', domain: 'westcall.ru', file: 'vestcall' },
  { name: 'Starlink', domain: 'starlink.com', file: 'starlink' },
  { name: 'Омские сети', domain: 'omskic.ru', file: 'omskie-kabelnye-seti' },
  { name: 'Таттелеком', domain: 'tattelecom.ru', file: 'tattelekom-letay' },
  { name: 'ЭР-Телеком', domain: 'ertelecom.ru', file: 'domru' },
  { name: '211.ru', domain: '211.ru', file: 'sibirskie-seti' },
  { name: 'Orionet', domain: 'orionet.ru', file: 'orionet' },
  { name: 'Поволжье.ТТК', domain: 'ttk.ru', file: 'ttk' },

  // МОБИЛЬНЫЕ (15)
  { name: 'Т-Мобайл', domain: 't-mobile.ru', file: 't2' },
  { name: 'СберМобайл', domain: 'sbermobile.ru', file: 'sbermobile' },
  { name: 'Virgin Mobile', domain: 'virginmobile.ru', file: 'virginmobile' },
  { name: 'MCN Telecom', domain: 'mcntelecom.ru', file: 'mcntelecom' },
  { name: 'Алло Инкогнито', domain: 'allo-incognito.ru', file: 'allo-incognito' },
  { name: 'Ростелеком Мобильный', domain: 'rt.ru', file: 'rostelecom' },
  { name: 'Дом.ру Мобильный', domain: 'domru.ru', file: 'domru' },
  { name: 'МТС', domain: 'mts.ru', file: 'mts' },
  { name: 'Билайн', domain: 'beeline.ru', file: 'beeline' },
  { name: 'МегаФон', domain: 'megafon.ru', file: 'megafon' },
  { name: 'Tele2', domain: 'tele2.ru', file: 'tele2' },
  { name: 'Yota', domain: 'yota.ru', file: 'yota' },
  { name: 'Tinkoff Mobile', domain: 'tinkoff.ru', file: 'tbank' },
  { name: 'Alfa Mobile', domain: 'alfabank.ru', file: 'alfa' },
  { name: 'Sber Mobile', domain: 'sber.ru', file: 'sber' },

  // БАНКИ (20)
  { name: 'Т-Банк Pro', domain: 'tbank.ru', file: 'tbank' },
  { name: 'Т-Банк Premium', domain: 'tbank.ru', file: 'tbank-premium' },
  { name: 'СберПрайм', domain: 'sber.ru', file: 'sberpraym' },
  { name: 'Альфа-Смарт', domain: 'alfabank.ru', file: 'alfa-smart' },
  { name: 'Альфа-Премиум', domain: 'alfabank.ru', file: 'alfa-premium' },
  { name: 'ВТБ', domain: 'vtb.ru', file: 'vtb-privilegiya' },
  { name: 'Газпромбанк', domain: 'gazprombank.ru', file: 'gazprombank-premium' },
  { name: 'Райффайзен', domain: 'raiffeisen.ru', file: 'raiffayzen-premium' },
  { name: 'Росбанк', domain: 'rosbank.ru', file: 'rosbank' },
  { name: 'Открытие', domain: 'open.ru', file: 'open' },
  { name: 'Почта Банк', domain: 'pochtabank.ru', file: 'pochtabank' },
  { name: 'Уралсиб', domain: 'uralsib.ru', file: 'uralsib' },
  { name: 'Ак Барс', domain: 'akbars.ru', file: 'akbars' },
  { name: 'Совкомбанк', domain: 'sovcombank.ru', file: 'sovcombank' },
  { name: 'Home Credit', domain: 'homecredit.ru', file: 'homecredit' },
  { name: 'Юникредит', domain: 'unicreditbank.ru', file: 'unicredit' },
  { name: 'МКБ', domain: 'mkb.ru', file: 'mkb' },
  { name: 'Промсвязьбанк', domain: 'psbank.ru', file: 'psbank' },
  { name: 'Россельхозбанк', domain: 'rshb.ru', file: 'rshb' },
  { name: 'Возрождение', domain: 'bankvr.ru', file: 'vozrozhdenie' },

  // ОБЛАКА (15)
  { name: 'Яндекс Диск', domain: 'disk.yandex.ru', file: 'yandeksdisk-100gb' },
  { name: 'Облако Mail.ru', domain: 'cloud.mail.ru', file: 'oblako-mailru-64gb' },
  { name: 'iCloud', domain: 'icloud.com', file: 'icloud-200gb' },
  { name: 'Google One', domain: 'one.google.com', file: 'google-one-100gb' },
  { name: 'OneDrive', domain: 'onedrive.live.com', file: 'onedrive-100gb' },
  { name: 'Dropbox', domain: 'dropbox.com', file: 'dropbox-2tb' },
  { name: 'СберДиск', domain: 'sber.ru', file: 'sber' },
  { name: 'VK WorkDisk', domain: 'vk.com', file: 'vk' },
  { name: 'TeraBox', domain: 'terabox.com', file: 'terabox' },
  { name: 'Selectel', domain: 'selectel.ru', file: 'selectel' },
  { name: 'OnCloud', domain: 'oncloud.ru', file: 'oncloud' },
  { name: 'Blomp', domain: 'blomp.com', file: 'blomp' },
  { name: 'pCloud', domain: 'pcloud.com', file: 'pcloud' },
  { name: 'Box', domain: 'box.com', file: 'box' },
  { name: 'Sync.com', domain: 'sync.com', file: 'sync' },

  // ИГРЫ (15)
  { name: 'PlayStation Plus', domain: 'playstation.com', file: 'playstation-plus' },
  { name: 'Xbox Game Pass', domain: 'xbox.com', file: 'xbox-game-pass' },
  { name: 'EA Play', domain: 'ea.com', file: 'ea-play' },
  { name: 'Discord Nitro', domain: 'discord.com', file: 'discord' },
  { name: 'Twitch Turbo', domain: 'twitch.tv', file: 'twitch' },
  { name: 'Nintendo Online', domain: 'nintendo.com', file: 'nintendo-online' },
  { name: 'GeForce NOW', domain: 'nvidia.com', file: 'geforce-now' },
  { name: 'Steam', domain: 'steampowered.com', file: 'steam' },
  { name: 'Ubisoft+', domain: 'ubisoft.com', file: 'ubisoft' },
  { name: 'Humble Choice', domain: 'humblebundle.com', file: 'humblebundle' },
  { name: 'itch.io', domain: 'itch.io', file: 'itch-io' },
  { name: 'Epic Games', domain: 'epicgames.com', file: 'epicgames' },
  { name: 'GOG', domain: 'gog.com', file: 'gog' },
  { name: 'Origin', domain: 'origin.com', file: 'origin' },
  { name: 'Battle.net', domain: 'battle.net', file: 'battlenet' },

  // ОБРАЗОВАНИЕ (30)
  { name: 'Skillbox', domain: 'skillbox.ru', file: 'skillbox' },
  { name: 'GeekBrains', domain: 'geekbrains.ru', file: 'geekbrains' },
  { name: 'Нетология', domain: 'netology.ru', file: 'netologiya' },
  { name: 'Stepik', domain: 'stepik.org', file: 'stepik' },
  { name: 'SkillFactory', domain: 'skillfactory.ru', file: 'skillfactory' },
  { name: 'Яндекс Практикум', domain: 'practicum.yandex.ru', file: 'yandekspraktikum' },
  { name: 'Skyeng', domain: 'skyeng.ru', file: 'skyeng' },
  { name: 'Skypro', domain: 'skypro.ru', file: 'skypro' },
  { name: 'OTUS', domain: 'otus.ru', file: 'otus' },
  { name: 'HTML Academy', domain: 'htmlacademy.ru', file: 'htmlacademy' },
  { name: 'Loftschool', domain: 'loftschool.com', file: 'loftschool' },
  { name: 'GeekUniversity', domain: 'geekuniversity.ru', file: 'geekuniversity' },
  { name: 'Coding Factory', domain: 'codingfactory.ru', file: 'codingfactory' },
  { name: 'Teletype', domain: 'teletype.in', file: 'teletype' },
  { name: 'Contented', domain: 'contented.ru', file: 'contented' },
  { name: 'Lingualeo', domain: 'lingualeo.com', file: 'lingualeo' },
  { name: 'Duolingo', domain: 'duolingo.com', file: 'duolingo-plus' },
  { name: 'Puzzle English', domain: 'puzzle-english.com', file: 'puzzle-english' },
  { name: 'EnglishDom', domain: 'englishdom.com', file: 'englishdom' },
  { name: 'Tilda', domain: 'tilda.cc', file: 'tilda' },
  { name: 'Синхронизация', domain: 'sync.ru', file: 'sync' },
  { name: 'Постнаука', domain: 'postnauka.ru', file: 'postnauka' },
  { name: 'Арзамас', domain: 'arzamas.academy', file: 'arzamas' },
  { name: 'Magisteria', domain: 'magisteria.ru', file: 'magisteria' },
  { name: '4brain', domain: '4brain.ru', file: 'chetyre-lapy' },
  { name: 'GetCourse', domain: 'getcourse.ru', file: 'getcourse' },
  { name: 'Antitraining', domain: 'antitraining.ru', file: 'antitraining' },
  { name: 'Zenclass', domain: 'zenclass.ru', file: 'zenclass' },
  { name: 'SOHO.LMS', domain: 'soho-lms.ru', file: 'soho-lms' },
  { name: 'Skillspace', domain: 'skillspace.ru', file: 'skillspace' },

  // ДОСТАВКА (20)
  { name: 'Яндекс Еда', domain: 'eda.yandex.ru', file: 'yandeks-lavka' },
  { name: 'Delivery Club', domain: 'deliveryclub.ru', file: 'deliveryclub' },
  { name: 'Самокат', domain: 'samokat.ru', file: 'samokat' },
  { name: 'Яндекс Лавка', domain: 'lavka.yandex.ru', file: 'yandeks-lavka' },
  { name: 'СберМаркет', domain: 'sbermarket.ru', file: 'sbermarket' },
  { name: 'ВкусВилл', domain: 'vkusvill.ru', file: 'vkusvill' },
  { name: 'OZON Fresh', domain: 'ozon.ru', file: 'ozon-premium' },
  { name: 'Пятёрочка', domain: '5post.ru', file: '5post' },
  { name: 'Перекрёсток', domain: 'perekrestok.ru', file: 'perekrestok' },
  { name: 'Лента', domain: 'lenta.com', file: 'lenta' },
  { name: 'Магнит', domain: 'magnit.ru', file: 'magnit' },
  { name: 'Ашан', domain: 'auchan.ru', file: 'auchan' },
  { name: 'Метро', domain: 'metro.ru', file: 'metro' },
  { name: 'iHerb', domain: 'iherb.com', file: 'iherb' },
  { name: 'AliExpress', domain: 'aliexpress.ru', file: 'aliexpress-premium' },
  { name: 'Ozon', domain: 'ozon.ru', file: 'ozon' },
  { name: 'Wildberries', domain: 'wildberries.ru', file: 'wildberries-prime' },
  { name: 'Lamoda', domain: 'lamoda.ru', file: 'lamoda-premium' },
  { name: 'Gold Apple', domain: 'goldapple.ru', file: 'goldapple-box' },
  { name: 'Четыре Лапы', domain: '4lapy.ru', file: 'chetyre-lapy' },

  // ПОДПИСКА НА ЕДУ (15)
  { name: 'Level Kitchen', domain: 'levelkitchen.com', file: 'level-kitchen' },
  { name: 'Grow Food', domain: 'growfood.pro', file: 'grow-food' },
  { name: 'BeFit', domain: 'befit-food.ru', file: 'befit' },
  { name: 'JustFood', domain: 'justfood.pro', file: 'justfood' },
  { name: 'My Food', domain: 'myfood.ru', file: 'myfood' },
  { name: 'Performance Food', domain: 'performance-food.ru', file: 'performance-food' },
  { name: 'Ideal Day', domain: 'idealday.ru', file: 'idealday' },
  { name: 'Smart Calories', domain: 'smartcalories.ru', file: 'smartcalories' },
  { name: 'ПриЕм', domain: 'priem-food.ru', file: 'priem' },
  { name: 'Шефмаркет', domain: 'chefmarket.ru', file: 'chefmarket' },
  { name: 'Польза', domain: 'polza-food.ru', file: 'polza' },
  { name: 'Elementaree', domain: 'elementaree.ru', file: 'elementaree' },
  { name: 'Foodband', domain: 'foodband.ru', file: 'foodband' },
  { name: '2Берега', domain: '2berega.ru', file: '2berega' },
  { name: 'Fresh Lab', domain: 'freshlab.ru', file: 'freshlab' },

  // ФИТНЕС (20)
  { name: 'World Class', domain: 'worldclass.ru', file: 'world-class' },
  { name: 'DDX Fitness', domain: 'ddxfitness.ru', file: 'ddx-fitness' },
  { name: 'X-Fit', domain: 'xfit.ru', file: 'xfit' },
  { name: 'Планета Фитнес', domain: 'fitness.ru', file: 'planeta-fitnes' },
  { name: 'Зебра', domain: 'fitnes-zebra.ru', file: 'zebra' },
  { name: 'Spirit Fitness', domain: 'spiritfitness.ru', file: 'spirit-fitness' },
  { name: 'URBANFIT', domain: 'urbanfit.ru', file: 'urbanfit' },
  { name: 'Alex Fitness', domain: 'alexfitness.ru', file: 'alex-fitness' },
  { name: 'Фитнес-Прага', domain: 'fitness-praga.ru', file: 'fitnes-praga' },
  { name: 'ССЗ Fitness', domain: 'sszfitness.ru', file: 'ssz-fitness' },
  { name: 'Pure Fitness', domain: 'purefitness.ru', file: 'pure-fitness' },
  { name: 'Encore Fitness', domain: 'encorefitness.ru', file: 'encorefitness' },
  { name: 'Republika', domain: 'republika.ru', file: 'republika' },
  { name: 'Физкульт', domain: 'fizkult.ru', file: 'fizkult' },
  { name: 'SSC', domain: 'sscfitness.ru', file: 'ssc' },
  { name: 'Fitnes Factory', domain: 'fitnessfactory.ru', file: 'fitnessfactory' },
  { name: 'FitCurves', domain: 'fitcurves.ru', file: 'fitcurves' },
  { name: 'Orange Fitness', domain: 'orangefitness.ru', file: 'orangefitness' },
  { name: 'Top Fitness', domain: 'topfitness.ru', file: 'topfitness' },
  { name: 'Fitness Place', domain: 'fitnessplace.ru', file: 'fitnessplace' },

  // ЖКХ И ДОМОФОНЫ (15)
  { name: 'Цифрал', domain: 'cyfral-group.ru', file: 'cyfral' },
  { name: 'Seven Sky', domain: '7sky.ru', file: 'seven-sky' },
  { name: 'Метаком', domain: 'metacom.ru', file: 'metacom' },
  { name: 'Vizit', domain: 'vizit.ru', file: 'vizit' },
  { name: 'Eltis', domain: 'eltis.ru', file: 'eltis' },
  { name: 'Факториал', domain: 'factorial.ru', file: 'factorial' },
  { name: 'Домофон.ру', domain: 'domofon.ru', file: 'domofon' },
  { name: 'АйТеко', domain: 'aiteco.ru', file: 'aiteco' },
  { name: 'Ником', domain: 'nikom.ru', file: 'nikom' },
  { name: 'Tantos', domain: 'tantos.ru', file: 'tantos' },
  { name: 'Умный Дом', domain: 'umnydom.ru', file: 'umny-dom' },
  { name: 'Яндекс Станция', domain: 'yandex.ru', file: 'yandeks-plyus' },
  { name: 'VK Капсула', domain: 'vk.com', file: 'vk' },
  { name: 'Сбер Умный дом', domain: 'sber.ru', file: 'sber' },
  { name: 'Rubek', domain: 'rubek.ru', file: 'rubek' },

  // ОХРАНА (12)
  { name: 'Дельта', domain: 'delta.ru', file: 'delta' },
  { name: 'Гольфстрим', domain: 'gulfstream.ru', file: 'gulfstream' },
  { name: 'Цезарь Сателлит', domain: 'caesar.ru', file: 'caesar' },
  { name: 'Росгвардия', domain: 'rosguard.gov.ru', file: 'rosguard' },
  { name: 'Атлант', domain: 'atlant.ru', file: 'atlant' },
  { name: 'Вояж', domain: 'voyage.ru', file: 'voyage' },
  { name: 'Титан', domain: 'titan.ru', file: 'titan' },
  { name: 'ЖилАльянс', domain: 'zhilalians.ru', file: 'zhilalians' },
  { name: 'Dr.Web', domain: 'drweb.ru', file: 'drweb' },
  { name: 'Касперский', domain: 'kaspersky.ru', file: 'kaspersky' },
  { name: 'ESET', domain: 'eset.com', file: 'eset' },
  { name: 'Avast', domain: 'avast.com', file: 'avast' },

  // АВТО (15)
  { name: 'Парковки Москвы', domain: 'parking.mos.ru', file: 'parking-mos' },
  { name: 'Штрафы ГИБДД', domain: 'gibdd.ru', file: 'gibdd' },
  { name: 'Автотека', domain: 'avtoteka.ru', file: 'avtoteka' },
  { name: 'BelkaCar', domain: 'belkacar.ru', file: 'belkacar' },
  { name: 'Делимобиль', domain: 'delimobil.ru', file: 'delimobil' },
  { name: 'Яндекс.Драйв', domain: 'drive.yandex.ru', file: 'yandeksdrayv' },
  { name: 'Парковки СПб', domain: 'parking.spb.ru', file: 'parking-spb' },
  { name: 'Парковки Казани', domain: 'kzn.ru', file: 'parking-kzn' },
  { name: 'Парковки Краснодара', domain: 'krd.ru', file: 'parking-krd' },
  { name: 'Парковки Тюмени', domain: 'tyumen.ru', file: 'parking-tyumen' },
  { name: 'Парковки Владивостока', domain: 'vladivostok.ru', file: 'parking-vlad' },
  { name: 'Парковки Калуги', domain: 'kaluga.ru', file: 'parking-kaluga' },
  { name: 'Парковки Белгорода', domain: 'bel.ru', file: 'parking-bel' },
  { name: 'Парковки Новороссийска', domain: 'nvrsk.ru', file: 'parking-nvrsk' },
  { name: 'ОСАГО', domain: 'osago.ru', file: 'osago' },

  // МЕДИЦИНА (15)
  { name: 'МЕДСИ', domain: 'medsi.ru', file: 'medsi' },
  { name: 'Доктор', domain: 'doctor.ru', file: 'doctor' },
  { name: 'СМ-Клиника', domain: 'smclinic.ru', file: 'smclinic' },
  { name: 'ABC-Медицина', domain: 'abc-medicina.com', file: 'abc-medicina' },
  { name: 'Клиника академика Ройтберга', domain: 'clinic.ru', file: 'clinic' },
  { name: 'ЗдравСити', domain: 'zdravcity.ru', file: 'zdravcity' },
  { name: 'Инвитро', domain: 'invitro.ru', file: 'invitro' },
  { name: 'Гемотест', domain: 'gemotest.ru', file: 'gemotest' },
  { name: 'Хеликс', domain: 'helix.ru', file: 'helix' },
  { name: 'KDL', domain: 'kdl.ru', file: 'kdl' },
  { name: 'СберЗдоровье', domain: 'sberhealth.ru', file: 'sberzdorovye' },
  { name: 'Доктор рядом', domain: 'dr.ru', file: 'dr' },
  { name: 'Онлайн-консультации', domain: 'online-doctor.ru', file: 'online-doctor' },
  { name: 'ДМС', domain: 'dms.ru', file: 'dms' },
  { name: 'ВТБ Медицина', domain: 'vtb.ru', file: 'vtb' },

  // МАГАЗИНЫ (15)
  { name: 'Ozon Premium', domain: 'ozon.ru', file: 'ozon-premium' },
  { name: 'Wildberries', domain: 'wildberries.ru', file: 'wildberries-prime' },
  { name: 'Яндекс Плюс', domain: 'plus.yandex.ru', file: 'yandeks-plyus' },
  { name: 'СберСпасибо', domain: 'sber.ru', file: 'sber' },
  { name: 'Tinkoff Pro', domain: 'tinkoff.ru', file: 'tbank' },
  { name: 'AliExpress', domain: 'aliexpress.ru', file: 'aliexpress' },
  { name: 'Lamoda', domain: 'lamoda.ru', file: 'lamoda' },
  { name: 'Gold Apple', domain: 'goldapple.ru', file: 'goldapple' },
  { name: 'Четыре Лапы', domain: '4lapy.ru', file: '4lapy' },
  { name: 'Л\'Этуаль', domain: 'letu.ru', file: 'letu' },
  { name: 'Рив Гош', domain: 'rigoshop.ru', file: 'rigoshop' },
  { name: 'Подружка', domain: 'podryzhka.ru', file: 'podryzhka' },
  { name: 'Детский Мир', domain: 'detmir.ru', file: 'detmir' },
  { name: 'М.Видео', domain: 'mvideo.ru', file: 'mvideo' },
  { name: 'Эльдорадо', domain: 'eldorado.ru', file: 'eldorado' },

  // СОЦСЕТИ (10)
  { name: 'Telegram Premium', domain: 'telegram.org', file: 'telegram-premium' },
  { name: 'VK Combo', domain: 'vk.com', file: 'vk-combo' },
  { name: 'VK Premium', domain: 'vk.com', file: 'vk-premium' },
  { name: 'VK Play', domain: 'vkplay.ru', file: 'vk-play' },
  { name: 'WhatsApp', domain: 'whatsapp.com', file: 'whatsapp' },
  { name: 'Viber', domain: 'viber.com', file: 'viber' },
  { name: 'Slack', domain: 'slack.com', file: 'slack' },
  { name: 'Discord', domain: 'discord.com', file: 'discord' },
  { name: 'TikTok', domain: 'tiktok.com', file: 'tiktok' },
  { name: 'Instagram', domain: 'instagram.com', file: 'instagram' },

  // ДИЗАЙН (12)
  { name: 'Canva Pro', domain: 'canva.com', file: 'canva-pro' },
  { name: 'Figma', domain: 'figma.com', file: 'figma' },
  { name: 'Adobe Creative Cloud', domain: 'adobe.com', file: 'adobe-creative-cloud' },
  { name: 'Photoshop', domain: 'adobe.com', file: 'photoshop' },
  { name: 'Illustrator', domain: 'adobe.com', file: 'illustrator' },
  { name: 'After Effects', domain: 'adobe.com', file: 'aftereffects' },
  { name: 'Premiere Pro', domain: 'adobe.com', file: 'premiere' },
  { name: 'InDesign', domain: 'adobe.com', file: 'indesign' },
  { name: 'Lightroom', domain: 'adobe.com', file: 'lightroom' },
  { name: 'CorelDRAW', domain: 'coreldraw.com', file: 'coreldraw' },
  { name: 'Sketch', domain: 'sketch.com', file: 'sketch' },
  { name: 'Affinity', domain: 'affinity.serif.com', file: 'affinity' },

  // ИИ (12)
  { name: 'ChatGPT Plus', domain: 'openai.com', file: 'chatgpt-plus' },
  { name: 'Midjourney', domain: 'midjourney.com', file: 'midjourney' },
  { name: 'Claude', domain: 'anthropic.com', file: 'claude-pro' },
  { name: 'Perplexity', domain: 'perplexity.ai', file: 'perplexity-pro' },
  { name: 'DeepSeek', domain: 'deepseek.com', file: 'deepseek-pro' },
  { name: 'GigaChat', domain: 'sberbank.ru', file: 'gigachat' },
  { name: 'Kandinsky', domain: 'fusionbrain.ai', file: 'kandinsky' },
  { name: 'YandexGPT', domain: 'yandex.ru', file: 'yandeks-plyus' },
  { name: 'NeuralHire', domain: 'neuralhire.com', file: 'neuralhire' },
  { name: 'NovelAI', domain: 'novelai.net', file: 'novelai' },
  { name: 'Stability AI', domain: 'stability.ai', file: 'stability' },
  { name: 'Runway', domain: 'runwayml.com', file: 'runway' },

  // БИЗНЕС (15)
  { name: 'Notion', domain: 'notion.so', file: 'notion' },
  { name: 'Trello', domain: 'trello.com', file: 'trello' },
  { name: 'Asana', domain: 'asana.com', file: 'asana' },
  { name: 'Monday', domain: 'monday.com', file: 'monday' },
  { name: 'ClickUp', domain: 'clickup.com', file: 'clickup' },
  { name: 'Airtable', domain: 'airtable.com', file: 'airtable' },
  { name: 'Miro', domain: 'miro.com', file: 'miro' },
  { name: 'Zoom', domain: 'zoom.us', file: 'zoom' },
  { name: 'Microsoft 365', domain: 'microsoft.com', file: 'microsoft-365' },
  { name: 'Google Workspace', domain: 'workspace.google.com', file: 'google-workspace' },
  { name: 'Яндекс 360', domain: '360.yandex.ru', file: 'yandex360' },
  { name: 'VK WorkSpace', domain: 'vk.com', file: 'vk' },
  { name: 'Битрикс24', domain: 'bitrix24.ru', file: 'bitrix24' },
  { name: 'amoCRM', domain: 'amocrm.ru', file: 'amocrm' },
  { name: 'RetailCRM', domain: 'retailcrm.ru', file: 'retailcrm' },

  // РАЗВЛЕЧЕНИЯ (10)
  { name: 'Tinder', domain: 'tinder.com', file: 'tinder' },
  { name: 'Bumble', domain: 'bumble.com', file: 'bumble' },
  { name: 'Mamba', domain: 'mamba.ru', file: 'mamba' },
  { name: 'Pure', domain: 'pure.app', file: 'pure' },
  { name: 'Leomax', domain: 'leomax.ru', file: 'leomax' },
  { name: 'Boosty', domain: 'boosty.to', file: 'boosty' },
  { name: 'Patreon', domain: 'patreon.com', file: 'patreon' },
  { name: 'DonationAlerts', domain: 'donationalerts.com', file: 'donationalerts' },
  { name: 'YouTube Memberships', domain: 'youtube.com', file: 'youtube' },
  { name: 'Twitch', domain: 'twitch.tv', file: 'twitch' },

  // СМИ (10)
  { name: 'Коммерсантъ', domain: 'kommersant.ru', file: 'kommersant' },
  { name: 'Ведомости', domain: 'vedomosti.ru', file: 'vedomosti' },
  { name: 'РБК', domain: 'rbk.ru', file: 'rbk' },
  { name: 'Forbes', domain: 'forbes.ru', file: 'forbes' },
  { name: 'Esquire', domain: 'esquire.ru', file: 'esquire' },
  { name: 'Афиша', domain: 'afisha.ru', file: 'afisha' },
  { name: 'The Village', domain: 'the-village.ru', file: 'the-village' },
  { name: 'VC.ru', domain: 'vc.ru', file: 'vc' },
  { name: 'Habr', domain: 'habr.com', file: 'habr' },
  { name: 'Lenta', domain: 'lenta.ru', file: 'lenta' },

  // ПРОЧЕЕ (20)
  { name: 'SMS', domain: '', file: 'sms' },
  { name: 'ЖКХ', domain: '', file: 'zhkh' },
  { name: 'СНТ', domain: '', file: 'snt' },
  { name: 'Podryad', domain: '', file: 'podryad' },
  { name: 'Loudplay', domain: 'loudplay.ru', file: 'loudplay' },
  { name: 'YandexGame', domain: 'yandex.ru', file: 'yandexgame' },
  { name: 'Yasno', domain: 'yasno.ru', file: 'yasno' },
  { name: 'Yota Home', domain: 'yota.ru', file: 'yota-home' },
  { name: 'Domovenok', domain: 'domovenok.ru', file: 'domovenok' },
  { name: 'Dom.ru', domain: 'domru.ru', file: 'domru' },
  { name: 'Onlime', domain: 'onlime.ru', file: 'onlime' },
  { name: 'Intervyaz', domain: 'intersvyaz.ru', file: 'intersvyaz' },
  { name: 'Infolink', domain: 'infolink.ru', file: 'infolink' },
  { name: 'NetByNet', domain: 'netbynet.ru', file: 'netbynet' },
  { name: 'Akado', domain: 'akado.ru', file: 'akado' },
  { name: 'Qwerty', domain: 'qwerty.ru', file: 'qwerty' },
  { name: 'Real', domain: 'real.ru', file: 'real' },
  { name: 'GoodLine', domain: 'goodline.ru', file: 'goodline' },
  { name: 'Miranda', domain: 'miranda-media.ru', file: 'miranda' },
  { name: 'VestCall', domain: 'westcall.ru', file: 'vestcall' }
];

const logosDir = path.join(__dirname, 'public', 'logos');
if (!fs.existsSync(logosDir)) {
  fs.mkdirSync(logosDir, { recursive: true });
}

function downloadFile(url, dest) {
  return new Promise((resolve) => {
    const options = {
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    };
    
    https.get(url, options, (response) => {
      if (response.statusCode === 200) {
        const file = fs.createWriteStream(dest);
        response.pipe(file);
        file.on('finish', () => {
          file.close();
          const stats = fs.statSync(dest);
          if (stats.size > 500) {
            resolve(true);
          } else {
            fs.unlinkSync(dest);
            resolve(false);
          }
        });
      } else {
        resolve(false);
      }
    }).on('error', () => {
      resolve(false);
    });
  });
}

console.log('🚀 Скачиваю ВСЕ 350+ логотипов...\n');

let downloaded = 0;
let failed = 0;

async function downloadAll() {
  for (let i = 0; i < subscriptions.length; i++) {
    const sub = subscriptions[i];
    const destPath = path.join(logosDir, `${sub.file}.png`);
    
    if (fs.existsSync(destPath) && fs.statSync(destPath).size > 500) {
      console.log(`⏭️  [${i + 1}/${subscriptions.length}] ${sub.name}`);
      downloaded++;
      continue;
    }
    
    const sources = [
      `https://logo.clearbit.com/${sub.domain}`,
      `https://www.google.com/s2/favicons?domain=${sub.domain}&sz=512`,
      `https://www.google.com/s2/favicons?domain=${sub.domain}&sz=256`,
      `https://icons.duckduckgo.com/ip3/${sub.domain}.ico`,
      `https://logo.clearbit.com/${sub.domain}?size=256`
    ];
    
    let success = false;
    for (const url of sources) {
      success = await downloadFile(url, destPath);
      if (success) break;
    }
    
    if (success) {
      const size = (fs.statSync(destPath).size / 1024).toFixed(2);
      console.log(`✅ [${i + 1}/${subscriptions.length}] ${sub.name} (${size} KB)`);
      downloaded++;
    } else {
      console.log(`❌ [${i + 1}/${subscriptions.length}] ${sub.name}`);
      failed++;
    }
    
    await new Promise(r => setTimeout(r, 200));
  }
  
  console.log('\n=================================');
  console.log(`✅ Скачано: ${downloaded} из ${subscriptions.length}`);
  console.log(`❌ Не удалось: ${failed}`);
  console.log(`📁 Папка: ${logosDir}`);
  console.log('=================================\n');
  console.log('💡 Теперь: npm run build && npx cap sync android');
}

downloadAll();