import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@pages': path.resolve(__dirname, './src/pages'),
      '@services': path.resolve(__dirname, './src/services'),
      '@types': path.resolve(__dirname, './src/types'),
      '@utils': path.resolve(__dirname, './src/utils'),
    },
  },
  server: {
    proxy: {
      '/api/instantly': {
        target: 'https://api.instantly.ai',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/instantly/, '/api/v2'),
        headers: {
          'Authorization': 'Bearer MmQ4NzQ5ZWUtMGFmNC00MDQ3LWI5NDktZTZjYjU2NzkzMjYyOlpsWWtyaFJnUm5zTA=='
        }
      }
    }
  }
})
