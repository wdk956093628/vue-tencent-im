import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '/src')
    }
  },
  define: {
    __VUE_PROD_DEVTOOLS__: false
  },
  devServer: {
    host: '192.168.2.182'
  }
})
