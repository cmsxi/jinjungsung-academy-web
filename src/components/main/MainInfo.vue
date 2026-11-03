<template>
  <section class="main-section info">
    <div class="section-inner">
      <MainSectionHead eyebrow="information" title="교육 안내" />

      <table class="info-table">
        <tbody>
          <tr v-for="row in INFO_ROWS" :key="row.label">
            <th scope="row">{{ row.label }}</th>
            <td>{{ row.value }}</td>
          </tr>
        </tbody>
      </table>

      <MainMoreLink to="/faq/questions" label="자주묻는질문 보기" />
    </div>
  </section>
</template>

<script setup>
import MainSectionHead from './MainSectionHead.vue'
import MainMoreLink from './MainMoreLink.vue'

// 자주묻는질문(Questions.vue) 답변 기준
const INFO_ROWS = [
  { label: '교육 기간', value: '과정별 4회차(총 16교시) 내외' },
  { label: '개강 일정', value: '매월 1회 이상 (수강신청문의 시 자세히 안내)' },
  { label: '교육 장소', value: '서울시 강남구 인근 교육장' },
  { label: '교재 · 장비', value: '교재 및 실습 장비(시금액, 시금석, 루페, 타임그래퍼 등) 제공' },
  { label: '수강 대상', value: '학력 · 경력 제한 없이 누구나' },
  { label: '수료', value: '최종 시험 합격 시 국제명품감정사 자격증 취득' },
]
</script>

<style scoped>
.main-section {
  padding: 90px 2rem;
  background: #fff;
}

.section-inner {
  max-width: 1100px;
  margin: 0 auto;
}

.info-table {
  width: 100%;
  border-collapse: collapse;
  border-top: 2px solid #111;
  font-size: 1.02rem;
}

.info-table th,
.info-table td {
  padding: 18px 24px;
  border-bottom: 1px solid #ddd;
  text-align: left;
  vertical-align: top;
  word-break: keep-all;
}

.info-table th {
  width: 200px;
  background: #fafafa;
  font-weight: 600;
  color: #111;
}

.info-table td {
  color: #333;
}

@media (max-width: 768px) {
  .main-section {
    padding: 60px 16px;
  }

  .info-table {
    font-size: 0.95rem;
  }

  .info-table th,
  .info-table td {
    padding: 14px 12px;
  }

  .info-table th {
    width: 96px;
  }
}
</style>
