// src/app/add/page.tsx

"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useFinance, TransactionType } from '@/lib/contexts/FinanceContext';
import { useLanguage } from '@/lib/contexts/LanguageContext';
import { ChevronRightIcon } from '@/components/Icons';
import Link from 'next/link';

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
    { name: 'Lainnya', icon: '💰' },
  ]
};

export default function AddTransaction() {
  const router = useRouter();
  const { addTransaction } = useFinance();
  const { t } = useLanguage();
  
  const [type, setType] = useState<TransactionType>('expense');
  const [amount, setAmount] = useState(''); 
  const [category, setCategory] = useState('');
  const [note, setNote] = useState('');
  const getLocalDateStr = () => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  };
  const [date, setDate] = useState(getLocalDateStr());
  const [error, setError] = useState('');

  const formatWithDots = (val: string) => {
    const numeric = val.replace(/\D/g, '');
    if (!numeric) return '';
    return numeric.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };

  const parseAmount = (val: string) => {
    return parseFloat(val.replace(/\./g, '')) || 0;
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatWithDots(e.target.value);
    setAmount(formatted);
    if (formatted) setError('');
  };

  const handleCategorySelect = (name: string) => {
    setCategory(name);
    if (name) setError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numericAmount = parseAmount(amount);
    
    if (!numericAmount) {
      setError(t('nominalRequired'));
      return;
    }
    
    if (!category) {
      setError(t('categoryRequired'));
      return;
    }

    const now = new Date();
    const timeStr = now.toTimeString().split(' ')[0]; // HH:MM:SS
    const dateTime = `${date}T${timeStr}`;

    const selectedCategory = categories[type].find(c => c.name === category);

    addTransaction({
      amount: numericAmount,
      type,
      category,
      icon: selectedCategory?.icon,
      note,
      date: dateTime,
    });

    router.push('/');
  };

  return (
    <main className="main-content no-scrollbar">
      <header className="seabank-page-header">
        <Link href="/" className="seabank-header-back">
          <div style={{ transform: 'rotate(180deg)', display: 'flex' }}>
            <ChevronRightIcon />
          </div>
        </Link>
        <h1 className="seabank-page-title">{t('addTransaction')}</h1>
      </header>

      <form onSubmit={handleSubmit} className="transaction-form" style={{ marginTop: '20px' }}>
        <div className="type-toggle">
          <button 
            type="button"
            className={`toggle-btn ${type === 'expense' ? 'active expense' : ''}`}
            onClick={() => { setType('expense'); setCategory(''); setError(''); }}
          >
            {t('expense')}
          </button>
          <button 
            type="button"
            className={`toggle-btn ${type === 'income' ? 'active income' : ''}`}
            onClick={() => { setType('income'); setCategory(''); setError(''); }}
          >
            {t('income')}
          </button>
        </div>

        {error && (
          <div className="error-message-v2">
            <span>⚠️</span>
            {error}
          </div>
        )}

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
                onClick={() => handleCategorySelect(cat.name)}
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

        <div className="date-submit-row">
          <div className="input-group date-field-group">
            <label>{t('date')}</label>
            <input 
              type="date" 
              max={`${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}-${String(new Date().getDate()).padStart(2, '0')}`}
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="text-input date-input-inline"
              style={{ boxSizing: 'border-box' }}
            />
          </div>

          <button type="submit" className="submit-btn submit-btn-inline">
            {t('saveTransaction')}
          </button>
        </div>
      </form>
    </main>
  );
}
