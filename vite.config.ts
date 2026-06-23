import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/survive_the_heat_solo_rpg/',
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: false,
  },
})
