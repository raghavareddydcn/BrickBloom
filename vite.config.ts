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
      const distAssets = path.join(distDir, 'assets');
      const rootAssets = path.join(rootDir, 'assets');

      if (!fs.existsSync(distIndex)) return;

      // Sync compiled index.html to branch root
      fs.copyFileSync(distIndex, rootIndex);

      // Helper to ensure target file exists in BOTH dist and root directories
      const copyToBoth = (src: string, relPath: string) => {
        const destDist = path.join(distDir, relPath);
        const destRoot = path.join(rootDir, relPath);
        fs.mkdirSync(path.dirname(destDist), { recursive: true });
        fs.mkdirSync(path.dirname(destRoot), { recursive: true });
        fs.copyFileSync(src, destDist);
        fs.copyFileSync(src, destRoot);
      };

      // 1. Static HTML fallbacks for direct clean URL access
      const staticHtmlFiles = [
        '404.html',
        'admin.html',
        'invoice.html',
        'inventory.html',
        'operations.html',
        'dashboard.html',
        // Legacy product URL compatibility
        'tabs.html',
        'blocks.html',
        'growbags.html',
        'loose.html',
        'coco-grow-cubes.html',
        'open-top-growbags.html',
        'coco-bricks.html',
        'coco-growslabs.html',
        'coir-chips.html',
      ];
      for (const file of staticHtmlFiles) {
        copyToBoth(distIndex, file);
      }

      // 2. Directory entry points (folder/index.html) so direct navigation and refreshes never 404
      const dirRoutes = [
        'admin',
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
      for (const route of dirRoutes) {
        copyToBoth(distIndex, path.join(route, 'index.html'));
      }

      // 3. GitHub Pages metadata files in both locations
      fs.writeFileSync(path.join(distDir, '.nojekyll'), '');
      fs.writeFileSync(path.join(rootDir, '.nojekyll'), '');
      fs.writeFileSync(path.join(distDir, 'CNAME'), 'brickbloom.co.in\n');
      fs.writeFileSync(path.join(rootDir, 'CNAME'), 'brickbloom.co.in\n');

      // 4. Standalone WhatsApp tool synchronization
      const publicWa = path.join(rootDir, 'public', 'whatsapp.html');
      if (fs.existsSync(publicWa)) {
        copyToBoth(publicWa, 'whatsapp.html');
      }

      // 5. Assets synchronization to root for branch deployment mode
      if (fs.existsSync(distAssets)) {
        if (fs.existsSync(rootAssets)) {
          fs.rmSync(rootAssets, { recursive: true, force: true });
        }
        fs.mkdirSync(rootAssets, { recursive: true });
        fs.cpSync(distAssets, rootAssets, { recursive: true });
      }

      console.log('[root-branch-deploy] Generated static entry points in both dist/ and root for GitHub Pages branch deployment.');
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
