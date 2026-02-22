import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { FinanceProvider } from "@/lib/contexts/FinanceContext";
import { ThemeProvider } from "@/lib/contexts/ThemeContext";
import { PWAProvider } from "@/lib/contexts/PWAContext";
import { LanguageProvider } from "@/lib/contexts/LanguageContext";
import InstallNotification from "@/components/InstallNotification";
import ServiceWorkerRegister from "@/components/ServiceWorkerRegister";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Asisten Keuangan",
  description: "Aplikasi pencatatan keuangan pribadi simpel dan aman",
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/icon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/icon-192x192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: "/icon-192x192.png",
  },
};

export const viewport = {
  themeColor: "#E88EAB",
  width: "device-width",
  initialScale: 1,
  minimumScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <ThemeProvider>
          <LanguageProvider>
            <PWAProvider>
              <ServiceWorkerRegister />
              <FinanceProvider>
                <div className="app-container">
                  <InstallNotification />
                  {children}
                </div>
              </FinanceProvider>
            </PWAProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
