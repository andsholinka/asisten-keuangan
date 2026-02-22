"use client";

import React, { useState } from 'react';
import { useFinance } from '@/lib/contexts/FinanceContext';
import { useTheme } from '@/lib/contexts/ThemeContext';
import { useLanguage } from '@/lib/contexts/LanguageContext';
import { WalletIcon, TrashIcon, ChevronRightIcon } from '@/components/Icons';
import Link from 'next/link';

export default function Settings() {
  const { transactions, userProfile, updateProfile } = useFinance();
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(userProfile.name);

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

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateProfile({ image: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const saveName = () => {
    updateProfile({ name: tempName });
    setIsEditingName(false);
  };

  return (
    <main className="main-content animate-slide-up no-scrollbar">
      <header className="seabank-page-header">
        <Link href="/" className="seabank-header-back">
          <div style={{ transform: 'rotate(180deg)', display: 'flex' }}>
            <ChevronRightIcon />
          </div>
        </Link>
        <h1 className="seabank-page-title">{t('settings')}</h1>
      </header>

      <section className="settings-section">
        <div className="profile-card" style={{ marginTop: '16px' }}>
          <div className="profile-top">
            <div className="avatar-wrapper">
              {userProfile.image ? (
                <img src={userProfile.image} alt="Profile" className="avatar-img" />
              ) : (
                <div className="avatar-placeholder-large">
                  {userProfile.name.charAt(0)}
                </div>
              )}
              <label className="avatar-edit-badge">
                <input type="file" accept="image/*" onChange={handleImageUpload} hidden />
                📷
              </label>
            </div>
            
            <div className="name-edit-section">
              {isEditingName ? (
                <div className="name-input-row">
                  <input 
                    type="text" 
                    value={tempName} 
                    onChange={(e) => setTempName(e.target.value)}
                    className="name-input"
                    autoFocus
                  />
                  <button onClick={saveName} className="save-name-btn">Save</button>
                </div>
              ) : (
                <div className="name-display-row" onClick={() => setIsEditingName(true)}>
                  <h3>{userProfile.name}</h3>
                  <button className="edit-icon-btn">✏️</button>
                </div>
              )}
              <p className="user-id">ID: {Math.floor(100000 + Math.random() * 900000)}</p>
            </div>
          </div>
        </div>

        <div className="settings-list-v2">
          <div className="settings-category">
            <h4>{t('appearance')}</h4>
            <div className="settings-panel">
              <button className="panel-item" onClick={toggleTheme}>
                <div className="item-icon-box theme">
                  {theme === 'light' ? '🌙' : '☀️'}
                </div>
                <div className="item-text">
                  <p className="item-title">{theme === 'light' ? t('darkMode') : t('lightMode')}</p>
                </div>
                <div className={`toggle-switch ${theme === 'dark' ? 'active' : ''}`}>
                  <div className="switch-dot"></div>
                </div>
              </button>

              <div className="panel-item no-arrow">
                <div className="item-icon-box lang">🌐</div>
                <div className="item-text">
                  <p className="item-title">{t('language')}</p>
                </div>
                <div className="lang-selector">
                  <button 
                    className={`lang-opt ${language === 'id' ? 'active' : ''}`}
                    onClick={() => setLanguage('id')}
                  >ID</button>
                  <button 
                    className={`lang-opt ${language === 'en' ? 'active' : ''}`}
                    onClick={() => setLanguage('en')}
                  >EN</button>
                </div>
              </div>
            </div>
          </div>

          <div className="settings-category">
            <h4>{t('dataSecurity')}</h4>
            <div className="settings-panel">
              <button className="panel-item" onClick={handleExportData}>
                <div className="item-icon-box export"><WalletIcon /></div>
                <div className="item-text">
                  <p className="item-title">{t('exportData')}</p>
                  <p className="item-subtitle">Download backup data</p>
                </div>
                <ChevronRightIcon />
              </button>

              <button className="panel-item" onClick={handleClearData}>
                <div className="item-icon-box danger"><TrashIcon /></div>
                <div className="item-text">
                  <p className="item-title danger-text">{t('clearData')}</p>
                  <p className="item-subtitle">{t('clearDataConfirm')}</p>
                </div>
                <ChevronRightIcon />
              </button>
            </div>
          </div>

          <div className="settings-category">
            <h4>{t('aboutApp')}</h4>
            <div className="settings-panel">
              <div className="panel-item no-arrow">
                <div className="item-icon-box info">📱</div>
                <div className="item-text">
                  <p className="item-title">{t('version')} 2.0.0</p>
                  <p className="item-subtitle">Made with ❤️</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
