import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// Opens the connection (DNS + TCP + TLS) to the API server while the JS bundle
// is still downloading, so the first /api request doesn't pay that cost.
const apiPreconnect = (apiUrl) => ({
  name: 'api-preconnect',
  transformIndexHtml() {
    if (!apiUrl) return [];
    try {
      const origin = new URL(apiUrl).origin;
      return [{ tag: 'link', attrs: { rel: 'preconnect', href: origin }, injectTo: 'head-prepend' }];
    } catch {
      return [];
    }
  },
});

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_');

  return {
    plugins: [react(), apiPreconnect(env.VITE_API_URL)],
    server: {
      port: 5173,
    },
    build: {
      target: 'es2020',
      rollupOptions: {
        output: {
          // Keeps React/Router in a long-cacheable chunk separate from app code.
          manualChunks(id) {
            if (
              /node_modules\/(react|react-dom|react-router|react-router-dom|scheduler|@remix-run)\//.test(id)
            ) {
              return 'react-vendor';
            }
            return undefined;
          },
        },
      },
    },
  };
});
