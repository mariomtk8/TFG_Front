import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },server: {
    proxy: {
      // Ejemplo: redirige las peticiones de /api a http://localhost:8005
      '/api': {
        target: 'http://localhost:8005', // URL base de tu backend
        changeOrigin: true, // Necesario para evitar problemas de CORS
        rewrite: path => path.replace(/^\/api/, ''), // Opcional: elimina el prefijo /api en la petición redirigida
      },
    },
  }
})