import React, { useState, useEffect } from 'react';

const Settings = ({
  theme,
  setTheme,
  startTour,
  notificationDays,
  setNotificationDays,
  exportData,
  importData,
  onLogout
}) => {
  const isDark = theme === 'dark';
  const [isPremium, setIsPremium] = useState(false);
  const [activationCode, setActivationCode] = useState('');

  useEffect(() => {
    const premiumStatus = localStorage.getItem('tsar-premium-status');
    if (premiumStatus === 'lifetime') {
      setIsPremium(true);
    }
  }, []);

  const activatePremium = () => {
    if (activationCode === 'TSAR2990') {
      localStorage.setItem('tsar-premium-status', 'lifetime');
      setIsPremium(true);
      alert('👑 Поздравляем! Вы активировали пожизненный Премиум-статус!');
    } else {
      alert('Неверный код активации');
    }
  };

  const themeStyles = {
    container: {
      padding: '20px',
      color: isDark ? '#fff' : '#000',
      display: 'flex',
      flexDirection: 'column',
      gap: '20px',
      paddingBottom: '80px'
    },
    card: {
      background: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
      padding: '20px',
      borderRadius: '20px',
      border: isDark ? '1px solid rgba(255, 215, 0, 0.1)' : '1px solid rgba(0, 0, 0, 0.1)'
    },
    buttonPrimary: {
      width: '100%',
      padding: '16px',
      borderRadius: '15px',
      border: 'none',
      background: 'linear-gradient(135deg, #FFD700, #FFA500)',
      color: '#000',
      fontWeight: '800',
      fontSize: '16px',
      cursor: 'pointer',
      marginTop: '15px',
      boxShadow: '0 4px 15px rgba(255, 215, 0, 0.3)'
    },
    buttonSecondary: {
      width: '100%',
      padding: '14px',
      borderRadius: '15px',
      border: `1px solid ${isDark ? '#FFD700' : '#FFA500'}`,
      background: 'transparent',
      color: isDark ? '#FFD700' : '#FFA500',
      fontWeight: '600',
      fontSize: '15px',
      cursor: 'pointer',
      marginTop: '10px'
    },
    buttonTelegram: {
      width: '100%',
      padding: '14px',
      borderRadius: '15px',
      border: 'none',
      background: '#0088cc',
      color: '#fff',
      fontWeight: '600',
      fontSize: '15px',
      cursor: 'pointer',
      marginTop: '10px',
      boxShadow: '0 2px 8px rgba(0,136,204,0.3)'
    },
    buttonEmail: {
      width: '100%',
      padding: '14px',
      borderRadius: '15px',
      border: 'none',
      background: '#34a853',
      color: '#fff',
      fontWeight: '600',
      fontSize: '15px',
      cursor: 'pointer',
      marginTop: '10px',
      boxShadow: '0 2px 8px rgba(52,168,83,0.3)'
    },
    buttonLogout: {
      width: '100%',
      padding: '14px',
      borderRadius: '15px',
      border: 'none',
      background: '#f44336',
      color: '#fff',
      fontWeight: '600',
      fontSize: '15px',
      cursor: 'pointer',
      marginTop: '10px',
      boxShadow: '0 2px 8px rgba(244,67,54,0.3)'
    },
    premiumBadge: {
      background: 'linear-gradient(135deg, #FFD700, #FFA500)',
      color: '#000',
      padding: '4px 12px',
      borderRadius: '20px',
      fontSize: '12px',
      fontWeight: 'bold',
      display: 'inline-block',
      marginLeft: '10px'
    },
    inputRange: {
      width: '100%',
      marginTop: '10px'
    }
  };

  const PREMIUM_URL = "https://твой-сайт.ru/premium";
  const DONATE_URL = "https://www.tbank.ru/cf/6wZbSEyTfU4";
  const TELEGRAM_BOT_URL = "https://t.me/soft_tsarya_bot";
  const EMAIL_ADDRESS = "tsarskiysoft@gmail.com";

  const handlePremium = () => {
    if (PREMIUM_URL.includes("твой")) {
      alert("Раздел Премиум в разработке. Ссылка появится после запуска сайта.");
      return;
    }
    window.open(PREMIUM_URL, '_blank');
  };

  const handleDonate = () => {
    window.open(DONATE_URL, '_blank');
  };

  const handleTelegram = () => {
    window.open(TELEGRAM_BOT_URL, '_blank');
  };

  const handleEmail = () => {
    window.location.href = `mailto:${EMAIL_ADDRESS}?subject=Вопрос по Царь-Подпискам&body=Здравствуйте!%0A%0A`;
  };

  const handleImport = (e) => {
    const file = e.target.files[0];
    if (file) importData(file);
  };

  const handleLogout = () => {
    if (window.confirm('Вы уверены, что хотите выйти из аккаунта?')) {
      localStorage.removeItem('tsar-user');
      localStorage.removeItem('tsar-premium-status');
      if (onLogout) onLogout();
      window.location.reload();
    }
  };

  return (
    <div style={themeStyles.container}>
      <h2 style={{ margin: 0, fontSize: '24px' }}>
        Настройки {isPremium && <span style={themeStyles.premiumBadge}>👑 ПРЕМИУМ</span>}
      </h2>

      {isPremium && (
        <div style={{ ...themeStyles.card, border: '2px solid #FFD700' }}>
          <h3 style={{ marginTop: 0, color: '#FFD700' }}>👑 Ваши Премиум-бонусы</h3>
          <ul style={{ fontSize: '14px', lineHeight: '1.8', paddingLeft: '20px' }}>
            <li>🚀 Ранний доступ к новым функциям (бета-тестирование)</li>
            <li>💰 Скидка 20% на все будущие продукты экосистемы</li>
            <li>⚡ Приоритетная поддержка в Telegram</li>
            <li>🎁 Эксклюзивные акции и конкурсы</li>
          </ul>
          <button onClick={handleTelegram} style={{ ...themeStyles.buttonSecondary, background: '#FFD700', color: '#000', border: 'none' }}>
            📨 Связаться с поддержкой
          </button>
        </div>
      )}

      {!isPremium && (
        <div style={themeStyles.card}>
          <h3 style={{ marginTop: 0, color: '#FFD700' }}>👑 Активировать Премиум</h3>
          <p style={{ fontSize: '13px', opacity: 0.8 }}>Введите код, полученный после оплаты:</p>
          <input 
            type="text"
            placeholder="Код активации"
            value={activationCode}
            onChange={(e) => setActivationCode(e.target.value)}
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '10px',
              background: '#222',
              color: '#fff',
              border: '1px solid #FFD700',
              marginBottom: '10px'
            }}
          />
          <button onClick={activatePremium} style={themeStyles.buttonSecondary}>
            Активировать
          </button>
        </div>
      )}

      <div style={{ ...themeStyles.card, border: '1px solid rgba(255, 215, 0, 0.3)' }}>
        <h3 style={{ marginTop: 0, color: isDark ? '#FFD700' : '#D4AF37' }}>💛 Развитие проекта</h3>
        <p style={{ fontSize: '14px', lineHeight: '1.5', opacity: 0.9, margin: '0 0 15px 0' }}>
          «Царские Подписки» — независимый проект. Приложение бесплатно, но ваша помощь оплачивает серверы и новые функции.
        </p>
        <button style={themeStyles.buttonPrimary} onClick={handlePremium}>
          Оформить Премиум
        </button>
        <div style={{ margin: '20px 0', borderTop: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}` }}></div>
        <button style={themeStyles.buttonSecondary} onClick={handleDonate}>
          Сделать донат
        </button>
      </div>

      <div style={themeStyles.card}>
        <h3 style={{ marginTop: 0 }}>📨 Связь</h3>
        <button style={themeStyles.buttonTelegram} onClick={handleTelegram}>
          Написать в Telegram
        </button>
        <button style={themeStyles.buttonEmail} onClick={handleEmail}>
          📧 Написать на почту
        </button>
      </div>

      <div style={themeStyles.card}>
        <h3 style={{ marginTop: 0 }}>Приложение</h3>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
          <span>Темная тема</span>
          <input type="checkbox" checked={isDark} onChange={() => setTheme(isDark ? 'light' : 'dark')} style={{ width: '24px', height: '24px', cursor: 'pointer', accentColor: '#FFD700' }} />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ fontSize: '14px', display: 'block', marginBottom: '5px' }}>Напоминать за {notificationDays} дн. до списания</label>
          <input type="range" min="1" max="10" value={notificationDays} onChange={(e) => setNotificationDays(parseInt(e.target.value))} style={themeStyles.inputRange} />
        </div>
        <button style={themeStyles.buttonSecondary} onClick={startTour}>🎓 Пройти обучение заново</button>
      </div>

      <div style={themeStyles.card}>
        <h3 style={{ marginTop: 0 }}>Данные</h3>
        <button style={themeStyles.buttonSecondary} onClick={exportData}>💾 Скачать резервную копию</button>
        <div style={{ marginTop: '15px', position: 'relative' }}>
          <input type="file" accept=".json" onChange={handleImport} style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }} />
          <div style={{ ...themeStyles.buttonSecondary, textAlign: 'center', boxSizing: 'border-box' }}>📂 Загрузить копию</div>
        </div>
      </div>

      <div style={themeStyles.card}>
        <h3 style={{ marginTop: 0, color: '#f44336' }}>🔐 Аккаунт</h3>
        <button style={themeStyles.buttonLogout} onClick={handleLogout}>
          🚪 Выйти из аккаунта
        </button>
      </div>

      <div style={{ textAlign: 'center', marginTop: '20px', opacity: 0.4, fontSize: '12px' }}>
        <div>Царь-Подписки v1.0</div>
        <div>© 2026 Царский Софт</div>
      </div>
    </div>
  );
};

export default Settings;