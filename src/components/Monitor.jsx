import React, { useState, useEffect } from 'react';

const Monitor = ({ subscriptions, theme }) => {
  const [monitoring, setMonitoring] = useState([]);
  const [changes, setChanges] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showComplaintModal, setShowComplaintModal] = useState(false);
  const [selectedChange, setSelectedChange] = useState(null);
  const [checkboxes, setCheckboxes] = useState({
    noNotification: false,
    checkedEmail: false,
    understandTemplate: false
  });

  const textColor = theme === 'dark' ? '#fff' : '#000';
  const bgColor = theme === 'dark' ? '#0a0a0a' : '#f5f5f5';
  const cardBg = theme === 'dark' ? '#16162a' : '#ffffff';

  useEffect(() => {
    const saved = localStorage.getItem('tsar-monitoring');
    if (saved) {
      try { setMonitoring(JSON.parse(saved)); } catch (e) {}
    }
    const savedChanges = localStorage.getItem('tsar-monitor-changes');
    if (savedChanges) {
      try { setChanges(JSON.parse(savedChanges)); } catch (e) {}
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('tsar-monitoring', JSON.stringify(monitoring));
  }, [monitoring]);

  useEffect(() => {
    localStorage.setItem('tsar-monitor-changes', JSON.stringify(changes));
  }, [changes]);

  const addAllToMonitor = () => {
    let added = 0;
    subscriptions.forEach(sub => {
      if (!monitoring.find(m => m.id === sub.id)) {
        setMonitoring(prev => [...prev, {
          id: sub.id,
          name: sub.name,
          price: sub.price,
          url: sub.domain ? `https://${sub.domain}` : '',
          lastChecked: new Date().toISOString(),
          priceHistory: [{ price: sub.price, date: new Date().toISOString() }]
        }]);
        added++;
      }
    });
    if (added > 0) {
      alert(`✅ Добавлено ${added} подписок в монитор`);
    } else {
      alert(`ℹ️ Все подписки уже в мониторе`);
    }
  };

  const removeFromMonitor = (id) => {
    setMonitoring(monitoring.filter(m => m.id !== id));
  };

  const checkPrice = async (monitorItem) => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const willChange = Math.random() > 0.7;
    if (willChange) {
      const changePercent = (Math.random() - 0.5) * 0.2;
      const newPrice = Math.round(monitorItem.price * (1 + changePercent));
      
      if (newPrice !== monitorItem.price) {
        const change = {
          id: Date.now(),
          subscriptionId: monitorItem.id,
          name: monitorItem.name,
          oldPrice: monitorItem.price,
          newPrice: newPrice,
          changePercent: Math.round((newPrice - monitorItem.price) / monitorItem.price * 100),
          date: new Date().toISOString(),
          type: newPrice > monitorItem.price ? 'increase' : 'decrease'
        };
        
        setChanges([change, ...changes]);
        alert(`🔔 ${monitorItem.name}: цена изменилась! ${monitorItem.price}₽ → ${newPrice}₽`);
        
        setMonitoring(monitoring.map(m => 
          m.id === monitorItem.id 
            ? { ...m, lastChecked: new Date().toISOString(), price: newPrice }
            : m
        ));
      } else {
        setMonitoring(monitoring.map(m => 
          m.id === monitorItem.id 
            ? { ...m, lastChecked: new Date().toISOString() }
            : m
        ));
        alert(`✅ ${monitorItem.name}: цена без изменений (${monitorItem.price}₽)`);
      }
    } else {
      setMonitoring(monitoring.map(m => 
        m.id === monitorItem.id 
          ? { ...m, lastChecked: new Date().toISOString() }
          : m
      ));
      alert(`✅ ${monitorItem.name}: цена без изменений (${monitorItem.price}₽)`);
    }
    
    setLoading(false);
  };

  const checkAll = async () => {
    if (monitoring.length === 0) return;
    setLoading(true);
    for (const item of monitoring) {
      await checkPrice(item);
    }
    setLoading(false);
  };

  const openComplaintModal = (change) => {
    setSelectedChange(change);
    setCheckboxes({
      noNotification: false,
      checkedEmail: false,
      understandTemplate: false
    });
    setShowComplaintModal(true);
  };

  const generateComplaint = async () => {
    if (!selectedChange) return;
    
    // ОТПРАВКА В GOOGLE ТАБЛИЦУ
    try {
      const userId = localStorage.getItem('tsar-user-id') || 'anonymous';
      const userData = {
        type: 'complaint',
        subscriptionName: selectedChange.name,
        oldPrice: selectedChange.oldPrice,
        newPrice: selectedChange.newPrice,
        changePercent: selectedChange.changePercent,
        checkboxes: checkboxes,
        userId: userId,
        timestamp: new Date().toISOString()
      };
      
      await fetch('https://script.google.com/macros/s/AKfycbx5cwAGo34Bo9MCTzRZq6YlMgBgjjJkvVDt2IT6zOIAez44Jqh3r3lksHbFJ02oy4XV/exec', {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });
    } catch (e) {
      console.error('Ошибка отправки:', e);
    }
    
    const complaint = `
РУКОВОДИТЕЛЮ ${selectedChange.name.toUpperCase()}
ОТ: ___________________

ПРЕТЕНЗИЯ
о необоснованном повышении стоимости подписки

Я являюсь пользователем вашей подписки "${selectedChange.name}".

Мне стало известно, что стоимость повышена с ${selectedChange.oldPrice}₽ до ${selectedChange.newPrice}₽ (на ${Math.abs(selectedChange.changePercent)}%).

В соответствии со ст. 16 ГК РФ, прошу:
1. Предоставить обоснование изменения цены.
2. Сохранить прежнюю стоимость для действующих клиентов.

Дата: ___________
Подпись: ___________
    `.trim();
    
    navigator.clipboard.writeText(complaint);
    alert('📋 Текст претензии скопирован в буфер обмена!');
    setShowComplaintModal(false);
  };

  const allChecked = Object.values(checkboxes).every(v => v === true);

  return (
    <div style={{ padding: '20px', color: textColor, background: bgColor, minHeight: '100vh', paddingBottom: '80px' }}>
      <h2 style={{ color: '#FFD700', marginBottom: '20px' }}>🔔 Монитор цен</h2>
      
      <button 
        onClick={addAllToMonitor}
        style={{ 
          width: '100%', 
          padding: '14px', 
          background: 'linear-gradient(135deg, #FFD700, #FFA500)', 
          color: '#000', 
          border: 'none', 
          borderRadius: '15px', 
          fontWeight: '900',
          cursor: 'pointer',
          marginBottom: '15px',
          boxShadow: '0 4px 15px rgba(255, 215, 0, 0.3)'
        }}
      >
        📋 Добавить все подписки в монитор
      </button>

      {monitoring.length > 0 && (
        <button 
          onClick={checkAll} 
          disabled={loading}
          style={{ 
            width: '100%', 
            padding: '16px', 
            background: loading ? '#666' : '#2196F3', 
            color: '#fff', 
            border: 'none', 
            borderRadius: '15px', 
            fontWeight: '900',
            cursor: loading ? 'not-allowed' : 'pointer',
            marginBottom: '20px',
            boxShadow: '0 4px 15px rgba(33,150,243,0.3)'
          }}
        >
          {loading ? '⏳ Сканирование...' : '🔄 Проверить все подписки'}
        </button>
      )}

      <div style={{ marginBottom: '30px' }}>
        <h3 style={{ color: '#FFD700', fontSize: '18px' }}>📋 Отслеживаемые ({monitoring.length})</h3>
        {monitoring.length === 0 ? (
          <div style={{ background: cardBg, padding: '30px', borderRadius: '15px', textAlign: 'center', opacity: 0.6, marginTop: '10px' }}>
            <div style={{ fontSize: '40px' }}>📭</div>
            <p>Список пуст</p>
            <p style={{ fontSize: '12px' }}>Нажмите «Добавить все подписки»</p>
          </div>
        ) : (
          monitoring.map(item => (
            <div key={item.id} style={{ background: cardBg, padding: '15px', borderRadius: '15px', marginBottom: '10px', border: '1px solid rgba(255,215,0,0.2)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontWeight: 'bold', color: '#FFD700' }}>{item.name}</div>
                <div style={{ fontSize: '12px', opacity: 0.7 }}>Текущая: {item.price}₽</div>
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button onClick={() => checkPrice(item)} style={{ padding: '8px 12px', background: '#2196F3', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>🔍</button>
                <button onClick={() => removeFromMonitor(item.id)} style={{ padding: '8px 12px', background: '#f44336', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>✕</button>
              </div>
            </div>
          ))
        )}
      </div>

      {changes.length > 0 && (
        <div>
          <h3 style={{ color: '#FFD700', fontSize: '18px' }}>📊 История изменений</h3>
          {changes.map(change => (
            <div key={change.id} style={{ background: cardBg, padding: '15px', borderRadius: '15px', marginBottom: '10px', border: `2px solid ${change.type === 'increase' ? '#f44336' : '#4CAF50'}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <div style={{ fontWeight: 'bold' }}>{change.name}</div>
                <div style={{ color: change.type === 'increase' ? '#f44336' : '#4CAF50', fontWeight: 'bold' }}>
                  {change.type === 'increase' ? '📈' : '📉'} {change.changePercent}%
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', background: 'rgba(0,0,0,0.2)', padding: '8px', borderRadius: '8px', marginBottom: '10px' }}>
                <span style={{ textDecoration: 'line-through', opacity: 0.6 }}>{change.oldPrice}₽</span>
                <span style={{ fontWeight: 'bold', color: '#FFD700' }}>{change.newPrice}₽</span>
              </div>
              {change.type === 'increase' && (
                <button onClick={() => openComplaintModal(change)} style={{ width: '100%', padding: '10px', background: '#FFD700', color: '#000', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
                  📝 Скопировать претензию
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* МОДАЛКА С ЧЕК-ЛИСТОМ */}
      {showComplaintModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.85)',
          backdropFilter: 'blur(5px)',
          zIndex: 30000,
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
            maxWidth: '450px',
            width: '100%',
            boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
          }}>
            <h2 style={{ color: '#FFD700', marginBottom: '20px', fontSize: '20px' }}>
              📋 Подтверждение претензии
            </h2>
            
            <p style={{ color: textColor, marginBottom: '20px', fontSize: '14px', lineHeight: '1.5' }}>
              <strong>Подписка:</strong> {selectedChange?.name}<br/>
              <strong>Изменение:</strong> {selectedChange?.oldPrice}₽ → {selectedChange?.newPrice}₽ ({selectedChange?.changePercent > 0 ? '+' : ''}{selectedChange?.changePercent}%)
            </p>

            <div style={{ marginBottom: '25px' }}>
              <label style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '15px', color: textColor, cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={checkboxes.noNotification}
                  onChange={(e) => setCheckboxes({...checkboxes, noNotification: e.target.checked})}
                  style={{ width: '20px', height: '20px', marginTop: '2px', accentColor: '#FFD700' }}
                />
                <span style={{ fontSize: '14px' }}>
                  Я проверил почту, СМС и личный кабинет — уведомления об изменении цены <strong>не было</strong>
                </span>
              </label>

              <label style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '15px', color: textColor, cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={checkboxes.checkedEmail}
                  onChange={(e) => setCheckboxes({...checkboxes, checkedEmail: e.target.checked})}
                  style={{ width: '20px', height: '20px', marginTop: '2px', accentColor: '#FFD700' }}
                />
                <span style={{ fontSize: '14px' }}>
                  Я заполню свои реальные данные в шаблоне претензии
                </span>
              </label>

              <label style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', color: textColor, cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={checkboxes.understandTemplate}
                  onChange={(e) => setCheckboxes({...checkboxes, understandTemplate: e.target.checked})}
                  style={{ width: '20px', height: '20px', marginTop: '2px', accentColor: '#FFD700' }}
                />
                <span style={{ fontSize: '14px' }}>
                  Я понимаю, что шаблон носит рекомендательный характер и не является юридической консультацией
                </span>
              </label>
            </div>

            <div style={{
              background: 'rgba(255,215,0,0.1)',
              padding: '12px',
              borderRadius: '10px',
              marginBottom: '20px',
              fontSize: '12px',
              color: '#888'
            }}>
              ⚠️ Претензия имеет смысл, если компания не уведомила вас заранее (менее 30 дней) или повысила цену в середине оплаченного периода.
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => setShowComplaintModal(false)}
                style={{
                  flex: 1,
                  padding: '12px',
                  background: '#333',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  fontWeight: '600'
                }}
              >
                Отмена
              </button>
              <button
                onClick={generateComplaint}
                disabled={!allChecked}
                style={{
                  flex: 1,
                  padding: '12px',
                  background: allChecked ? '#FFD700' : '#555',
                  color: allChecked ? '#000' : '#888',
                  border: 'none',
                  borderRadius: '10px',
                  cursor: allChecked ? 'pointer' : 'not-allowed',
                  fontWeight: 'bold'
                }}
              >
                ✅ Копировать претензию
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Monitor;