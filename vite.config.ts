import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: '/',
  appType: 'mpa',
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        quote: resolve(__dirname, 'quote/index.html'),
        hiringGuide: resolve(__dirname, 'hiring-guide/index.html'),
        lessons: resolve(__dirname, 'lessons/index.html'),
        admin: resolve(__dirname, 'admin/index.html'),
      },
    },
  },
})
