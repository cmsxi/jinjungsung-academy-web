<template>
  <section id="consult" class="ui-section ui-section--warm consult" aria-labelledby="consult-title">
    <div class="ui-container consult-inner">
      <div class="call-panel">
        <p class="ui-eyebrow call-eyebrow">상담 문의</p>
        <h2 id="consult-title" class="call-title">창업 상담,<br />전화 한 통으로 시작하세요</h2>
        <p class="call-desc">
          과정 구성과 개강 일정, 창업 준비까지 담당자가 직접 안내해 드립니다.
        </p>

        <a :href="PHONE_TEL" class="call-number-box">
          <span class="call-number-label">전화 상담</span>
          <strong class="call-number">{{ PHONE_DISPLAY }}</strong>
        </a>

        <div class="call-actions">
          <a :href="PHONE_TEL" class="ui-btn ui-btn--primary ui-btn--lg ui-btn--block">
            <AppIcon name="phone" :size="18" />
            지금 전화 걸기
          </a>
          <a
            :href="KAKAO_CHANNEL_URL"
            target="_blank"
            rel="noopener noreferrer"
            class="ui-btn ui-btn--lg ui-btn--block kakao-btn"
          >
            <AppIcon name="message" :size="18" />
            카카오톡 채널 문의
          </a>
        </div>
      </div>

      <div class="form-panel">
        <div class="form-head">
          <h3 class="form-title">상담 신청서</h3>
          <p class="form-desc">
            남겨주신 연락처로 담당자가 연락드립니다.
            <span class="form-required"><span class="req">*</span> 필수 입력</span>
          </p>
        </div>
        <ConsultForm />
      </div>
    </div>
  </section>
</template>

<script setup>
import AppIcon from '@/components/ui/AppIcon.js'
import ConsultForm from '@/components/ConsultForm.vue'
import { PHONE_DISPLAY, PHONE_TEL, KAKAO_CHANNEL_URL } from '@/constants/contact.js'
</script>

<style scoped>
.consult {
  scroll-margin-top: var(--header-height);
}

.consult-inner {
  display: grid;
  grid-template-columns: 1fr 1.15fr;
  gap: 24px;
  align-items: stretch;
}

.call-panel {
  display: flex;
  flex-direction: column;
  padding: 48px 44px;
  border-radius: var(--radius-lg);
  background-color: var(--charcoal);
  color: #fff;
}

.call-eyebrow {
  color: var(--gold-400);
}

.call-eyebrow::before {
  background-color: var(--gold-400);
}

.call-title {
  font-size: 2rem;
  line-height: 1.4;
  font-weight: 700;
  letter-spacing: -0.03em;
  word-break: keep-all;
}

.call-desc {
  margin-top: 14px;
  font-size: 1rem;
  line-height: 1.75;
  color: rgba(255, 255, 255, 0.68);
  word-break: keep-all;
}

.call-number-box {
  display: grid;
  gap: 4px;
  margin-top: auto;
  padding: 28px 0 24px;
  border-top: 1px solid rgba(255, 255, 255, 0.12);
}

.call-number-label {
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.55);
}

.call-number {
  font-size: 2.5rem;
  font-weight: 700;
  letter-spacing: 0;
  color: #fff;
}

.call-number-box:hover .call-number {
  color: var(--gold-400);
}

.call-actions {
  display: grid;
  gap: 10px;
}

.kakao-btn {
  background-color: transparent;
  border-color: rgba(255, 255, 255, 0.24);
  color: #fff;
}

.kakao-btn:hover {
  border-color: #fff;
}

.form-panel {
  padding: 44px 44px 40px;
  border-radius: var(--radius-lg);
  background-color: var(--surface);
  border: 1px solid var(--line);
}

.form-head {
  margin-bottom: 28px;
}

.form-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--ink-900);
  letter-spacing: -0.02em;
}

.form-desc {
  margin-top: 8px;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 8px;
  font-size: 0.9375rem;
  color: var(--ink-500);
}

.form-required {
  font-size: 0.875rem;
}

.req {
  color: #c0392b;
}

@media (max-width: 1024px) {
  .consult-inner {
    grid-template-columns: 1fr;
  }

  .call-number-box {
    margin-top: 28px;
  }
}

@media (max-width: 768px) {
  .call-panel {
    padding: 32px 20px;
  }

  .call-title {
    font-size: 1.5rem;
  }

  .call-number {
    font-size: 2rem;
  }

  .form-panel {
    padding: 28px 20px;
  }

  .form-title {
    font-size: 1.25rem;
  }
}
</style>
