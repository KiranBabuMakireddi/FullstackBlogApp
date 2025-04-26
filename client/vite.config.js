import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        secure: false,
      },
    },
    hmr: process.env.NODE_ENV !== 'production', // Disable HMR in production
  },
  plugins: [react()],
});
