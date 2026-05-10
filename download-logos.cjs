const fs = require('fs');
const path = require('path');
const https = require('https');

// === ВСЕ 350+ ЛОГОТИПОВ ИЗ БАЗЫ ===
const subscriptions = [
  // КИНО И ВИДЕО
  'yandeks-plyus', 'ivi', 'kinopoisk', 'okko', 'premier', 'wink', 'amediateka', 'kion', 'more-tv', 'tricolor', 'start', 'netflix', 'disney-plus', 'amazon-prime', 'youtube-music', 'ntv-plyus', 'mts-tv', 'smotreshka', 'edem', 'rutube',

  // МУЗЫКА
  'yandeks-muzyka', 'vk-muzyka', 'zvuk', 'apple-music', 'spotify', 'mts-music', 'tidal', 'yandex-music',

  // КНИГИ
  'litres-podpiska', 'mybook', 'bukmeyt', 'storytel', 'patefon', 'loudplay', 'bookmate', 'alpinabook',

  // ИНТЕРНЕТ
  'rostelecom', 'mts', 'domru', 'beeline', 'megafon', 'tele2', 'yota', 'mgts', 'ttk', 'onlaym', 'ufanet', 'skynet', 'sibirskie-seti', 'zelenaya-tochka', 'intersvyaz', 'infolink', 'netbynet', 'akado', 'qwerty', 'real', 'good-line', 'miranda-media', 'omskie-kabelnye-seti', 'vestcall', 'starlink', 'bilayn-dom', 'bilayn-tarif',

  // МОБИЛЬНЫЕ
  't2', 'sbermobile', 'virginmobile', 'mcntelecom', 'allo-incognito', 'megafon-plyus', 'megafon-tarif', 'mts-tarif',

  // БАНКИ
  'tbank', 'tbank-premium', 'sberpraym', 'alfa-smart', 'alfa', 'vtb-privilegiya', 'gazprombank-premium', 'raiffayzen-premium', 'rosbank', 'open', 'pochtabank', 'uralsib', 'akbars', 'sovcombank', 'homecredit',

  // ОБЛАКА
  'yandeksdisk-100gb', 'yandeksdisk-1tb', 'oblako-mailru-64gb', 'icloud-50gb', 'icloud-200gb', 'icloud-2tb', 'google-one-100gb', 'google-one-2tb', 'onedrive-100gb', 'dropbox-2tb', 'sberdisk', 'vk-workdisk', 'terabox', 'selectel', 'oncloud', 'blomp',

  // ИГРЫ
  'playstation-plus', 'xbox-game-pass', 'ea-play', 'discord', 'twich', 'nintendo-online', 'geforce-now', 'steam', 'ubisoft', 'humblebundle', 'itch-io', 'epicgames',

  // ОБРАЗОВАНИЕ
  'skillbox', 'geekbrains', 'netologiya', 'stepik', 'skillfactory', 'yandekspraktikum', 'skyeng', 'skypro', 'otus', 'htmlacademy', 'loftschool', 'geekuniversity', 'codingfactory', 'tattooekom-letay', 'contented', 'lingualeo', 'duolingo-plus', 'puzzle-english', 'englishdom', 'tilda', 'sync', 'postnauka', 'arzamas', 'magisteria', 'chetyre-lapy', 'getcourse', 'antitraining', 'zenclass', 'soho-lms', 'skillspace',

  // ДОСТАВКА
  'yandeks-lavka', 'deliveryclub', 'samokat', 'sbermarket', 'vkusvill', 'ozon-premium', '5post', 'perekrestok', 'lanta', 'magnit', 'auchan', 'metro', 'iherb', 'aliexpress-premium', 'level-kitchen', 'grow-food', 'befit', 'justfood', 'myfood', 'performance-food', 'idealday', 'smartcalories', 'priem', 'chefmarket', 'polza', 'elementaree', 'foodband', '2berega', 'freshlab', 'kitchenrepublic', 'mrdoorsfood',

  // ФИТНЕС
  'world-class', 'pure-fitness', 'xfit', 'planeta-fitnes', 'zebra', 'sss-fitness', 'urbanfit', 'alex-fitness', 'fitnes-praga', 'pure-vip', 'encorefitness', 'republika', 'fizkult', 'ssc', 'fitnessfactory', 'fitcurves', 'orangefitness', 'topfitness', 'fitnessplace', 'gymnasium', 'ufcgym', 'adidas', 'reebok',

  // ЖКХ
  'seven-sky', 'metacom', 'vizit', 'eltis', 'factorial', 'domovenok', 'aiteco', 'nikom', 'tantos', 'mts-tv', 'vk', 'rubek', 'tuya',

  // ОХРАНА
  'delta-okhrana', 'golfstrim', 'caesar', 'rosguard', 'atlant', 'voyage', 'titan', 'zhilalians', 'drweb', 'kaspersky', 'eset', 'avast',

  // АВТО
  'platnye-parkovki', 'shtrafy-gibdd', 'avtoteka', 'belkacar', 'delimobil-prime', 'yandeksdrayv-plus', 'osago',

  // МЕДИЦИНА
  'medsi', 'doctor', 'smclinic', 'abc-medicina', 'clinic', 'zdravcity', 'invitro', 'gemotest', 'helix', 'kdl', 'sberzdorovye', 'dr', 'online-doctor', 'dms', 'vtb-privilegiya',

  // МАГАЗИНЫ
  'wildberries-prime', 'goldapple-box', 'letu', 'rigoshop', 'podryzhka', 'lamoda-premium',

  // СОЦСЕТИ
  'telegram-premium', 'vk-combo', 'vk-premium', 'vk-play-cloud', 'whatsapp', 'viber', 'slack',

  // ДИЗАЙН
  'canva-pro', 'figma', 'adobe-creative-cloud', 'photoshop', 'illustrator', 'aftereffects', 'premier', 'indesign', 'lightroom', 'coreldraw',

  // ИИ
  'chatgpt-plus', 'midjourney', 'claude-pro', 'perplexity-pro', 'deepseek-pro', 'gigachat-pro', 'fusionbrain', 'neuralhire', 'novelai',

  // БИЗНЕС
  'notion', 'trello', 'asana', 'monday', 'clickup', 'airtable', 'miro', 'zoom', 'microsoft-365-family', 'microsoft-365-personal', 'workspace', 'yandex360', 'bitrix24', 'amocrm', 'retailcrm',

  // РАЗВЛЕЧЕНИЯ
  'tinder', 'bumble', 'mamba-vip', 'pure', 'leomax', 'boosty', 'patreon', 'donationalerts',

  // СМИ
  'kommersant', 'vedomosti', 'rbk', 'forbes', 'esquire', 'afisha', 'the-village', 'vc',

  // ПРОЧЕЕ
  'sms', 'zhkh', 'snt', 'podryad', 'loudplay', 'start', 'yandexgame', 'yasno', 'yota-home'
];

