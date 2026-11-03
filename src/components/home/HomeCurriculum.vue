<template>
  <section class="ui-section ui-section--warm" aria-labelledby="curriculum-title">
    <div class="ui-container">
      <div class="ui-section-head ui-section-head--center">
        <p class="ui-eyebrow">교육 과정</p>
        <h2 id="curriculum-title" class="ui-title">목표에 맞는 두 가지 과정을 운영합니다</h2>
        <p class="ui-desc">
          전당포 창업을 준비하신다면 전당포 창업 과정을, 명품 감정 전문성을 바탕으로 한 창업을
          원하신다면 명품창업(명품감정) 과정을 선택하세요.
        </p>
      </div>

      <ul class="course-grid">
        <li v-for="course in COURSES" :key="course.id" class="course-card">
          <div class="course-top">
            <span class="course-badge">{{ course.badge }}</span>
            <h3 class="course-name">{{ course.name }}</h3>
            <p class="course-summary">{{ course.summary }}</p>
          </div>
          <ul class="course-points">
            <li v-for="point in course.highlights" :key="point">
              <AppIcon name="check" :size="16" :stroke-width="2.2" />
              {{ point }}
            </li>
          </ul>
          <router-link :to="curriculumLink(course.id)" class="ui-btn ui-btn--outline ui-btn--block">
            커리큘럼 자세히 보기
            <AppIcon name="arrowRight" :size="16" />
          </router-link>
        </li>
      </ul>

      <div class="overview">
        <h3 class="overview-title">교육 안내</h3>
        <dl class="overview-list">
          <div v-for="row in OVERVIEW" :key="row.label" class="overview-row">
            <dt>{{ row.label }}</dt>
            <dd>{{ row.value }}</dd>
          </div>
        </dl>
      </div>

      <p class="notice" role="note">※ {{ CURRICULUM_NOTICE }}</p>
    </div>
  </section>
</template>

<script setup>
import AppIcon from '@/components/ui/AppIcon.js'
import { COURSES, CURRICULUM_NOTICE } from '@/data/curriculum.js'
import { curriculumLink } from '@/constants/navigation.js'

// FAQ에 게시된 교육 안내 내용 기준
const OVERVIEW = Object.freeze([
  { label: '교육 구성', value: '과정별 4회차(총 16교시) 내외' },
  { label: '개강 일정', value: '매월 1회 이상 (상담 시 일정 안내)' },
  { label: '교육 장소', value: '서울시 강남구 인근 교육장' },
  { label: '제공 사항', value: '교재 및 실습 장비 (시금액·시금석·루페·타임그래퍼 등)' },
  { label: '수강 대상', value: '학력·경력 제한 없이 누구나' },
  { label: '수료 혜택', value: '최종 시험 합격 시 국제명품감정사 자격증 취득' },
])
</script>

<style scoped>
.course-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
}

.course-card {
  display: flex;
  flex-direction: column;
  gap: 28px;
  padding: 40px 36px 36px;
  background-color: var(--surface);
  border: 1px solid var(--line);
  border-radius: var(--radius-lg);
}

.course-card:first-child {
  border-top: 3px solid var(--gold-700);
}

.course-card:last-child {
  border-top: 3px solid var(--charcoal);
}

.course-badge {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--gold-700);
}

.course-name {
  margin-top: 8px;
  font-size: 1.625rem;
  font-weight: 700;
  color: var(--ink-900);
  letter-spacing: -0.03em;
}

.course-summary {
  margin-top: 12px;
  font-size: 0.9875rem;
  line-height: 1.75;
  color: var(--ink-500);
  word-break: keep-all;
}

.course-points {
  flex: 1;
  display: grid;
  align-content: start;
  gap: 12px;
  padding-top: 24px;
  border-top: 1px solid var(--line);
}

.course-points li {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  font-size: 1rem;
  color: var(--ink-800);
  line-height: 1.5;
  word-break: keep-all;
}

.course-points .app-icon {
  margin-top: 3px;
  flex-shrink: 0;
  color: var(--gold-700);
}

/* ── 교육 안내 표 ── */
.overview {
  margin-top: 40px;
  display: grid;
  grid-template-columns: 180px 1fr;
  gap: 24px;
  padding: 32px 36px;
  background-color: var(--surface);
  border: 1px solid var(--line);
  border-radius: var(--radius-lg);
}

.overview-title {
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--ink-900);
}

.overview-list {
  display: grid;
  grid-template-columns: 1fr 1fr;
  column-gap: 32px;
}

.overview-row {
  display: flex;
  gap: 16px;
  padding: 12px 0;
  border-bottom: 1px solid var(--line);
  font-size: 0.9375rem;
  line-height: 1.6;
}

.overview-row dt {
  flex: 0 0 72px;
  color: var(--ink-500);
}

.overview-row dd {
  margin: 0;
  color: var(--ink-800);
  word-break: keep-all;
}

.notice {
  margin-top: 16px;
  font-size: 0.9375rem;
  font-weight: 600;
  color: var(--gold-700);
  word-break: keep-all;
}

@media (max-width: 1024px) {
  .overview {
    grid-template-columns: 1fr;
    gap: 8px;
  }
}

@media (max-width: 768px) {
  .course-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .course-card {
    padding: 28px 20px 24px;
    gap: 22px;
  }

  .course-name {
    font-size: 1.375rem;
  }

  .overview {
    margin-top: 24px;
    padding: 24px 20px;
  }

  .overview-list {
    grid-template-columns: 1fr;
  }
}
</style>
