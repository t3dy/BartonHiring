import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: '/BartonHiring/',
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        lessons: resolve(__dirname, 'lessons/index.html'),
      },
    },
  },
})
