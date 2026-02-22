"use client";

import React, { useState, useEffect } from 'react';
import { usePWA } from '@/lib/contexts/PWAContext';
import { useLanguage } from '@/lib/contexts/LanguageContext';

const InstallNotification = () => {
  const { isInstallable, installApp } = usePWA();
  const { t } = useLanguage();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isInstallable) {
      // Delay slightly for better UX
      const timer = setTimeout(() => setIsVisible(true), 2000);
      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
    }
  }, [isInstallable]);

  if (!isVisible) return null;

  return (
    <div className="install-banner">
      <div className="install-content">
        <div className="install-icon-wrapper">
          <img src="/app_icon.png" alt="App Icon" className="app-logo" />
        </div>
        <div className="install-text">
          <p className="install-title">{t('installApp')}</p>
          <p className="install-desc">{t('installDesc')}</p>
        </div>
      </div>
      <div className="install-actions">
        <button className="btn-close" onClick={() => setIsVisible(false)}>{t('later')}</button>
        <button className="btn-install" onClick={installApp}>{t('install')}</button>
      </div>
      <style jsx>{`
        .install-banner {
          position: fixed;
          top: 20px;
          left: 50%;
          transform: translateX(-50%);
          width: calc(100% - 40px);
          max-width: 440px;
          background: var(--surface-elevated);
          border: 1px solid var(--primary);
          border-radius: 16px;
          padding: 16px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          box-shadow: var(--shadow-lg);
          z-index: 9999;
          animation: slideDown 0.5s cubic-bezier(0.16, 1, 0.3, 1);
        }
        @keyframes slideDown {
          from { transform: translate(-50%, -100%); opacity: 0; }
          to { transform: translate(-50%, 0); opacity: 1; }
        }
        .install-content {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .install-icon-wrapper {
          width: 44px;
          height: 44px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 10px;
          overflow: hidden;
          background: var(--surface);
          border: 1px solid var(--border);
        }
        .app-logo {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .install-title {
          font-weight: 700;
          font-size: 0.9rem;
        }
        .install-desc {
          font-size: 0.75rem;
          color: var(--text-secondary);
        }
        .install-actions {
          display: flex;
          gap: 8px;
        }
        .btn-close {
          font-size: 0.8rem;
          font-weight: 600;
          color: var(--text-secondary);
          padding: 8px 12px;
          background: none;
          border: none;
        }
        .btn-install {
          background: var(--primary);
          color: white;
          padding: 8px 16px;
          border-radius: 8px;
          font-size: 0.8rem;
          font-weight: 700;
          border: none;
        }
      `}</style>
    </div>
  );
};

export default InstallNotification;
