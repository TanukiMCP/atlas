import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  root: __dirname,
  base: './',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        mobile: resolve(__dirname, 'mobile.html'),
      }
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@shared': path.resolve(__dirname, '../shared/src'),
      '@management-center': path.resolve(__dirname, '../management-center/src')
    }
  },
  server: {
    port: 3000,
    strictPort: true,
    host: true,
    fs: {
      allow: ['..'],
    },
    proxy: {}
  },
  define: {
    global: 'globalThis'
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'zustand'],
    exclude: ['@tanukimcp/shared']
  },
  esbuild: {
    target: 'es2020'
  },
  publicDir: 'public'
});