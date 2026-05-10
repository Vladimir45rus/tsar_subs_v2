import React from 'react';

const transliterate = (text) => {
  if (!text) return '';
  const map = {
    'а':'a','б':'b','в':'v','г':'g','д':'d','е':'e','ё':'yo','ж':'zh','з':'z','и':'i',
    'й':'y','к':'k','л':'l','м':'m','н':'n','о':'o','п':'p','р':'r','с':'s','т':'t',
    'у':'u','ф':'f','х':'h','ц':'ts','ч':'ch','ш':'sh','щ':'shch','ъ':'','ы':'y','ь':'',
    'э':'e','ю':'yu','я':'ya'
  };
  return text.toLowerCase().split('').map(char => map[char] || char).join('').replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
};

// Функция для получения иконки категории
const getCategoryIcon = (category) => {
  const icons = {
    'video': '🎬',
    'music': '🎵',
    'internet': '🌐',
    'software': '💻',
    'media': '📰',
    'other': '📦',
    'health': '🏥',
    'fitness': '💪',
    'education': '📚',
    'finance': '💰',
    'shopping': '🛒',
    'travel': '✈️',
    'food': '🍕',
    'games': '🎮',
    'cloud': '☁️',
    'security': '🔒',
    'communication': '📞',
    'social': '👥',
  };
  return icons[category] || '📄';
};

// Функция для получения градиента по категории
const getCategoryGradient = (category) => {
  const gradients = {
    'video': 'linear-gradient(135deg, #ff6b6b, #ffa726)',
    'music': 'linear-gradient(135deg, #5c6bc0, #ab47bc)',
    'internet': 'linear-gradient(135deg, #26c6da, #42a5f5)',
    'software': 'linear-gradient(135deg, #66bb6a, #9ccc65)',
    'media': 'linear-gradient(135deg, #ffa726, #ffca28)',
    'other': 'linear-gradient(135deg, #bdbdbd, #9e9e9e)',
    'default': 'linear-gradient(135deg, #FFD700, #FFA500)',
  };
  return gradients[category] || gradients.default;
};

export const Logo = ({ id, domain, logo, category, size = 40 }) => {
  // Защита: если id нет, показываем заглушку
  if (!id) {
    return (
      <div style={{
        width: size,
        height: size,
        borderRadius: '12px',
        overflow: 'hidden',
        background: 'rgba(255,255,255,0.05)',
        backdropFilter: 'blur(10px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: '800',
        color: '#FFD700',
        fontSize: `${size / 2.5}px`,
        flexShrink: 0,
        border: '1px solid rgba(255,255,255,0.1)'
      }}>
        ?
      </div>
    );
  }

  const logoFileName = logo || transliterate(id);
  const localPath = `/logos/${logoFileName}.png`;
  const googleFavicon = domain
    ? `https://www.google.com/s2/favicons?domain=${domain}&sz=${size * 4}`
    : null;
  const firstLetter = id.charAt(0).toUpperCase();
  const categoryIcon = category ? getCategoryIcon(category) : firstLetter;
  const categoryGradient = getCategoryGradient(category);

  // Функция для отображения заглушки
  const renderFallback = () => {
    return (
      <div style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: categoryGradient,
        color: 'white',
        fontWeight: 'bold',
        fontSize: `${size / 2.5}px`,
        borderRadius: '12px',
      }}>
        {categoryIcon}
      </div>
    );
  };

  return (
    <div style={{
      width: size,
      height: size,
      borderRadius: '12px',
      overflow: 'hidden',
      background: 'rgba(255,255,255,0.05)',
      backdropFilter: 'blur(10px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontWeight: '800',
      color: '#FFD700',
      fontSize: `${size / 2.5}px`,
      flexShrink: 0,
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
              // Заменяем содержимое на заглушку
              const parent = e.target.parentNode;
              parent.innerHTML = '';
              parent.appendChild(renderFallback());
            };
          } else {
            e.target.style.display = 'none';
            const parent = e.target.parentNode;
            parent.innerHTML = '';
            parent.appendChild(renderFallback());
          }
        }}
      />
    </div>
  );
};

export default Logo;