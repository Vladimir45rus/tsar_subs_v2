import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const logosDir = path.join(__dirname, 'public', 'logos');

// === ВСЕ ПОДПИСКИ (те же что в download-clearbit.js) ===
const allSubscriptions = [
  'yandeks-plyus', 'ivi', 'kinopoisk', 'okko', 'premier', 'wink', 'amediateka', 'kion', 'more-tv', 'tricolor', 'start', 'netflix', 'disney-plus', 'amazon-prime', 'youtube-music', 'ntv-plyus', 'mts-tv', 'smotreshka', 'rutube', 'vk',
  'yandeks-muzyka', 'vk-muzyka', 'zvuk', 'apple-music', 'spotify', 'mts-music', 'tidal', 'soundcloud', 'deezer',
  'litres-podpiska', 'mybook', 'bukmeyt', 'storytel', 'loudplay', 'bookmate', 'alpinabook', 'patefon',
  'rostelecom', 'mts', 'domru', 'beeline', 'megafon', 'tele2', 'yota', 'mgts', 'ttk', 'onlaym', 'ufanet', 'skynet', 'sibirskie-seti', 'zelenaya-tochka', 'intersvyaz', 'infolink', 'netbynet', 'akado', 'qwerty', 'real', 'good-line', 'miranda-media', 'vestcall', 'starlink', 'omskie-kabelnye-seti', 'tattelekom-letay', 'orionet',
  't2', 'sbermobile', 'virginmobile', 'mcntelecom', 'allo-incognito',
  'tbank', 'tbank-premium', 'sberpraym', 'alfa-smart', 'alfa-premium', 'vtb-privilegiya', 'gazprombank-premium', 'raiffayzen-premium', 'rosbank', 'open', 'pochtabank', 'uralsib', 'akbars', 'sovcombank', 'homecredit', 'unicredit', 'mkb', 'psbank', 'rshb', 'vozrozhdenie',
  'yandeksdisk-100gb', 'oblako-mailru-64gb', 'icloud-200gb', 'google-one-100gb', 'onedrive-100gb', 'dropbox-2tb', 'sber', 'terabox', 'selectel', 'oncloud', 'blomp', 'pcloud', 'box', 'sync',
  'playstation-plus', 'xbox-game-pass', 'ea-play', 'discord', 'twitch', 'nintendo-online', 'geforce-now', 'steam', 'ubisoft', 'humblebundle', 'itch-io', 'epicgames', 'gog', 'origin', 'battlenet',
  'skillbox', 'geekbrains', 'netologiya', 'stepik', 'skillfactory', 'yandekspraktikum', 'skyeng', 'skypro', 'otus', 'htmlacademy', 'loftschool', 'geekuniversity', 'codingfactory', 'teletype', 'contented', 'lingualeo', 'duolingo-plus', 'puzzle-english', 'englishdom', 'tilda', 'sync', 'postnauka', 'arzamas', 'magisteria', 'chetyre-lapy', 'getcourse', 'antitraining', 'zenclass', 'soho-lms', 'skillspace',
  'yandeks-lavka', 'deliveryclub', 'samokat', 'sbermarket', 'vkusvill', 'ozon-premium', '5post', 'perekrestok', 'lenta', 'magnit', 'auchan', 'metro', 'iherb', 'aliexpress-premium', 'ozon', 'wildberries-prime', 'lamoda-premium', 'goldapple-box', 'chetyre-lapy',
  'level-kitchen', 'grow-food', 'befit', 'justfood', 'myfood', 'performance-food', 'idealday', 'smartcalories', 'priem', 'chefmarket', 'polza', 'elementaree', 'foodband', '2berega', 'freshlab',
  'world-class', 'ddx-fitness', 'xfit', 'planeta-fitnes', 'zebra', 'spirit-fitness', 'urbanfit', 'alex-fitness', 'fitnes-praga', 'ssz-fitness', 'pure-fitness', 'encorefitness', 'republika', 'fizkult', 'ssc', 'fitnessfactory', 'fitcurves', 'orangefitness', 'topfitness', 'fitnessplace',
  'cyfral', 'seven-sky', 'metacom', 'vizit', 'eltis', 'factorial', 'domofon', 'aiteco', 'nikom', 'tantos', 'umny-dom', 'rubek',
  'delta', 'gulfstream', 'caesar', 'rosguard', 'atlant', 'voyage', 'titan', 'zhilalians', 'drweb', 'kaspersky', 'eset', 'avast',
  'parking-mos', 'gibdd', 'avtoteka', 'belkacar', 'delimobil', 'yandeksdrayv', 'parking-spb', 'parking-kzn', 'parking-krd', 'parking-tyumen', 'parking-vlad', 'parking-kaluga', 'parking-bel', 'parking-nvrsk', 'osago',
  'medsi', 'doctor', 'smclinic', 'abc-medicina', 'clinic', 'zdravcity', 'invitro', 'gemotest', 'helix', 'kdl', 'sberzdorovye', 'dr', 'online-doctor', 'dms', 'vtb',
  'letu', 'rigoshop', 'podryzhka', 'detmir', 'mvideo', 'eldorado',
  'telegram-premium', 'vk-combo', 'vk-premium', 'vk-play', 'whatsapp', 'viber', 'slack', 'tiktok', 'instagram',
  'canva-pro', 'figma', 'adobe-creative-cloud', 'photoshop', 'illustrator', 'aftereffects', 'premiere', 'indesign', 'lightroom', 'coreldraw', 'sketch', 'affinity',
  'chatgpt-plus', 'midjourney', 'claude-pro', 'perplexity-pro', 'deepseek-pro', 'gigachat', 'kandinsky', 'neuralhire', 'novelai', 'stability', 'runway',
  'notion', 'trello', 'asana', 'monday', 'clickup', 'airtable', 'miro', 'zoom', 'microsoft-365', 'google-workspace', 'yandex360', 'bitrix24', 'amocrm', 'retailcrm',
  'tinder', 'bumble', 'mamba', 'pure', 'leomax', 'boosty', 'patreon', 'donationalerts', 'youtube',
  'kommersant', 'vedomosti', 'rbk', 'forbes', 'esquire', 'afisha', 'the-village', 'vc', 'habr',
  'sms', 'zhkh', 'snt', 'podryad', 'loudplay', 'yandexgame', 'yasno', 'yota-home', 'domovenok', 'onlime', 'intervyaz', 'goodline', 'miranda'
];

console.log('🔍 Проверяю логотипы...\n');

const failed = [];
let good = 0;

allSubscriptions.forEach(file => {
  const filePath = path.join(logosDir, `${file}.png`);
  
  if (!fs.existsSync(filePath)) {
    console.log(`❌ ${file}.png (не найден)`);
    failed.push(file);
  } else {
    const stats = fs.statSync(filePath);
    if (stats.size < 500) {
      console.log(`❌ ${file}.png (${stats.size} bytes - слишком маленький)`);
      failed.push(file);
    } else {
      good++;
    }
  }
});

console.log('\n=================================');
console.log(`✅ Хороших: ${good}`);
console.log(`❌ Плохих: ${failed.length}`);
console.log('=================================\n');

if (failed.length > 0) {
  fs.writeFileSync('failed-logos.txt', 
    '=== ЛОГОТИПЫ КОТОРЫЕ НЕ СКАЧАЛИСЬ ===\n\n' +
    failed.join('\n')
  );
  console.log('📄 Список сохранён в failed-logos.txt');
  console.log('\n💡 Теперь можешь:');
  console.log('   1. Скачать их вручную с Google');
  console.log('   2. Или использовать заглушки с буквами');
}