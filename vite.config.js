import { fileURLToPath, URL } from 'node:url'
import fs from 'node:fs'
import path from 'node:path'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import viteSitemap from 'vite-plugin-sitemap'

// ── 개발 서버가 붙을 백엔드 (배포 빌드와 무관) ──
// 기본: 운영 서버. 로컬 백엔드(운영과 분리된 시험용, cdpp-dev/jinjungsung-local/start-local.ps1)를 쓰려면
//   API_TARGET=http://127.0.0.1:8091 (+ 로컬에서 올린 사진: LOCAL_UPLOADS_DIR=<백엔드>/uploads/jinjungsung)
const API_TARGET = process.env.API_TARGET || 'https://luxacademy.kr'
const IS_LIVE = /luxacademy\.kr/.test(API_TARGET)
const LOCAL_UPLOADS_DIR = process.env.LOCAL_UPLOADS_DIR ? path.resolve(process.env.LOCAL_UPLOADS_DIR) : ''
const IMAGE_TYPES = { '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.gif': 'image/gif', '.webp': 'image/webp' }

// 로컬 백엔드로 시험할 때: 로컬에서 새로 올린 사진은 로컬 폴더에서, 나머지(운영에서 복사한 글의 사진)는 운영 사이트에서
const localUploadsFirst = () => ({
  name: 'local-uploads-first',
  configureServer(server) {
    if (!LOCAL_UPLOADS_DIR) return
    server.middlewares.use('/uploads', (req, res, next) => {
      const name = decodeURIComponent((req.url || '').split('?')[0]).replace(/^\/+/, '')
      const file = path.resolve(LOCAL_UPLOADS_DIR, name)
      if (!file.startsWith(LOCAL_UPLOADS_DIR + path.sep) || !fs.existsSync(file) || !fs.statSync(file).isFile()) return next()
      res.setHeader('Content-Type', IMAGE_TYPES[path.extname(file).toLowerCase()] || 'application/octet-stream')
      fs.createReadStream(file).pipe(res)
    })
  },
})

export default defineConfig({
  plugins: [
    vue(),
    localUploadsFirst(),
    viteSitemap({
      hostname: 'https://luxacademy.kr',
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
    // 개발 화면(npm run dev)만 쓰는 설정 — 배포본에는 영향 없음.
    // 2026-11-13: 예전 대상 http://211.170.168.146:9000 은 밖에서 접속이 안 돼(시간 초과) 개발 화면이 늘 미리보기 데이터로만 보였다.
    //   같은 백엔드가 운영 주소 https://luxacademy.kr/api 로는 응답하므로 그쪽으로 잇는다. 사진(/uploads)도 같은 곳에서.
    // ⛔ 운영 서버라 방문자 폼(수강신청 문의 = 고객사에 실제 메일, 후기 작성 = 실제 데이터)은 개발 화면에서 막는다(404).
    //   관리자 기능(로그인 · 목록 · 작성/수정/삭제)은 관리자 비밀번호가 있어야만 동작하므로 통과 — 운영 관리자 화면과 똑같이 실제로 반영된다.
    //   방문자 폼까지 꼭 운영 서버에 써 봐야 할 때만 LIVE_WRITE=1 을 붙여 dev 서버를 켠다.
    //   (로컬 백엔드에 붙었을 때는 막지 않는다 — 로컬 DB 이고 메일 계정도 로컬용이라 실제로 나가지 않는다)
    proxy: {
      '/api': {
        target: API_TARGET,
        changeOrigin: true,
        secure: true,
        // 백엔드의 CSRF 방어는 허용 목록에 없는 Origin(여기서는 http://localhost:5191)을 403 으로 막는다.
        //   개발 서버가 대신 보내는 요청이라 Origin 을 떼고 넘긴다(관리자 기능은 어차피 로그인 토큰이 있어야 동작)
        configure(proxy) {
          proxy.on('proxyReq', (proxyReq) => proxyReq.removeHeader('origin'))
        },
        bypass(req) {
          if (!IS_LIVE || process.env.LIVE_WRITE === '1') return
          const path = req.url.split('?')[0]
          const isPublicForm =
            req.method === 'POST' &&
            ['/api/jinjungsung-academy/course-registration', '/api/jinjungsung-academy/reviews/submit'].includes(path)
          if (!isPublicForm) return
          console.warn(`[dev] 방문자 폼 제출을 막았습니다: ${req.method} ${path} (써야 하면 LIVE_WRITE=1)`)
          return false
        }
      },
      '/uploads': {
        target: 'https://luxacademy.kr',
        changeOrigin: true,
        secure: true
      }
    }
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
})