"use client";

import React from 'react';
import { useFinance } from '@/lib/contexts/FinanceContext';
import { useLanguage } from '@/lib/contexts/LanguageContext';

const SpendingChart = () => {
  const { transactions, totalExpense } = useFinance();
  const { t } = useLanguage();

  const expenseTransactions = transactions.filter(trans => trans.type === 'expense');
  
  // Group by category
  const categories = expenseTransactions.reduce((acc, trans) => {
    acc[trans.category] = (acc[trans.category] || 0) + trans.amount;
    return acc;
  }, {} as Record<string, number>);

  const sortedCategories = Object.entries(categories)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3);

  if (totalExpense === 0) return null;

  return (
    <div className="chart-container">
      <h3>{t('spendingDistribution')}</h3>
      <div className="chart-bars">
        {sortedCategories.map(([name, amount]) => {
          const percentage = (amount / totalExpense) * 100;
          return (
            <div key={name} className="bar-item">
              <div className="bar-info">
                <span>{t(name.toLowerCase())}</span>
                <span>{Math.round(percentage)}%</span>
              </div>
              <div className="bar-track">
                <div 
                  className="bar-fill" 
                  style={{ 
                    width: `${percentage}%`,
                    background: name === 'Makanan' ? '#FF9500' : 
                                name === 'Transport' ? '#5856D6' : 
                                name === 'Belanja' ? '#FF2D55' : 'var(--primary)'
                  }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>
      <style jsx>{`
        .chart-container {
          background: var(--surface-elevated);
          padding: 20px;
          border-radius: var(--radius);
          margin-bottom: 32px;
          border: 1px solid var(--border);
        }
        h3 {
          font-size: 1rem;
          margin-bottom: 16px;
        }
        .chart-bars {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .bar-item {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .bar-info {
          display: flex;
          justify-content: space-between;
          font-size: 0.85rem;
          font-weight: 500;
        }
        .bar-track {
          width: 100%;
          height: 8px;
          background: var(--surface);
          border-radius: 4px;
          overflow: hidden;
        }
        .bar-fill {
          height: 100%;
          border-radius: 4px;
          transition: width 1s ease-out;
        }
      `}</style>
    </div>
  );
};

export default SpendingChart;
