"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLanguage } from '@/lib/contexts/LanguageContext';
import { HomeIcon, AddIcon, HistoryIcon, SettingsIcon } from './Icons';

const BottomNav = () => {
  const pathname = usePathname();
  const { t } = useLanguage();

  const navItems = [
    { label: t('dashboard'), path: '/', icon: (active: boolean) => <HomeIcon active={active} /> },
    { label: t('add'), path: '/add', icon: (active: boolean) => <AddIcon active={active} /> },
    { label: t('history'), path: '/history', icon: (active: boolean) => <HistoryIcon active={active} /> },
    { label: t('settings'), path: '/settings', icon: (active: boolean) => <SettingsIcon active={active} /> },
  ];

  return (
    <nav className="bottom-nav">
      {navItems.map((item) => {
        const isActive = pathname === item.path;
        return (
          <Link 
            key={item.path} 
            href={item.path}
            className={`nav-item ${isActive ? 'active' : ''}`}
            aria-label={item.label}
          >
            <div className="active-indicator"></div>
            <span className="nav-icon">{item.icon(isActive)}</span>
          </Link>
        );
      })}
      <style jsx>{`
        .bottom-nav {
          position: fixed;
          bottom: 24px;
          left: 50%;
          transform: translateX(-50%);
          width: calc(100% - 40px);
          max-width: 420px;
          height: 76px;
          background: rgba(var(--surface-elevated-rgb, 255, 255, 255), 0.7);
          backdrop-filter: blur(25px) saturate(180%);
          -webkit-backdrop-filter: blur(25px) saturate(180%);
          display: flex;
          justify-content: space-around;
          align-items: center;
          padding: 0 10px;
          border-radius: 28px;
          border: 1px solid rgba(255, 255, 255, 0.2);
          box-shadow: 0 15px 35px rgba(0, 0, 0, 0.15);
          z-index: 1000;
        }
        [data-theme='dark'] .bottom-nav {
          background: rgba(28, 28, 30, 0.6);
          border-color: rgba(255, 255, 255, 0.08);
          box-shadow: 0 15px 35px rgba(0, 0, 0, 0.4);
        }
        .nav-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          color: var(--text-secondary);
          transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);
          flex: 1;
          height: 100%;
          position: relative;
          text-decoration: none;
        }
        .nav-item.active {
          color: var(--foreground);
        }
        .nav-icon {
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          z-index: 2;
        }
        .nav-item.active .nav-icon {
          transform: scale(1.1);
        }
        .active-indicator {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 54px;
          height: 54px;
          background: var(--surface);
          border-radius: 18px;
          opacity: 0;
          transition: all 0.4s ease;
          z-index: 1;
        }
        .nav-item.active .active-indicator {
          opacity: 1;
          box-shadow: 0 8px 15px rgba(0,0,0,0.05);
          animation: badgePop 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        }
        @keyframes badgePop {
          0% { transform: translate(-50%, -50%) scale(0.5); opacity: 0; }
          100% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
        }
      `}</style>
    </nav>
  );
};

export default BottomNav;
