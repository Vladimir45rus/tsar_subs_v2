import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const logosDir = path.join(__dirname, 'public', 'logos');

// Читаем все файлы в папке
const files = fs.readdirSync(logosDir);

console.log('\n📊 === СТАТИСТИКА ===\n');
console.log(`📁 Папка: ${logosDir}`);
console.log(`✅ Всего файлов: ${files.length}\n`);

console.log('📋 === СКАЧАНЫ ЛОГОТИПЫ ===\n');
files.forEach((file, index) => {
  const filePath = path.join(logosDir, file);
  const stats = fs.statSync(filePath);
  const sizeKB = (stats.size / 1024).toFixed(2);
  
  if (sizeKB > 0.5) { // Только нормальные файлы
    console.log(`${index + 1}. ${file} (${sizeKB} KB)`);
  }
});

console.log('\n=================================\n');
console.log(`💡 Совет: скопируй этот список чтобы знать что уже есть!`);