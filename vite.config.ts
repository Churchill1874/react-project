import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import WindiCSS from 'vite-plugin-windicss';

export default defineConfig({
  plugins: [react(), WindiCSS()],
  server: {
    open: true,
    host: '0.0.0.0',
    port: 5173,
  },
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  define: {
    global: 'window', // 修复 SockJS 的 global 问题
  },
});
