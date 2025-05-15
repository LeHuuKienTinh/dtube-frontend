import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // cho phép truy cập từ máy khác
    port: 5173,       // có thể đổi nếu cần
  }
})
