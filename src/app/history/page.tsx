// src/app/history/page.tsx

"use client";

import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { useFinance, Transaction } from '@/lib/contexts/FinanceContext';
import { useLanguage } from '@/lib/contexts/LanguageContext';
import { WalletIcon, TrashIcon, ChevronDownIcon, DownloadIcon, ChevronRightIcon } from '@/components/Icons';
import Link from 'next/link';

type DateFilterType = 'today' | 'thisMonth' | 'thisYear' | 'period' | 'last30';

export default function History() {
  const { transactions, deleteTransaction } = useFinance();
  const { t, language } = useLanguage();
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all');
  const [dateFilter, setDateFilter] = useState<DateFilterType>('thisMonth');
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showExportPicker, setShowExportPicker] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null); // State untuk menyimpan hasil gambar laporan
  const [exportRange, setExportRange] = useState({ 
    start: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0] 
  });
  const [customRange, setCustomRange] = useState({ 
    start: new Date().toISOString().split('T')[0], 
    end: new Date().toISOString().split('T')[0] 
  });

  useEffect(() => {
    const typeParam = new URLSearchParams(window.location.search).get('type');
    if (typeParam === 'income' || typeParam === 'expense') {
      setFilterType(typeParam);
    }
  }, []);

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

    // Canvas setup untuk ukuran mobile (lebar 400px)
    const rowHeight = 44;
    const headerHeight = 180;
    const footerHeight = 80;
    const padding = 20;
    const canvasWidth = 400;
    const canvasHeight = headerHeight + (exportTransactions.length * rowHeight) + footerHeight + padding;

    const canvas = document.createElement('canvas');
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    const ctx = canvas.getContext('2d')!;

    // Background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    // Header gradient card
    const grad = ctx.createLinearGradient(0, 0, canvasWidth, 0);
    grad.addColorStop(0, '#E88EAB');
    grad.addColorStop(1, '#7EC8E3');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.roundRect(padding, padding, canvasWidth - padding * 2, 120, 16);
    ctx.fill();

    // Header text
    ctx.fillStyle = 'white';
    ctx.font = 'bold 20px -apple-system, BlinkMacSystemFont, sans-serif';
    ctx.fillText('Asisten Keuangan', padding + 16, padding + 36);
    ctx.font = '12px -apple-system, BlinkMacSystemFont, sans-serif';
    ctx.fillText(`${exportRange.start}  →  ${exportRange.end}`, padding + 16, padding + 56);

    // Summary in header
    ctx.font = 'bold 13px -apple-system, BlinkMacSystemFont, sans-serif';
    const summaryY = padding + 94;
    ctx.fillText(`${language === 'id' ? 'Masuk' : 'In'}: ${formatCurrency(totalIncome)}`, padding + 16, summaryY);
    ctx.fillText(`${language === 'id' ? 'Keluar' : 'Out'}: ${formatCurrency(totalExpense)}`, padding + 170, summaryY);

    // Transactions list
    let y = headerHeight + 10;
    
    // Table header
    ctx.fillStyle = '#E88EAB';
    ctx.font = 'bold 12px -apple-system, BlinkMacSystemFont, sans-serif';
    ctx.fillText(language === 'id' ? 'Tgl' : 'Date', padding, y);
    ctx.fillText(language === 'id' ? 'Ket' : 'Desc', padding + 55, y);
    
    // Amount di kanan
    ctx.textAlign = 'right';
    ctx.fillText(language === 'id' ? 'Jumlah' : 'Amount', canvasWidth - padding, y);
    ctx.textAlign = 'left'; // Kembalikan ke kiri
    
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
        ctx.fillStyle = '#f9f9f9';
        ctx.fillRect(padding - 4, y - 14, canvasWidth - padding * 2 + 8, rowHeight);
      }
      
      const dateObj = new Date(trans.date);
      const dateStr = dateObj.toLocaleDateString(language === 'id' ? 'id-ID' : 'en-US', { day: '2-digit', month: '2-digit' });
      
      ctx.fillStyle = '#555';
      ctx.font = '12px -apple-system, BlinkMacSystemFont, sans-serif';
      ctx.fillText(dateStr, padding, y + 6);
      
      ctx.fillStyle = '#333';
      ctx.font = '12px -apple-system, BlinkMacSystemFont, sans-serif';
      // Truncate deskripsi agar tidak menabrak nominal uang
      const desc = (trans.note || trans.category).substring(0, 20) + ((trans.note || trans.category).length > 20 ? '...' : '');
      ctx.fillText(desc, padding + 55, y + 6);

      const amountStr = `${trans.type === 'income' ? '+' : '-'} ${formatCurrency(trans.amount).replace('Rp ', '')}`;
      ctx.fillStyle = trans.type === 'income' ? '#7EC8E3' : '#E88EAB';
      ctx.font = 'bold 12px -apple-system, BlinkMacSystemFont, sans-serif';
      
      ctx.textAlign = 'right';
      ctx.fillText(amountStr, canvasWidth - padding, y + 6);
      ctx.textAlign = 'left';

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
    
    ctx.fillStyle = '#333';
    ctx.font = 'bold 14px -apple-system, BlinkMacSystemFont, sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText(language === 'id' ? 'Saldo:' : 'Balance:', canvasWidth - padding - 110, y);
    ctx.fillStyle = balance >= 0 ? '#7EC8E3' : '#E88EAB';
    ctx.fillText(formatCurrency(balance), canvasWidth - padding, y);
    ctx.textAlign = 'left';

    // Watermark
    ctx.fillStyle = '#bbb';
    ctx.font = '10px -apple-system, BlinkMacSystemFont, sans-serif';
    ctx.fillText(`Asisten Keuangan • ${new Date().toLocaleDateString('id-ID')}`, padding, canvasHeight - 16);

    // Save to state instead of window.open
    const dataUrl = canvas.toDataURL('image/png');
    setPreviewImage(dataUrl);
    setShowExportPicker(false);
  }, [transactions, exportRange, language, formatCurrency]);

  const downloadImage = () => {
    if (previewImage) {
      const link = document.createElement('a');
      link.href = previewImage;
      link.download = `Laporan_Keuangan_${exportRange.start}_${exportRange.end}.png`;
      link.click();
    }
  };

  return (
    <main className="main-content no-scrollbar">
      <header className="seabank-page-header" style={{ paddingTop: '24px' }}>
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

      <div className="history-filters" style={{ marginTop: '16px' }}>
        <div className="filter-item" onClick={() => setShowDatePicker(true)}>
          <span>{getDateFilterLabel()}</span>
          <ChevronDownIcon />
        </div>
        <div className="filter-divider"></div>
        
        <div className="filter-item" onClick={() => setShowTypeDropdown(true)}>
          <span>{filterType === 'all' ? t('allTransactions') : t(filterType)}</span>
          <ChevronDownIcon />
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

      {/* Type Filter Picker (Bottom Sheet) */}
      {showTypeDropdown && (
        <div className="modal-overlay" onClick={() => setShowTypeDropdown(false)}>
          <div className="bottom-sheet" onClick={(e) => e.stopPropagation()}>
            <div className="sheet-header">
              <h2>{language === 'id' ? 'Pilih Tipe Transaksi' : 'Select Transaction Type'}</h2>
              <button onClick={() => setShowTypeDropdown(false)} className="close-sheet-btn">✕</button>
            </div>
            <div className="sheet-option-list">
              <button className={`sheet-option ${filterType === 'all' ? 'selected' : ''}`} onClick={() => { setFilterType('all'); setShowTypeDropdown(false); }}>{t('allTransactions')}</button>
              <button className={`sheet-option ${filterType === 'income' ? 'selected' : ''}`} onClick={() => { setFilterType('income'); setShowTypeDropdown(false); }}>{t('income')}</button>
              <button className={`sheet-option ${filterType === 'expense' ? 'selected' : ''}`} onClick={() => { setFilterType('expense'); setShowTypeDropdown(false); }}>{t('expense')}</button>
            </div>
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
                📥 {language === 'id' ? 'Buat Laporan' : 'Generate Report'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Image Preview Overlay */}
      {previewImage && (
        <div className="modal-overlay" style={{ zIndex: 1000, display: 'flex', flexDirection: 'column', padding: '20px', backgroundColor: 'rgba(0,0,0,0.85)' }}>
          <div style={{ flex: 1, overflowY: 'auto', display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '20px' }}>
            <img 
              src={previewImage} 
              alt="Report Preview" 
              style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.3)' }} 
            />
          </div>
          <div style={{ display: 'flex', gap: '12px', paddingBottom: '20px' }}>
            <button 
              onClick={() => setPreviewImage(null)} 
              style={{ flex: 1, padding: '14px', borderRadius: '12px', background: 'white', color: '#333', fontWeight: 'bold', border: 'none' }}
            >
              {language === 'id' ? 'Kembali' : 'Back'}
            </button>
            <button 
              onClick={downloadImage} 
              style={{ flex: 1, padding: '14px', borderRadius: '12px', background: 'linear-gradient(135deg, #E88EAB, #7EC8E3)', color: 'white', fontWeight: 'bold', border: 'none' }}
            >
              {language === 'id' ? 'Simpan Galeri' : 'Save to Gallery'}
            </button>
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
