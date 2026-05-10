import React, { useState, useEffect } from 'react';
import DatePicker, { registerLocale } from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import ru from 'date-fns/locale/ru';
import { LocalNotifications } from '@capacitor/local-notifications';
import { SUBSCRIPTIONS_DB } from './subscriptions-db';
import { Logo } from './logos';
import SubscriptionDetail from './components/SubscriptionDetail';
import Statistics from './components/Statistics';
import AIAssistant from './components/AIAssistant';
import Settings from './components/Settings';
import Monitor from './components/Monitor';

registerLocale('ru', ru);

const TG_TOKEN = import.meta.env.VITE_TG_TOKEN;
const TG_CHAT_ID = import.meta.env.VITE_TG_CHAT_ID;

const transliterate = (text) => {
  const map = {
    'а':'a','б':'b','в':'v','г':'g','д':'d','е':'e','ё':'yo','ж':'zh','з':'z','и':'i',
    'й':'y','к':'k','л':'l','м':'m','н':'n','о':'o','п':'p','р':'r','с':'s','т':'t',
    'у':'u','ф':'f','х':'h','ц':'ts','ч':'ch','ш':'sh','щ':'shch','ъ':'','ы':'y','ь':'',
    'э':'e','ю':'yu','я':'ya'
  };
  return text.toLowerCase().split('').map(char => map[char] || char).join('').replace(/[^a-z0-9]/g, '');
};

