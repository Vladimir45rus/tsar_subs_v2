import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const logosDir = path.join(__dirname, 'public', 'logos');

// ========== 1. ПЕРЕИМЕНОВАНИЕ (сопоставление неправильных имён) ==========
// Здесь мы вручную пропишем соответствия для самых частых расхождений
const renameMap = {
  // Яндекс.Диск
  'yandeks-disk-1tb.png': 'yandeksdisk-1tb.png',
  // Добавь другие пары по необходимости (например, если увидишь ещё)
};

// Выполняем переименование
Object.entries(renameMap).forEach(([oldName, newName]) => {
  const oldPath = path.join(logosDir, oldName);
  const newPath = path.join(logosDir, newName);
  if (fs.existsSync(oldPath) && !fs.existsSync(newPath)) {
    fs.renameSync(oldPath, newPath);
    console.log(`✅ Переименован: ${oldName} -> ${newName}`);
  } else if (fs.existsSync(oldPath) && fs.existsSync(newPath)) {
    console.log(`⚠️ Файл ${newName} уже существует, пропускаем ${oldName}`);
  }
});

// ========== 2. УДАЛЕНИЕ ЛИШНИХ ==========
const extra = [
  // Список extra из твоего отчёта (скопируй его сюда)
  "affinity", "afisha", "airtable", "al-yanstelekom", "alfa-premium", "aliexpress",
  "alpinabook", "amedia", "amocrm", "arzamas", "asana", "avast", "aviasales-premium",
  "avtokod", "battlenet", "bitrix24", "blomp", "boosty", "box", "bumble", "clickup",
  "contented", "coreldraw", "cyfral", "ddx-fitness", "deezer", "del-ta-ohrana",
  "delimobil", "delta", "detmir", "doctor", "domofon", "donationalerts", "ea-play",
  "eldorado", "elementaree", "encorefitness", "eneva", "englishdom", "epicgames",
  "eset", "factorial", "fizkult", "foodband", "forbes", "gazprom-bonus", "gemotest",
  "getcourse", "gog", "goldapple", "google-workspace", "helix", "hexlet", "htmlacademy",
  "humblebundle", "idealday", "iherb", "instagram", "invitro", "itch-io", "kdl",
  "kuper-prime", "lamoda", "lenta", "letu", "magisteria", "mamba", "medsi", "miro",
  "monday", "novelai", "oncloud", "online-doctor", "origin", "orionet", "otus",
  "parking-kaluga", "parking-krd", "parking-nvrsk", "parking-spb", "parking-tyumen",
  "patreon", "pcloud", "petshop", "podryad", "potok", "republika", "retailcrm",
  "royal-samples", "runway", "rutube", "selectel", "sevstar", "sketch", "skillfactory",
  "skillspace", "slack", "smotreshka", "soundcloud", "spirit-fitness", "stability",
  "starlink", "stroki", "sync", "tabor-vip", "tantos", "tattelekom-letay", "terabox",
  "the-village", "tiktok", "tinder", "titan", "trello", "utkonos-prime", "vc", "viber",
  "viju", "vprokru", "whatsapp", "whoosh-pass", "x5-paket", "xiaomi-cloud",
  "yandeksdom", "yandex360", "yandexgame", "yasno", "yota-home", "youtube", "zenclass",
  "zoom"
];

extra.forEach(fileBase => {
  const extensions = ['.png', '.jpg', '.jpeg'];
  extensions.forEach(ext => {
    const filePath = path.join(logosDir, fileBase + ext);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log(`🗑️ Удалён лишний файл: ${fileBase + ext}`);
    }
  });
});

// ========== 3. СКАЧИВАНИЕ НЕДОСТАЮЩИХ ==========
const missing = [
  "beeline", "fitnes-praga", "geforce-now", "gigachat-pro", "mgts", "more-tv", "mts-tv",
  "omskie-kabelnye-seti", "onlaym", "planeta-fitnes", "sberpraym", "shtrafy-gibdd",
  "sibirskie-seti", "skynet", "skyyeng", "sms", "snt", "sss-fitness", "stepik",
  "tbank-premium", "tricolor", "ttk", "vk-combo", "vk-muzyka", "vk-premium",
  "yandeksdisk-100gb", "yandeksdisk-1tb", "youtube-music", "zebra", "zhkh"
];

// Функция для скачивания
function download(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, (response) => {
      if (response.statusCode === 200) {
        response.pipe(file);
        file.on('finish', () => {
          file.close();
          resolve();
        });
      } else {
        file.close();
        fs.unlink(dest, () => {});
        reject(`Ошибка ${response.statusCode} для ${url}`);
      }
    }).on('error', (err) => {
      file.close();
      fs.unlink(dest, () => {});
      reject(err);
    });
  });
}

// Домены для логотипов (можно дополнить)
const domains = {
  beeline: 'beeline.ru',
  'fitnes-praga': 'fitness-praga.ru',
  'geforce-now': 'nvidia.com',
  'gigachat-pro': 'sberbank.ru',
  mgts: 'mgts.ru',
  'more-tv': 'more.tv',
  'mts-tv': 'mts.ru',
  'omskie-kabelnye-seti': 'omskc.ru',
  onlaym: 'onlime.ru',
  'planeta-fitnes': 'fitness.ru',
  sberpraym: 'sber.ru',
  'shtrafy-gibdd': 'gibdd.ru',
  'sibirskie-seti': 'sibset.ru',
  skynet: 'skynet.ru',
  skyyeng: 'skyeng.ru',
  sms: '',
  snt: '',
  'sss-fitness': 'sszfitness.ru',
  stepik: 'stepik.org',
  'tbank-premium': 'tbank.ru',
  tricolor: 'tricolor.tv',
  ttk: 'ttk.ru',
  'vk-combo': 'vk.com',
  'vk-muzyka': 'vk.com',
  'vk-premium': 'vk.com',
  'yandeksdisk-100gb': 'disk.yandex.ru',
  'yandeksdisk-1tb': 'disk.yandex.ru',
  'youtube-music': 'youtube.com',
  zebra: 'fitness-zebra.ru',
  zhkh: ''
};

(async () => {
  for (const logo of missing) {
    const filePath = path.join(logosDir, `${logo}.png`);
    if (fs.existsSync(filePath)) {
      console.log(`⏭️ ${logo} уже есть, пропускаем.`);
      continue;
    }

    const domain = domains[logo];
    if (!domain) {
      console.log(`⚠️ Для ${logo} не указан домен, пропускаем.`);
      continue;
    }

    const url = `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
    console.log(`⬇️ Скачиваю ${logo} с ${domain}...`);

    try {
      await download(url, filePath);
      console.log(`✅ ${logo}.png сохранён.`);
    } catch (e) {
      console.log(`❌ Не удалось скачать ${logo}: ${e}`);
    }
  }
  console.log('🎉 Загрузка завершена!');
})();