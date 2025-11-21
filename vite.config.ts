import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// Vite config
export default defineConfig(({ mode }) => {
  return {
    base: './', // Safe for static hosting

    server: {
      port: 3000,
      host: '0.0.0.0',
    },

    plugins: [react()],

    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },

    build: {
      // Split large chunks automatically
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              if (id.includes('react')) return 'vendor-react';
              if (id.includes('pdfjs-dist')) return 'vendor-pdfjs';
              if (id.includes('mammoth')) return 'vendor-mammoth';
              return 'vendor';
            }
          },
        },
      },
      chunkSizeWarningLimit: 1000, // Increase to suppress warnings for large chunks
    },
  };
});
