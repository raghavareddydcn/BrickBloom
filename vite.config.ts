import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';

function githubPagesRoutesPlugin(): Plugin {
  return {
    name: 'github-pages-routes-plugin',
    closeBundle() {
      const rootDir = __dirname;
      const distDir = path.resolve(rootDir, 'dist');
      const distIndex = path.join(distDir, 'index.html');

      if (!fs.existsSync(distIndex)) return;

      // GitHub Pages serves static files without SPA rewrite rules.
      // Put application shells at every routed URL in the published dist artifact.
      const staticRoutes = [
        'admin',
        'admin/products',
        'admin/catalog',
        'admin/invoices',
        'admin/inventory',
        'admin/whatsapp',
        'admin/audit',
        'admin/users',
        'products/ready-pot',
        'products/starter-kit',
        'products/medium-kit',
        'products/premium-kit',
        'products/coco-grow-disk',
        'products/premium-cocopeat',
        'products/coco-bricks',
        'products/coco-growslabs',
        'products/coir-chips',
      ];

      for (const route of staticRoutes) {
        const dir = path.join(distDir, route);
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, { recursive: true });
        }
        fs.copyFileSync(distIndex, path.join(dir, 'index.html'));
      }

      // SPA fallback for any unmatched route
      fs.copyFileSync(distIndex, path.join(distDir, '404.html'));

      console.log('[github-pages-routes] Created React route entry points in dist/');
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
