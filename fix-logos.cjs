const fs = require('fs');
const path = require('path');

const logosDir = path.join(__dirname, 'public', 'logos');

const renameMap = {
  'delta-ohrana.png': 'delta-okhrana.png',
  'gulfstream.png': 'golfstrim.png',
  'ivi-ivi.png': 'ivi.png',
  'microsoft-365.png': 'microsoft-365-family.png',
  'pure.png': 'pure-fitness.png',
  'rayffayzen-premium.png': 'raiffayzen-premium.png',
  'sberzdorov-e.png': 'sberzdorovye.png',
  'vk-play.png': 'vk-play-cloud.png',
  'vtb.png': 'vtb-privilegiya.png',
  'yandeksdrayv.png': 'yandeksdrayv-plus.png',
};

const deleteFiles = [
  'al-fa-premium.png',
  'al-fa-smart.png',
  'logos-list.txt',
];

Object.entries(renameMap).forEach(([oldName, newName]) => {
  const oldPath = path.join(logosDir, oldName);
  const newPath = path.join(logosDir, newName);
  if (fs.existsSync(oldPath)) {
    fs.renameSync(oldPath, newPath);
    console.log(`✅ ${oldName} -> ${newName}`);
  } else {
    console.log(`❌ Файл ${oldName} не найден`);
  }
});

deleteFiles.forEach(file => {
  const filePath = path.join(logosDir, file);
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
    console.log(`🗑️ Удалён ${file}`);
  }
});

if (fs.existsSync(path.join(logosDir, 'microsoft-365-family.png'))) {
  fs.copyFileSync(
    path.join(logosDir, 'microsoft-365-family.png'),
    path.join(logosDir, 'microsoft-365-personal.png')
  );
  console.log('📄 Создан microsoft-365-personal.png (копия)');
}

if (fs.existsSync(path.join(logosDir, 'pure-fitness.png'))) {
  fs.copyFileSync(
    path.join(logosDir, 'pure-fitness.png'),
    path.join(logosDir, 'pure-vip.png')
  );
  console.log('📄 Создан pure-vip.png (копия)');
}

console.log('🎉 Переименование и чистка завершены!');