import React, { useState } from 'react';

const SubscriptionDetail = ({ subscription, onClose, onEdit, onDelete, onMarkPaid, onAddToMonitor }) => {
  const [showAIPopup, setShowAIPopup] = useState(false);
  const [aiResponse, setAiResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  if (!subscription) return null;

  const callHuggingFace = async (prompt) => {
    try {
      const response = await fetch(
        "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.3",
        {
          method: "POST",
          headers: {
            "Authorization": "тут должен быть ключ",
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            inputs: prompt,
            parameters: { max_new_tokens: 300 }
          })
        }
      );
      const data = await response.json();
      return data[0]?.generated_text || "Не удалось получить ответ от ИИ";
    } catch (error) {
      console.error("Ошибка ИИ:", error);
      return "Ошибка соединения с ИИ. Попробуйте позже.";
    }
  };

  const handleAIClick = async () => {
    setIsLoading(true);
    setShowAIPopup(true);
    const answer = await callHuggingFace(`Расскажи что-то полезное о подписке ${subscription.name}. Дай совет как сэкономить или не пропустить платеж. Ответ коротко, 2-3 предложения.`);
    setAiResponse(answer);
    setIsLoading(false);
    setTimeout(() => {
      setShowAIPopup(false);
      setAiResponse("");
    }, 5000);
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.85)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 10000,
      padding: '20px'
    }}>
      <div style={{
        background: '#16162a',
        borderRadius: '30px',
        padding: '25px',
        width: '100%',
        maxWidth: '400px',
        color: '#fff',
        position: 'relative'
      }}>
        <h2 style={{ color: '#FFD700', marginTop: 0 }}>{subscription.name}</h2>
        <p><strong>Цена:</strong> {subscription.price} ₽ / {subscription.period === 'month' ? 'мес' : 'год'}</p>
        <p><strong>День списания:</strong> {subscription.billingDay}-го числа</p>
        <p><strong>Начало:</strong> {subscription.startDate || 'не указана'}</p>
        <p><strong>Категория:</strong> {subscription.category || 'не выбрана'}</p>

        <button 
          onClick={() => onMarkPaid(subscription.id, new Date().toISOString())}
          style={{
            width: '100%',
            padding: '12px',
            marginTop: '10px',
            background: '#4CAF50',
            color: '#fff',
            border: 'none',
            borderRadius: '15px',
            fontSize: '16px',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}
        >
          ✅ Отметить оплаченным
        </button>

        <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
          <button 
            onClick={() => onEdit(subscription)}
            style={{
              flex: 1,
              padding: '12px',
              background: '#FFD700',
              color: '#000',
              border: 'none',
              borderRadius: '15px',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            ✏️ Редактировать
          </button>
          <button 
            onClick={() => onDelete(subscription.id)}
            style={{
              flex: 1,
              padding: '12px',
              background: '#f44336',
              color: '#fff',
              border: 'none',
              borderRadius: '15px',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            🗑️ Удалить
          </button>
        </div>

        <button 
          onClick={() => onAddToMonitor(subscription)}
          style={{
            width: '100%',
            padding: '12px',
            marginTop: '10px',
            background: '#2196F3',
            color: '#fff',
            border: 'none',
            borderRadius: '15px',
            fontSize: '16px',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}
        >
          🔍 Добавить в монитор
        </button>

        <button 
          onClick={handleAIClick}
          style={{
            width: '100%',
            padding: '12px',
            marginTop: '10px',
            background: '#9C27B0',
            color: '#fff',
            border: 'none',
            borderRadius: '15px',
            fontSize: '16px',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}
        >
          🤖 Спросить ИИ про эту подписку
        </button>

        <button 
          onClick={onClose}
          style={{
            width: '100%',
            padding: '12px',
            marginTop: '15px',
            background: 'none',
            border: 'none',
            color: '#aaa',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          Закрыть
        </button>

        {showAIPopup && (
          <div style={{
            position: 'absolute',
            bottom: '100%',
            left: '20px',
            right: '20px',
            marginBottom: '15px',
            background: '#333',
            borderRadius: '15px',
            padding: '15px',
            textAlign: 'center',
            boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
            border: '1px solid #FFD700',
            animation: 'fadeInUp 0.3s ease-out'
          }}>
            <p style={{ margin: 0, fontSize: '14px', color: '#FFD700' }}>
              {isLoading ? '🤖 Думаю...' : `🤖 ${aiResponse}`}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SubscriptionDetail;