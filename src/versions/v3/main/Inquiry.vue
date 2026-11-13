<template>
  <!--
    수강신청 문의 — 헤더·푸터의 '수강신청 문의'가 여기로 내려온다 (11/12)
    11/13 디자인 규칙
    - 규칙 8: 다른 섹션과 같은 머리(V3Head)
    - 규칙 5: 고르는(작성하는) 대상인 문의 폼만 베이지 상자. 섹션 바탕은 흰색
    - 다른 문의 방법(전화·카카오톡)은 눌러서 바로 연결되는 카드(11/13)
  -->
  <section id="inquiry" class="inquiry">
    <div class="jj-container">
      <V3Head title="수강신청문의" desc="과정 구성과 개강 일정, 창업 준비까지 담당자가 직접 안내해 드립니다." />

      <div class="inquiry-inner">
        <div class="inquiry-box" v-reveal>
          <InquiryForm id-prefix="v3-main-inquiry" />
        </div>

        <!-- 11/13 "다른 방법으로 문의 조금 더" → 방법마다 눌러서 바로 연결되는 카드(아이콘 + 크게 + 화살표) -->
        <div class="inquiry-alt" v-reveal="120">
          <p class="alt-title">다른 방법으로 문의</p>
          <a :href="PHONE_TEL" class="alt-card">
            <span class="alt-icon alt-icon--phone" aria-hidden="true">
              <svg viewBox="0 0 24 24" focusable="false">
                <path
                  fill="currentColor"
                  d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.6 21 3 13.4 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1l-2.3 2.2z"
                />
              </svg>
            </span>
            <span class="alt-text">
              <span class="alt-label">전화 문의</span>
              <span class="alt-value">{{ PHONE_DISPLAY }}</span>
            </span>
            <span class="alt-arrow" aria-hidden="true">→</span>
          </a>
          <a :href="KAKAO_CHANNEL_URL" target="_blank" rel="noopener noreferrer" class="alt-card">
            <span class="alt-icon alt-icon--kakao" aria-hidden="true">
              <svg viewBox="0 0 24 24" focusable="false">
                <path
                  fill="currentColor"
                  d="M12 3C6.48 3 2 6.48 2 10.8c0 2.78 1.86 5.22 4.66 6.6l-.95 3.48c-.08.3.26.54.52.37l4.15-2.74c.53.07 1.07.1 1.62.1 5.52 0 10-3.48 10-7.8S17.52 3 12 3z"
                />
              </svg>
            </span>
            <span class="alt-text">
              <span class="alt-label">카카오톡 문의</span>
              <span class="alt-value">카카오톡 채널 열기</span>
            </span>
            <span class="alt-arrow" aria-hidden="true">→</span>
          </a>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import V3Head from './V3Head.vue'
import { vReveal } from '../useReveal.js'
import InquiryForm from '@/versions/v3/InquiryForm.vue'
import { PHONE_DISPLAY, PHONE_TEL, KAKAO_CHANNEL_URL } from '@/constants/contact.js'
</script>

<style scoped>
.inquiry {
  padding: var(--v3-section-y) 0;
  background: var(--c-bg);
  scroll-margin-top: 100px;
}

.inquiry-inner {
  display: grid;
  grid-template-columns: 7fr 4fr;
  gap: var(--v3-gap);
  align-items: start;
}

.inquiry-box {
  padding: 40px;
  background: var(--c-bg-alt);
}

.alt-title {
  margin-bottom: 14px;
  font-size: var(--fs-body);
  font-weight: 700;
  color: var(--c-text);
}

/* 방법마다 카드 하나(누르면 바로 전화·카카오톡). 문의 폼처럼 '하는 것'이라 흰 상자(규칙 5) */
.alt-card {
  display: grid;
  grid-template-columns: 52px minmax(0, 1fr) auto;
  align-items: center;
  gap: 18px;
  padding: 24px 26px;
  background: var(--c-bg-alt);
  transition:
    box-shadow var(--t-1) var(--ease-soft),
    transform var(--t-1) var(--ease-soft);
}

.alt-card + .alt-card {
  margin-top: 12px;
}

/* 11/13 "hover 시 테두리 없애" — 테두리 대신 살짝 떠오르며 옅은 그림자 */
.alt-card:hover,
.alt-card:focus-visible {
  transform: translateY(-2px);
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.06);
}

.alt-card:focus-visible {
  outline: none;
}

.alt-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 52px;
  height: 52px;
  border-radius: 50%;
}

.alt-icon svg {
  width: 24px;
  height: 24px;
}

.alt-icon--phone {
  background: var(--c-text);
  color: #ffffff;
}

.alt-icon--kakao {
  background: #fee500;
  color: #191919;
}

.alt-text {
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
}

.alt-label {
  font-size: var(--fs-small);
  color: var(--c-sub);
}

.alt-value {
  font-size: var(--fs-item);
  font-weight: 700;
  letter-spacing: -0.02em;
  color: var(--c-text);
  word-break: keep-all;
}

.alt-arrow {
  font-size: 20px;
  color: var(--c-text);
  transition: transform var(--t-1) var(--ease-soft);
}

.alt-card:hover .alt-arrow {
  transform: translateX(4px);
}

@media (max-width: 1080px) {
  .inquiry {
    scroll-margin-top: 64px;
  }

  .inquiry-inner {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .inquiry-box {
    padding: 28px 20px;
  }

  .alt-card {
    grid-template-columns: 44px minmax(0, 1fr) auto;
    gap: 14px;
    padding: 18px 18px;
  }

  .alt-icon {
    width: 44px;
    height: 44px;
  }
}
</style>