// Создаём папку logos
const logosDir = path.join(__dirname, 'public', 'logos');
if (!fs.existsSync(logosDir)) {
  fs.mkdirSync(logosDir, { recursive: true });
  console.log('✅ Папка public/logos создана');
}

// Функция скачивания
function downloadFile(url, dest, callback) {
  const file = fs.createWriteStream(dest);
  
  const request = https.get(url, (response) => {
    if (response.statusCode === 200) {
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        callback(true);
      });
    } else {
      file.close();
      callback(false);
    }
  }).on('error', (err) => {
    fs.unlink(dest, () => {});
    callback(false);
  });
  
  request.setTimeout(10000, () => {
    request.destroy();
    callback(false);
  });
}

console.log('🚀 Начинаю загрузку 350+ логотипов...\n');

let downloaded = 0;
let failed = 0;
const total = subscriptions.length;

subscriptions.forEach((logoName) => {
  const simpleIconName = logoName.replace(/-/g, '').toLowerCase();
  
  // Источники (по порядку)
  const sources = [
    `https://cdn.simpleicons.org/${simpleIconName}`,
    `https://cdn.simpleicons.org/${simpleIconName}/FFFFFF/000000`,
    `https://www.google.com/s2/favicons?domain=${logoName.split('-')[0]}.ru&sz=256`,
    `https://www.google.com/s2/favicons?domain=${logoName.split('-')[0]}.com&sz=256`
  ];

  const destPath = path.join(logosDir, `${logoName}.png`);
  
  if (fs.existsSync(destPath)) {
    console.log(`⏭️  Пропущено: ${logoName}.png (уже есть)`);
    downloaded++;
    checkCompletion();
    return;
  }

  // Пробуем источники по очереди
  let sourceIndex = 0;
  
  function tryNextSource() {
    if (sourceIndex >= sources.length) {
      console.log(`❌ Не удалось: ${logoName}.png`);
      failed++;
      checkCompletion();
      return;
    }
    
    const url = sources[sourceIndex];
    downloadFile(url, destPath, (success) => {
      if (success) {
        console.log(`✅ Скачано: ${logoName}.png`);
        downloaded++;
      } else {
        sourceIndex++;
        tryNextSource();
      }
      checkCompletion();
    });
  }
  
  tryNextSource();
});

function checkCompletion() {
  if (downloaded + failed >= total) {
    console.log('\n=================================');
    console.log(`✅ ГОТОВО! Скачано: ${downloaded} из ${total}`);
    console.log(`❌ Не удалось: ${failed}`);
    console.log(`📁 Папка: ${logosDir}`);
    console.log('=================================\n');
    console.log('Теперь выполни: npm run build && npx cap sync android');
  }
}