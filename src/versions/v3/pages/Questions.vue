<template>
  <!--
    3차 시안 '자주묻는질문' 본문 (11/13 메인 규칙 적용)
    - 페이지 제목은 묶음 틀(SectionLayout)이 그린다 → 여기서는 목록만
    - 규칙 6: 질문마다 옅은 선 한 줄, 그 밖의 장식 선 없음
    - 규칙 3: 질문 400 검정(22px) / 답변 400 회색 — 질문은 크기·색으로 구분
    - 규칙 5: 읽기만 하는 정보라 상자 없이(원본의 가격·자격증·연락처 상자도 덜어냄)
    - 하나만 열린다(원본과 같음). 열고 닫힐 때 부드럽게
  -->
  <div class="jj-container">
    <ul class="faq-list" v-reveal>
      <li
        v-for="(question, index) in QUESTIONS"
        :key="index"
        :ref="(el) => (itemEls[index] = el)"
        class="faq-item"
        :class="{ 'is-open': openIndex === index }"
      >
        <h3 class="faq-q-wrap">
          <button
            :id="`faq-q-${index}`"
            :ref="(el) => (buttonEls[index] = el)"
            type="button"
            class="faq-q"
            :aria-expanded="openIndex === index"
            :aria-controls="`faq-a-${index}`"
            @click="toggleQuestion(index)"
            @keydown="handleKeyDown($event, index)"
          >
            <span class="faq-num">Q{{ index + 1 }}</span>
            <span class="faq-title">{{ question.title }}</span>
            <span class="faq-icon" aria-hidden="true"></span>
          </button>
        </h3>
        <div :id="`faq-a-${index}`" class="faq-a" role="region" :aria-labelledby="`faq-q-${index}`">
          <div class="faq-a-inner">
            <div class="faq-a-body" v-html="question.answer"></div>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, onBeforeUnmount } from 'vue'
import { vReveal } from '../useReveal.js'

