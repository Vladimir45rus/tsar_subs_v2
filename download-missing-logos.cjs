const fs = require('fs');
const path = require('path');
const https = require('https');

const logosDir = path.join(__dirname, 'public', 'logos');

const missingLogos = [
  'beeline',
  'geforce-now',
  'gigachat-pro',
  'more-tv',
  'mts-tv',
  'pure-fitness',
  'pure-vip',
  'sss-fitness',
  'tbank-premium',
  'tricolor',
  'ttk',
  'vk-combo',
  'vk-muzyka',
  'vk-play-cloud',
  'vk-premium',
  'vtb-privilegiya',
  'yandeksdisk-100gb',
  'yandeksdrayv-plus',
  'zhkh',
  'sms',
  'skyyeng',
  'microsoft-365-family',
  'microsoft-365-personal',
];

const logoDomains = {
  'beeline': 'beeline.ru',
  'geforce-now': 'nvidia.com',
  'gigachat-pro': 'sberbank.ru',
  'more-tv': 'more.tv',
  'mts-tv': 'mts.ru',
  'pure-fitness': 'purefitness.ru',
  'pure-vip': 'pure.app',
  'sss-fitness': 'sszfitness.ru',
  'tbank-premium': 'tbank.ru',
  'tricolor': 'tricolor.tv',
  'ttk': 'ttk.ru',
  'vk-combo': 'vk.com',
  'vk-muzyka': 'vk.com',
  'vk-play-cloud': 'vkplay.ru',
  'vk-premium': 'vk.com',
  'vtb-privilegiya': 'vtb.ru',
  'yandeksdisk-100gb': 'disk.yandex.ru',
  'yandeksdrayv-plus': 'drive.yandex.ru',
  'zhkh': '',
  'sms': '',
  'skyyeng': 'skypro.ru',
  'microsoft-365-family': 'microsoft.com',
  'microsoft-365-personal': 'microsoft.com',
};

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

(async () => {
  for (const logo of missingLogos) {
    const filePath = path.join(logosDir, `${logo}.png`);
    if (fs.existsSync(filePath)) {
      console.log(`⏭️ ${logo} уже существует`);
      continue;
    }

    const domain = logoDomains[logo];
    if (!domain) {
      console.log(`⚠️ Для ${logo} не указан домен, пропускаем`);
      continue;
    }

    const url = `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
    console.log(`⬇️ Скачиваю ${logo} с домена ${domain}...`);

    try {
      await download(url, filePath);
      console.log(`✅ ${logo}.png сохранён`);
    } catch (e) {
      console.log(`❌ Не удалось скачать ${logo}: ${e.message || e}`);
    }
  }
  console.log('🎉 Загрузка завершена!');
})();