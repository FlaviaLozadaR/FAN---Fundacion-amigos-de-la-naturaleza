import { defineConfig } from 'vite';
import { resolve } from 'path';
import { existsSync, readFileSync } from 'fs';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

export default defineConfig({
  server: {
    host: '0.0.0.0',
  },
  plugins: [
    {
      // Serve app/*.jsx and tweaks-panel.jsx as plain text so Babel standalone
      // in the browser can handle JSX transpilation (these files use CDN globals,
      // not ES module imports, so Vite/esbuild must NOT transform them).
      name: 'serve-babel-scripts-raw',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          const url = (req.url || '').split('?')[0];
          const isBabelScript =
            (url.startsWith('/app/') || url === '/tweaks-panel.jsx') &&
            (url.endsWith('.jsx') || url.endsWith('.js'));

          if (!isBabelScript) return next();

          const filePath = resolve(__dirname, url.slice(1));
          if (!existsSync(filePath)) return next();

          res.setHeader('Content-Type', 'text/plain; charset=utf-8');
          res.setHeader('Cache-Control', 'no-cache');
          res.end(readFileSync(filePath, 'utf-8'));
        });
      },
    },
  ],
});
