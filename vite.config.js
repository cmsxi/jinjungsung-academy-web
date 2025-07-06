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
      filename: 'sitemap.xml',
      // SEO 최적화 옵션 추가
      changefreq: 'weekly',
      priority: {
        '/': 1.0,
        '/education/curriculum': 0.9,
        '/registration': 0.9,
        '/introduction/greeting': 0.8,
        '/introduction/business': 0.8,
        '/introduction/partners': 0.7,
        '/education/status': 0.7,
        '/faq/questions': 0.6,
        '/faq/inquiry': 0.6,
        '/reviews': 0.6
      },
      lastmod: new Date().toISOString().split('T')[0]
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
        target: 'http://211.170.168.146:9000',
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