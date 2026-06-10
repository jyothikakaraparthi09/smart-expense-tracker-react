import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // This is how you safely load environment variables inside a Vite config file if needed
  const env = loadEnv(mode, process.cwd(), '');

  // Choose your local backend target fallback (e.g., http://localhost:8080)
  const backendTarget = env.VITE_API_BASE_URL || 'http://localhost:8080';

  return {
    plugins: [react()],
    server: {
      proxy: {
        // Local development proxies (These are ignored in production)
        '/auth': {
          target: backendTarget,
          changeOrigin: true,
        },
        '/expenses': {
          target: backendTarget,
          changeOrigin: true,
        }
      }
    }
  }
})