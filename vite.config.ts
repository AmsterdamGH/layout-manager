import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [
          ['@babel/plugin-proposal-decorators', { version: '2023-11' }],
          '@babel/plugin-transform-class-properties',
          '@babel/plugin-transform-class-static-block',
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  server: {
    port: 3000,
    open: process.env.VITE_APP_BROWSER || false,
  },
  base: '/layout-manager/'
});
