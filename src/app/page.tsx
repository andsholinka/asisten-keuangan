"use client";

import React from 'react';
import { useFinance } from '@/lib/contexts/FinanceContext';
import { useTheme } from '@/lib/contexts/ThemeContext';
import { useLanguage } from '@/lib/contexts/LanguageContext';
import BottomNav from '@/components/BottomNav';
import SpendingChart from '@/components/SpendingChart';
import { IncomeIcon, ExpenseIcon, WalletIcon } from '@/components/Icons';

export default function Dashboard() {
  const { balance, totalIncome, totalExpense, transactions } = useFinance();
  const { theme, toggleTheme } = useTheme();
  const { t } = useLanguage();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <main className="main-content animate-slide-up">
      <header className="home-header">
        <div className="header-top">
          <div>
            <p className="text-secondary">{t('welcome')} 👋</p>
            <h1 className="app-title">{t('appName')}</h1>
            <p className="privacy-badge">🔒 {t('privacyNoteHeader')}</p>
          </div>
          <button onClick={toggleTheme} className="theme-toggle">
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
        </div>
      </header>

      <div className="balance-card">
        <p className="balance-label">{t('totalBalance')}</p>
        <h2 className="balance-value">{formatCurrency(balance)}</h2>
        
        <div className="stats-row">
          <div className="stat-item income">
            <span className="stat-icon"><IncomeIcon /></span>
            <div>
              <p className="stat-label">{t('income')}</p>
              <p className="stat-value">{formatCurrency(totalIncome)}</p>
            </div>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-item expense">
            <span className="stat-icon"><ExpenseIcon /></span>
            <div>
              <p className="stat-label">{t('expense')}</p>
              <p className="stat-value">{formatCurrency(totalExpense)}</p>
            </div>
          </div>
        </div>
      </div>

      <section className="recent-section">
        <div className="section-header">
          <h3>{t('recentTransactions')}</h3>
          <a href="/history" className="view-all">{t('viewAll')}</a>
        </div>

        {transactions.length === 0 ? (
          <div className="empty-state">
            <p>{t('noTransactions')}</p>
          </div>
        ) : (
          <div className="transaction-list">
            {transactions.slice(0, 5).map((trans) => (
              <div key={trans.id} className="transaction-item">
                <div className="t-icon-box">
                  <WalletIcon />
                </div>
                <div className="t-info">
                  <p className="t-note">{trans.note || trans.category}</p>
                  <p className="t-cat">{trans.category}</p>
                </div>
                <div className={`t-amount ${trans.type}`}>
                  {trans.type === 'income' ? '+' : '-'} {formatCurrency(trans.amount)}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="chart-section">
        <h3>{t('spendingCategory')}</h3>
        <SpendingChart />
      </section>

      <BottomNav />

      <style jsx>{`
        .home-header {
          margin-bottom: 24px;
        }
        .header-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .theme-toggle {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          background: var(--surface-elevated);
          border: 1px solid var(--border);
          font-size: 1.2rem;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .app-title {
          font-size: 1.8rem;
          background: var(--primary-gradient);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin-bottom: 4px;
        }
        .privacy-badge {
          font-size: 0.7rem;
          color: var(--success);
          font-weight: 500;
          background: rgba(48, 209, 88, 0.1);
          padding: 2px 8px;
          border-radius: 20px;
          display: inline-block;
        }
        .balance-card {
          background: var(--surface-elevated);
          padding: 24px;
          border-radius: var(--radius);
          box-shadow: var(--shadow-md);
          margin-bottom: 32px;
          border: 1px solid var(--border);
        }
        .balance-label {
          color: var(--text-secondary);
          font-size: 0.9rem;
          margin-bottom: 4px;
        }
        .balance-value {
          font-size: 2.2rem;
          margin-bottom: 24px;
          letter-spacing: -1px;
          font-weight: 800;
        }
        .stats-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .stat-item {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .stat-icon {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .stat-icon :global(svg) {
          width: 20px;
          height: 20px;
        }
        .income .stat-icon {
          background: rgba(52, 199, 89, 0.1);
          color: var(--success);
        }
        .expense .stat-icon {
          background: rgba(255, 59, 48, 0.1);
          color: var(--danger);
        }
        .stat-label {
          font-size: 0.75rem;
          color: var(--text-secondary);
        }
        .stat-value {
          font-weight: 600;
          font-size: 0.95rem;
        }
        .stat-divider {
          width: 1px;
          height: 30px;
          background: var(--border);
        }
        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }
        .view-all {
          color: var(--primary);
          font-size: 0.85rem;
          font-weight: 600;
        }
        .transaction-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .transaction-item {
          display: flex;
          align-items: center;
          padding: 16px;
          background: var(--surface);
          border-radius: 16px;
          gap: 16px;
        }
        .t-icon-box {
          width: 48px;
          height: 48px;
          background: var(--surface-elevated);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid var(--border);
          color: var(--primary);
        }
        .t-icon-box :global(svg) {
          width: 24px;
          height: 24px;
        }
        .t-info {
          flex: 1;
        }
        .t-note {
          font-weight: 600;
          font-size: 0.95rem;
          margin-bottom: 2px;
        }
        .t-cat {
          font-size: 0.75rem;
          color: var(--text-secondary);
        }
        .t-amount {
          font-weight: 700;
          font-size: 0.95rem;
        }
        .t-amount.income {
          color: var(--success);
        }
        .t-amount.expense {
          color: var(--danger);
        }
        .chart-section {
          margin-bottom: 100px;
        }
        .chart-section h3 {
          margin-bottom: 16px;
        }
        .empty-state {
          text-align: center;
          padding: 40px;
          color: var(--text-secondary);
          background: var(--surface-elevated);
          border-radius: 16px;
          border: 1px dashed var(--border);
        }
      `}</style>
    </main>
  );
}
