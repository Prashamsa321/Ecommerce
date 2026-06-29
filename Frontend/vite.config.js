// vite.config.js
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const apiUrl = env.VITE_API_URL || '/api'
  const apiTarget = apiUrl.startsWith('/')
    ? (env.VITE_API_TARGET || 'http://localhost:5000')
    : apiUrl.replace(/\/api\/?$/, '')

  return {
    plugins: [react()],
    server: {
      host: true,
      port: parseInt(env.VITE_PORT || '3000', 10),
      proxy: {
        '/api': {
          target: apiTarget,
          changeOrigin: true,
        }
      }
    },
    css: {
      postcss: './postcss.config.js',
    }
  }
})