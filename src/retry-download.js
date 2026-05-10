import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Список ВСЕХ подписок
const allSubscriptions = [
  'yandeks-plyus', 'ivi', 'kinopoisk', 'okko', 'premier', 'wink', 'amediateka', 'kion', 'tricolor', 'start', 'netflix', 'disney-plus', 'amazon-prime', 'youtube-music',
  'yandeks-muzyka', 'vk-muzyka', 'zvuk', 'apple-music', 'spotify', 'tidal',
  'litres-podpiska', 'mybook', 'bukmeyt', 'storytel',
  'rostelecom', 'mts', 'domru', 'beeline', 'megafon', 'tele2', 'yota', 'mgts', 'ttk', 'onlaym', 'ufanet', 'skynet', 'sibirskie-seti', 'zelenaya-tochka',
  't2', 'sber', 'sberpraym', 'tbank', 'tbank-premium', 'alfa', 'vtb-privilegiya',
  'icloud-50gb', 'icloud-200gb', 'icloud-2tb', 'google-one-100gb', 'google-one-2tb', 'onedrive-100gb', 'dropbox-2tb',
  'playstation-plus', 'xbox-game-pass', 'discord', 'steam', 'twitch',
  'skillbox', 'geekbrains', 'netologiya', 'stepik', 'skyeng', 'tilda', 'lingualeo', 'duolingo-plus',
  'yandeks-lavka', 'samokat', 'ozon-premium', 'wildberries-prime', 'level-kitchen', 'grow-food',
  'world-class', 'zebra', 'alex-fitness', 'fitnes-praga',
  'telegram-premium', 'vk', 'vk-combo',
  'canva-pro', 'figma', 'adobe-creative-cloud', 'notion',
  'chatgpt-plus', 'midjourney', 'perplexity-pro',
  'delta-okhrana', 'golfstrim', 'kaspersky',
  'shtrafy-gibdd', 'avtoteka', 'belkacar', 'delimobil-prime',
  'sms', 'zhkh', 'snt', 'caesar', 'sbermobile', 'mts-music', 'megafon-plyus', 'bilayn-dom', 'onlime', 'intersvyaz', 'infolink', 'netbynet', 'akado', 'qwerty', 'good-line', 'miranda-media', 'omskie-kabelnye-seti', 'alfa-smart', 'gazprombank-premium', 'raiffayzen-premium', 'dropbox-2tb', 'ea-play', 'nintendo-online', 'geforce-now', 'ubisoft', 'humblebundle', 'itch-io', 'epicgames', 'skypro', 'otus', 'htmlacademy', 'loftschool', 'geekuniversity', 'codingfactory', 'contented', 'puzzle-english', 'englishdom', 'sync', 'postnauka', 'arzamas', 'magisteria', 'getcourse', 'antitraining', 'zenclass', 'soho-lms', 'skillspace', 'deliveryclub', 'sbermarket', 'vkusvill', 'ozon-fresh', '5post', 'perekrestok', 'lanta', 'magnit', 'auchan', 'metro', 'iherb', 'aliexpress-premium', 'befit', 'justfood', 'myfood', 'performance-food', 'idealday', 'smartcalories', 'priem', 'chefmarket', 'polza', 'elementaree', 'foodband', '2berega', 'freshlab', 'kitchenrepublic', 'mrdoorsfood', 'pure-fitness', 'sss-fitness', 'urbanfit', 'encorefitness', 'republika', 'fizkult', 'ssc', 'fitnessfactory', 'fitcurves', 'orangefitness', 'topfitness', 'fitnessplace', 'gymnasium', 'ufcgym', 'adidas', 'reebok', 'metacom', 'vizit', 'eltis', 'factorial', 'domovenok', 'aiteco', 'nikom', 'tantos', 'vk-workdisk', 'rubek', 'tuya', 'rosguard', 'atlant', 'voyage', 'titan', 'zhilalians', 'drweb', 'eset', 'avast', 'platnye-parkovki', 'osago', 'medsi', 'doctor', 'smclinic', 'abc-medicina', 'clinic', 'zdravcity', 'invitro', 'gemotest', 'helix', 'kdl', 'sberzdorovye', 'dr', 'online-doctor', 'dms', 'goldapple-box', 'letu', 'rigoshop', 'podryzhka', 'lamoda-premium', 'vk-premium', 'vk-play-cloud', 'whatsapp', 'viber', 'slack', 'photoshop', 'illustrator', 'aftereffects', 'premier', 'indesign', 'lightroom', 'coreldraw', 'claude-pro', 'deepseek-pro', 'gigachat-pro', 'fusionbrain', 'neuralhire', 'novelai', 'trello', 'asana', 'monday', 'clickup', 'airtable', 'miro', 'zoom', 'microsoft-365-family', 'microsoft-365-personal', 'workspace', 'yandex360', 'bitrix24', 'amocrm', 'retailcrm', 'tinder', 'bumble', 'mamba-vip', 'pure', 'leomax', 'boosty', 'patreon', 'donationalerts', 'kommersant', 'vedomosti', 'rbk', 'forbes', 'esquire', 'afisha', 'the-village', 'vc', 'podryad', 'loudplay', 'yandexgame', 'yasno', 'yota-home', 'rutube', 'smotreshka', 'edem', 'mts-tv', 'ntv-plyus', 'more-tv', 'patefon', 'alpinabook', 'bookmate', 'terabox', 'selectel', 'oncloud', 'blomp', 'tattooekom-letay', 'chetyre-lapy', 'vestcall', 'starlink', 'virginmobile', 'mcntelecom', 'allo-incognito', 'rosbank', 'open', 'pochtabank', 'uralsib', 'akbars', 'sovcombank', 'homecredit', 'skillfactory', 'yandekspraktikum'
];

