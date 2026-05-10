import React, { useState, useEffect } from 'react';

const GOOGLE_SHEETS_URL = "https://script.google.com/macros/s/AKfycbx5cwAGo34Bo9MCTzRZq6YlMgBgjjJkvVDt2IT6zOIAez44Jqh3r3lksHbFJ02oy4XV/exec";

const AIAssistant = ({ subscriptions, theme }) => {
  const [votes, setVotes] = useState({});
  const [premiumVote, setPremiumVote] = useState(null);
  const [showThankYou, setShowThankYou] = useState(false);
  const [activeCategory, setActiveCategory] = useState('premium');
  const [isVoting, setIsVoting] = useState(false);

  const textColor = theme === 'dark' ? '#fff' : '#000';
  const cardBg = theme === 'dark' ? '#16162a' : '#ffffff';
  const secondaryText = theme === 'dark' ? '#aaa' : '#555';

  const sendVoteToSheets = async (type, option, label, desc) => {
    try {
      let userId = localStorage.getItem('tsar-user-id');
      if (!userId) {
        userId = 'user_' + Math.random().toString(36).substr(2, 9);
        localStorage.setItem('tsar-user-id', userId);
      }

      await fetch(GOOGLE_SHEETS_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type,
          option,
          label,
          desc,
          userId,
          timestamp: new Date().toISOString()
        })
      });
      console.log('✅ Голос отправлен:', { type, option, label });
    } catch (e) {
      console.error('❌ Ошибка отправки:', e);
    }
  };

  useEffect(() => {
    const savedVotes = localStorage.getItem('tsar-ai-votes');
    if (savedVotes) {
      try { setVotes(JSON.parse(savedVotes)); } catch (e) {}
    }
    const savedPremium = localStorage.getItem('tsar-premium-vote');
    if (savedPremium) {
      try { setPremiumVote(savedPremium); } catch (e) {}
    }
  }, []);

  useEffect(() => {
    if (Object.keys(votes).length > 0) {
      localStorage.setItem('tsar-ai-votes', JSON.stringify(votes));
    }
  }, [votes]);

  useEffect(() => {
    if (premiumVote) {
      localStorage.setItem('tsar-premium-vote', premiumVote);
    }
  }, [premiumVote]);

  const handleVote = (id, title, desc) => {
    if (votes[id] || isVoting) return;
    setIsVoting(true);
    setVotes(prev => ({ ...prev, [id]: true }));
    sendVoteToSheets('Идея', id, title, desc);
    setShowThankYou(true);
    
    setTimeout(() => {
      setShowThankYou(false);
      setIsVoting(false);
    }, 1500);
  };

  const handlePremiumVote = (option, label, desc) => {
    if (premiumVote || isVoting) return;
    setIsVoting(true);
    setPremiumVote(option);
    sendVoteToSheets('Премиум-формат', option, label, desc);
    setShowThankYou(true);
    
    setTimeout(() => {
      setShowThankYou(false);
      setIsVoting(false);
    }, 1500);
  };

  const ideas = [
    { id: 1, title: '🎯 Умные уведомления об отключении', desc: 'Напомнит только за день до списания, только для отмеченных подписок.' },
    { id: 2, title: '📊 Экспорт в Excel / CSV', desc: 'Выгрузи данные для анализа на компьютере.' },
    { id: 3, title: '📅 Календарь платежей', desc: 'Покажет все списания на календарной сетке с группировкой по дням и категориям.' }
  ];

  const premiumOptions = [
    { id: 'monthly', label: '📅 149 ₽/месяц', desc: 'Гибкий вариант на месяц' },
    { id: 'yearly', label: '🎉 1490 ₽/год', desc: 'Экономия 2 месяца' },
    { id: 'lifetime', label: '👑 2990 ₽ навсегда', desc: 'Разово и навсегда' }
  ];

  const remainingIdeas = ideas.filter(idea => !votes[idea.id]).length;

  return (
    <div style={{ padding: '20px', color: textColor, minHeight: '100vh', background: theme === 'dark' ? '#0a0a0a' : '#f5f5f5' }}>
      <h2 style={{ color: '#FFD700', marginBottom: '5px' }}>🤖 ИИ-Советник</h2>
      <p style={{ color: secondaryText, marginBottom: '20px', fontSize: '14px' }}>
        Помоги нам стать лучше — проголосуй за важные направления развития
      </p>

      {showThankYou && (
        <div style={{
          position: 'fixed',
          top: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: '#4CAF50',
          color: '#fff',
          padding: '12px 24px',
          borderRadius: '20px',
          zIndex: 10000,
          fontWeight: 'bold',
          animation: 'fadeIn 0.3s ease-out'
        }}>
          ✅ Спасибо за голос!
        </div>
      )}

      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', borderBottom: `1px solid ${theme === 'dark' ? '#333' : '#ddd'}`, paddingBottom: '10px' }}>
        <button 
          onClick={() => setActiveCategory('premium')}
          style={{
            background: activeCategory === 'premium' ? '#FFD700' : 'transparent',
            color: activeCategory === 'premium' ? '#000' : '#FFD700',
            border: '1px solid #FFD700',
            borderRadius: '20px',
            padding: '8px 16px',
            cursor: 'pointer',
            fontWeight: 'bold',
            transition: 'all 0.2s'
          }}
        >
          💎 Премиум
        </button>
        <button 
          onClick={() => setActiveCategory('ideas')}
          style={{
            background: activeCategory === 'ideas' ? '#FFD700' : 'transparent',
            color: activeCategory === 'ideas' ? '#000' : '#FFD700',
            border: '1px solid #FFD700',
            borderRadius: '20px',
            padding: '8px 16px',
            cursor: 'pointer',
            fontWeight: 'bold',
            transition: 'all 0.2s'
          }}
        >
          🚀 Идеи {remainingIdeas > 0 && `(${remainingIdeas})`}
        </button>
      </div>

      {activeCategory === 'premium' && (
        <div>
          {premiumVote ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#4CAF50', background: cardBg, borderRadius: '20px' }}>
              ✅ Спасибо за ваш голос!<br/>
              <span style={{ fontSize: '14px', color: secondaryText }}>
                Результаты опроса помогут нам выбрать лучший формат Премиума.
              </span>
            </div>
          ) : (
            <div>
              <h3 style={{ color: '#FFD700', fontSize: '18px', marginBottom: '15px' }}>
                Какой формат Премиума вам удобнее?
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {premiumOptions.map(option => (
                  <div key={option.id} style={{ background: cardBg, padding: '15px', borderRadius: '15px', border: '1px solid rgba(255,215,0,0.2)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', flexWrap: 'wrap', gap: '5px' }}>
                      <span style={{ fontSize: '16px', fontWeight: 'bold', color: '#FFD700' }}>{option.label}</span>
                      <span style={{ fontSize: '12px', color: secondaryText }}>{option.desc}</span>
                    </div>
                    <button 
                      onClick={() => handlePremiumVote(option.id, option.label, option.desc)} 
                      disabled={isVoting}
                      style={{ 
                        width: '100%', 
                        padding: '10px', 
                        background: '#FFD700', 
                        color: '#000', 
                        border: 'none', 
                        borderRadius: '10px', 
                        fontWeight: 'bold', 
                        cursor: isVoting ? 'not-allowed' : 'pointer', 
                        marginTop: '8px',
                        opacity: isVoting ? 0.6 : 1,
                        transition: 'opacity 0.2s'
                      }}
                    >
                      🔥 Проголосовать
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {activeCategory === 'ideas' && (
        <div>
          {remainingIdeas === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#4CAF50', background: cardBg, borderRadius: '20px' }}>
              ✅ Спасибо! Вы проголосовали за все идеи.
            </div>
          ) : (
            <div>
              <h3 style={{ color: '#FFD700', fontSize: '18px', marginBottom: '15px' }}>
                Что добавить в первую очередь?
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {ideas.filter(idea => !votes[idea.id]).map(idea => (
                  <div key={idea.id} style={{ background: cardBg, padding: '20px', borderRadius: '20px', border: '1px solid rgba(255,215,0,0.1)' }}>
                    <h3 style={{ margin: 0, fontSize: '18px', color: '#FFD700' }}>{idea.title}</h3>
                    <p style={{ margin: '10px 0', fontSize: '14px', color: secondaryText, lineHeight: '1.5' }}>{idea.desc}</p>
                    <button 
                      onClick={() => handleVote(idea.id, idea.title, idea.desc)} 
                      disabled={isVoting}
                      style={{ 
                        width: '100%', 
                        padding: '12px', 
                        background: '#FFD700', 
                        color: '#000', 
                        border: 'none', 
                        borderRadius: '12px', 
                        fontWeight: 'bold', 
                        cursor: isVoting ? 'not-allowed' : 'pointer', 
                        fontSize: '14px',
                        opacity: isVoting ? 0.6 : 1,
                        transition: 'opacity 0.2s'
                      }}
                    >
                      🔥 Поддержать идею
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <div style={{ marginTop: '30px', textAlign: 'center', color: secondaryText, fontSize: '12px' }}>
        <p>Есть своя идея? Напиши нам в поддержку!</p>
      </div>
    </div>
  );
};

export default AIAssistant;