<template>
  <!-- 관리자 로그인 — 비밀번호 하나(11/12 결정 유지). 브라우저에는 비밀번호가 아니라 8시간짜리 로그인 토큰만 남는다 -->
  <div class="adm adm-login">
    <form class="adm-login-box" @submit.prevent="submit">
      <h1>국제명품감정교육원 관리자</h1>

      <p v-if="expired" class="adm-note adm-note--info">로그인 시간이 지나 다시 로그인해 주세요.</p>

      <div class="adm-field">
        <label for="adm-password">비밀번호</label>
        <input
          id="adm-password"
          ref="input"
          v-model="password"
          class="adm-input"
          type="password"
          autocomplete="current-password"
          :disabled="busy"
        />
      </div>

      <p v-if="error" class="adm-login-error" role="alert">{{ error }}</p>

      <button type="submit" class="adm-btn adm-btn--primary adm-login-submit" :disabled="!password || busy">
        {{ busy ? '확인 중…' : '로그인' }}
      </button>

      <a href="/" class="adm-login-home">홈페이지로 돌아가기</a>
    </form>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useHead } from '@unhead/vue'
import { useRoute, useRouter } from 'vue-router'
import { adminService } from '@/services/adminService.js'
import { isLoggedIn, saveSession } from './adminAuth.js'
import './admin.css'

const route = useRoute()
const router = useRouter()

useHead({ title: '관리자 로그인 | 국제명품감정교육원', meta: [{ name: 'robots', content: 'noindex, nofollow' }] })

const password = ref('')
const busy = ref(false)
const error = ref('')
const input = ref(null)
const expired = computed(() => route.query.expired === '1')

// 로그인 뒤 갈 곳: 원래 보려던 관리자 화면(없으면 수강신청 문의)
const nextPath = () => {
  const next = typeof route.query.next === 'string' ? route.query.next : ''
  return next.startsWith('/admin') && !next.startsWith('/admin/login') ? next : '/admin/inquiries'
}

const submit = async () => {
  if (!password.value || busy.value) return
  busy.value = true
  error.value = ''
  try {
    const { token, expires_at: expiresAt } = await adminService.login(password.value)
    saveSession(token, expiresAt)
    password.value = ''
    router.replace(nextPath())
  } catch (e) {
    const status = e?.response?.status
    if (status === 401) error.value = '비밀번호가 맞지 않습니다.'
    else if (status === 429) error.value = '로그인 시도가 너무 많습니다. 잠시 후 다시 시도해 주세요.'
    else error.value = '로그인하지 못했습니다. 잠시 후 다시 시도해 주세요.'
    password.value = ''
    input.value?.focus()
  } finally {
    busy.value = false
  }
}

onMounted(() => {
  if (isLoggedIn()) {
    router.replace(nextPath())
    return
  }
  input.value?.focus()
})
</script>

<style scoped>
.adm-login {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px 16px;
}

.adm-login-box {
  width: min(360px, 100%);
  padding: 28px 28px 24px;
  border: 1px solid var(--adm-line);
  border-radius: 6px;
  background: var(--adm-panel);
}

.adm-login-box h1 {
  margin-bottom: 20px;
  font-size: 17px;
  font-weight: 700;
}

.adm-login-error {
  margin-top: 8px;
  font-size: 13px;
  color: var(--adm-danger);
}

.adm-login-submit {
  width: 100%;
  height: 38px;
  margin-top: 16px;
}

.adm-login-home {
  display: block;
  margin-top: 14px;
  font-size: 13px;
  color: var(--adm-sub);
  text-align: center;
}
</style>
