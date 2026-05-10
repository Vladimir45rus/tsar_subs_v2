export default async function handler(req, res) {
  // CORS конфиг
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { messages, subscriptions } = req.body || {};

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Messages are required and must be an array' });
    }

    const subsContext = subscriptions?.length 
      ? `Список подписок пользователя:\n${subscriptions.map(s => `- ${s.name}: ${s.price}₽ в ${s.period}, списание ${s.billingDay}-го числа`).join('\n')}`
      : 'У пользователя пока нет активных подписок.';

    const systemPrompt = `Ты — ИИ-помощник "Tsarskiy Soft" в приложении для управления подписками. 
    Отвечай кратко, по делу. Твои задачи: анализировать траты, искать способы сэкономить и находить актуальные промокоды.
    Данные о подписках пользователя:\n${subsContext}`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);

    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`
      },
      signal: controller.signal,
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages
        ],
        temperature: 0.7,
        max_tokens: 800
      })
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorData = await response.text();
      console.error('DeepSeek Error Response:', errorData);
      throw new Error(`DeepSeek API error: ${response.status}`);
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    if (error.name === 'AbortError') {
      res.status(504).json({ error: 'DeepSeek API timeout' });
    } else {
      console.error('Proxy error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}