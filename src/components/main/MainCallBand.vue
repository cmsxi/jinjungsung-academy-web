<template>
  <section class="call-band" aria-label="전화 상담">
    <div class="call-inner">
      <div class="call-copy">
        <p class="call-eyebrow">contact</p>
        <h2 class="call-title">전화 상담 <a :href="PHONE_TEL" class="call-number">{{ PHONE_DISPLAY }}</a></h2>
        <p class="call-desc">과정 구성과 개강 일정, 창업 준비까지 담당자가 직접 안내해 드립니다.</p>
      </div>
      <div class="call-actions">
        <a :href="PHONE_TEL" class="call-btn call-btn--primary">전화 걸기</a>
        <a :href="KAKAO_CHANNEL_URL" target="_blank" rel="noopener noreferrer" class="call-btn call-btn--outline">카카오톡 문의</a>
      </div>
    </div>
  </section>
</template>

<script setup>
import { PHONE_DISPLAY, PHONE_TEL, KAKAO_CHANNEL_URL } from '@/constants/contact.js'
</script>

<style scoped>
.call-band {
  background: var(--secondary-color);
  color: #fff;
  padding: 56px 2rem;
}

.call-inner {
  max-width: 1100px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 32px;
}

.call-eyebrow {
  font-size: 1rem;
  font-weight: 600;
  color: var(--tertiary-color);
  margin-bottom: 8px;
}

.call-title {
  font-size: 1.6rem;
  font-weight: 700;
  word-break: keep-all;
}

.call-number {
  margin-left: 8px;
  color: var(--tertiary-color);
  white-space: nowrap;
}

.call-desc {
  margin-top: 10px;
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.7);
  word-break: keep-all;
}

.call-actions {
  display: flex;
  gap: 12px;
  flex-shrink: 0;
}

.call-btn {
  display: inline-block;
  min-width: 160px;
  padding: 15px 24px;
  text-align: center;
  font-size: 1.05rem;
  font-weight: 600;
  transition: opacity 0.2s ease, background-color 0.2s ease;
}

.call-btn--primary {
  background: var(--primary-color);
  border: 1px solid var(--primary-color);
  color: #fff;
}

.call-btn--primary:hover {
  opacity: 0.9;
}

.call-btn--outline {
  border: 1px solid rgba(255, 255, 255, 0.4);
  color: #fff;
}

.call-btn--outline:hover {
  background: rgba(255, 255, 255, 0.08);
}

@media (max-width: 768px) {
  .call-band {
    padding: 44px 16px;
  }

  .call-inner {
    flex-direction: column;
    align-items: stretch;
    gap: 24px;
  }

  .call-title {
    font-size: 1.3rem;
  }

  .call-number {
    display: block;
    margin: 6px 0 0;
    font-size: 1.7rem;
  }

  .call-actions {
    flex-direction: column;
  }
}
</style>
