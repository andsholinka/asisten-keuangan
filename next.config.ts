// next.config.ts

import type { NextConfig } from "next";
import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  disable: process.env.NODE_ENV === "development", 
  register: false, 
  workboxOptions: {
    skipWaiting: false, 
  },
});

const nextConfig: NextConfig = {
  turbopack: {}, // <--- Tambahkan baris ini untuk mengatasi error Turbopack vs Webpack
};

export default withPWA(nextConfig);