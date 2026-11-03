<template>
  <section class="main-section courses">
    <div class="section-inner">
      <MainSectionHead eyebrow="curriculum" title="교육과정" desc="창업 목표에 맞는 과정을 선택하세요." />

      <div class="course-grid">
        <router-link
          v-for="course in COURSES"
          :key="course.id"
          :to="{ path: '/education/curriculum', query: { course: course.id } }"
          class="course-card"
        >
          <span class="course-tag">{{ course.tag }}</span>
          <h3 class="course-name">{{ course.name }}</h3>
          <p class="course-summary">{{ course.summary }}</p>
          <ul class="course-items">
            <li v-for="item in course.items" :key="item">{{ item }}</li>
          </ul>
          <span class="course-more">커리큘럼 보기 →</span>
        </router-link>
      </div>

      <p class="course-notice">※ 명품감정 자격증반은 커리큘럼이 달라질 수 있습니다.</p>
    </div>
  </section>
</template>

<script setup>
import MainSectionHead from './MainSectionHead.vue'

// 커리큘럼 페이지(edu-step.png 및 명품창업 표) 내용 기준 요약
const COURSES = [
  {
    id: 'pawnshop',
    tag: '오프라인 4회차 · 16교시',
    name: '전당포 커리큘럼',
    summary: '전당포 창업에 필요한 감정 실습과 운영 실무를 함께 배웁니다.',
    items: [
      '전당포 창업 개요(시장성, 사업성, 주고객층)',
      '귀금속 · 롤렉스 · 명품가방 감정 실습',
      '기타 고가품 감정법(IT기기, 카메라, 주류 등)',
      '전당포 실무 · 전당포 세무처리',
      '명품감정 시험 및 수료식',
    ],
  },
  {
    id: 'luxury',
    tag: '명품감정',
    name: '명품창업(명품감정) 커리큘럼',
    summary: '귀금속 · 명품시계 · 명품가방 감정을 과목별로 배웁니다.',
    items: [
      '귀금속(금, 은, 다이아몬드) 감정 및 실습',
      '롤렉스 · 까르띠에 · IWC · 오데마피게 감정',
      '루이비통 · 샤넬 · 고야드 등 명품가방 감정',
      '기타 고가품 감정법',
      '명품감정 시험',
    ],
  },
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

.course-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
}

.course-card {
  display: flex;
  flex-direction: column;
  padding: 36px 34px 32px;
  border: 1px solid #ddd;
  border-top: 2px solid #111;
  background: #fff;
  transition: border-color 0.2s ease;
}

.course-card:hover {
  border-color: var(--primary-color);
}

.course-tag {
  align-self: flex-start;
  padding: 4px 10px;
  border: 1px solid var(--primary-color);
  color: var(--primary-color);
  font-size: 0.85rem;
  font-weight: 600;
}

.course-name {
  margin-top: 18px;
  font-size: 1.45rem;
  font-weight: 700;
  color: #111;
  word-break: keep-all;
}

.course-summary {
  margin-top: 10px;
  font-size: 1rem;
  line-height: 1.7;
  color: #555;
  word-break: keep-all;
}

.course-items {
  flex: 1;
  margin-top: 22px;
  padding-top: 20px;
  border-top: 1px solid #e5e5e5;
}

.course-items li {
  position: relative;
  padding-left: 14px;
  font-size: 0.98rem;
  line-height: 2;
  color: #333;
  word-break: keep-all;
}

.course-items li::before {
  content: "";
  position: absolute;
  left: 0;
  top: 0.95em;
  width: 5px;
  height: 1px;
  background: var(--primary-color);
}

.course-more {
  margin-top: 26px;
  padding: 13px 0;
  text-align: center;
  border: 1px solid var(--primary-color);
  color: var(--primary-color);
  font-weight: 600;
  transition: background-color 0.2s ease, color 0.2s ease;
}

.course-card:hover .course-more {
  background: var(--primary-color);
  color: #fff;
}

.course-notice {
  margin-top: 20px;
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--primary-color);
  word-break: keep-all;
}

@media (max-width: 768px) {
  .main-section {
    padding: 60px 16px;
  }

  .course-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .course-card {
    padding: 26px 20px 22px;
  }

  .course-name {
    font-size: 1.25rem;
  }
}
</style>
