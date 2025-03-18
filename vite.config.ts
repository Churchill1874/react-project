import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import WindiCSS from 'vite-plugin-windicss';
import legacy from '@vitejs/plugin-legacy';

export default defineConfig({
  plugins: [
    react(),
    WindiCSS(),
    legacy({
      targets: ['> 0.5%', 'last 2 versions', 'not dead'],
      additionalLegacyPolyfills: ['regenerator-runtime/runtime', 'core-js/stable'], // 添加 core-js polyfill
      modernPolyfills: true, // 启用现代浏览器 polyfill
    }),
  ],
  build: {
    target: 'es2015', // 兼容旧浏览器
    minify: 'esbuild', // 尝试使用不同的 minify 方式
    rollupOptions: {
      output: {
        manualChunks: undefined, // 避免 iOS 兼容性问题
      },
    },
  },
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
