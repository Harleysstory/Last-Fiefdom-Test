import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: process.env.VITE_API_URL || 'http://localhost:3001',
        changeOrigin: true,
      },
      '/socket.io': {
        target: process.env.VITE_WS_URL || 'http://localhost:3001',
        ws: true,
      },
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './client/src'),
      '@components': path.resolve(__dirname, './client/src/components'),
      '@pages': path.resolve(__dirname, './client/src/pages'),
      '@store': path.resolve(__dirname, './client/src/store'),
      '@api': path.resolve(__dirname, './client/src/api'),
      '@types': path.resolve(__dirname, './client/src/types'),
      '@hooks': path.resolve(__dirname, './client/src/hooks'),
    },
  },
})
