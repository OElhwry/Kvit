import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Build output goes straight to ../docs so GitHub Pages
// (configured to serve /docs on main) picks up every new build.
export default defineConfig({
  plugins: [react()],
  base: '/SplidIt/',
  build: {
    outDir: '../docs',
    emptyOutDir: true,
  },
})