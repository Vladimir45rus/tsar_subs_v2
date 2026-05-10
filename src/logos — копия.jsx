import React from 'react';
import { SUBSCRIPTIONS_DB } from './subscriptions-db';

// === ТРАНСЛИТЕРАЦИЯ ===
const transliterate = (text) => {
  const map = {
    'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd',
    'е': 'e', 'ё': 'yo', 'ж': 'zh', 'з': 'z', 'и': 'i',
    'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm', 'н': 'n',
    'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't',
    'у': 'u', 'ф': 'f', 'х': 'h', 'ц': 'ts', 'ч': 'ch',
    'ш': 'sh', 'щ': 'shch', 'ъ': '', 'ы': 'y', 'ь': '',
    'э': 'e', 'ю': 'yu', 'я': 'ya'
  };
  
  return text.toLowerCase()
    .split('')
    .map(char => map[char] || char)
    .join('')
    .replace(/[^a-z0-9а-яё]/g, '-')  // 🔹 Добавил русские буквы
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
};

// === ПОИСК ЛОГОТИПА ===
const findLogoFile = (subscriptionName) => {
  const availableLogos = [
    'mts', 'mts-music', 'mts-premium', 'mts-tarif', 'mts-tv',
    'megafon', 'megafon-plyus', 'megafon-tarif',
    'beeline', 'bilayn-dom', 'bilayn-tarif',
    'yandeks-muzyka', 'yandeks-plyus', 'yandeks-lavka', 'yandeksdom', 'yandekspraktikum', 'yandeksdrayv-plus',
    'yandexgame', 'yasno',
    'sberpraym', 'sberzdorovye',
    'tbank', 't2', 'tele2',
    'ivi', 'ivi-ivi', 'okko', 'kinopoisk', 'premier', 'wink', 'amediateka', 'kion',
    'vk', 'vk-muzyka', 'vk-combo', 'vk-premium', 'vk-play-cloud',
    'zvuk', 'spotify-premium', 'apple-music',
    'telegram-premium', 'discord', 'steam',
    'ozon-premium', 'wildberries-prime', 'samokat',
    'world-class', 'ddx-fitness', 'zebra', 'planeta-fitnes', 'fitnes-praga',
    'rostelecom', 'domru', 'mgts', 'skynet', 'sibirskie-seti', 'zelenaya-tochka',
    'onlaym', 'ufanet', 'intersvyaz', 'infolink',
    'alfa', 'alfa-premium', 'alfa-smart',
    'vtb-privilegiya', 'gazprombank-premium', 'raiffayzen-premium',
    'shtrafy-gibdd', 'avtokod', 'avtoteka',
    'delta', 'delta-okhrana', 'golfstrim',
    'seven-sky', 'domovenok',
    'literes-podpiska', 'bukmeyt', 'mybook', 'storytel',
    'geekbrains', 'skillbox', 'skyeng', 'stepik', 'tilda',
    'puzzle-english', 'lingualeo', 'duolingo-plus',
    'netologiya', 'hexlet', 'level-kitchen',
    'midjourney', 'chatgpt-plus', 'claude-pro', 'perplexity-pro', 'deepseek-pro',
    'google-one-100gb', 'google-one-2tb', 'icloud-50gb', 'icloud-200gb', 'icloud-2tb',
    'onedrive-100gb', 'dropbox-2tb', 'oblako-mailru-64gb',
    'youtube-music', 'twitch', 'tiktok',
    'netflix', 'amazon-prime', 'disney-plus',
    'xbox-game-pass', 'playstation-plus', 'ea-play', 'nintendo-online',
    'adobe-creative-cloud', 'canva-pro', 'figma',
    'notion', 'trello', 'asana',
    // Добавь сюда новые логотипы по мере появления
  ];

  const transliterated = transliterate(subscriptionName);
  const words = transliterated.split('-');

  for (let logo of availableLogos) {
    if (logo === transliterated) return logo;
    const matchesAll = words.every(word => logo.includes(word));
    if (matchesAll && words.length > 1) return logo;
    if (words.length > 0 && logo.includes(words[0])) return logo;
  }

  return transliterated;
};

// === КОМПОНЕНТ ЛОГОТИПА ===
export const Logo = ({ id, domain, size = 40 }) => {
  const logoFileName = findLogoFile(id);
  const localPath = `/logos/${logoFileName}.png`;
  
  // 🔹 ИСПРАВЛЕНО: убран лишний пробел в URL
  const googleFavicon = domain 
    ? `https://www.google.com/s2/favicons?domain=${domain}&sz=${size * 2}`
    : null;

  const firstLetter = id.charAt(0).toUpperCase();

  return (
    <div style={{ 
      width: size, 
      height: size, 
      borderRadius: '12px', 
      overflow: 'hidden',
      // 🔹 ИСПРАВЛЕНО: прозрачный фон вместо золотого градиента
      background: 'rgba(255,255,255,0.05)',
      backdropFilter: 'blur(10px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontWeight: '800',
      color: '#FFD700',  // 🔹 Золотая буква для заглушки
      fontSize: `${size / 2.5}px`,
      flexShrink: 0,
      // 🔹 Тонкая рамка вместо массивного градиента
      border: '1px solid rgba(255,255,255,0.1)'
    }}>
      <img
        src={localPath}
        alt={id}
        style={{ width: '100%', height: '100%', objectFit: 'contain' }}
        onError={(e) => {
          if (googleFavicon) {
            e.target.src = googleFavicon;
            e.target.onerror = () => {
              e.target.style.display = 'none';
              e.target.parentNode.innerHTML = `<span>${firstLetter}</span>`;
            };
          } else {
            e.target.style.display = 'none';
            e.target.parentNode.innerHTML = `<span>${firstLetter}</span>`;
          }
        }}
      />
    </div>
  );
};

export default Logo;