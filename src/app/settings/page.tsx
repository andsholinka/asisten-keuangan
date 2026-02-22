"use client";

import React from 'react';
import { useFinance } from '@/lib/contexts/FinanceContext';
import { useTheme } from '@/lib/contexts/ThemeContext';
import { useLanguage } from '@/lib/contexts/LanguageContext';
import BottomNav from '@/components/BottomNav';
import { SettingsIcon, WalletIcon, HistoryIcon, AddIcon } from '@/components/Icons';

export default function Settings() {
  const { transactions } = useFinance();
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();

  const handleClearData = () => {
    if (confirm(t('clearDataConfirm'))) {
      localStorage.removeItem('asisten_keuangan_data');
      window.location.reload();
    }
  };

  const handleExportData = () => {
    const data = JSON.stringify(transactions, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `asisten_keuangan_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <main className="main-content animate-slide-up">
      <header className="page-header">
        <h1>{t('settings')}</h1>
      </header>

      <section className="settings-section">
        <div className="profile-brief">
          <div className="avatar">
            <SettingsIcon />
          </div>
          <div className="user-info">
            <h3>{t('localUser')}</h3>
            <p className="text-secondary">{t('storedOnDevice')}</p>
          </div>
        </div>

        <div className="settings-list">
          <div className="settings-group">
            <h4>{t('appearance')}</h4>
            <button className="settings-item" onClick={toggleTheme}>
              <span className="item-icon">{theme === 'light' ? '🌙' : '☀️'}</span>
              <span className="item-label">
                {theme === 'light' ? t('darkMode') : t('lightMode')}
              </span>
              <span className="item-status">{theme === 'light' ? t('inactive') : t('active')}</span>
            </button>
            <div className="settings-item-static">
              <span className="item-icon">🌐</span>
              <span className="item-label">{t('language')}</span>
              <div className="lang-toggle">
                <button 
                  className={`lang-btn ${language === 'id' ? 'active' : ''}`}
                  onClick={() => setLanguage('id')}
                >
                  ID
                </button>
                <button 
                  className={`lang-btn ${language === 'en' ? 'active' : ''}`}
                  onClick={() => setLanguage('en')}
                >
                  EN
                </button>
              </div>
            </div>
          </div>

          <div className="settings-group">
            <h4>{t('dataSecurity')}</h4>
            <button className="settings-item" onClick={handleExportData}>
              <span className="item-icon"><WalletIcon /></span>
              <span className="item-label">{t('exportData')}</span>
            </button>
            <button className="settings-item" onClick={handleClearData}>
              <span className="item-icon danger-icon"><HistoryIcon /></span>
              <span className="item-label danger">{t('clearData')}</span>
            </button>
          </div>

          <div className="settings-group">
            <h4>{t('aboutApp')}</h4>
            <div className="settings-item-static">
              <span className="item-icon">📱</span>
              <span className="item-label">{t('version')} 1.0.0 (PWA Ready)</span>
            </div>
            <div className="settings-item-static">
              <span className="item-icon">🛡️</span>
              <span className="item-label">{t('privacyOffline')}</span>
            </div>
          </div>
        </div>
      </section>

      <BottomNav />

      <style jsx>{`
        .page-header {
          margin-bottom: 32px;
        }
        .profile-brief {
          display: flex;
          align-items: center;
          gap: 20px;
          padding: 24px;
          background: var(--surface-elevated);
          border-radius: var(--radius);
          margin-bottom: 32px;
          border: 1px solid var(--border);
        }
        .avatar {
          width: 64px;
          height: 64px;
          background: var(--surface);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2rem;
        }
        .user-info h3 {
          font-size: 1.2rem;
          margin-bottom: 4px;
        }
        .settings-group {
          margin-bottom: 24px;
        }
        .settings-group h4 {
          font-size: 0.8rem;
          color: var(--text-secondary);
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-bottom: 12px;
          padding-left: 8px;
        }
        .settings-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .settings-item, .settings-item-static {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 16px;
          background: var(--surface);
          border-radius: 16px;
          text-align: left;
          border: 1px solid transparent;
        }
        .settings-item:active {
          background: var(--surface-elevated);
          border-color: var(--border);
        }
        .item-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--primary);
        }
        .item-icon :global(svg) {
          width: 20px;
          height: 20px;
        }
        .item-icon.danger-icon {
          color: var(--danger);
        }
        .item-label {
          font-weight: 500;
          font-size: 1rem;
        }
        .item-label.danger {
          color: var(--danger);
        }
        .item-status {
          margin-left: auto;
          font-size: 0.8rem;
          color: var(--primary);
          font-weight: 600;
        }
        .lang-toggle {
          margin-left: auto;
          display: flex;
          background: var(--surface-elevated);
          padding: 2px;
          border-radius: 8px;
          border: 1px solid var(--border);
        }
        .lang-btn {
          padding: 4px 12px;
          border-radius: 6px;
          font-size: 0.75rem;
          font-weight: 700;
          color: var(--text-secondary);
        }
        .lang-btn.active {
          background: var(--primary);
          color: white;
        }
      `}</style>
    </main>
  );
}
