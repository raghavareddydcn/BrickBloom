import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';

function rootBranchDeployPlugin(): Plugin {
  return {
    name: 'root-branch-deploy-plugin',
    transformIndexHtml: {
      order: 'pre',
      handler(html) {
        return html
          .replace(
            /<script type="module" crossorigin src="\/assets\/[^"]+"><\/script>/,
            '<script type="module" src="/src/main.tsx"></script>'
          )
          .replace(/<link rel="modulepreload"[^>]+>\r?\n?/g, '')
          .replace(/<link rel="stylesheet" crossorigin href="\/assets\/[^"]+">\r?\n?/, '');
      },
    },
    closeBundle() {
      const rootDir = __dirname;
      const distDir = path.resolve(rootDir, 'dist');
      const distIndex = path.join(distDir, 'index.html');
      const rootIndex = path.join(rootDir, 'index.html');
      const root404 = path.join(rootDir, '404.html');
      const rootNoJekyll = path.join(rootDir, '.nojekyll');
      const rootCname = path.join(rootDir, 'CNAME');
      const distAssets = path.join(distDir, 'assets');
      const rootAssets = path.join(rootDir, 'assets');

      if (fs.existsSync(distIndex)) {
        fs.copyFileSync(distIndex, rootIndex);
        fs.copyFileSync(distIndex, root404);
        fs.writeFileSync(rootNoJekyll, '');
        fs.writeFileSync(rootCname, 'brickbloom.co.in\n');

        // Create physical HTML entry points for direct URLs in GitHub Pages branch mode
        const staticRoutes = [
          'admin',
          'admin/invoices',
          'admin/inventory',
          'admin/whatsapp',
          'admin/audit',
          'admin/users'
        ];
        fs.copyFileSync(distIndex, path.join(rootDir, 'admin.html'));
        fs.copyFileSync(distIndex, path.join(rootDir, 'invoice.html'));
        fs.copyFileSync(distIndex, path.join(rootDir, 'inventory.html'));

        for (const route of staticRoutes) {
          const dir = path.join(rootDir, route);
          if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
          }
          fs.copyFileSync(distIndex, path.join(dir, 'index.html'));
        }
        console.log('[root-branch-deploy] Copied compiled index.html, 404.html, admin entry points to root');

        if (fs.existsSync(distAssets)) {
          if (!fs.existsSync(rootAssets)) {
            fs.mkdirSync(rootAssets, { recursive: true });
          }
          fs.cpSync(distAssets, rootAssets, { recursive: true });
          console.log('[root-branch-deploy] Copied compiled assets to root ./assets');
        }
      }
    },
  };
}

export default defineConfig({
  plugins: [react(), rootBranchDeployPlugin()],
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
