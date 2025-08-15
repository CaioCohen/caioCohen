import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/caioCohen/',          // nome exato do repositório
  build: { outDir: 'docs' }     // gera o build dentro de /docs
})
