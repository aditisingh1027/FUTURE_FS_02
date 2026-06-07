import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

const PRODUCTION_API_URL = 'https://future-fs-02-km5o.onrender.com/api';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const apiBase = env.VITE_API_BASE_URL || (mode === 'production' ? PRODUCTION_API_URL : 'http://localhost:5000/api');

  return {
    plugins: [
      react(),
      tailwindcss(),
    ],
    define: {
      // Guarantee VITE_API_BASE_URL is always set correctly in production builds
      'import.meta.env.VITE_API_BASE_URL': JSON.stringify(apiBase),
    },
    server: {
      port: 5173,
      proxy: {
        '/api': {
          target: 'http://localhost:5000',
          changeOrigin: true,
          secure: false,
        }
      }
    }
  };
});
