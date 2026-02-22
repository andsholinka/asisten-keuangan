"use client";

import React, { useState, useEffect } from 'react';
import { usePWA } from '@/lib/contexts/PWAContext';
import { useLanguage } from '@/lib/contexts/LanguageContext';

const InstallNotification = () => {
  const { isInstallable, isIOS, installApp } = usePWA();
  const { language } = useLanguage();
  const [isVisible, setIsVisible] = useState(false);
  const [showIOSModal, setShowIOSModal] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const wasDismissed = sessionStorage.getItem('install-dismissed');
    if (wasDismissed) {
      setDismissed(true);
      return;
    }

    if (isInstallable && !dismissed) {
      const timer = setTimeout(() => {
        if (isIOS) {
          setShowIOSModal(true);
        } else {
          setIsVisible(true);
        }
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isInstallable, isIOS, dismissed]);

  const handleDismiss = () => {
    setIsVisible(false);
    setShowIOSModal(false);
    setDismissed(true);
    sessionStorage.setItem('install-dismissed', 'true');
  };

  return (
    <>
      {/* Android / Chrome Install Banner */}
      {isVisible && !isIOS && (
        <div className="install-banner">
          <div className="install-content">
            <div className="install-icon-wrapper">
              <img src="/icon-192x192.png" alt="App Icon" className="app-logo" />
            </div>
            <div className="install-text">
              <p className="install-title">
                {language === 'id' ? 'Pasang Aplikasi' : 'Install App'}
              </p>
              <p className="install-desc">
                {language === 'id' ? 'Akses lebih cepat & offline' : 'Faster access & offline'}
              </p>
            </div>
          </div>
          <div className="install-actions">
            <button className="btn-close" onClick={handleDismiss}>
              {language === 'id' ? 'Nanti' : 'Later'}
            </button>
            <button className="btn-install" onClick={installApp}>
              {language === 'id' ? 'Pasang' : 'Install'}
            </button>
          </div>
        </div>
      )}

      {/* iOS Install Guide Modal */}
      {showIOSModal && (
        <div className="ios-modal-overlay" onClick={handleDismiss}>
          <div className="ios-modal" onClick={(e) => e.stopPropagation()}>
            <p className="ios-modal-intro">
              {language === 'id' 
                ? 'Install aplikasi ini di perangkat kamu untuk akses secara offline.'
                : 'Install this app on your device for offline access.'}
            </p>

            <div className="ios-steps-card">
              <p className="ios-steps-title">
                {language === 'id' ? 'Cara Install di iOS:' : 'How to Install on iOS:'}
              </p>
              
              <div className="ios-step">
                <span className="ios-step-num">1</span>
                <p className="ios-step-text">
                  {language === 'id' 
                    ? <>Tap tombol <span className="ios-icon-inline">⬆</span> <strong>Bagikan</strong> di bar bawah browser.</>
                    : <>Tap the <span className="ios-icon-inline">⬆</span> <strong>Share</strong> button in the bottom bar.</>}
                </p>
              </div>
              
              <div className="ios-step">
                <span className="ios-step-num">2</span>
                <p className="ios-step-text">
                  {language === 'id'
                    ? <>Geser ke bawah & pilih <span className="ios-icon-inline">＋</span> <strong>Tambah ke Layar Utama</strong>.</>
                    : <>Scroll down & tap <span className="ios-icon-inline">＋</span> <strong>Add to Home Screen</strong>.</>}
                </p>
              </div>
            </div>

            <button className="ios-dismiss-btn" onClick={handleDismiss}>
              {language === 'id' ? 'Nanti Saja' : 'Maybe Later'}
            </button>
          </div>
        </div>
      )}

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
          flex-shrink: 0;
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
          background: var(--primary-gradient);
          color: white;
          padding: 8px 16px;
          border-radius: 8px;
          font-size: 0.8rem;
          font-weight: 700;
          border: none;
          white-space: nowrap;
        }

        /* iOS Modal */
        .ios-modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.5);
          z-index: 10000;
          display: flex;
          align-items: flex-end;
          justify-content: center;
          animation: fadeIn 0.3s ease;
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .ios-modal {
          width: 100%;
          max-width: 440px;
          background: var(--surface-elevated);
          border-radius: 24px 24px 0 0;
          padding: 32px 24px;
          animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
        @keyframes slideUp {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
        .ios-modal-intro {
          text-align: center;
          font-size: 0.9rem;
          color: var(--text-secondary);
          line-height: 1.5;
          margin-bottom: 24px;
        }
        .ios-steps-card {
          background: var(--surface-secondary);
          border-radius: 16px;
          padding: 20px;
          margin-bottom: 24px;
        }
        .ios-steps-title {
          font-weight: 700;
          font-size: 0.95rem;
          color: var(--text-main);
          margin-bottom: 16px;
        }
        .ios-step {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          margin-bottom: 14px;
        }
        .ios-step:last-child {
          margin-bottom: 0;
        }
        .ios-step-num {
          width: 28px;
          height: 28px;
          border-radius: 8px;
          background: var(--surface);
          border: 1px solid var(--border);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 0.8rem;
          color: var(--text-secondary);
          flex-shrink: 0;
        }
        .ios-step-text {
          font-size: 0.9rem;
          color: var(--text-main);
          line-height: 1.5;
          padding-top: 3px;
        }
        .ios-icon-inline {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 22px;
          height: 22px;
          border-radius: 5px;
          border: 1px solid var(--border);
          font-size: 0.7rem;
          vertical-align: middle;
          margin: 0 2px;
        }
        .ios-dismiss-btn {
          display: block;
          width: 100%;
          text-align: center;
          padding: 14px;
          font-size: 1rem;
          font-weight: 600;
          color: var(--text-secondary);
          background: none;
          border: none;
        }
      `}</style>
    </>
  );
};

export default InstallNotification;
