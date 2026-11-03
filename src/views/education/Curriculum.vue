<template>
  <div class="curriculum">
    <div class="course-switch" role="tablist" aria-label="교육 과정 선택">
      <button
        v-for="item in COURSES"
        :id="`course-tab-${item.id}`"
        :key="item.id"
        type="button"
        role="tab"
        class="course-tab"
        :class="{ 'is-active': item.id === course.id }"
        :aria-selected="item.id === course.id"
        aria-controls="course-panel"
        @click="selectCourse(item.id)"
      >
        <span class="course-tab-badge">{{ item.badge }}</span>
        <span class="course-tab-label">{{ item.label }}</span>
      </button>
    </div>

    <section
      id="course-panel"
      class="course-panel"
      role="tabpanel"
      :aria-labelledby="`course-tab-${course.id}`"
    >
      <header class="course-head">
        <h2 class="course-name">{{ course.name }}</h2>
        <p class="course-summary">{{ course.summary }}</p>
        <ul class="course-facts">
          <li v-for="fact in course.facts" :key="fact">{{ fact }}</li>
        </ul>
      </header>

      <!-- 회차별 시간표 -->
      <table v-if="course.sessions" class="session-table">
        <caption class="sr-only">{{ course.name }} 회차별 강의 내용</caption>
        <thead>
          <tr>
            <th scope="col">회차</th>
            <th scope="col">교시</th>
            <th scope="col">강의 내용</th>
          </tr>
        </thead>
        <tbody v-for="session in course.sessions" :key="session.round">
          <tr v-for="(lesson, index) in session.lessons" :key="lesson">
            <th
              v-if="index === 0"
              scope="rowgroup"
              :rowspan="session.lessons.length"
              class="session-round"
            >{{ session.round }}회차</th>
            <td class="session-lesson-no">{{ index + 1 }}교시</td>
            <td class="session-lesson">{{ lesson }}</td>
          </tr>
        </tbody>
      </table>

      <!-- 과목 구성 -->
      <ol v-else-if="course.modules" class="module-grid">
        <li v-for="(module, index) in course.modules" :key="module.title" class="module-card">
          <span class="module-no">{{ String(index + 1).padStart(2, '0') }}</span>
          <h3 class="module-title">{{ module.title }}</h3>
          <ul class="module-items">
            <li v-for="item in module.items" :key="item">{{ item }}</li>
          </ul>
        </li>
      </ol>

      <p v-if="course.footnote" class="course-footnote">{{ course.footnote }}</p>
    </section>

    <p class="curriculum-notice" role="note">※ {{ CURRICULUM_NOTICE }}</p>

    <div class="curriculum-cta">
      <div>
        <strong class="cta-title">과정 선택이 고민되신다면 상담으로 안내해 드립니다.</strong>
        <p class="cta-desc">창업 목표와 일정에 맞는 과정을 담당자가 직접 설명해 드립니다.</p>
      </div>
      <div class="cta-actions">
        <a :href="PHONE_TEL" class="ui-btn ui-btn--primary">
          <AppIcon name="phone" :size="18" />
          {{ PHONE_DISPLAY }}
        </a>
        <router-link to="/registration" class="ui-btn ui-btn--outline">수강신청문의</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AppIcon from '@/components/ui/AppIcon.js'
import { COURSES, CURRICULUM_NOTICE, findCourse } from '@/data/curriculum.js'
import { PHONE_DISPLAY, PHONE_TEL } from '@/constants/contact.js'
import { useSEO } from '@/composables/useSEO.js'

useSEO({
  path: '/education/curriculum',
  title: '커리큘럼 | 전당포 창업 과정 · 명품창업(명품감정) 과정 - 국제명품감정교육원',
  description:
    '전당포 창업 과정과 명품창업(명품감정) 과정의 커리큘럼을 안내합니다. 귀금속·명품시계·명품가방 감정 실습부터 전당포 실무와 세무 처리까지 배울 수 있습니다.',
})

const route = useRoute()
const router = useRouter()

const course = computed(() => findCourse(route.query.course))

const selectCourse = (courseId) => {
  if (courseId === course.value.id) return
  router.replace({ query: { ...route.query, course: courseId } })
}
</script>

<style scoped>
.curriculum {
  padding: 8px 0 40px;
  color: var(--ink-900);
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
  white-space: nowrap;
}

/* ── 과정 선택 ── */
.course-switch {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-bottom: 28px;
}

.course-tab {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 6px;
  padding: 20px 24px;
  border: 1px solid var(--line);
  border-radius: var(--radius-md);
  background-color: var(--surface);
  text-align: left;
  cursor: pointer;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.course-tab:hover {
  border-color: var(--line-strong);
}

.course-tab.is-active {
  border-color: var(--gold-700);
  box-shadow: inset 0 0 0 1px var(--gold-700);
}

.course-tab-badge {
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--gold-700);
}

.course-tab-label {
  font-size: 1.1875rem;
  font-weight: 700;
  color: var(--ink-900);
  letter-spacing: -0.02em;
}

.course-tab:not(.is-active) .course-tab-label {
  color: var(--ink-500);
}

