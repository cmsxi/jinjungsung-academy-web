<template>
  <!--
    3차 시안 '수강신청문의' 페이지 (11/13 메인 규칙 적용)
    - 공통 머리(PageHead)에만 페이지 이름. 본문에 같은 제목을 다시 두지 않는다
    - 문의 폼은 메인과 같은 InquiryForm(고객사 확인 항목: 성함·연락처·거주지역·알게 된 경로·문의 내용·동의)
      원본의 '*표시는 필수 입력요소입니다' · 접수 완료 · 오류 안내는 폼 안에 들어 있다
    - 규칙 5: 작성하는 폼과 눌러서 연결되는 카드만 연한 회색 상자, 입력 칸은 흰색
    - 다른 문의 방법(전화·카카오톡) 카드는 메인(main/Inquiry.vue)과 같은 모양
  -->
  <div class="page">
    <PageHead title="수강신청문의" />

    <div class="page-body">
      <div class="jj-container">
        <div class="inquiry-inner">
          <div class="inquiry-box" v-reveal>
            <InquiryForm id-prefix="v3-page-inquiry" />
          </div>

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
    </div>
  </div>
</template>

<script setup>
import PageHead from './PageHead.vue'
import { vReveal } from '../useReveal.js'
import InquiryForm from '@/versions/v3/InquiryForm.vue'
import { PHONE_DISPLAY, PHONE_TEL, KAKAO_CHANNEL_URL } from '@/constants/contact.js'
</script>

<style scoped>
.page {
  background: #ffffff;
}

/* 머리 아래 본문 — SectionLayout 의 .page-body 와 같은 간격 */
.page-body {
  padding: 64px 0 var(--v3-section-y);
}

.inquiry-inner {
  display: grid;
  grid-template-columns: 7fr 4fr;
  gap: var(--v3-gap);
  align-items: start;
}

/* 흰 페이지 위의 상자는 연한 회색(입력 칸은 흰색 그대로) */
.inquiry-box {
  padding: 40px;
  background: var(--c-bg);
}

.alt-title {
  margin-bottom: 14px;
  font-size: var(--fs-body);
  font-weight: 700;
  color: var(--c-text);
}

/* 방법마다 카드 하나(누르면 바로 전화·카카오톡) — 메인과 같은 모양, 바탕만 연한 회색 */
.alt-card {
  display: grid;
  grid-template-columns: 52px minmax(0, 1fr) auto;
  align-items: center;
  gap: 18px;
  padding: 24px 26px;
  background: var(--c-bg);
  transition:
    box-shadow var(--t-1) var(--ease-soft),
    transform var(--t-1) var(--ease-soft);
}

.alt-card + .alt-card {
  margin-top: 12px;
}

.alt-card:hover,
.alt-card:focus-visible {
  transform: translateY(-2px);
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.06);
}

.alt-card:focus-visible {
  outline: 2px solid var(--c-text);
  outline-offset: 3px;
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
  .inquiry-inner {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .page-body {
    padding-top: 40px;
  }

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
