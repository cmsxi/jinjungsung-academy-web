import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import viteSitemap from 'vite-plugin-sitemap'

export default defineConfig({
  plugins: [
    vue(),
    viteSitemap({
      hostname: 'https://globeetax.com',
      routes: [
        '/',
        '/globee',
        '/service',
        '/consulting',
        '/review'
      ],
      outDir: 'dist',
      filename: 'sitemap.xml'
    })
  ],
  // 프로덕션 모드 설정 추가
  define: {
    '__VUE_PROD_DEVTOOLS__': false,
  },
  server: {
    host: true,
    proxy: {
      '/api': {
        target: 'http://106.246.144.126:9000',
        changeOrigin: true
      }
    }
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
})