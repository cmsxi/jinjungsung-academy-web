import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import viteSitemap from 'vite-plugin-sitemap'

export default defineConfig({
  plugins: [
    vue(),
    viteSitemap({
      hostname: 'https://국제명품감정교육원.com',
      routes: [
        '/',
        '/introduction/greeting',
        '/introduction/business', 
        '/introduction/partners',
        '/education/curriculum',
        '/education/status',
        '/registration',
        '/faq/questions',
        '/faq/inquiry',
        '/reviews'
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