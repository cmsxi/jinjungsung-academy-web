<template>
  <!-- 관리자 틀: 왼쪽 메뉴 + 오른쪽 내용 (11/13 "왼쪽 메뉴형" 선택). 홈페이지 헤더 · 푸터 없이 관리자 전용 -->
  <div class="adm adm-shell">
    <aside class="adm-side">
      <!-- 11/13 이름 글자 대신 홈페이지와 같은 로고(금색 엠블럼 + 검정 글자). 누르면 관리자 첫 화면 -->
      <div class="adm-brand">
        <router-link to="/admin/inquiries" class="adm-brand-link" aria-label="관리자 첫 화면">
          <img :src="logo" alt="국제명품감정교육원" class="adm-logo" />
        </router-link>
        <span>관리자</span>
      </div>

      <nav class="adm-nav" aria-label="관리자 메뉴">
        <router-link v-for="item in MENU" :key="item.to" :to="item.to" :class="{ 'is-active': isActive(item) }">
          {{ item.label }}
        </router-link>
      </nav>

      <div class="adm-side-foot">
        <a href="/" target="_blank" rel="noopener">홈페이지 보기 ↗</a>
        <button type="button" @click="logout">로그아웃</button>
        <p v-if="expiresText" class="adm-session">{{ expiresText }} 자동 로그아웃</p>
      </div>
    </aside>

    <main class="adm-main">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useHead } from '@unhead/vue'
import { useRoute, useRouter } from 'vue-router'
import { clearSession, getSession, onUnauthorized } from './adminAuth.js'
import logo from '@/assets/images/logo-text-black.svg'
import './admin.css'

const MENU = [
  { label: '수강신청 문의', to: '/admin/inquiries' },
  { label: '수강현황', to: '/admin/status' },
  { label: '수강후기', to: '/admin/reviews' },
]

const route = useRoute()
const router = useRouter()

// 관리자 화면은 검색에 나오지 않게
useHead({ title: '관리자 | 국제명품감정교육원', meta: [{ name: 'robots', content: 'noindex, nofollow' }] })

const isActive = (item) => route.path === item.to || route.path.startsWith(`${item.to}/`)

// 남은 로그인 시간 안내(예: 22:41 자동 로그아웃)
const now = ref(Date.now())
let timer = null
const expiresText = computed(() => {
  now.value // 1분마다 다시 계산
  const session = getSession()
  if (!session) return ''
  return new Intl.DateTimeFormat('ko-KR', { timeZone: 'Asia/Seoul', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).format(
    new Date(session.expiresAt),
  )
})

const toLogin = (expired) => {
  router.replace({ path: '/admin/login', query: { next: route.fullPath, ...(expired ? { expired: '1' } : {}) } })
}

const logout = () => {
  clearSession()
  router.replace('/admin/login')
}

onMounted(() => {
  // 작업 중 로그인이 풀리면(토큰 만료 등) 로그인 화면으로
  onUnauthorized(() => toLogin(true))
  timer = setInterval(() => {
    now.value = Date.now()
    if (!getSession()) toLogin(true)
  }, 60 * 1000)
})

onBeforeUnmount(() => {
  clearInterval(timer)
  onUnauthorized(null)
})
</script>
