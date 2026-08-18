import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  // GitHub Pages serves this app from a /finance_lab/ subpath, but the local
  // dev server serves from root — only apply the subpath during production builds.
  base: command === 'build' ? '/finance_lab/' : '/',
  plugins: [react(), tailwindcss()],
}))
