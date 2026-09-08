import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  base: './',
  plugins: [
    react(),
    tailwindcss(),
  ],
  build: {
    rollupOptions: {
      input: {
        main: resolve(import.meta.dirname, 'index.html'),
        mongonchimeg: resolve(import.meta.dirname, 'mongonchimeg/index.html'),
        tomoo: resolve(import.meta.dirname, 'tomoo/index.html'),
        jijgee: resolve(import.meta.dirname, 'jijgee/index.html'),
      },
    },
  },
})
