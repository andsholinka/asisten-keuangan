"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useFinance, TransactionType } from '@/lib/contexts/FinanceContext';
import { useLanguage } from '@/lib/contexts/LanguageContext';
import BottomNav from '@/components/BottomNav';

const categories = {
  expense: [
    { name: 'Makanan', icon: '🍕' },
    { name: 'Transport', icon: '🚗' },
    { name: 'Belanja', icon: '🛍️' },
    { name: 'Hiburan', icon: '🎮' },
    { name: 'Kesehatan', icon: '🏥' },
    { name: 'Lainnya', icon: '📦' },
  ],
  income: [
    { name: 'Gaji', icon: '💵' },
    { name: 'Bonus', icon: '🧧' },
    { name: 'Investasi', icon: '📈' },
    { name: 'Lainnya', icon: '💰' },
  ]
};

export default function AddTransaction() {
  const router = useRouter();
  const { addTransaction } = useFinance();
  const { t } = useLanguage();
  
  const [type, setType] = useState<TransactionType>('expense');
  const [amount, setAmount] = useState(''); // This will store the formatted string
  const [category, setCategory] = useState('');
  const [note, setNote] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  // Format string with dots (e.g., 1000000 -> 1.000.000)
  const formatWithDots = (val: string) => {
    // Remove everything except numbers
    const numeric = val.replace(/\D/g, '');
    if (!numeric) return '';
    // Add dots every 3 digits from the right
    return numeric.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };

  // Strip dots to get pure number
  const parseAmount = (val: string) => {
    return parseFloat(val.replace(/\./g, '')) || 0;
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatWithDots(e.target.value);
    setAmount(formatted);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numericAmount = parseAmount(amount);
    if (!numericAmount || !category) return;

    addTransaction({
      amount: numericAmount,
      type,
      category,
      note,
      date,
    });

    router.push('/');
  };

  return (
    <main className="main-content animate-slide-up">
      <header className="page-header">
        <h1>{t('addTransaction')}</h1>
      </header>

      <form onSubmit={handleSubmit} className="transaction-form">
        <div className="type-toggle">
          <button 
            type="button"
            className={`toggle-btn ${type === 'expense' ? 'active expense' : ''}`}
            onClick={() => { setType('expense'); setCategory(''); }}
          >
            {t('expense')}
          </button>
          <button 
            type="button"
            className={`toggle-btn ${type === 'income' ? 'active income' : ''}`}
            onClick={() => { setType('income'); setCategory(''); }}
          >
            {t('income')}
          </button>
        </div>

        <div className="input-group">
          <label>{t('nominal')}</label>
          <div className="amount-input-wrapper">
            <span className="currency-prefix">Rp</span>
            <input 
              type="text" 
              inputMode="numeric"
              placeholder="0" 
              value={amount}
              onChange={handleAmountChange}
              required
              className="amount-input"
            />
          </div>
        </div>

        <div className="input-group">
          <label>{t('category')}</label>
          <div className="category-grid">
            {categories[type].map((cat) => (
              <button
                key={cat.name}
                type="button"
                className={`category-item ${category === cat.name ? 'selected' : ''}`}
                onClick={() => setCategory(cat.name)}
              >
                <span className="cat-icon">{cat.icon}</span>
                <span className="cat-name">{t(cat.name.toLowerCase())}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="input-group">
          <label>{t('noteOptional')}</label>
          <input 
            type="text" 
            placeholder={t('notePlaceholder')}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="text-input"
          />
        </div>

        <div className="input-group">
          <label>{t('date')}</label>
          <input 
            type="date" 
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="text-input"
          />
        </div>

        <button type="submit" className="submit-btn" disabled={!amount || !category}>
          {t('saveTransaction')}
        </button>

        <p className="form-privacy-note">
          🔒 {t('privacyNoteForm')}
        </p>
      </form>

      <BottomNav />

      <style jsx>{`
        .page-header {
          margin-bottom: 24px;
        }
        .transaction-form {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }
        .type-toggle {
          display: flex;
          background: var(--surface);
          padding: 4px;
          border-radius: 12px;
          gap: 4px;
        }
        .toggle-btn {
          flex: 1;
          padding: 10px;
          border-radius: 10px;
          font-weight: 600;
          font-size: 0.9rem;
          color: var(--text-secondary);
        }
        .toggle-btn.active.expense {
          background: var(--danger);
          color: white;
        }
        .toggle-btn.active.income {
          background: var(--success);
          color: white;
        }
        .input-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .input-group label {
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--text-secondary);
        }
        .amount-input-wrapper {
          display: flex;
          align-items: center;
          gap: 8px;
          border-bottom: 2px solid var(--border);
          padding: 8px 0;
        }
        .currency-prefix {
          font-size: 1.5rem;
          font-weight: 700;
        }
        .amount-input {
          flex: 1;
          background: none;
          border: none;
          outline: none;
          font-size: 2rem;
          font-weight: 700;
          color: var(--foreground);
        }
        .category-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
        }
        .category-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 12px;
          background: var(--surface);
          border-radius: 12px;
          border: 1px solid var(--border);
          gap: 4px;
          color: var(--foreground);
        }
        .category-item.selected {
          border-color: var(--primary);
          background: rgba(0, 113, 227, 0.05);
        }
        .cat-icon {
          font-size: 1.5rem;
        }
        .cat-name {
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--foreground);
        }
        .text-input {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 12px;
          padding: 12px 16px;
          font-size: 1rem;
          color: var(--foreground);
          outline: none;
        }
        .text-input:focus {
          border-color: var(--primary);
        }
        .submit-btn {
          background: var(--primary-gradient);
          color: white;
          padding: 16px;
          border-radius: 16px;
          font-size: 1rem;
          font-weight: 700;
          margin-top: 12px;
          box-shadow: 0 4px 15px rgba(0, 113, 227, 0.3);
        }
        .submit-btn:disabled {
          opacity: 0.5;
          box-shadow: none;
        }
        .form-privacy-note {
          text-align: center;
          font-size: 0.75rem;
          color: var(--text-secondary);
          margin-top: 12px;
        }
      `}</style>
    </main>
  );
}
