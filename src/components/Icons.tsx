import React from 'react';

const IconGradients = () => (
  <defs>
    {/* Home: Orange-Pink Sun */}
    <linearGradient id="grad-home-main" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stopColor="#FF6B6B" />
      <stop offset="100%" stopColor="#FFE66D" />
    </linearGradient>
    {/* Add: Ocean Blue */}
    <linearGradient id="grad-add-main" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stopColor="#4facfe" />
      <stop offset="100%" stopColor="#00f2fe" />
    </linearGradient>
    {/* History: Purple Magic */}
    <linearGradient id="grad-history-main" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stopColor="#a18cd1" />
      <stop offset="100%" stopColor="#fbc2eb" />
    </linearGradient>
    {/* Settings: Minty Fresh */}
    <linearGradient id="grad-settings-main" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stopColor="#43e97b" />
      <stop offset="100%" stopColor="#38f9d7" />
    </linearGradient>
    
    <filter id="soft-shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="1.5" result="blur" />
      <feOffset dx="0" dy="2" result="offsetBlur" />
      <feMerge>
        <feMergeNode in="offsetBlur" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>
  </defs>
);

export const HomeIcon = ({ active }: { active?: boolean }) => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <IconGradients />
    <g filter={active ? "url(#soft-shadow)" : "none"}>
      <path 
        d="M21 12L12 3L3 12V21H21V12Z" 
        fill={active ? "url(#grad-home-main)" : "#D1D1D6"} 
      />
      <path 
        d="M9 21V15H15V21" 
        fill="white" 
        fillOpacity="0.8"
      />
      <path 
        d="M21 12L12 3L3 12" 
        stroke="white" 
        strokeWidth="1.5" 
        strokeLinecap="round" 
        strokeLinejoin="round"
        opacity={active ? "0.6" : "0"}
      />
    </g>
  </svg>
);

export const AddIcon = ({ active }: { active?: boolean }) => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <IconGradients />
    <g filter={active ? "url(#soft-shadow)" : "none"}>
      <rect 
        x="3" y="3" width="18" height="18" rx="9" 
        fill={active ? "url(#grad-add-main)" : "#D1D1D6"} 
      />
      <path 
        d="M12 8V16M8 12H16" 
        stroke="white" 
        strokeWidth="3" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
    </g>
  </svg>
);

export const HistoryIcon = ({ active }: { active?: boolean }) => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <IconGradients />
    <g filter={active ? "url(#soft-shadow)" : "none"}>
      <circle 
        cx="12" cy="12" r="10" 
        fill={active ? "url(#grad-history-main)" : "#D1D1D6"} 
      />
      <path 
        d="M12 7V12H16" 
        stroke="white" 
        strokeWidth="2.5" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
      <circle cx="12" cy="12" r="3" stroke="white" strokeOpacity="0.3" strokeWidth="4"/>
    </g>
  </svg>
);

export const SettingsIcon = ({ active }: { active?: boolean }) => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <IconGradients />
    <g filter={active ? "url(#soft-shadow)" : "none"}>
      <path 
        d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" 
        fill={active ? "url(#grad-settings-main)" : "#D1D1D6"}
      />
      <path 
        fillRule="evenodd" clipRule="evenodd" 
        d="M19.4 15c.31.53.25 1.25-.33 1.82l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" 
        fill={active ? "url(#grad-settings-main)" : "#D1D1D6"}
        fillOpacity="0.4"
      />
    </g>
  </svg>
);

export const WalletIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M19 7V19C19 20.1046 18.1046 21 17 21H5C3.89543 21 3 20.1046 3 19V5C3 3.89543 3.89543 3 5 3H17C18.1046 3 19 3.89543 19 5V7H14C12.8954 7 12 7.89543 12 9V11C12 12.1046 12.8954 13 14 13H19V15M19 7V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="16" cy="10" r="1" fill="currentColor"/>
  </svg>
);

export const IncomeIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 19V5M12 19L5 12M12 19L19 12" stroke="#34c759" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const ExpenseIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 5V19M12 5L5 12M12 5L19 12" stroke="#ff3b30" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const TrashIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"></polyline>
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
    <line x1="10" y1="11" x2="10" y2="17"></line>
    <line x1="14" y1="11" x2="14" y2="17"></line>
  </svg>
);
