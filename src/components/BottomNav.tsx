"use client";

import React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useLanguage } from '@/lib/contexts/LanguageContext';
import { HomeIcon, AddIcon, SettingsIcon } from './Icons';

const BottomNav = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { t } = useLanguage();

  return (
    <nav className="bottom-nav">
      <div className="nav-content">
        {/* Dashboard Item */}
        <button 
          onClick={() => router.push('/')}
          className={`nav-item ${pathname === '/' ? 'active' : ''}`}
        >
          <HomeIcon active={pathname === '/'} />
          <span>{t('dashboard')}</span>
        </button>

        {/* Central Large Add Button */}
        <div className="center-button-wrapper" onClick={() => router.push('/add')}>
          <div className="center-btn-pulse"></div>
          <button 
            className={`add-center-btn ${pathname === '/add' ? 'active' : ''}`}
            aria-label={t('add')}
          >
            <AddIcon active={true} />
          </button>
          <span className="add-label">{t('add')}</span>
        </div>

        {/* Settings Item */}
        <button 
          onClick={() => router.push('/settings')}
          className={`nav-item ${pathname === '/settings' ? 'active' : ''}`}
        >
          <SettingsIcon active={pathname === '/settings'} />
          <span>{t('settings')}</span>
        </button>
      </div>
    </nav>
  );
};

export default BottomNav;
