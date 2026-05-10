const fs = require('fs');
const path = require('path');

const logosDir = path.join(__dirname, 'public', 'logos');
const backupDir = path.join(__dirname, 'backup', 'unused_logos');

// Убедимся, что папка backup существует
if (!fs.existsSync(backupDir)) {
  fs.mkdirSync(backupDir, { recursive: true });
  console.log(`Создана папка ${backupDir}`);
}

// Загружаем отчёт из logos-report.json
let report;
try {
  report = JSON.parse(fs.readFileSync('logos-report.json', 'utf8'));
} catch (e) {
  console.error('Не удалось загрузить logos-report.json. Запустите сначала check-logos.js');
  process.exit(1);
}

const extra = report.extra || [];
console.log(`Найдено ${extra.length} лишних файлов`);

let movedCount = 0;
extra.forEach(filename => {
  const srcPath = path.join(logosDir, `${filename}.png`);
  const destPath = path.join(backupDir, `${filename}.png`);
  
  if (fs.existsSync(srcPath)) {
    fs.renameSync(srcPath, destPath);
    console.log(`Перемещён: ${filename}.png`);
    movedCount++;
  } else {
    // Попробуем с другими расширениями
    const extensions = ['.png', '.jpg', '.jpeg', '.svg'];
    let found = false;
    for (const ext of extensions) {
      const altPath = path.join(logosDir, `${filename}${ext}`);
      if (fs.existsSync(altPath)) {
        fs.renameSync(altPath, path.join(backupDir, `${filename}${ext}`));
        console.log(`Перемещён: ${filename}${ext}`);
        movedCount++;
        found = true;
        break;
      }
    }
    if (!found) {
      console.log(`Файл ${filename} не найден в папке logos`);
    }
  }
});

console.log(`\n✅ Перемещено ${movedCount} файлов в ${backupDir}`);
console.log('Очистка завершена.');