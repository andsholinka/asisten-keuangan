// src/components/ServiceWorkerRegister.tsx

"use client";

import { useEffect, useState } from 'react';

export default function ServiceWorkerRegister() {
  const [showUpdate, setShowUpdate] = useState(false);
  const [waitingWorker, setWaitingWorker] = useState<ServiceWorker | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('/sw.js')
          .then((registration) => {
            console.log('SW registered: ', registration);

            // Cek jika ada update yang tertunda saat aplikasi baru dimuat
            if (registration.waiting) {
              setWaitingWorker(registration.waiting);
              setShowUpdate(true);
            }

            // Deteksi jika ada file Service Worker baru yang sedang di-install di background
            registration.addEventListener('updatefound', () => {
              const newWorker = registration.installing;
              if (newWorker) {
                newWorker.addEventListener('statechange', () => {
                  // Pastikan update baru sudah terinstall dan ini bukan instalasi PWA pertama kali
                  if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                    setWaitingWorker(newWorker);
                    setShowUpdate(true);
                  }
                });
              }
            });
          })
          .catch((registrationError) => {
            console.log('SW registration failed: ', registrationError);
          });

        // Event ini akan terpanggil saat service worker baru mengambil alih
        let refreshing = false;
        navigator.serviceWorker.addEventListener('controllerchange', () => {
          if (!refreshing) {
            refreshing = true;
            window.location.reload(); // Muat ulang halaman ke versi baru
          }
        });
      });
    }
  }, []);

  const updateServiceWorker = () => {
    if (waitingWorker) {
      // Mengirim pesan ke Service Worker baru untuk memicu proses skipWaiting
      waitingWorker.postMessage({ type: 'SKIP_WAITING' });
      setShowUpdate(false);
    }
  };

  // Jika tidak ada update, jangan render apa-apa
  if (!showUpdate) return null;

  // UI Toast/Banner untuk Update
  return (
    <div style={{
      position: 'fixed',
      bottom: '100px', // Diberi jarak agar tidak tertutup bottom nav
      left: '50%',
      transform: 'translateX(-50%)',
      backgroundColor: '#333333',
      color: '#ffffff',
      padding: '12px 20px',
      borderRadius: '12px',
      boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
      zIndex: 9999,
      width: 'max-content',
      maxWidth: '90%'
    }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <span style={{ fontSize: '14px', fontWeight: 'bold' }}>Versi Baru Tersedia! 🚀</span>
        <span style={{ fontSize: '12px', color: '#ccc' }}>Muat ulang untuk memperbarui.</span>
      </div>
      <button 
        onClick={updateServiceWorker}
        style={{
          background: 'linear-gradient(135deg, #E88EAB, #7EC8E3)',
          color: 'white',
          border: 'none',
          padding: '8px 16px',
          borderRadius: '8px',
          cursor: 'pointer',
          fontWeight: 'bold',
          fontSize: '13px',
          boxShadow: '0 2px 8px rgba(232, 142, 171, 0.4)'
        }}
      >
        Update
      </button>
    </div>
  );
}