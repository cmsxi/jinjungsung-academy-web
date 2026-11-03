<template>
  <template v-if="isVisible">
    <!-- 데스크톱: 우측 하단 전화 버튼 -->
    <a :href="PHONE_TEL" class="quick-call-float" :aria-label="`전화 상담 ${PHONE_DISPLAY}`">
      <span class="float-icon"><AppIcon name="phone" :size="20" /></span>
      <span class="float-text">
        <span class="float-label">전화 상담</span>
        <strong class="float-number">{{ PHONE_DISPLAY }}</strong>
      </span>
    </a>

    <!-- 모바일: 하단 고정 바 -->
    <div class="quick-call-bar" role="region" aria-label="빠른 상담">
      <a :href="PHONE_TEL" class="bar-btn bar-btn--call">
        <AppIcon name="phone" :size="18" />
        전화 상담
      </a>
      <button type="button" class="bar-btn bar-btn--apply" @click="goToConsult">
        <AppIcon name="edit" :size="18" />
        상담 신청
      </button>
    </div>
    <div class="quick-call-spacer" aria-hidden="true"></div>
  </template>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AppIcon from '@/components/ui/AppIcon.js'
import { PHONE_DISPLAY, PHONE_TEL } from '@/constants/contact.js'

const CONSULT_SECTION_ID = 'consult'

const route = useRoute()
const router = useRouter()

const isVisible = computed(() => !route.path.startsWith('/admin'))

// 메인에서는 하단 상담 섹션으로 스크롤, 그 외 페이지는 수강신청문의로 이동
const goToConsult = () => {
  const section = route.path === '/' ? document.getElementById(CONSULT_SECTION_ID) : null
  if (section) {
    section.scrollIntoView({ behavior: 'smooth', block: 'start' })
    return
  }
  router.push('/registration')
}
</script>

<style scoped>
.quick-call-float {
  position: fixed;
  right: 24px;
  bottom: 24px;
  z-index: 900;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 20px 10px 10px;
  background-color: var(--surface);
  border: 1px solid var(--line);
  border-radius: 999px;
  box-shadow: 0 8px 28px rgba(28, 30, 34, 0.14);
  color: var(--ink-900);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.quick-call-float:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 32px rgba(28, 30, 34, 0.18);
}

.float-icon {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background-color: var(--gold-700);
  color: #fff;
}

.float-text {
  display: grid;
  line-height: 1.25;
}

.float-label {
  font-size: 0.8125rem;
  color: var(--ink-500);
}

.float-number {
  font-size: 1.0625rem;
  font-weight: 700;
  letter-spacing: 0;
}

.quick-call-bar,
.quick-call-spacer {
  display: none;
}

@media (max-width: 768px) {
  .quick-call-float {
    display: none;
  }

  .quick-call-bar {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 900;
    display: grid;
    grid-template-columns: 1.2fr 1fr;
    gap: 8px;
    padding: 8px 12px calc(8px + env(safe-area-inset-bottom));
    background-color: var(--surface);
    border-top: 1px solid var(--line);
    box-shadow: 0 -6px 18px rgba(28, 30, 34, 0.06);
  }

  .quick-call-spacer {
    display: block;
    height: calc(var(--callbar-height) + env(safe-area-inset-bottom));
  }

  .bar-btn {
    height: 48px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    border-radius: var(--radius-sm);
    border: none;
    font-size: 1rem;
    font-weight: 700;
    cursor: pointer;
  }

  .bar-btn--call {
    background-color: var(--gold-700);
    color: #fff;
  }

  .bar-btn--apply {
    background-color: var(--charcoal);
    color: #fff;
  }
}
</style>
