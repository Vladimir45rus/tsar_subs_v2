const fs = require('fs');
const path = require('path');
const https = require('https');

const LOGOS_DIR = path.join(__dirname, 'public', 'logos');

if (!fs.existsSync(LOGOS_DIR)) {
  fs.mkdirSync(LOGOS_DIR, { recursive: true });
}

// ПРЯМЫЕ ССЫЛКИ НА ЛОГОТИПЫ
const LOGOS = {
  'tbank': 'https://logowik.com/content/uploads/images/tinkoff-bank-new2020.jpg',
  'sber': 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Sberbank_Logo.svg/1200px-Sberbank_Logo.svg.png',
  'premier': 'https://avatars.mds.yandex.net/get-ott/2493163/2a0000017a0e1e8f000000000000000000000/orig',
  'amediateka': 'https://static.amediateka.ru/static/img/logo.png',
  'ivi': 'https://www.ivi.ru/assets/logo.png',
  'okko': 'https://okko.tv/static/img/logo.png',
  'kinopoisk': 'https://avatars.mds.yandex.net/get-kinopoisk-official/2493163/2a0000017a0e1e8f000000000000000000000/orig',
  'rostelecom': 'https://logowik.com/content/uploads/images/rostelecom5525.jpg',
  'mts': 'https://logowik.com/content/uploads/images/mts2224.jpg',
  'megafon': 'https://logowik.com/content/uploads/images/megafon8841.jpg',
  'beeline': 'https://logowik.com/content/uploads/images/beeline-new-logo2021.jpg',
  'tele2': 'https://logowik.com/content/uploads/images/tele2-new-logo2020.jpg',
  'mgts': 'https://www.mgts.ru/static/img/logo.png',
  'ttk': 'https://www.ttk.ru/upload/logo.png',
  'ufanet': 'https://www.ufanet.ru/static/img/logo.png',
  'skynet': 'https://skynt.ru/static/img/logo.png',
  't-mobile': 'https://logowik.com/content/uploads/images/t-mobile-russia.jpg',
  'sbermobile': 'https://sbermobile.ru/static/img/logo.png',
  'ea-play': 'https://logowik.com/content/uploads/images/ea-play.jpg',
  'twitch': 'https://logowik.com/content/uploads/images/twitch910.jpg',
  'discord': 'https://logowik.com/content/uploads/images/discord812.jpg',
  'steam': 'https://logowik.com/content/uploads/images/steam911.jpg',
  'samokat': 'https://samokat.ru/static/img/logo.png',
  'stepik': 'https://stepik.org/static/img/logo.png',
  'drweb': 'https://www.drweb.ru/static/img/logo.png',
  'avtoteka': 'https://autoteka.ru/static/img/logo.png',
  'belkacar': 'https://belkacar.ru/static/img/logo.png',
  'delta': 'https://delta.ru/static/img/logo.png',
  'vk': 'https://logowik.com/content/uploads/images/vk-new-icon1124.jpg',
  'yandex': 'https://logowik.com/content/uploads/images/yandex911.jpg'
};

async function downloadFile(name, url, outputPath) {
  return new Promise((resolve) => {
    https.get(url, (response) => {
      const file = fs.createWriteStream(outputPath);
      response.pipe(file);
      
      file.on('finish', () => {
        file.close();
        console.log('OK: ' + name);
        resolve(true);
      });
    }).on('error', (err) => {
      fs.unlink(outputPath, () => {});
      console.log('FAIL: ' + name + ' - ' + err.message);
      resolve(false);
    });
  });
}

async function main() {
  console.log('Downloading logos...');
  const mapping = {};
  let success = 0;
  let failed = 0;
  
  for (const [name, url] of Object.entries(LOGOS)) {
    const filename = name + '.png';
    const filepath = path.join(LOGOS_DIR, filename);
    const downloaded = await downloadFile(name, url, filepath);
    
    if (downloaded) {
      mapping[name] = filename;
      success++;
    } else {
      failed++;
    }
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  const content = 'export const LOGO_MAPPING = ' + JSON.stringify(mapping, null, 2) + ';';
  fs.writeFileSync(path.join(__dirname, 'src', 'logo-mapping.js'), content);
  
  console.log('DONE! Success: ' + success + ', Failed: ' + failed);
}

main().catch(console.error);