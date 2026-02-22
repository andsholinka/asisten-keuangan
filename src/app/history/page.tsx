"use client";

import React from 'react';
import { useFinance } from '@/lib/contexts/FinanceContext';
import { useLanguage } from '@/lib/contexts/LanguageContext';
import BottomNav from '@/components/BottomNav';
import { WalletIcon, TrashIcon } from '@/components/Icons';

export default function History() {
  const { transactions, deleteTransaction } = useFinance();
  const { t } = useLanguage();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const sortedTransactions = [...transactions].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <main className="main-content animate-slide-up">
      <header className="page-header">
        <h1>{t('history')}</h1>
      </header>

      <section className="history-list">
        {sortedTransactions.length === 0 ? (
          <div className="empty-state">
            <p>{t('noTransactionsHistory')}</p>
          </div>
        ) : (
          <div className="transaction-list">
            {sortedTransactions.map((trans) => (
              <div key={trans.id} className="history-item">
                <div className="t-icon-box">
                  <WalletIcon />
                </div>
                <div className="t-info">
                  <p className="t-note">{trans.note || trans.category}</p>
                  <div className="t-meta">
                    <span className="t-cat">{t(trans.category.toLowerCase())}</span>
                    <span className="t-dot">•</span>
                    <span className="t-date">{new Date(trans.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                  </div>
                </div>
                <div className="t-actions">
                  <div className={`t-amount ${trans.type}`}>
                    {trans.type === 'income' ? '+' : '-'} {formatCurrency(trans.amount)}
                  </div>
                  <button 
                    onClick={() => confirm(t('deleteConfirm')) && deleteTransaction(trans.id)} 
                    className="delete-btn"
                    aria-label={t('delete')}
                  >
                    <TrashIcon />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <BottomNav />

      <style jsx>{`
        .history-list {
          margin-bottom: 100px;
        }
        .transaction-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .history-item {
          display: flex;
          align-items: center;
          padding: 16px;
          background: var(--surface-elevated);
          border-radius: 16px;
          gap: 16px;
          border: 1px solid var(--border);
        }
        .t-icon-box {
          width: 48px;
          height: 48px;
          background: var(--surface);
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
          margin-bottom: 4px;
        }
        .t-meta {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.75rem;
          color: var(--text-secondary);
        }
        .t-dot {
          opacity: 0.5;
        }
        .t-actions {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 8px;
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
        .delete-btn {
          padding: 4px;
          color: var(--text-secondary);
          opacity: 0.5;
          transition: all 0.2s;
        }
        .delete-btn:hover {
          color: var(--danger);
          opacity: 1;
        }
        .delete-btn :global(svg) {
          width: 18px;
          height: 18px;
        }
        .empty-state {
          text-align: center;
          padding: 60px 20px;
          color: var(--text-secondary);
          background: var(--surface-elevated);
          border-radius: 16px;
          border: 1px dashed var(--border);
        }
      `}</style>
    </main>
  );
}
