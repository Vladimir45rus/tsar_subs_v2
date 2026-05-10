import React, { useState } from 'react';

const AIChat = ({ subscriptions, theme }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const textColor = theme === 'dark' ? '#fff' : '#000';
  const bgColor = theme === 'dark' ? '#0a0a0a' : '#f5f5f5';
  const cardBg = theme === 'dark' ? '#16162a' : '#ffffff';

  const callHuggingFace = async (prompt) => {
    try {
      const response = await fetch(
        "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.3",
        {
          method: "POST",
          headers: {
            "Authorization": "Bearer hf_aIepScO",
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            inputs: prompt,
            parameters: { max_new_tokens: 300 }
          })
        }
      );
      const data = await response.json();
      return data[0]?.generated_text || "Не удалось получить ответ";
    } catch (error) {
      console.error("Ошибка ИИ:", error);
      return "Ошибка соединения с ИИ";
    }
  };

  const sendMessage = async () => {
    if (!input.trim()) return;
    
    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    const subsList = subscriptions.map(s => `${s.name} (${s.price} ₽/${s.period})`).join(', ');
    const prompt = `У пользователя есть подписки: ${subsList}. Вопрос: ${input}. Ответь коротко, 2-3 предложения.`;
    
    const reply = await callHuggingFace(prompt);
    const aiMessage = { role: 'assistant', content: reply };
    setMessages(prev => [...prev, aiMessage]);
    setIsLoading(false);
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: bgColor, color: textColor }}>
      <div style={{ flex: 1, overflowY: 'auto', padding: '15px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {messages.length === 0 && (
          <div style={{ textAlign: 'center', opacity: 0.6, marginTop: '50px' }}>
            🤖 Задай вопрос о своих подписках
          </div>
        )}
        {messages.map((msg, idx) => (
          <div key={idx} style={{
            alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
            background: msg.role === 'user' ? '#FFD700' : cardBg,
            color: msg.role === 'user' ? '#000' : textColor,
            padding: '10px 15px',
            borderRadius: '20px',
            maxWidth: '80%',
            wordWrap: 'break-word'
          }}>
            {msg.content}
          </div>
        ))}
        {isLoading && (
          <div style={{ alignSelf: 'flex-start', background: cardBg, padding: '10px 15px', borderRadius: '20px' }}>
            🤖 Думаю...
          </div>
        )}
      </div>
      <div style={{ display: 'flex', gap: '10px', padding: '15px', borderTop: `1px solid ${theme === 'dark' ? '#333' : '#ddd'}` }}>
        <input
          type="text"
          placeholder="Спроси про подписки..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          style={{
            flex: 1,
            padding: '12px',
            borderRadius: '25px',
            border: '1px solid #FFD700',
            background: theme === 'dark' ? '#222' : '#fff',
            color: textColor
          }}
        />
        <button onClick={sendMessage} style={{
          padding: '12px 20px',
          borderRadius: '25px',
          background: '#FFD700',
          color: '#000',
          border: 'none',
          fontWeight: 'bold',
          cursor: 'pointer'
        }}>
          Отправить
        </button>
      </div>
    </div>
  );
};

export default AIChat;