// 질문·답변은 원본(views/faq/Questions.vue)과 글자 하나 다르지 않게 유지한다. 새 내용을 넣지 말 것.
const QUESTIONS = [
  {
    title: '교육 과정은 어떤 종류가 있나요?',
    answer: `
      <p><strong>귀금속, 시계, 명품가방, 기타 잡화 및 소품 감정</strong>에 대한 전반적인 교육이 이루어집니다.</p>
      <p>또한 <strong>전당포 창업, 금거래소 운영 실무</strong> 등 각 과정별로 이론·실습·실전 노하우를 제공합니다.</p>
    `
  },
  {
    title: '수강 대상과 전제 조건이 있나요?',
    answer: `
      <p><strong>학력·경력 제한 없이 누구나 수강 가능</strong>합니다.</p>
      <p>특별한 자격증이 없어도 실습 장비와 교재를 제공받아 기초 이론부터 현장 실습을 통해 명품감정 교육을 받으실 수 있습니다.</p>
      <p>다만, 현업에 바로 투입되길 원하는 분들은 교육과정을 수료한 뒤 <span class="highlight">협력점 및 제휴점 가입을 권장</span>드립니다.</p>
    `
  },
  {
    title: '교육 기간과 일정은 어떻게 되나요?',
    answer: `
      <p>과정별로 <strong>4회차(총 16교시)</strong> 내외로 구성되어 운영됩니다.</p>
      <p>개강 일정은 <strong>매월 1회 이상</strong> 진행 중이며 수강신청문의를 통해 자세히 안내받으실 수 있습니다.</p>
    `
  },
  {
    title: '교재나 실습 장비는 별도로 구입해야 하나요?',
    answer: `
      <p>교재 및 실습 장비<strong>(시금액, 시금석, 루페, 타임그래퍼 등)</strong>는 교육원에서 제공됩니다.</p>
      <p>단, <span class="notice">개인용 노트북이나 메모장은 별도 준비</span>가 필요합니다.</p>
    `
  },
  {
    title: '교육비는 얼마인가요?',
    answer: `
      <p>명품 감정 과정(귀금속·명품·시계) 및 전당포 창업, 금거래소 실무등의 교육을 포함하여</p>
      <p class="price"><strong>440만원(부가세 포함)</strong>입니다.</p>
    `
  },
  {
    title: '결제 방법에는 어떤 것이 있나요?',
    answer: `
      <p><strong>신용카드(무이자 할부 불가능), 계좌이체, 무통장 입금</strong> 모두 가능하며,</p>
      <p>법인계약 시에는 <strong>법인카드 또는 전자세금계산서 처리</strong>가 가능합니다.</p>
    `
  },
  {
    title: '수료증과 자격증은 어떻게 발급되나요?',
    answer: `
      <p>이론·실습 과정을 모두 이수하고, 최종 시험에 합격 시,</p>
      <p class="certificate"><strong>국제명품감정사 자격증 취득</strong>이 가능합니다.</p>
    `
  },
  {
    title: '교육 장소는 어디인가요?',
    answer: `
      <p>강의 확정시 <strong>서울시 강남구 인근 교육장</strong>에서 진행 예정입니다.</p>
      <p>상세 주소 및 오시는 길은 별도 안내드립니다.</p>
    `
  },
  {
    title: '교육원 연락처 및 상담 시간은 어떻게 되나요?',
    answer: `
      <div class="contact-info">
        <p><strong>전화:</strong> <a href="tel:01099551140" class="contact-link">010-9955-1140</a></p>
        <p><strong>카카오톡채널:</strong> <a href="http://pf.kakao.com/_FXRwn" target="_blank" class="contact-link">http://pf.kakao.com/_FXRwn</a></p>
        <p><strong>1:1 문의:</strong> 홈페이지 내 수강신청문의를 이용해 주세요.</p>
      </div>
    `
  },
  {
    title: '수강 신청 방법을 알고 싶어요.',
    answer: `
      <div class="registration-steps">
        <ol>
          <li>홈페이지 '<strong>수강 신청 문의</strong>'를 통해 결제링크를 확인</li>
          <li><strong>계약금 결제</strong> 진행하시면 신청 완료</li>
          <li>결제 확인 후, <strong>교육 전 안내 문자 및 카카오톡 채팅방 주소</strong>를 발송</li>
          <li>교육 당일 <strong>교재 및 실습 장비</strong>를 배부</li>
        </ol>
      </div>
    `
  }
]

const openIndex = ref(null)
const itemEls = []
const buttonEls = []
let scrollTimer = null

// 아코디언: 하나만 열린다. 연 질문이 화면 밖으로 밀리면 펼침이 끝난 뒤 보이는 곳까지 부드럽게 옮긴다
const toggleQuestion = (index) => {
  const isOpen = openIndex.value === index
  openIndex.value = isOpen ? null : index
  if (isOpen) return

  clearTimeout(scrollTimer)
  scrollTimer = setTimeout(() => {
    itemEls[index]?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
  }, 520)
}

// 키보드: Enter·Space 는 버튼 기본 동작, ↑·↓ 로 이전·다음 질문으로 이동 (원본과 같음)
const handleKeyDown = (event, index) => {
  if (event.key === 'ArrowDown') {
    event.preventDefault()
    buttonEls[Math.min(index + 1, QUESTIONS.length - 1)]?.focus()
  } else if (event.key === 'ArrowUp') {
    event.preventDefault()
    buttonEls[Math.max(index - 1, 0)]?.focus()
  }
}

onBeforeUnmount(() => clearTimeout(scrollTimer))
</script>

<style scoped>
.faq-item {
  border-bottom: 1px solid var(--c-line);
  scroll-margin-top: 120px;
}

.faq-q-wrap {
  font-size: inherit;
  font-weight: inherit;
}

.faq-q {
  display: grid;
  grid-template-columns: 64px minmax(0, 1fr) 24px;
  align-items: center;
  gap: 16px;
  width: 100%;
  padding: 26px 0;
  border: 0;
  background: transparent;
  text-align: left;
  cursor: pointer;
}