const logosDir = path.join(__dirname, 'public', 'logos');

// Проверяем что уже есть
const existingFiles = fs.existsSync(logosDir) ? fs.readdirSync(logosDir).map(f => f.replace('.png', '')) : [];
const needToDownload = allSubscriptions.filter(sub => !existingFiles.includes(sub));

console.log(`\n📊 Уже есть: ${existingFiles.length}`);
console.log(`📥 Нужно скачать: ${needToDownload.length}\n`);

if (needToDownload.length === 0) {
  console.log('✅ Все логотипы уже скачаны!');
  process.exit(0);
}

function downloadFile(url, dest) {
  return new Promise((resolve) => {
    const file = fs.createWriteStream(dest);
    https.get(url, { timeout: 10000 }, (response) => {
      if (response.statusCode === 200) {
        response.pipe(file);
        file.on('finish', () => {
          file.close();
          resolve(true);
        });
      } else {
        file.close();
        resolve(false);
      }
    }).on('error', () => {
      fs.unlink(dest, () => {});
      resolve(false);
    });
  });
}

console.log('🚀 Начинаю докачку...\n');

let downloaded = 0;
let failed = 0;

async function downloadAll() {
  for (let i = 0; i < needToDownload.length; i++) {
    const logoName = needToDownload[i];
    const simpleIconName = logoName.replace(/-/g, '').toLowerCase();
    const destPath = path.join(logosDir, `${logoName}.png`);
    
    // Пробуем разные источники
    const sources = [
      `https://cdn.simpleicons.org/${simpleIconName}`,
      `https://cdn.simpleicons.org/${simpleIconName}/000000/FFFFFF`,
      `https://www.google.com/s2/favicons?domain=${logoName.split('-')[0]}.ru&sz=512`,
      `https://www.google.com/s2/favicons?domain=${logoName.split('-')[0]}.com&sz=512`,
      `https://logo.clearbit.com/${logoName.split('-')[0]}.ru`,
      `https://logo.clearbit.com/${logoName.split('-')[0]}.com`
    ];

    let success = false;
    for (const url of sources) {
      success = await downloadFile(url, destPath);
      if (success) break;
    }

    if (success) {
      console.log(`✅ [${i + 1}/${needToDownload.length}] ${logoName}.png`);
      downloaded++;
    } else {
      console.log(`❌ [${i + 1}/${needToDownload.length}] ${logoName}.png`);
      failed++;
    }
    
    // Пауза чтобы не блокировали
    await new Promise(r => setTimeout(r, 200));
  }

  console.log('\n=================================');
  console.log(`✅ ГОТОВО! Скачано: ${downloaded}`);
  console.log(`❌ Не удалось: ${failed}`);
  console.log(`📁 Всего в папке: ${existingFiles.length + downloaded}`);
  console.log('=================================\n');
}

downloadAll();