/* ── 과정 본문 ── */
.course-panel {
  background-color: var(--surface);
  border: 1px solid var(--line);
  border-radius: var(--radius-lg);
  padding: 40px;
}

.course-head {
  padding-bottom: 28px;
  margin-bottom: 28px;
  border-bottom: 1px solid var(--line);
}

.course-name {
  font-size: 1.625rem;
  font-weight: 700;
  letter-spacing: -0.03em;
}

.course-summary {
  margin-top: 10px;
  font-size: 1rem;
  line-height: 1.75;
  color: var(--ink-500);
  word-break: keep-all;
}

.course-facts {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 18px;
}

.course-facts li {
  padding: 6px 12px;
  border-radius: 999px;
  background-color: var(--surface-warm);
  border: 1px solid var(--line);
  font-size: 0.875rem;
  color: var(--ink-700);
}

/* ── 회차표 ── */
.session-table {
  width: 100%;
  border-collapse: collapse;
  border-top: 2px solid var(--ink-900);
  font-size: 1rem;
}

.session-table thead th {
  padding: 14px 12px;
  background-color: var(--surface-warm);
  border-bottom: 1px solid var(--line-strong);
  font-weight: 600;
  color: var(--ink-700);
}

.session-table td,
.session-round {
  padding: 15px 16px;
  border-bottom: 1px solid var(--line);
}

.session-round {
  width: 120px;
  text-align: center;
  font-weight: 700;
  border-right: 1px solid var(--line);
  vertical-align: middle;
}

.session-lesson-no {
  width: 110px;
  text-align: center;
  color: var(--ink-500);
  border-right: 1px solid var(--line);
}

.session-lesson {
  color: var(--ink-800);
  word-break: keep-all;
}

/* ── 과목 구성 ── */
.module-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  list-style: none;
}

.module-card {
  padding: 26px 26px 24px;
  border: 1px solid var(--line);
  border-radius: var(--radius-md);
  background-color: var(--surface);
}

.module-no {
  font-size: 0.875rem;
  font-weight: 700;
  color: var(--gold-700);
}

.module-title {
  margin: 6px 0 14px;
  font-size: 1.1875rem;
  font-weight: 700;
  letter-spacing: -0.02em;
}

.module-items li {
  position: relative;
  padding-left: 14px;
  font-size: 0.9375rem;
  line-height: 1.9;
  color: var(--ink-700);
  word-break: keep-all;
}

.module-items li::before {
  content: "";
  position: absolute;
  left: 0;
  top: 0.85em;
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background-color: var(--gold-600);
}

.course-footnote {
  margin-top: 20px;
  font-size: 0.9375rem;
  color: var(--ink-500);
}

/* ── 안내 · CTA ── */
.curriculum-notice {
  margin-top: 20px;
  padding: 16px 20px;
  border-radius: var(--radius-sm);
  background-color: var(--gold-100);
  color: var(--gold-700);
  font-size: 0.9375rem;
  font-weight: 600;
  word-break: keep-all;
}

.curriculum-cta {
  margin-top: 28px;
  padding: 28px 32px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  border-radius: var(--radius-lg);
  background-color: var(--charcoal);
  color: #fff;
}

.cta-title {
  font-size: 1.125rem;
  font-weight: 700;
  word-break: keep-all;
}

.cta-desc {
  margin-top: 6px;
  font-size: 0.9375rem;
  color: rgba(255, 255, 255, 0.65);
  word-break: keep-all;
}

.cta-actions {
  display: flex;
  gap: 10px;
  flex-shrink: 0;
}

@media (max-width: 768px) {
  .course-switch {
    gap: 8px;
  }

  .course-tab {
    padding: 14px 14px;
  }

  .course-tab-label {
    font-size: 1rem;
    word-break: keep-all;
  }

  .course-panel {
    padding: 24px 18px;
    border-radius: var(--radius-md);
  }

  .course-name {
    font-size: 1.375rem;
  }

  .module-grid {
    grid-template-columns: 1fr;
  }

  /* 회차표 → 회차별 카드 */
  .session-table thead {
    display: none;
  }

  .session-table,
  .session-table tbody {
    display: block;
    border-top: none;
  }

  .session-table tbody {
    border: 1px solid var(--line);
    border-radius: var(--radius-sm);
    overflow: hidden;
    margin-bottom: 12px;
  }

  .session-table tr {
    display: grid;
    grid-template-columns: 64px 1fr;
  }

  .session-round {
    grid-column: 1 / -1;
    width: auto;
    text-align: left;
    padding: 12px 14px;
    background-color: var(--surface-warm);
    border-right: none;
  }

  .session-table td {
    padding: 12px 14px;
  }

  .session-lesson-no {
    width: auto;
    font-size: 0.875rem;
    text-align: left;
  }

  .session-table tbody tr:last-child td {
    border-bottom: none;
  }

  .curriculum-cta {
    flex-direction: column;
    align-items: stretch;
    padding: 24px 20px;
  }

  .cta-actions {
    flex-direction: column;
  }
}
</style>
