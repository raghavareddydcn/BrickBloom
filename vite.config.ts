import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';

function githubPagesRoutesPlugin(): Plugin {
  return {
    closeBundle() {
      const rootDir = __dirname;
      const distDir = path.resolve(rootDir, 'dist');
      const distIndex = path.join(distDir, 'index.html');

      if (fs.existsSync(distIndex)) {
        // GitHub Pages hosts files, not SPA rewrites. Put an application shell at
        // every routed admin URL in the published dist artifact.
        const staticRoutes = [
          'admin',
          'admin/invoices',
          'admin/inventory',
          'admin/whatsapp',
          'admin/audit',
          'admin/users'
        ];

        for (const route of staticRoutes) {
          const dir = path.join(distDir, route);
          if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
          }
          fs.copyFileSync(distIndex, path.join(dir, 'index.html'));
        }
        fs.copyFileSync(distIndex, path.join(distDir, '404.html'));
        // The old standalone page remains in the working tree for recovery, but
        // is deliberately omitted from the Pages artifact.
        fs.rmSync(path.join(distDir, 'whatsapp.html'), { force: true });
        console.log('[github-pages-routes] Created React route entry points in dist');
      }
    },
  };
}

export default defineConfig({
  plugins: [react(), githubPagesRoutesPlugin()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          motion: ['framer-motion'],
          firebase: ['firebase/app', 'firebase/firestore'],
        },
      },
    },
  },
});
