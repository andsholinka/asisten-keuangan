"use client";

import React, { useState } from 'react';
import { useFinance } from '@/lib/contexts/FinanceContext';
import { useLanguage } from '@/lib/contexts/LanguageContext';
import SpendingChart from '@/components/SpendingChart';
// We import these but use them specifically
import { WalletIcon, EyeIcon, EyeOffIcon, ChevronRightIcon, SettingsIcon, AddIcon } from '@/components/Icons';
import Link from 'next/link';

/**
 * DASHBOARD PAGE - UPDATED VERSION
 * - Removed BottomNav
 * - Added Floating Action Button (FAB)
 * - 5 Recent Transactions
 * - Settings in top right
 * - No Search/Bell icons
 */
export default function Dashboard() {
  const { balance, totalIncome, totalExpense, transactions, userProfile } = useFinance();
  const { t, language } = useLanguage();
  const [showBalance, setShowBalance] = useState(true);

  const formatCurrency = (amount: number) => {
    const formatted = new Intl.NumberFormat('id-ID', {
      minimumFractionDigits: 0,
    }).format(amount);
    return `Rp ${formatted}`;
  };

  return (
    <main className="main-content no-scrollbar">
      {/* Top Profile Bar - Settings moved to right, search/bell removed */}
      <header className="profile-header">
        <div className="profile-info">
          <div className="avatar">
            {userProfile.image ? (
              <img src={userProfile.image} alt="Profile" />
            ) : (
              <div className="avatar-placeholder">
                {userProfile.name.charAt(0)}
              </div>
            )}
          </div>
          <div className="user-details">
            <h3>{userProfile.name}</h3>
            <p className="privacy-badge-v2">🔒 {t('privacyNoteHeader')}</p>
          </div>
        </div>
        <div className="header-actions">
          <Link href="/settings" className="icon-action-btn" id="settings-button-top">
            <SettingsIcon active={true} />
          </Link>
        </div>
      </header>

      {/* Orange Header Card */}
      <div className="seabank-header">
        <div className="header-top-row">
          <div className="balance-info">
            <div className="label-row" onClick={() => setShowBalance(!showBalance)}>
              <span>{t('totalBalance')}</span>
              {showBalance ? <EyeIcon /> : <EyeOffIcon />}
            </div>
            <h2 className="balance-text">
              {showBalance ? formatCurrency(balance) : 'Rp ••••••••'}
            </h2>
          </div>
          <Link href="/history" className="history-quick-link">
            {t('history')} <ChevronRightIcon />
          </Link>
        </div>

        <div className="seabank-stats">
          <Link href="/history?type=income" className="stat-col">
            <div className="stat-label-item">
              <span>{t('income')}</span>
              <ChevronRightIcon />
            </div>
            <p className="stat-amount">
              {showBalance ? formatCurrency(totalIncome) : 'Rp ••••••••'}
            </p>
          </Link>
          <Link href="/history?type=expense" className="stat-col">
            <div className="stat-label-item">
              <span>{t('expense')}</span>
              <ChevronRightIcon />
            </div>
            <p className="stat-amount">
              {showBalance ? formatCurrency(totalExpense) : 'Rp ••••••••'}
            </p>
          </Link>
        </div>
      </div>

      {/* Comparison Chart Section */}
      <section className="white-section chart-card">
        <div className="section-title-row">
          <h3>{t('spendingCategory')}</h3>
        </div>
        <SpendingChart />
      </section>

      {/* Recent Transactions Section - Extended to 5 items */}
      <section className="white-section history-card">
        <Link href="/history" className="section-header-link">
          <h3>{t('recentTransactions')}</h3>
          <ChevronRightIcon />
        </Link>

        {transactions.length === 0 ? (
          <div className="empty-state">
            <p>{t('noTransactions')}</p>
          </div>
        ) : (
          <div className="mini-transaction-list">
            {transactions.slice(0, 5).map((trans) => (
              <div key={trans.id} className="mini-t-item">
                <div className={`t-icon-indicator ${trans.type}`}>
                  {trans.icon ? (
                    <span className="t-icon-emoji">{trans.icon}</span>
                  ) : (
                    <WalletIcon />
                  )}
                </div>
                <div className="t-main-info">
                  <p className="t-note-text">{trans.note || trans.category}</p>
                  <p className="t-subtext">{trans.category}</p>
                  <p className="t-subtext">
                    {new Date(trans.date).toLocaleDateString(language === 'id' ? 'id-ID' : 'en-US', { day: 'numeric', month: 'short', year: 'numeric' })}, {new Date(trans.date).toLocaleTimeString(language === 'id' ? 'id-ID' : 'en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}
                  </p>
                </div>
                <div className={`t-amount-text ${trans.type}`}>
                  {trans.type === 'income' ? '+' : '-'} {formatCurrency(trans.amount).replace('Rp ', '')}
                </div>
              </div>
            ))}
          </div>
        )}
        
      </section>

      {/* Floating Action Button - FIXED BOTTOM RIGHT */}
      <div className="fab-container">
        <div className="fab-pulse"></div>
        <Link href="/add" className="fab-button" id="fab-add-txn">
          <AddIcon active={true} />
        </Link>
      </div>
      
      {/* NO BottomNav HERE */}
    </main>
  );
}