.faq-q:focus-visible {
  outline: 2px solid var(--c-text);
  outline-offset: 2px;
}

.faq-num {
  font-size: var(--fs-body);
  font-weight: 700;
  color: var(--c-sub);
}

.faq-title {
  font-size: var(--fs-item);
  font-weight: 400; /* 11/13 "질문 글자가 너무 굵어" → 700에서 낮춤(규칙 3의 두 굵기 중 400) */
  line-height: 1.45;
  letter-spacing: -0.02em;
  color: var(--c-text);
  word-break: keep-all;
}

/* 펼침 표시: 아래 꺾쇠 → 열리면 위로 */
.faq-icon {
  justify-self: center;
  width: 10px;
  height: 10px;
  margin-top: -5px;
  border-right: 2px solid var(--c-text);
  border-bottom: 2px solid var(--c-text);
  transform: rotate(45deg);
  transition: transform var(--t-1) var(--ease-soft);
}

.faq-item.is-open .faq-icon {
  margin-top: 5px;
  transform: rotate(-135deg);
}

/* 열고 닫기: 높이를 0 ↔ 내용 높이로 부드럽게. 닫힌 답변은 화면·키보드 이동에서 빠진다 */
.faq-a {
  display: grid;
  grid-template-rows: 0fr;
  visibility: hidden;
  transition:
    grid-template-rows var(--t-1) var(--ease-soft),
    visibility 0s linear var(--t-1);
}

.faq-item.is-open .faq-a {
  grid-template-rows: 1fr;
  visibility: visible;
  transition:
    grid-template-rows var(--t-1) var(--ease-soft),
    visibility 0s;
}

.faq-a-inner {
  min-height: 0;
  overflow: hidden;
}

.faq-a-body {
  max-width: calc(880px + 80px);
  padding: 0 40px 32px 80px;
  font-size: var(--fs-body);
  font-weight: 400;
  line-height: 1.8;
  color: var(--c-sub);
  word-break: keep-all;
}

/* ── 답변 안 원본 마크업(v-html) 다듬기: 색·굵기는 규칙 3 안에서만 ── */
.faq-a-body :deep(p + p) {
  margin-top: 6px;
}

.faq-a-body :deep(strong),
.faq-a-body :deep(.highlight),
.faq-a-body :deep(.notice) {
  font-weight: 700;
  color: var(--c-text);
}

/* 연락처: 「항목명 : 내용」 한 줄에 하나, 항목명 같은 폭(규칙 7) */
.faq-a-body :deep(.contact-info p) {
  display: grid;
  grid-template-columns: 120px minmax(0, 1fr);
  gap: 16px;
  margin-top: 0;
  padding: 4px 0;
}

.faq-a-body :deep(.contact-link) {
  color: var(--c-text);
  text-decoration: underline;
  text-underline-offset: 3px;
  word-break: break-all;
  transition: color var(--t-1) var(--ease-soft);
}

.faq-a-body :deep(.contact-link:hover) {
  color: var(--c-sub);
}

/* 수강 신청 순서: 번호 목록 */
.faq-a-body :deep(.registration-steps ol) {
  padding-left: 22px;
  list-style: decimal;
}

.faq-a-body :deep(.registration-steps li + li) {
  margin-top: 6px;
}

.faq-a-body :deep(.registration-steps li::marker) {
  font-weight: 700;
  color: var(--c-text);
}

@media (max-width: 768px) {
  .faq-q {
    grid-template-columns: 36px minmax(0, 1fr) 20px;
    gap: 10px;
    padding: 20px 0;
  }

  .faq-a-body {
    padding: 0 0 24px 46px;
    line-height: 1.75;
  }

  .faq-a-body :deep(.contact-info p) {
    grid-template-columns: 100px minmax(0, 1fr);
    gap: 10px;
  }
}
</style>
