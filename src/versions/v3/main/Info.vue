<template>
  <!--
    교육 안내 — 11/13 디자인 규칙
    - 규칙 7: 「항목명 : 내용」은 한 줄에 하나, 왼쪽에 항목명(같은 폭)
    - 규칙 6: 표처럼 줄마다 옅은 선 (규칙 5 메모 "교육기간 ↔ 개강일정이 구분되게")
    - 규칙 5: 읽기만 하는 정보라 상자 없이
  -->
  <section class="info">
    <div class="jj-container">
      <V3Head title="교육 안내" link-to="/faq/questions" link-label="자주묻는질문 보기" />

      <dl class="info-list" v-reveal>
        <div v-for="row in INFO_ROWS" :key="row.label" class="info-row">
          <dt>{{ row.label }}</dt>
          <dd>{{ row.value }}</dd>
        </div>
      </dl>
    </div>
  </section>
</template>

<script setup>
import V3Head from './V3Head.vue'
import { vReveal } from '../useReveal.js'

// 자주묻는질문(Questions.vue) 답변 기준. 새 정보를 추가하지 말 것.
const INFO_ROWS = [
  { label: '교육 기간', value: '과정별 4회차(총 16교시) 내외' },
  { label: '개강 일정', value: '매월 1회 이상 (수강신청문의 시 자세히 안내)' },
  { label: '교육 장소', value: '서울시 강남구 인근 교육장' },
  { label: '수강 대상', value: '학력 · 경력 제한 없이 누구나' },
  { label: '교재 · 장비', value: '교재 및 실습 장비(시금액, 시금석, 루페, 타임그래퍼 등) 제공' },
  { label: '수료', value: '최종 시험 합격 시 국제명품감정사 자격증 취득' },
]
</script>

<style scoped>
.info {
  padding: var(--v3-section-y) 0;
  background: var(--c-bg);
}

.info-list {
  border-top: 1px solid var(--c-line);
}

.info-row {
  display: grid;
  grid-template-columns: 160px minmax(0, 1fr);
  gap: 24px;
  padding: 18px 0;
  border-bottom: 1px solid var(--c-line);
}

.info-row dt {
  font-size: var(--fs-body);
  font-weight: 700;
  line-height: 1.6;
  color: var(--c-text);
}

.info-row dd {
  font-size: var(--fs-body);
  line-height: 1.6;
  color: var(--c-sub);
  word-break: keep-all;
}

@media (max-width: 560px) {
  .info-row {
    grid-template-columns: 88px minmax(0, 1fr);
    gap: 14px;
    padding: 14px 0;
  }
}
</style>
