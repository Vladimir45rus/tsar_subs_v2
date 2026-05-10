import React, { useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts';

const COLORS = ['#FFD700', '#FFA500', '#FF6347', '#4CAF50', '#2196F3', '#9C27B0', '#FF5722', '#795548', '#607D8B', '#E91E63'];
const categoryNames = {
  video: 'Кино',
  music: 'Музыка',
  mobile: 'Связь',
  internet: 'Интернет',
  bank: 'Банки',
  auto: 'Авто',
  fitness: 'Фитнес',
  education: 'Обучение',
  delivery: 'Доставка',
  security: 'Охрана',
  games: 'Игры',
  other: 'Прочее'
};

const Statistics = ({ subscriptions, theme }) => {
  const [selectedIndex, setSelectedIndex] = useState(null);

  const categoriesMap = {};
  subscriptions.forEach(sub => {
    const cat = sub.category || 'other';
    const monthlyPrice = sub.period === 'year' ? sub.price / 12 : sub.price;
    categoriesMap[cat] = (categoriesMap[cat] || 0) + monthlyPrice;
  });

  const pieData = Object.entries(categoriesMap).map(([key, value]) => ({
    name: categoryNames[key] || key,
    value: Math.round(value * 100) / 100
  }));
  const total = pieData.reduce((sum, item) => sum + item.value, 0);

  const months = ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'];
  const currentYear = new Date().getFullYear();

  const getMonthTotal = (year, monthIndex) => {
    let total = 0;
    subscriptions.forEach(sub => {
      const start = new Date(sub.startDate);
      const startYear = start.getFullYear();
      const startMonth = start.getMonth();
      if (year < startYear) return;
      if (year === startYear && monthIndex < startMonth) return;
      const monthsPassed = (year - startYear) * 12 + (monthIndex - startMonth);
      if (sub.period === 'month' && monthsPassed >= 0) {
        total += sub.price;
      } else if (sub.period === 'year' && monthIndex === startMonth && monthsPassed % 12 === 0) {
        total += sub.price;
      }
    });
    return total;
  };

  const lineData = months.map((month, idx) => ({
    name: month,
    Сумма: getMonthTotal(currentYear, idx)
  }));

  const totalSpent = subscriptions.reduce((sum, sub) => {
    const paymentsCount = sub.payments?.length || 0;
    if (sub.period === 'month') {
      return sum + (sub.price * paymentsCount);
    } else if (sub.period === 'year') {
      return sum + (sub.price * paymentsCount);
    }
    return sum;
  }, 0);

  const handlePieClick = (data, index) => {
    setSelectedIndex(prevIndex => (prevIndex === index ? null : index));
  };

  const textColor = theme === 'dark' ? '#fff' : '#000';
  const bgColor = theme === 'dark' ? '#0a0a0a' : '#f5f5f5';

  return (
    <div className={`statistics-container ${theme === 'dark' ? 'dark-theme' : 'light-theme'}`} style={{ padding: '20px', color: textColor, background: bgColor }}>
      <h2 style={{ color: '#FFD700', marginBottom: '20px' }}>📊 Статистика</h2>

      {pieData.length === 0 ? (
        <p style={{ color: '#888' }}>Нет данных для отображения</p>
      ) : (
        <>
          <div style={{ marginBottom: '30px' }}>
            <h3 style={{ color: '#FFD700' }}>Распределение по категориям</h3>
            <p>Общая сумма в месяц: <strong>{total} ₽</strong></p>
            <ResponsiveContainer width="100%" height={350}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={{ stroke: '#FFD700', strokeWidth: 1.5 }}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  dataKey="value"
                  onClick={handlePieClick}
                  animationDuration={300}
                >
                  {pieData.map((entry, index) => {
                    const isSelected = selectedIndex === index;
                    return (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                        opacity={selectedIndex === null || isSelected ? 1 : 0.4}
                        style={{
                          transition: 'opacity 0.2s',
                          cursor: 'pointer'
                        }}
                      />
                    );
                  })}
                </Pie>
                <Tooltip
                  formatter={(value, name) => [`${value} ₽`, name]}
                  contentStyle={{
                    backgroundColor: theme === 'dark' ? '#1a1a2e' : '#fff',
                    border: '1px solid #FFD700',
                    borderRadius: '8px',
                  }}
                  itemStyle={{ color: textColor }}
                  labelStyle={{ color: textColor }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div style={{ marginTop: '30px' }}>
            <h3 style={{ color: '#FFD700' }}>Расходы по месяцам (прогноз на {currentYear} год)</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={lineData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                <XAxis dataKey="name" stroke="#FFD700" />
                <YAxis stroke="#FFD700" />
                <Tooltip
                  formatter={(value) => `${value} ₽`}
                  contentStyle={{
                    backgroundColor: theme === 'dark' ? '#1a1a2e' : '#fff',
                    border: '1px solid #FFD700',
                    borderRadius: '8px',
                  }}
                  itemStyle={{ color: textColor }}
                  labelStyle={{ color: textColor }}
                />
                <Legend />
                <Line type="monotone" dataKey="Сумма" stroke="#FFD700" strokeWidth={2} dot={{ fill: '#FFD700' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div style={{ marginTop: '30px', padding: '20px', background: theme === 'dark' ? '#16162a' : '#e0e0e0', borderRadius: '15px', textAlign: 'center' }}>
            <h3 style={{ color: '#FFD700' }}>💰 Всего потрачено за всё время</h3>
            <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#FFD700' }}>{totalSpent} ₽</p>
            <p style={{ fontSize: '14px', color: '#888' }}>на основе истории платежей</p>
          </div>
        </>
      )}
    </div>
  );
};

export default Statistics;