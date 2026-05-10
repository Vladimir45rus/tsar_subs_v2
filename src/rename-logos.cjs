const fs = require('fs');
const path = require('path');

// Твоя функция транслитерации (скопируй из App.jsx)
const transliterate = (text) => {
  const map = {
    'а':'a','б':'b','в':'v','г':'g','д':'d','е':'e','ё':'yo','ж':'zh','з':'z','и':'i',
    'й':'y','к':'k','л':'l','м':'m','н':'n','о':'o','п':'p','р':'r','с':'s','т':'t',
    'у':'u','ф':'f','х':'h','ц':'ts','ч':'ch','ш':'sh','щ':'shch','ъ':'','ы':'y','ь':'',
    'э':'e','ю':'yu','я':'ya'
  };
  return text.toLowerCase().split('').map(char => map[char] || char).join('').replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
};

const logosDir = 'C:\\Users\\BOBAH\\Desktop\\tsar_subs\\public\\logos';

fs.readdirSync(logosDir).forEach(file => {
  const ext = path.extname(file).toLowerCase();
  if (!['.png', '.jpg', '.jpeg'].includes(ext)) return;

  const nameWithoutExt = path.basename(file, ext);
  const newName = transliterate(nameWithoutExt) + '.png'; // приводим всё к PNG
  const oldPath = path.join(logosDir, file);
  const newPath = path.join(logosDir, newName);

  if (oldPath !== newPath) {
    fs.renameSync(oldPath, newPath);
    console.log(`${file} -> ${newName}`);
  }
});