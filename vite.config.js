import { defineConfig, loadEnv } from 'vite'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    server: {
      port: 3000
    },
    define: {
      __API_CREATE_URL__: JSON.stringify(env.VITE_API_CREATE_URL),
      __API_BASE_URL__: JSON.stringify(env.VITE_API_BASE_URL),
      __API_KEY__: JSON.stringify(env.VITE_API_KEY)
    }
  }
});