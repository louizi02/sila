import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// En ligne, GitHub Pages sert le site sous /sila/.
export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/sila/' : '/',
  plugins: [react()],
  server: { port: 5173 },
}))
