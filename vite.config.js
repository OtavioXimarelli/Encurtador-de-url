import { defineConfig } from 'vite'
import dotenv from 'dotenv'

dotenv.config()

export default defineConfig({
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: process.env.PUBLIC_API_BASE_URL,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
        configure: (proxy) => {
          proxy.on('proxyReq', (proxyReq) => {
            proxyReq.setHeader('x-api-key', process.env.PRIVATE_API_KEY)
          })
        }
      }
    }
  },
  define: {
    __PUBLIC_API_BASE_URL__: JSON.stringify(process.env.PUBLIC_API_BASE_URL),
    __PUBLIC_URL_EXPIRATION_DAYS__: process.env.PUBLIC_URL_EXPIRATION_DAYS
  }
})