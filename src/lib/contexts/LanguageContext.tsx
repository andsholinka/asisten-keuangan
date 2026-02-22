"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'id' | 'en';

interface Translations {
  [key: string]: {
    [key in Language]: string;
  };
}

export const translations: Translations = {
  // Common
  appName: { id: 'Asisten Keuangan', en: 'Asisten Keuangan' },
  welcome: { id: 'Selamat Datang', en: 'Welcome' },
  privacyNoteHeader: { id: 'semua data hanya tersimpan di HP kamu,', en: 'all data is only stored on your phone,' },
  privacyNoteForm: { id: 'Data ini hanya akan disimpan di HP kamu secara lokal.', en: 'This data will only be stored locally on your phone.' },
  
  // Navigation
  dashboard: { id: 'Beranda', en: 'Dashboard' },
  add: { id: 'Tambah', en: 'Add' },
  history: { id: 'Riwayat', en: 'History' },
  settings: { id: 'Pengaturan', en: 'Settings' },
  
  // Dashboard
  totalBalance: { id: 'Total Saldo', en: 'Total Balance' },
  income: { id: 'Pemasukan', en: 'Income' },
  expense: { id: 'Pengeluaran', en: 'Expense' },
  recentTransactions: { id: 'Transaksi Terakhir', en: 'Recent Transactions' },
  viewAll: { id: 'Liat Semua', en: 'View All' },
  noTransactions: { id: 'Belum ada transaksi', en: 'No transactions yet' },
  spendingCategory: { id: 'Top Pengeluaran', en: 'Top Spending' },
  spendingDistribution: { id: 'Distribusi Pengeluaran', en: 'Spending Distribution' },
  
  // Add Transaction
  addTransaction: { id: 'Tambah Transaksi', en: 'Add Transaction' },
  nominal: { id: '💰 Berapa jumlahnya?', en: '💰 How much?' },
  category: { id: '🏷️ Buat apa nih?', en: '🏷️ What for?' },
  noteOptional: { id: '📝 Mau dikasih catatan?', en: '📝 Any notes?' },
  notePlaceholder: { id: 'Tulis keterangan di sini...', en: 'Write a note here...' },
  date: { id: '📅 Kapan transaksinya?', en: '📅 When was it?' },
  saveTransaction: { id: 'Simpan Transaksi', en: 'Save Transaction' },
  nominalRequired: { id: 'Isi dulu nominalnya ya 😊', en: 'Please enter the amount 😊' },
  categoryRequired: { id: 'Pilih kategori dulu ya 😊', en: 'Please select a category 😊' },
  
  // History
  noTransactionsHistory: { id: 'Belum ada riwayat transaksi', en: 'No transaction history yet' },
  deleteConfirm: { id: 'Hapus transaksi ini?', en: 'Delete this transaction?' },
  delete: { id: 'Hapus', en: 'Delete' },
  viewAllTransactions: { id: 'Transaksi lainnya', en: 'View all transactions' },
  last30Days: { id: '30 Hari Terakhir', en: 'Last 30 Days' },
  today: { id: 'Hari Ini', en: 'Today' },
  thisMonth: { id: 'Bulan Ini', en: 'This Month' },
  thisYear: { id: 'Tahun Ini', en: 'This Year' },
  selectPeriod: { id: 'Pilih Periode', en: 'Select Period' },
  selectDate: { id: 'Pilih Tanggal', en: 'Select Date' },
  startDate: { id: 'Tanggal Mulai', en: 'Start Date' },
  endDate: { id: 'Tanggal Selesai', en: 'End Date' },
  allTransactions: { id: 'Semua Transaksi', en: 'All Transactions' },
  monthlySummary: { id: 'Ringkasan Bulanan', en: 'Monthly Summary' },
  out: { id: 'Keluar', en: 'Out' },
  in: { id: 'Masuk', en: 'In' },
  
  // Settings
  localUser: { id: 'Asisten Keuangan', en: 'Asisten Keuangan' },
  storedOnDevice: { id: 'Data disimpan di perangkat ini', en: 'Data stored on this device' },
  appearance: { id: 'Tampilan', en: 'Appearance' },
  darkMode: { id: 'Mode Gelap', en: 'Dark Mode' },
  lightMode: { id: 'Mode Terang', en: 'Light Mode' },
  active: { id: 'Aktif', en: 'Active' },
  inactive: { id: 'Nonaktif', en: 'Inactive' },
  language: { id: 'Bahasa', en: 'Language' },
  dataSecurity: { id: 'Data & Keamanan', en: 'Data & Security' },
  exportData: { id: 'Ekspor Data (Backup)', en: 'Export Data (Backup)' },
  clearData: { id: 'Hapus Semua Data', en: 'Clear All Data' },
  aboutApp: { id: 'Tentang Aplikasi', en: 'About App' },
  version: { id: 'Versi', en: 'Version' },
  privacyOffline: { id: 'Privasi: 100% Offline', en: 'Privacy: 100% Offline' },
  clearDataConfirm: { id: 'Hapus semua data keuangan Anda? Tindakan ini tidak dapat dibatalkan.', en: 'Delete all your financial data? This action cannot be undone.' },
  
  // Categories
  makanan: { id: 'Makanan', en: 'Food' },
  transport: { id: 'Transport', en: 'Transport' },
  belanja: { id: 'Belanja', en: 'Shopping' },
  hiburan: { id: 'Hiburan', en: 'Entertainment' },
  kesehatan: { id: 'Kesehatan', en: 'Health' },
  lainnya: { id: 'Lainnya', en: 'Others' },
  gaji: { id: 'Gaji', en: 'Salary' },
  bonus: { id: 'Bonus', en: 'Bonus' },
  investasi: { id: 'Investasi', en: 'Investment' },

  // PWA
  installApp: { id: 'Pasang Aplikasi', en: 'Install App' },
  installDesc: { id: 'Akses lebih cepat & offline', en: 'Faster access & offline' },
  later: { id: 'Nanti', en: 'Later' },
  install: { id: 'Pasang', en: 'Install' },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('id');

  useEffect(() => {
    const savedLang = localStorage.getItem('asisten_keuangan_lang') as Language;
    if (savedLang) {
      setLanguageState(savedLang);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('asisten_keuangan_lang', lang);
  };

  const t = (key: string) => {
    if (!translations[key]) return key;
    return translations[key][language];
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
