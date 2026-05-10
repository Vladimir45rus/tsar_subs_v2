import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { SUBSCRIPTIONS_DB } from './src/subscriptions-db.js'; // путь к твоей базе

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const logosDir = path.join(__dirname, 'public', 'logos');

// Получаем список всех файлов в папке logos (без расширения)
const existingFiles = fs.readdirSync(logosDir)
  .filter(file => file.endsWith('.png') || file.endsWith('.jpg') || file.endsWith('.jpeg'))
  .map(file => path.basename(file, path.extname(file))); // убираем расширение

// Получаем все уникальные значения logo из базы (кроме podryad)
const neededLogosSet = new Set();
SUBSCRIPTIONS_DB.forEach(item => {
  if (item.logo && item.logo !== 'podryad') {
    neededLogosSet.add(item.logo);
  }
});
const neededLogos = Array.from(neededLogosSet).sort();

// Сравниваем
const missing = neededLogos.filter(logo => !existingFiles.includes(logo));
const extra = existingFiles.filter(file => !neededLogos.includes(file) && !file.startsWith('.')); // исключаем служебные

console.log('=== ЛОГОТИПЫ, КОТОРЫЕ ДОЛЖНЫ БЫТЬ (из базы) ===');
console.log(neededLogos);
console.log(`\n=== ВСЕГО НУЖНО: ${neededLogos.length} ===`);

console.log('\n=== ФАЙЛЫ, КОТОРЫЕ ЕСТЬ В ПАПКЕ ===');
console.log(existingFiles);
console.log(`\n=== ВСЕГО В ПАПКЕ: ${existingFiles.length} ===`);

console.log('\n=== ❌ ОТСУТСТВУЮТ (нужно скачать) ===');
if (missing.length === 0) console.log('✅ Все логотипы на месте!');
else console.log(missing);

console.log('\n=== 🗑️ ЛИШНИЕ (можно удалить, если не нужны) ===');
if (extra.length === 0) console.log('✅ Лишних нет');
else console.log(extra);

// Сохраняем отчёт в файл
const report = {
  needed: neededLogos,
  existing: existingFiles,
  missing,
  extra,
};

fs.writeFileSync('logos-report.json', JSON.stringify(report, null, 2));
console.log('\n📄 Отчёт сохранён в logos-report.json');