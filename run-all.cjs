const { exec } = require('child_process');

console.log('🚀 Запуск переименования и чистки...');
exec('node fix-logos.cjs', (err, stdout, stderr) => {
  if (err) {
    console.error('Ошибка при fix-logos:', err);
    return;
  }
  console.log(stdout);
  console.error(stderr);
  
  console.log('📥 Запуск скачивания логотипов...');
  exec('node download-missing-logos.cjs', (err2, stdout2, stderr2) => {
    if (err2) {
      console.error('Ошибка при download:', err2);
      return;
    }
    console.log(stdout2);
    console.error(stderr2);
    console.log('🎉 Все операции завершены!');
  });
});