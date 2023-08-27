import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    createSvgIconsPlugin({
      // 这个是自己配置的图标路径，指出来（自己咋配置的咋来）
      iconDirs: [path.resolve(process.cwd(), './src/assets/icons/svg')],
      // 这个表示id，按这个来就对了
      symbolId: 'icon-[dir]-[name]',
  }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  define: {
    __VUE_PROD_DEVTOOLS__: false
  },
  devServer: {
    host: '0.0.0.0'
  },
  css: {
    loaderOptions: {
      postcss: {
        config: {
          path: './postcss.config.cjs'
        }
      }
    }
  }
})
