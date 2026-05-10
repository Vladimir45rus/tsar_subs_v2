const fs = require('fs');
const path = require('path');

const LOGOS_DIR = path.join(__dirname, 'public', 'logos');

const files = fs.readdirSync(LOGOS_DIR);
let renamed = 0;

// Транслитерация
function transliterate(text) {
  const map = {
    'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd',
    'е': 'e', 'ё': 'yo', 'ж': 'zh', 'з': 'z', 'и': 'i',
    'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm', 'н': 'n',
    'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't',
    'у': 'u', 'ф': 'f', 'х': 'h', 'ц': 'ts', 'ч': 'ch',
    'ш': 'sh', 'щ': 'sch', 'ъ': '', 'ы': 'y', 'ь': '',
    'э': 'e', 'ю': 'yu', 'я': 'ya'
  };
  
  return text.toLowerCase().split('').map(char => map[char] || char).join('');
}

files.forEach(file => {
  const ext = path.extname(file);
  const name = path.basename(file, ext);
  
  // Если есть русские буквы
  if (/[а-яё]/i.test(name)) {
    const newName = transliterate(name) + ext;
    const oldPath = path.join(LOGOS_DIR, file);
    const newPath = path.join(LOGOS_DIR, newName);
    
    try {
      fs.renameSync(oldPath, newPath);
      console.log('✓ ' + file + ' → ' + newName);
      renamed++;
    } catch (err) {
      console.log('✗ ' + file + ': ' + err.message);
    }
  }
});

console.log('\nГОТОВО! Переименовано: ' + renamed);