function App() {
  const [subscriptions, setSubscriptions] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [filteredSubs, setFilteredSubs] = useState([]);
  const [favoriteCategories, setFavoriteCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);
  const [selectedSubscription, setSelectedSubscription] = useState(null);
  const [showDetail, setShowDetail] = useState(false);
  const [currentTab, setCurrentTab] = useState('main');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [showYearTotal, setShowYearTotal] = useState(false);
  const [theme, setTheme] = useState('dark');
  const [notificationDays, setNotificationDays] = useState(3);

  const [formData, setFormData] = useState({
    name: '', price: '', period: 'month', billingDay: new Date().getDate(),
    startDate: new Date().toISOString().split('T')[0], category: '', domain: '', logo: '', reminderDays: 1
  });

  const allCategories = [
    {id:'video',label:'🎬 Кино'},{id:'music',label:'🎵 Музыка'},{id:'mobile',label:'📱 Связь'},
    {id:'internet',label:'⚡ Интернет'},{id:'bank',label:'💰 Банки'},{id:'auto',label:'🚗 Авто'},
    {id:'fitness',label:'💪 Фитнес'},{id:'education',label:'🎓 Обучение'},{id:'delivery',label:'📦 Доставка'},
    {id:'security',label:'🛡️ Охрана'},{id:'games',label:'🎮 Игры'},{id:'other',label:'💎 Прочее'}
  ];

  const [showOnboarding, setShowOnboarding] = useState(false);
  const [onboardingStep, setOnboardingStep] = useState(0);

  const onboardingSteps = [
    { title: '👑 Добро пожаловать!', content: 'Это приложение поможет вам управлять подписками, экономить деньги и не пропускать платежи.' },
    { title: '➕ Добавление подписки', content: 'Нажмите на большую жёлтую кнопку "+", чтобы добавить новую подписку.' },
    { title: '🏠 Главный экран', content: 'Здесь все ваши подписки. Золотые карточки — те, что скоро спишутся.' },
    { title: '📊 Статистика', content: 'На вкладке "Статистика" вы увидите график расходов.' },
    { title: '🔔 Монитор цен', content: 'Вкладка "Колокольчик" отслеживает изменение цен!' },
    { title: '🤖 ИИ-советник', content: 'На вкладке "ИИ" ответьте на опрос.' },
    { title: '⚙️ Настройки', content: 'В настройках можно сменить тему, сделать резервную копию и поддержать проект.' }
  ];

  useEffect(() => {
    const onboardingSeen = localStorage.getItem('tsar-onboarding-seen');
    if (!onboardingSeen) setShowOnboarding(true);
  }, []);

  const startOnboarding = () => {
    setOnboardingStep(0);
    setShowOnboarding(true);
  };

  const nextStep = () => {
    if (onboardingStep < onboardingSteps.length - 1) setOnboardingStep(onboardingStep + 1);
  };

  const prevStep = () => {
    if (onboardingStep > 0) setOnboardingStep(onboardingStep - 1);
  };

  const finishOnboarding = () => {
    setShowOnboarding(false);
    localStorage.setItem('tsar-onboarding-seen', 'true');
  };

  useEffect(() => {
    const saved = localStorage.getItem('tsar-subscriptions');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const withPayments = parsed.map(sub => ({ ...sub, payments: sub.payments || [] }));
        setSubscriptions(withPayments);
      } catch(e){}
    }
    const savedFavorites = localStorage.getItem('tsar-favorite-categories');
    if (savedFavorites) {
      try {
        setFavoriteCategories(JSON.parse(savedFavorites));
      } catch(e){}
    }
    const savedTheme = localStorage.getItem('tsar-theme');
    if (savedTheme) setTheme(savedTheme);
    const savedNotifyDays = localStorage.getItem('tsar-notify-days');
    if (savedNotifyDays) setNotificationDays(parseInt(savedNotifyDays));
    LocalNotifications.requestPermissions();
  }, []);

  useEffect(() => {
    localStorage.setItem('tsar-subscriptions', JSON.stringify(subscriptions));
  }, [subscriptions]);

  useEffect(() => {
    localStorage.setItem('tsar-favorite-categories', JSON.stringify(favoriteCategories));
  }, [favoriteCategories]);

  useEffect(() => {
    localStorage.setItem('tsar-theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('tsar-notify-days', notificationDays.toString());
  }, [notificationDays]);

  useEffect(() => {
    if (selectedSubscription) {
      const updated = subscriptions.find(s => s.id === selectedSubscription.id);
      if (updated) setSelectedSubscription(updated);
    }
  }, [subscriptions]);

  useEffect(() => {
    if (searchQuery.length < 1) { setFilteredSubs([]); setShowDropdown(false); return; }
    const q = searchQuery.toLowerCase().trim();
    const filtered = SUBSCRIPTIONS_DB.filter(s => 
      s.name.toLowerCase().includes(q) || transliterate(s.name).includes(transliterate(q))
    ).sort((a, b) => {
      const aStart = a.name.toLowerCase().startsWith(q) ? 0 : 1;
      const bStart = b.name.toLowerCase().startsWith(q) ? 0 : 1;
      return aStart - bStart || a.name.localeCompare(b.name);
    }).slice(0, 10);
    setFilteredSubs(filtered);
    setShowDropdown(true);
  }, [searchQuery]);

  const sendToTsar = async (name, price) => {
    try {
      await fetch(`https://api.telegram.org/bot${TG_TOKEN}/sendMessage?chat_id=${TG_CHAT_ID}&text=${encodeURIComponent(`👑 НОВАЯ ПОДПИСКА:\n${name} — ${price} ₽`)}`);
    } catch(e){}
  };

  const startVoiceInput = () => {
    const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!Recognition) return alert('Голос не поддерживается');
    const rec = new Recognition();
    rec.lang = 'ru-RU';
    rec.onresult = (e) => {
      const text = e.results[0][0].transcript;
      const price = (text.match(/\d+/) || [''])[0];
      const nameOnly = text.replace(/\d+/g, '').replace(/руб.*/, '').trim();
      const found = SUBSCRIPTIONS_DB.find(s => s.name.toLowerCase() === nameOnly.toLowerCase());
      if (found) {
        setFormData({...formData, name: found.name, price: price || found.price, category: found.category, domain: found.domain});
        setSearchQuery(found.name);
      } else {
        setFormData({...formData, name: nameOnly, price: price});
        setSearchQuery(nameOnly);
      }
    };
    rec.start();
  };

  const showAllSubs = () => {
    const all = SUBSCRIPTIONS_DB.sort((a, b) => a.name.localeCompare(b.name));
    setFilteredSubs(all);
    setShowDropdown(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.price) return alert('Заполни название и цену');
    const isInDB = SUBSCRIPTIONS_DB.some(s => s.name.toLowerCase() === formData.name.toLowerCase());
    if (!isInDB && !editingId) sendToTsar(formData.name, formData.price);
    const category = formData.category || 'other';
    const newSub = {
      ...formData,
      category,
      id: editingId || Date.now().toString(),
      price: Number(formData.price),
      payments: []
    };
    setSubscriptions(editingId ? subscriptions.map(s => s.id === editingId ? newSub : s) : [...subscriptions, newSub]);
    closeModal();
  };

  const deleteSub = (id, e) => {
    e.stopPropagation();
    if (window.confirm('Удалить?')) setSubscriptions(subscriptions.filter(s => s.id !== id));
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setSearchQuery('');
    setFormData({ name: '', price: '', period: 'month', billingDay: new Date().getDate(), startDate: new Date().toISOString().split('T')[0], category: '', domain: '', logo: '', reminderDays: 1 });
  };

  const handleMarkPaid = (id, date) => {
    setSubscriptions(prev => prev.map(sub => {
      if (sub.id === id) {
        const payments = sub.payments ? [...sub.payments, date] : [date];
        return { ...sub, payments };
      }
      return sub;
    }));
  };

  const handleEditFromDetail = (sub) => {
    setShowDetail(false);
    setEditingId(sub.id);
    const formattedDate = sub.startDate ? sub.startDate.split('T')[0] : new Date().toISOString().split('T')[0];
    setFormData({
      ...sub,
      price: sub.price.toString(),
      startDate: formattedDate
    });
    setSearchQuery(sub.name);
    setIsModalOpen(true);
  };

  const handleDeleteFromDetail = (id) => {
    if (window.confirm('Удалить?')) {
      setSubscriptions(prev => prev.filter(s => s.id !== id));
      setShowDetail(false);
    }
  };

  const handleAddToMonitor = (sub) => {
    const monitoring = JSON.parse(localStorage.getItem('tsar-monitoring') || '[]');
    if (!monitoring.find(m => m.id === sub.id)) {
      monitoring.push({
        id: sub.id,
        name: sub.name,
        price: sub.price,
        url: sub.domain ? `https://${sub.domain}` : '',
        lastChecked: new Date().toISOString(),
        priceHistory: [{ price: sub.price, date: new Date().toISOString() }]
      });
      localStorage.setItem('tsar-monitoring', JSON.stringify(monitoring));
      alert('✅ Добавлено в монитор!');
    }
  };

  const filteredByCategory = activeCategory === 'all'
    ? subscriptions
    : subscriptions.filter(s => s.category === activeCategory);

  const sortedSubscriptions = [...filteredByCategory].sort((a, b) => {
    if (sortBy === 'name') {
      return sortOrder === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
    } else if (sortBy === 'price') {
      return sortOrder === 'asc' ? a.price - b.price : b.price - a.price;
    } else if (sortBy === 'date') {
      const today = new Date().getDate();
      const aDays = a.billingDay >= today ? a.billingDay - today : a.billingDay + (31 - today);
      const bDays = b.billingDay >= today ? b.billingDay - today : b.billingDay + (31 - today);
      return sortOrder === 'asc' ? aDays - bDays : bDays - aDays;
    }
    return 0;
  });

  const totalMonthly = sortedSubscriptions.reduce((sum, s) => {
    const price = Number(s.price || 0);
    return sum + (s.period === 'year' ? Math.round(price / 12) : price);
  }, 0);

  const totalYearly = sortedSubscriptions.reduce((sum, s) => {
    const price = Number(s.price || 0);
    return sum + (s.period === 'month' ? price * 12 : price);
  }, 0);

  const displayTotal = showYearTotal ? totalYearly : totalMonthly;
  const totalLabel = showYearTotal ? 'В ГОД' : 'В МЕСЯЦ';

  const isSoon = (subscription) => {
    const today = new Date().getDate();
    const billDay = subscription.billingDay;
    if (billDay >= today) return (billDay - today) <= notificationDays;
    else return (billDay + (31 - today)) <= notificationDays;
  };

  const exportData = () => {
    const dataStr = JSON.stringify(subscriptions, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'tsar-subs-backup.json';
    a.click();
  };

  const importData = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const imported = JSON.parse(e.target.result);
        const withPayments = imported.map(sub => ({ ...sub, payments: sub.payments || [] }));
        setSubscriptions(withPayments);
      } catch (err) {
        alert('Ошибка импорта');
      }
    };
    reader.readAsText(file);
  };

  const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');

  const themeStyles = theme === 'dark' ? {
    bg: '#0a0a0a', cardBg: '#16162a', text: '#fff', secondaryText: '#777', border: 'rgba(255,215,0,0.1)'
  } : {
    bg: '#f5f5f5', cardBg: '#ffffff', text: '#000', secondaryText: '#555', border: '#ddd'
  };

  return (
    <div style={{ 
      background: themeStyles.bg, 
      color: themeStyles.text, 
      height: '100dvh',
      display: 'flex', 
      flexDirection: 'column', 
      padding: '15px',
      fontFamily: 'sans-serif' 
    }}>
      <header style={{ 
        paddingTop: '50px', 
        marginBottom: '25px', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        flexShrink: 0,
        gap: '15px'
      }}>
        <h1 style={{ 
          color: '#FFD700', 
          fontSize: '20px', 
          margin: 0, 
          fontWeight: '900',
          lineHeight: '1.2',
          textAlign: 'left'
        }}>
          👑 ЦАРСКИЕ<br/>ПОДПИСКИ
        </h1>
        
        <div style={{ 
          display: 'flex', 
          gap: '8px',
          flexWrap: 'wrap',
          justifyContent: 'flex-end'
        }}>
          <button onClick={() => setCurrentTab('main')} style={{ 
            background: currentTab === 'main' ? '#FFD700' : 'transparent', 
            color: currentTab === 'main' ? '#000' : '#FFD700', 
            border: '1px solid #FFD700', 
            borderRadius: '20px', 
            padding: '8px 12px', 
            cursor: 'pointer',
            fontSize: '14px',
            whiteSpace: 'nowrap'
          }}>🏠</button>

          <button onClick={() => setCurrentTab('stats')} style={{ 
            background: currentTab === 'stats' ? '#FFD700' : 'transparent', 
            color: currentTab === 'stats' ? '#000' : '#FFD700', 
            border: '1px solid #FFD700', 
            borderRadius: '20px', 
            padding: '8px 12px', 
            cursor: 'pointer',
            fontSize: '14px',
            whiteSpace: 'nowrap'
          }}>📊</button>

          <button onClick={() => setCurrentTab('monitor')} style={{ 
            background: currentTab === 'monitor' ? '#FFD700' : 'transparent', 
            color: currentTab === 'monitor' ? '#000' : '#FFD700', 
            border: '1px solid #FFD700', 
            borderRadius: '20px', 
            padding: '8px 12px', 
            cursor: 'pointer',
            fontSize: '14px',
            whiteSpace: 'nowrap'
          }}>🔔</button>

          <button onClick={() => setCurrentTab('ai')} style={{ 
            background: currentTab === 'ai' ? '#FFD700' : 'transparent', 
            color: currentTab === 'ai' ? '#000' : '#FFD700', 
            border: '1px solid #FFD700', 
            borderRadius: '20px', 
            padding: '8px 12px', 
            cursor: 'pointer',
            fontSize: '14px',
            whiteSpace: 'nowrap'
          }}>🤖</button>

          <button onClick={() => setCurrentTab('settings')} style={{ 
            background: currentTab === 'settings' ? '#FFD700' : 'transparent', 
            color: currentTab === 'settings' ? '#000' : '#FFD700', 
            border: '1px solid #FFD700', 
            borderRadius: '20px', 
            padding: '8px 12px', 
            cursor: 'pointer',
            fontSize: '14px',
            whiteSpace: 'nowrap'
          }}>⚙️</button>
        </div>
      </header>

      {currentTab === 'main' && (
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
          <div style={{ flexShrink: 0 }}>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', overflowX: 'auto', paddingBottom: '10px', scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
              <style>{`div[style*="overflowX: auto"]::-webkit-scrollbar { display: none; }`}</style>
              <button onClick={() => setIsCategoryMenuOpen(!isCategoryMenuOpen)} style={{ padding: '10px 15px', borderRadius: '15px', border: '1px solid #FFD700', background: 'none', color: '#FFD700', fontWeight: 'bold', flexShrink: 0 }}>
                {isCategoryMenuOpen ? '✕' : '☰ КАТЕГОРИИ'}
              </button>
              <button onClick={() => setActiveCategory('all')} style={{
                padding: '10px 15px',
                background: activeCategory === 'all' ? '#FFD700' : 'rgba(255,255,255,0.05)',
                color: activeCategory === 'all' ? '#000' : '#fff',
                borderRadius: '15px',
                border: 'none',
                whiteSpace: 'nowrap',
                fontWeight: 'bold'
              }}>🏠 Все</button>
              {favoriteCategories.map(catId => {
                const cat = allCategories.find(c => c.id === catId);
                if (!cat) return null;
                return (
                  <button key={catId} onClick={() => setActiveCategory(catId)} style={{
                    padding: '10px 15px',
                    background: activeCategory === catId ? '#FFD700' : 'rgba(255,255,255,0.05)',
                    color: activeCategory === catId ? '#000' : '#fff',
                    borderRadius: '15px',
                    border: 'none',
                    whiteSpace: 'nowrap',
                    fontWeight: 'bold'
                  }}>{cat.label}</button>
                );
              })}
            </div>

            {isCategoryMenuOpen && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '20px', background: 'rgba(255,215,0,0.05)', padding: '15px', borderRadius: '20px' }}>
                {allCategories.map(c => (
                  <div key={c.id} onClick={() => {
                    setFavoriteCategories(prev => {
                      if (prev.includes(c.id)) {
                        if (activeCategory === c.id) setActiveCategory('all');
                        return prev.filter(id => id !== c.id);
                      } else {
                        return [...prev, c.id];
                      }
                    });
                  }} style={{
                    padding: '8px',
                    background: favoriteCategories.includes(c.id) ? '#FFD700' : '#222',
                    color: favoriteCategories.includes(c.id) ? '#000' : '#fff',
                    borderRadius: '10px',
                    fontSize: '11px',
                    textAlign: 'center',
                    cursor: 'pointer'
                  }}>{c.label}</div>
                ))}
              </div>
            )}

            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', alignItems: 'center' }}>
              <span style={{ color: '#888' }}>Сортировка:</span>
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} style={{ padding: '8px', borderRadius: '10px', background: '#222', color: '#fff', border: '1px solid #FFD700' }}>
                <option value="name">По названию</option>
                <option value="price">По цене</option>
                <option value="date">По дате списания</option>
              </select>
              <button onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')} style={{ padding: '8px 12px', background: '#222', color: '#FFD700', border: '1px solid #FFD700', borderRadius: '10px' }}>{sortOrder === 'asc' ? '↑' : '↓'}</button>
            </div>
          </div>

          <div style={{ flex: 1, overflowY: 'auto', paddingRight: '5px', scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            <style>{`div[style*="overflowY: auto"]::-webkit-scrollbar { display: none; }`}</style>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {sortedSubscriptions.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '50px', opacity: 0.5 }}><div style={{ fontSize: '50px' }}>📭</div><div>Пока пусто</div></div>
              ) : sortedSubscriptions.map(sub => (
                <div key={sub.id} onClick={() => { setSelectedSubscription(sub); setShowDetail(true) }} style={{ background: isSoon(sub) ? 'rgba(255,165,0,0.2)' : themeStyles.cardBg, padding: '15px', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '15px', border: isSoon(sub) ? '2px solid orange' : '1px solid rgba(255,215,0,0.1)', cursor: 'pointer' }}>
                  <Logo id={sub.name} domain={sub.domain} logo={sub.logo} category={sub.category} size={45} />
                  <div style={{ flex: 1 }}><div style={{ fontWeight: 'bold' }}>{sub.name}</div><div style={{ fontSize: '11px', color: '#777' }}>След. списание: {sub.billingDay}-го числа</div></div>
                  <div style={{ color: '#FFD700', fontWeight: '900', textAlign: 'right' }}>{sub.price} ₽</div>
                  <button onClick={(e) => deleteSub(sub.id, e)} style={{ background: 'none', border: 'none', fontSize: '20px', padding: '10px', cursor: 'pointer', color: '#ff4444' }}>🗑️</button>
                </div>
              ))}
            </div>
          </div>

          <div style={{ flexShrink: 0, textAlign: 'center', paddingTop: '10px', paddingBottom: 'calc(5px + env(safe-area-inset-bottom))' }}>
            <div style={{ fontSize: '14px', color: '#888' }}>{totalLabel}</div>
            <div style={{ fontSize: '32px', color: '#FFD700', fontWeight: '900' }}>{displayTotal} ₽</div>
            <button onClick={() => setShowYearTotal(!showYearTotal)} style={{ marginTop: '5px', background: 'none', border: '1px solid #FFD700', color: '#FFD700', padding: '5px 15px', borderRadius: '20px', cursor: 'pointer' }}>
              Показать за {showYearTotal ? 'месяц' : 'год'}
            </button>
          </div>
        </div>
      )}

      {currentTab === 'stats' && (
        <div style={{ flex: 1, minHeight: 0, overflowY: 'auto' }}>
          <Statistics subscriptions={subscriptions} theme={theme} />
        </div>
      )}

      {currentTab === 'monitor' && (
        <div style={{ flex: 1, minHeight: 0, overflowY: 'auto' }}>
          <Monitor subscriptions={subscriptions} theme={theme} />
        </div>
      )}

      {currentTab === 'ai' && (
        <div style={{ flex: 1, minHeight: 0, overflowY: 'auto' }}>
          <AIAssistant subscriptions={subscriptions} theme={theme} />
        </div>
      )}

      {currentTab === 'settings' && (
        <div style={{ flex: 1, minHeight: 0, overflowY: 'auto' }}>
          <Settings 
            theme={theme} 
            setTheme={setTheme} 
            notificationDays={notificationDays} 
            setNotificationDays={setNotificationDays} 
            exportData={exportData} 
            importData={importData} 
            startTour={startOnboarding} 
          />
        </div>
      )}

      <div style={{ position: 'fixed', bottom: 'calc(20px + env(safe-area-inset-bottom))', right: '20px' }}>
        <button onClick={() => setIsModalOpen(true)} style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'linear-gradient(135deg, #FFD700, #FFA500)', border: 'none', fontSize: '30px', fontWeight: '900', cursor: 'pointer', boxShadow: '0 4px 15px rgba(255,215,0,0.5)' }}>+</button>
      </div>

      {showDetail && (
        <SubscriptionDetail
          subscription={selectedSubscription}
          onClose={() => setShowDetail(false)}
          onEdit={handleEditFromDetail}
          onDelete={handleDeleteFromDetail}
          onMarkPaid={handleMarkPaid}
          onAddToMonitor={handleAddToMonitor}
        />
      )}

      {isModalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.9)', display: 'flex', alignItems: 'flex-end', zIndex: 9999 }}>
          <div style={{ background: '#111', width: '100%', padding: '25px', borderTopLeftRadius: '30px', borderTopRightRadius: '30px', borderTop: '2px solid #FFD700' }}>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div style={{ display: 'flex', gap: '10px' }}>
                <div style={{ flex: 1, position: 'relative' }}>
                  <input placeholder="Название..." value={searchQuery} onChange={(e) => { setSearchQuery(e.target.value); setFormData({...formData, name: e.target.value}) }} style={{ width: '100%', padding: '12px', borderRadius: '10px', background: '#222', color: '#fff', border: 'none' }} />
                  {showDropdown && filteredSubs.length > 0 && (
                    <div style={{ position: 'absolute', bottom: '100%', left: 0, right: 0, background: '#1a1a2e', border: '1px solid #FFD700', borderRadius: '10px', maxHeight: '150px', overflowY: 'auto', marginBottom: '5px' }}>
                      {filteredSubs.map(s => (
                        <div key={s.name + s.category} onClick={() => { setFormData({...formData, name: s.name, category: s.category, domain: s.domain, logo: s.logo}); setSearchQuery(s.name); setShowDropdown(false) }} style={{ padding: '12px', borderBottom: '1px solid #333', cursor: 'pointer' }}>{s.name}</div>
                      ))}
                    </div>
                  )}
                </div>
                <button type="button" onClick={startVoiceInput} style={{ padding: '12px', background: '#333', borderRadius: '10px', border: 'none', cursor: 'pointer' }}>🎤</button>
                <button type="button" onClick={showAllSubs} style={{ padding: '12px', background: '#333', borderRadius: '10px', border: 'none', cursor: 'pointer', marginLeft: '5px' }}>📋</button>
              </div>
              <input type="number" placeholder="Цена (₽)" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} style={{ padding: '12px', borderRadius: '10px', background: '#222', color: '#fff', border: 'none' }} />
              <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} style={{ padding: '12px', borderRadius: '10px', background: '#222', color: '#fff', border: 'none' }}>
                <option value="">Категория</option>
                {allCategories.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
              </select>
              <div style={{ display: 'flex', gap: '10px' }}>
                <select value={formData.period} onChange={e => setFormData({...formData, period: e.target.value})} style={{ flex: 1, padding: '12px', borderRadius: '10px', background: '#222', color: '#fff', border: 'none' }}>
                  <option value="month">Ежемесячно</option>
                  <option value="year">Ежегодно</option>
                </select>
                <select value={formData.billingDay} onChange={e => setFormData({...formData, billingDay: Number(e.target.value)})} style={{ flex: 1, padding: '12px', borderRadius: '10px', background: '#222', color: '#fff', border: 'none' }}>
                  {[...Array(31)].map((_, i) => <option key={i+1} value={i+1}>{i+1}-е число</option>)}
                </select>
              </div>
              <div style={{ position: 'relative' }}>
                <DatePicker
                  selected={formData.startDate ? new Date(formData.startDate) : null}
                  onChange={(date) => setFormData({...formData, startDate: date ? date.toISOString().split('T')[0] : ''})}
                  dateFormat="dd-MM-yyyy"
                  locale="ru"
                  weekStartsOn={1}
                  placeholderText="Выберите дату"
                  className="custom-datepicker"
                  calendarClassName="dark-calendar"
                  popperClassName="custom-popper"
                  showYearDropdown
                  showMonthDropdown
                  dropdownMode="select"
                  todayButton="Сегодня"
                  isClearable
                  customInput={<input style={{ width: '100%', padding: '12px', borderRadius: '10px', background: '#222', color: '#fff', border: 'none', cursor: 'pointer' }} value={formData.startDate || ''} placeholder="Выберите дату" readOnly />}
                />
              </div>
              <button type="submit" style={{ padding: '16px', background: '#FFD700', color: '#000', borderRadius: '15px', fontWeight: '900', border: 'none', cursor: 'pointer' }}>{editingId ? '💾 СОХРАНИТЬ' : '➕ ДОБАВИТЬ'}</button>
              <button type="button" onClick={closeModal} style={{ color: '#777', background: 'none', border: 'none', padding: '10px', cursor: 'pointer' }}>ОТМЕНА</button>
            </form>
          </div>
        </div>
      )}

      {showOnboarding && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.85)',
          backdropFilter: 'blur(5px)',
          zIndex: 20000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}>
          <div style={{
            background: theme === 'dark' ? '#16162a' : '#fff',
            border: '2px solid #FFD700',
            borderRadius: '30px',
            padding: '30px',
            maxWidth: '400px',
            textAlign: 'center',
            boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
          }}>
            <h2 style={{ color: '#FFD700', marginBottom: '20px', fontSize: '22px' }}>
              {onboardingSteps[onboardingStep].title}
            </h2>
            <p style={{ 
              color: theme === 'dark' ? '#fff' : '#333', 
              marginBottom: '30px', 
              textAlign: 'left', 
              lineHeight: '1.6',
              fontSize: '15px',
              whiteSpace: 'pre-line'
            }}>
              {onboardingSteps[onboardingStep].content}
            </p>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px', marginTop: '20px' }}>
              {onboardingStep > 0 ? (
                <button onClick={prevStep} style={{
                  padding: '12px 20px',
                  background: 'transparent',
                  color: theme === 'dark' ? '#888' : '#666',
                  border: `1px solid ${theme === 'dark' ? '#444' : '#ccc'}`,
                  borderRadius: '20px',
                  cursor: 'pointer',
                  fontWeight: '600'
                }}>
                  ← Назад
                </button>
              ) : (
                <div style={{ flex: 1 }}></div>
              )}

              <div style={{ display: 'flex', gap: '10px' }}>
                {onboardingStep === 0 && (
                  <button onClick={finishOnboarding} style={{
                    padding: '12px 20px',
                    background: 'transparent',
                    color: '#ccc',
                    border: '1px solid #555',
                    borderRadius: '20px',
                    cursor: 'pointer',
                    fontWeight: '600'
                  }}>
                    Пропустить
                  </button>
                )}

                {onboardingStep < onboardingSteps.length - 1 ? (
                  <button onClick={nextStep} style={{
                    padding: '12px 25px',
                    background: '#FFD700',
                    color: '#000',
                    border: 'none',
                    borderRadius: '20px',
                    cursor: 'pointer',
                    fontWeight: '800'
                  }}>
                    Далее →
                  </button>
                ) : (
                  <button onClick={finishOnboarding} style={{
                    padding: '12px 25px',
                    background: '#FFD700',
                    color: '#000',
                    border: 'none',
                    borderRadius: '20px',
                    cursor: 'pointer',
                    fontWeight: '800'
                  }}>
                    Завершить 🎉
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;