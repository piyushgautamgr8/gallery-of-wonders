import process from 'node:process'
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

const DEFAULT_API_ORIGIN = 'https://gallery-of-wonders.onrender.com'

function getProxyTarget(apiBaseUrl) {
  return (apiBaseUrl || DEFAULT_API_ORIGIN).replace(/\/api\/?$/, '').replace(/\/+$/, '')
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const proxyTarget = getProxyTarget(env.VITE_API_PROXY_TARGET || env.VITE_API_BASE_URL)

  return {
    plugins: [react()],
    server: {
      proxy: {
        '/api': {
          target: proxyTarget,
          changeOrigin: true,
          secure: true,
        },
      },
    },
  }
})
