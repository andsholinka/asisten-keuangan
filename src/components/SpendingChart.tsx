"use client";

import React, { useMemo } from 'react';
import { useFinance } from '@/lib/contexts/FinanceContext';
import { useLanguage } from '@/lib/contexts/LanguageContext';

const categoryIcons: Record<string, string> = {
  'Makanan': '🍕',
  'Transport': '🚗',
  'Belanja': '🛍️',
  'Hiburan': '🎮',
  'Kesehatan': '🏥',
  'Lainnya': '📦',
};

// Pastel colors for each rank
const barColors = ['#E88EAB', '#7EC8E3', '#C4B5E0'];

const SpendingChart = () => {
  const { transactions } = useFinance();
  const { t } = useLanguage();

  const topCategories = useMemo(() => {
    const expenseTransactions = transactions.filter(t => t.type === 'expense');
    
    // Group by category
    const categoryMap: Record<string, number> = {};
    expenseTransactions.forEach(trans => {
      categoryMap[trans.category] = (categoryMap[trans.category] || 0) + trans.amount;
    });

    // Sort and take top 3
    return Object.entries(categoryMap)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([category, amount]) => ({ category, amount }));
  }, [transactions]);

  if (topCategories.length === 0) return null;

  const maxAmount = topCategories[0]?.amount || 1;

  const formatCurrency = (amount: number) => {
    return `Rp ${new Intl.NumberFormat('id-ID', { maximumFractionDigits: 0 }).format(amount)}`;
  };

  return (
    <div className="top-categories">
      {topCategories.map((item, index) => {
        const percentage = (item.amount / maxAmount) * 100;
        const icon = categoryIcons[item.category] || '📦';
        
        return (
          <div key={item.category} className="top-cat-item">
            <div className="top-cat-left">
              <span className="top-cat-rank">{index + 1}</span>
              <span className="top-cat-icon">{icon}</span>
              <div className="top-cat-info">
                <span className="top-cat-name">{t(item.category.toLowerCase())}</span>
                <span className="top-cat-amount">{formatCurrency(item.amount)}</span>
              </div>
            </div>
            <div className="top-cat-bar-wrap">
              <div 
                className="top-cat-bar" 
                style={{ width: `${percentage}%`, background: barColors[index] }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default SpendingChart;
