"use client";

import React, { useState, useMemo, Suspense, useCallback } from 'react';
import { useFinance, Transaction } from '@/lib/contexts/FinanceContext';
import { useLanguage } from '@/lib/contexts/LanguageContext';
import { WalletIcon, TrashIcon, ChevronDownIcon, DownloadIcon, ChevronRightIcon } from '@/components/Icons';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

type DateFilterType = 'today' | 'thisMonth' | 'thisYear' | 'period' | 'last30';

function HistoryContent() {
  const { transactions, deleteTransaction } = useFinance();
  const { t, language } = useLanguage();
  const searchParams = useSearchParams();
  const initialType = searchParams.get('type') as 'income' | 'expense' | null;
  
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>(initialType || 'all');
  const [dateFilter, setDateFilter] = useState<DateFilterType>('thisMonth');
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showExportPicker, setShowExportPicker] = useState(false);
  const [exportRange, setExportRange] = useState({ 
    start: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0] 
  });
  const [customRange, setCustomRange] = useState({ 
    start: new Date().toISOString().split('T')[0], 
    end: new Date().toISOString().split('T')[0] 
  });

  const formatCurrency = (amount: number) => {
    const formatted = new Intl.NumberFormat('id-ID', {
      minimumFractionDigits: 0,
    }).format(amount);
    return `Rp ${formatted}`;
  };

  const filteredTransactions = useMemo(() => {
    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    return transactions
      .filter(trans => {
        if (filterType !== 'all' && trans.type !== filterType) return false;

        const tDate = new Date(trans.date);
        const tDateStr = trans.date.split('T')[0];

        if (dateFilter === 'today') return tDateStr === todayStr;
        if (dateFilter === 'thisMonth') return tDate.getMonth() === currentMonth && tDate.getFullYear() === currentYear;
        if (dateFilter === 'thisYear') return tDate.getFullYear() === currentYear;
        if (dateFilter === 'period') return tDateStr >= customRange.start && tDateStr <= customRange.end;
        
        return true;
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [transactions, filterType, dateFilter, customRange]);

  const groupedTransactions = useMemo(() => {
    const groups: Record<string, Transaction[]> = {};
    filteredTransactions.forEach(trans => {
      const key = trans.date.split('T')[0];
      if (!groups[key]) groups[key] = [];
      groups[key].push(trans);
    });
    return groups;
  }, [filteredTransactions]);

  const formatDateHeader = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

    if (dateStr === today) return language === 'id' ? 'Hari Ini' : 'Today';
    if (dateStr === yesterday) return language === 'id' ? 'Kemarin' : 'Yesterday';

    return date.toLocaleDateString(language === 'id' ? 'id-ID' : 'en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const getGroupTotals = (items: Transaction[]) => {
    const income = items.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const expense = items.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
    return { income, expense };
  };

  const getDateFilterLabel = () => {
    if (dateFilter === 'period') return `${customRange.start} - ${customRange.end}`;
    return t(dateFilter);
  };

  const handleExportPNG = useCallback(() => {
    // Filter transactions by export period
    const exportTransactions = transactions
      .filter(trans => {
        const tDateStr = trans.date.split('T')[0];
        return tDateStr >= exportRange.start && tDateStr <= exportRange.end;
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    if (exportTransactions.length === 0) {
      alert(language === 'id' ? 'Tidak ada transaksi di periode ini' : 'No transactions in this period');
      return;
    }

    const totalIncome = exportTransactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
    const totalExpense = exportTransactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
    const balance = totalIncome - totalExpense;

    // Canvas setup
    const rowHeight = 44;
    const headerHeight = 200;
    const footerHeight = 100;
    const padding = 40;
    const canvasWidth = 800;
    const canvasHeight = headerHeight + (exportTransactions.length * rowHeight) + footerHeight + padding;

    const canvas = document.createElement('canvas');
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    const ctx = canvas.getContext('2d')!;

    // Background
    ctx.fillStyle = '#fafafa';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    // Header gradient
    const grad = ctx.createLinearGradient(0, 0, canvasWidth, 0);
    grad.addColorStop(0, '#E88EAB');
    grad.addColorStop(1, '#7EC8E3');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.roundRect(padding, padding, canvasWidth - padding * 2, 140, 20);
    ctx.fill();

    // Header text
    ctx.fillStyle = 'white';
    ctx.font = 'bold 22px -apple-system, BlinkMacSystemFont, sans-serif';
    ctx.fillText('Asisten Keuangan', padding + 24, padding + 40);
    ctx.font = '14px -apple-system, BlinkMacSystemFont, sans-serif';
    ctx.fillText(`${exportRange.start}  →  ${exportRange.end}`, padding + 24, padding + 65);

    // Summary in header
    ctx.font = 'bold 16px -apple-system, BlinkMacSystemFont, sans-serif';
    const summaryY = padding + 110;
    ctx.fillText(`${language === 'id' ? 'Pemasukan' : 'Income'}: ${formatCurrency(totalIncome)}`, padding + 24, summaryY);
    ctx.fillText(`${language === 'id' ? 'Pengeluaran' : 'Expense'}: ${formatCurrency(totalExpense)}`, padding + 320, summaryY);

    // Transactions list
    let y = headerHeight + 20;
    
    // Table header
    ctx.fillStyle = '#E88EAB';
    ctx.font = 'bold 13px -apple-system, BlinkMacSystemFont, sans-serif';
    ctx.fillText('No', padding, y);
    ctx.fillText(language === 'id' ? 'Tanggal' : 'Date', padding + 40, y);
    ctx.fillText(language === 'id' ? 'Keterangan' : 'Description', padding + 180, y);
    ctx.fillText(language === 'id' ? 'Tipe' : 'Type', padding + 440, y);
    ctx.fillText(language === 'id' ? 'Jumlah' : 'Amount', padding + 560, y);
    
    y += 8;
    ctx.strokeStyle = '#E88EAB';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(padding, y);
    ctx.lineTo(canvasWidth - padding, y);
    ctx.stroke();
    y += 16;

    exportTransactions.forEach((trans, index) => {
      // Zebra striping
      if (index % 2 === 0) {
        ctx.fillStyle = '#f5f5f5';
        ctx.fillRect(padding - 8, y - 14, canvasWidth - padding * 2 + 16, rowHeight);
      }
      
      ctx.font = '13px -apple-system, BlinkMacSystemFont, sans-serif';
      ctx.fillStyle = '#555';
      ctx.fillText(`${index + 1}`, padding, y + 6);

      const dateObj = new Date(trans.date);
      const dateStr = dateObj.toLocaleDateString(language === 'id' ? 'id-ID' : 'en-US', { day: '2-digit', month: 'short', year: 'numeric' });
      ctx.fillText(dateStr, padding + 40, y + 6);
      
      ctx.fillStyle = '#333';
      ctx.font = '13px -apple-system, BlinkMacSystemFont, sans-serif';
      const desc = (trans.note || trans.category).substring(0, 30);
      ctx.fillText(desc, padding + 180, y + 6);

      ctx.fillStyle = trans.type === 'income' ? '#7EC8E3' : '#E88EAB';
      ctx.font = 'bold 12px -apple-system, BlinkMacSystemFont, sans-serif';
      ctx.fillText(trans.type === 'income' ? (language === 'id' ? 'Masuk' : 'In') : (language === 'id' ? 'Keluar' : 'Out'), padding + 440, y + 6);
      
      const amountStr = `${trans.type === 'income' ? '+' : '-'} ${formatCurrency(trans.amount).replace('Rp ', '')}`;
      ctx.fillStyle = trans.type === 'income' ? '#7EC8E3' : '#E88EAB';
      ctx.font = 'bold 13px -apple-system, BlinkMacSystemFont, sans-serif';
      ctx.fillText(amountStr, padding + 560, y + 6);

      y += rowHeight;
    });

    // Footer - balance
    y += 16;
    ctx.strokeStyle = '#ddd';
    ctx.beginPath();
    ctx.moveTo(padding, y);
    ctx.lineTo(canvasWidth - padding, y);
    ctx.stroke();
    y += 30;
    
    const balGrad = ctx.createLinearGradient(padding + 440, 0, canvasWidth - padding, 0);
    balGrad.addColorStop(0, '#E88EAB');
    balGrad.addColorStop(1, '#7EC8E3');
    ctx.fillStyle = '#333';
    ctx.font = 'bold 15px -apple-system, BlinkMacSystemFont, sans-serif';
    ctx.fillText(language === 'id' ? 'Saldo:' : 'Balance:', padding + 440, y);
    ctx.fillStyle = balance >= 0 ? '#7EC8E3' : '#E88EAB';
    ctx.font = 'bold 15px -apple-system, BlinkMacSystemFont, sans-serif';
    ctx.fillText(formatCurrency(balance), padding + 560, y);

    // Watermark
    ctx.fillStyle = '#ccc';
    ctx.font = '11px -apple-system, BlinkMacSystemFont, sans-serif';
    ctx.fillText(`Dibuat oleh Asisten Keuangan • ${new Date().toLocaleDateString('id-ID')}`, padding, canvasHeight - 20);

    // Export to PNG and open
    const dataUrl = canvas.toDataURL('image/png');
    const newWindow = window.open();
    if (newWindow) {
      newWindow.document.write(`
        <html><head><title>Laporan Keuangan</title></head>
        <body style="margin:0;display:flex;justify-content:center;background:#f0f0f0;padding:20px">
          <img src="${dataUrl}" style="max-width:100%;box-shadow:0 4px 20px rgba(0,0,0,0.1);border-radius:12px" />
        </body></html>
      `);
    }
    setShowExportPicker(false);
  }, [transactions, exportRange, language, formatCurrency]);

  return (
    <main className="main-content animate-slide-up no-scrollbar" onClick={() => setShowTypeDropdown(false)}>
      <header className="seabank-page-header">
        <Link href="/" className="seabank-header-back">
          <div style={{ transform: 'rotate(180deg)', display: 'flex' }}>
            <ChevronRightIcon />
          </div>
        </Link>
        <h1 className="seabank-page-title">{t('history')}</h1>
        <button className="header-report-btn" onClick={() => setShowExportPicker(true)}>
          <DownloadIcon />
        </button>
      </header>

      <div className="history-filters">
        <div className="filter-item" onClick={() => setShowDatePicker(true)}>
          <span>{getDateFilterLabel()}</span>
          <ChevronDownIcon />
        </div>
        <div className="filter-divider"></div>
        
        <div className="filter-item" onClick={(e) => {
          e.stopPropagation();
          setShowTypeDropdown(!showTypeDropdown);
        }}>
          <span>{filterType === 'all' ? t('allTransactions') : t(filterType)}</span>
          <ChevronDownIcon />
          
          {showTypeDropdown && (
            <div className="filter-dropdown-v2">
              <button className={`dropdown-opt ${filterType === 'all' ? 'selected' : ''}`} onClick={() => setFilterType('all')}>{t('allTransactions')}</button>
              <button className={`dropdown-opt ${filterType === 'income' ? 'selected' : ''}`} onClick={() => setFilterType('income')}>{t('income')}</button>
              <button className={`dropdown-opt ${filterType === 'expense' ? 'selected' : ''}`} onClick={() => setFilterType('expense')}>{t('expense')}</button>
            </div>
          )}
        </div>
      </div>

      {/* Date Filter Picker */}
      {showDatePicker && (
        <div className="modal-overlay" onClick={() => setShowDatePicker(false)}>
          <div className="bottom-sheet" onClick={(e) => e.stopPropagation()}>
            <div className="sheet-header">
              <h2>{t('selectDate')}</h2>
              <button onClick={() => setShowDatePicker(false)} className="close-sheet-btn">✕</button>
            </div>
            <div className="sheet-option-list">
              <button className={`sheet-option ${dateFilter === 'today' ? 'selected' : ''}`} onClick={() => { setDateFilter('today'); setShowDatePicker(false); }}>{t('today')}</button>
              <button className={`sheet-option ${dateFilter === 'thisMonth' ? 'selected' : ''}`} onClick={() => { setDateFilter('thisMonth'); setShowDatePicker(false); }}>{t('thisMonth')}</button>
              <button className={`sheet-option ${dateFilter === 'thisYear' ? 'selected' : ''}`} onClick={() => { setDateFilter('thisYear'); setShowDatePicker(false); }}>{t('thisYear')}</button>
              <button className={`sheet-option ${dateFilter === 'period' ? 'selected' : ''}`} onClick={() => setDateFilter('period')}>{t('selectPeriod')}</button>
            </div>
            {dateFilter === 'period' && (
              <div className="period-picker-box">
                <div className="date-input-row">
                  <label>{t('startDate')}</label>
                  <input type="date" max={new Date().toISOString().split('T')[0]} value={customRange.start} onChange={(e) => setCustomRange({...customRange, start: e.target.value})} className="text-input" />
                </div>
                <div className="date-input-row">
                  <label>{t('endDate')}</label>
                  <input type="date" max={new Date().toISOString().split('T')[0]} value={customRange.end} onChange={(e) => setCustomRange({...customRange, end: e.target.value})} className="text-input" />
                </div>
                <button className="period-apply-btn" onClick={() => setShowDatePicker(false)}>Apply</button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Export Period Picker */}
      {showExportPicker && (
        <div className="modal-overlay" onClick={() => setShowExportPicker(false)}>
          <div className="bottom-sheet" onClick={(e) => e.stopPropagation()}>
            <div className="sheet-header">
              <h2>{language === 'id' ? 'Download Laporan' : 'Download Report'}</h2>
              <button onClick={() => setShowExportPicker(false)} className="close-sheet-btn">✕</button>
            </div>
            <p style={{ fontSize: '0.85rem', color: '#888', padding: '0 20px 12px', textAlign: 'center' }}>
              {language === 'id' ? 'Pilih periode untuk download semua transaksi' : 'Select period to download all transactions'}
            </p>
            <div className="period-picker-box">
              <div className="date-input-row">
                <label>{t('startDate')}</label>
                <input type="date" max={new Date().toISOString().split('T')[0]} value={exportRange.start} onChange={(e) => setExportRange({...exportRange, start: e.target.value})} className="text-input" />
              </div>
              <div className="date-input-row">
                <label>{t('endDate')}</label>
                <input type="date" max={new Date().toISOString().split('T')[0]} value={exportRange.end} onChange={(e) => setExportRange({...exportRange, end: e.target.value})} className="text-input" />
              </div>
              <button className="period-apply-btn" onClick={handleExportPNG} style={{ background: 'linear-gradient(135deg, #E88EAB, #7EC8E3)', color: 'white', fontWeight: 700 }}>
                📥 {language === 'id' ? 'Download PNG' : 'Download PNG'}
              </button>
            </div>
          </div>
        </div>
      )}

      <section className="grouped-history" style={{ paddingBottom: '40px' }}>
        {Object.keys(groupedTransactions).length === 0 ? (
          <div className="empty-state"><p>{t('noTransactionsHistory')}</p></div>
        ) : (
          Object.entries(groupedTransactions).map(([dateKey, items]) => {
            const totals = getGroupTotals(items);
            return (
              <div key={dateKey} className="month-group">
                <div className="month-header" style={{ paddingBottom: '8px' }}>
                  <span className="month-label">{formatDateHeader(dateKey)}</span>
                  <div className="month-totals">
                    {totals.expense > 0 && <span className="total-out">{t('out')}: {formatCurrency(totals.expense)}</span>}
                    {totals.income > 0 && <span className="total-in">{t('in')}: {formatCurrency(totals.income)}</span>}
                  </div>
                </div>
                <div className="transactions-card">
                  {items.map((trans) => (
                    <div key={trans.id} className="history-list-item">
                      <div className={`t-icon-circle ${trans.type}`}>
                        {trans.icon ? (
                          <span className="t-icon-emoji">{trans.icon}</span>
                        ) : (
                          <WalletIcon />
                        )}
                      </div>
                      <div className="t-description">
                        <p className="t-title">{trans.note || trans.category}</p>
                        <p className="t-meta">{trans.category}</p>
                        <p className="t-meta">
                          {new Date(trans.date).toLocaleDateString(language === 'id' ? 'id-ID' : 'en-US', { day: 'numeric', month: 'short', year: 'numeric' })}, {new Date(trans.date).toLocaleTimeString(language === 'id' ? 'id-ID' : 'en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}
                        </p>
                      </div>
                      <div className="t-right-side">
                        <div className={`t-amount-val ${trans.type}`}>{trans.type === 'income' ? '+' : '-'} {formatCurrency(trans.amount).replace('Rp ', '')}</div>
                        <button onClick={(e) => { e.stopPropagation(); confirm(t('deleteConfirm')) && deleteTransaction(trans.id); }} className="item-delete-btn"><TrashIcon /></button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })
        )}
      </section>
    </main>
  );
}

export default function History() {
  return (
    <Suspense fallback={<div className="main-content"><p>Loading...</p></div>}>
      <HistoryContent />
    </Suspense>
  );
}
