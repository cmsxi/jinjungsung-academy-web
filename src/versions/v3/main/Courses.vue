<template>
  <!--
    교육과정: 과정 안내 카드 2장 (11/12 문답 결과)
    11/13 카드 전체 배경에 과정 사진 + 어두운 그라데이션, 글자·선은 흰색.
          마우스를 올리면(키보드로 들어와도) 사진이 천천히 사라지며 미색 바탕에 검정 글자로 바뀐다.
          수강신청 문의는 카드 밖 아래에 과정별 버튼으로 따로 둔다.
  -->
  <section class="courses">
    <div class="jj-container">
      <V3Head title="교육과정" desc="창업 목표에 맞는 과정을 선택하세요." />

      <div class="course-grid">
        <div v-for="(course, i) in COURSES" :key="course.id" class="course-col" v-reveal="i * 120">
        <article class="course" :class="{ 'is-bright': photos[course.id].bright }">
          <img
            :key="photos[course.id].src"
            class="course-bg"
            :src="photos[course.id].src"
            alt=""
            loading="lazy"
            :style="photos[course.id].pos ? { objectPosition: photos[course.id].pos } : null"
          />
          <span class="course-dim" aria-hidden="true"></span>
          <!-- 11/13 왼쪽 위 큰 번호: 아주 연하게 글자 뒤 배경처럼 -->
          <span class="course-num" aria-hidden="true">{{ String(i + 1).padStart(2, '0') }}</span>

          <div class="course-panel">
          <div class="course-head">
            <h3 class="course-name">{{ course.name }}</h3>
            <p class="course-meta">{{ course.meta }}</p>
          </div>

          <div class="course-body">
            <p class="course-summary">{{ course.summary }}</p>

            <!-- 규칙 7·6: 「항목명 : 내용」 한 줄에 하나 + 줄마다 옅은 선 -->
            <dl class="course-plan">
              <div v-for="row in course.plan" :key="row.label" class="plan-row">
                <dt>{{ row.label }}</dt>
                <dd>{{ row.text }}</dd>
              </div>
            </dl>

            <div class="course-foot">
              <!-- 11/13 "커리큘럼 보기는 이전처럼 밑줄 + 화살표", "카드 전체가 커리큘럼 연결" → 이 링크가 카드 전체를 덮는다 -->
              <router-link :to="curriculumLink(course.id)" class="course-link" :aria-label="`${course.name} 커리큘럼 보기`">
                커리큘럼 보기<span class="course-link-arrow" aria-hidden="true">→</span>
              </router-link>
            </div>
          </div>
          </div>
        </article>

        <!-- 11/13 수강신청 문의는 카드 아래로 따로, 과정 이름을 넣어서 -->
        <a href="#inquiry" class="v3-btn course-cta" @click.prevent="toInquiry">{{ course.cta }}</a>
        </div>
      </div>

      <p class="course-notice" v-reveal>※ 명품감정 자격증반은 커리큘럼이 달라질 수 있습니다.</p>
    </div>
  </section>
</template>

<script setup>
import V3Head from './V3Head.vue'
import { vReveal } from '../useReveal.js'
import pawnPhoto from '@/assets/images/stock/gold-bars.jpg'
import luxPhoto from '@/assets/images/stock/white-bag.jpg'

// 카드 배경 사진(11/13 확정: 금괴 / 흰 가방). bright = 밝은 사진이라 흰 글자가 읽히게 더 어둡게 보정
const photos = {
  pawnshop: { src: pawnPhoto, pos: '50% 45%' },
  luxury: { src: luxPhoto, pos: '50% 52%', bright: true },
}

const curriculumLink = (id) => ({ path: '/education/curriculum', query: { course: id } })

const toInquiry = () => {
  document.getElementById('inquiry')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

// 커리큘럼 페이지 내용 기준(전당포: edu-step.png 회차·교시표 / 명품창업: Curriculum.vue 과목표).
// 새 내용을 추가하지 말 것.
const COURSES = [
  {
    id: 'pawnshop',
    name: '전당포 과정',
    cta: '전당포 과정 수강신청 문의하기',
    meta: '오프라인 4회차 · 16교시',
    summary: '전당포 창업에 필요한 감정 실습과 운영 실무를 함께 배웁니다.',
    plan: [
      { label: '1회차', text: '전당포 창업 개요, 귀금속 감정 및 실습, 롤렉스 브랜드 개요 · 외부감정' },
      { label: '2회차', text: '롤렉스 내부감정 및 시세파악, 까르띠에 · IWC · 오데마피게, 무브먼트 감정법' },
      { label: '3회차', text: '명품가방 감정 및 실습, 기타 고가품 감정법' },
      { label: '4회차', text: '전당포 실무, 전당포 세무처리, 명품감정 시험, 수료식' },
    ],
  },
  {
    id: 'luxury',
    name: '명품창업(명품감정) 과정',
    cta: '명품창업 과정 수강신청 문의하기',
    meta: '과목별 감정 실습',
    summary: '귀금속 · 명품시계 · 명품가방 감정을 과목별로 배웁니다.',
    plan: [
      { label: '귀금속', text: '금, 은, 다이아몬드 감정 및 실습' },
      { label: '명품시계', text: '롤렉스, 까르띠에, IWC, 오데마피게 감정과 내부 무브먼트 감정법' },
      { label: '명품가방', text: '루이비통, 구찌, 샤넬, 보테가, 몽클레어, 프라다, 입생로랑, 고야드 감정 및 실습' },
      { label: '기타 · 시험', text: '기타 고가품 감정법, 명품감정 시험, 수료식' },
    ],
  },
]
</script>

<style scoped>
/* 규칙 5: 고르는 대상이라 상자로 묶는다. 안쪽 목록은 규칙 6·7(줄마다 옅은 선, 항목명 왼쪽)
   11/13: 기본은 사진 + 그라데이션 + 흰 글자, 마우스를 올리면 미색(베이지) + 검정 글자 */
.courses {
  padding: var(--v3-section-y) 0;
  background: var(--c-bg);
}

/* 11/13 "카드 사이 여백 조금 더 넓게" 32 → 56 */
.course-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 56px;
}

.course-col {
  display: flex;
  flex-direction: column;
}

/* 11/13 "인터랙션 조금 더 스르르" — 전환을 길고 부드럽게(끝에서 천천히 멈추는 곡선) */
.course {
  position: relative;
  isolation: isolate;
  display: flex;
  flex: 1;
  flex-direction: column;
  padding: 40px;
  overflow: hidden;
  background: var(--c-bg-alt);
  --ease: 0.7s var(--ease-soft); /* 11/13 "hover 전환 조금만 더 빠르게" 1s → 0.7s */
  cursor: pointer;
}

/* 11/13 "박스 말고 사진 전체를 이용해" — 안쪽 판 없이, 카드 전체가 사진 + 유리(흐림·반사) */
.course-panel {
  display: flex;
  flex: 1;
  flex-direction: column;
}

/* 유리 가장자리: 아주 얇은 밝은 테 (마우스를 올리면 사라짐) */
.course::after {
  content: '';
  position: absolute;
  inset: 0;
  z-index: -1;
  border: 1px solid rgba(255, 255, 255, 0.18);
  pointer-events: none;
  transition: opacity var(--ease);
}

.course:hover::after,
.course:focus-within::after {
  opacity: 0;
}

.course-bg,
.course-dim {
  position: absolute;
  inset: 0;
  z-index: -1;
}

.course-bg {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition:
    opacity var(--ease),
    transform 1.4s var(--ease-soft);
}

/* 글자가 많은 카드라 전체를 고르게 어둡게, 왼쪽 위(제목)를 조금 더 */
.course-dim {
  /* 반투명 유리 — 11/13 "조금 더 뿌옇고 흐리게": 사진을 많이 흐리게 + 우윳빛 막 + 왼쪽 위 빛 반사
     + 흰 글자가 읽히는 어두운 막 */
  background:
    linear-gradient(150deg, rgba(255, 255, 255, 0.16) 0%, rgba(255, 255, 255, 0.04) 40%, rgba(255, 255, 255, 0) 62%),
    linear-gradient(0deg, rgba(255, 255, 255, 0.07), rgba(255, 255, 255, 0.07)),
    linear-gradient(180deg, rgba(14, 14, 14, 0.5) 0%, rgba(14, 14, 14, 0.48) 45%, rgba(14, 14, 14, 0.62) 100%);
  -webkit-backdrop-filter: blur(18px) saturate(125%);
  backdrop-filter: blur(18px) saturate(125%);
  transition: opacity var(--ease);
}

/* 왼쪽 위 큰 번호 — 금색 아주 연하게(사진 위·흰 바탕 모두) */
.course-num {
  position: absolute;
  top: 6px;
  left: 22px;
  z-index: -1;
  font-size: 150px;
  font-weight: 700;
  line-height: 1;
  letter-spacing: -0.05em;
  color: rgba(229, 183, 82, 0.08); /* 11/13 "금색으로, 아주 연하게" → "조금 더 연하게" 13% → 8% */
  pointer-events: none;
  user-select: none;
  transition: color var(--ease);
}

.course:hover .course-num,
.course:focus-within .course-num {
  color: rgba(229, 183, 82, 0.09);
}

/* 11/13 흰 가방처럼 밝은 사진: 흰 글자가 묻히지 않게 사진 자체를 어둡게 + 막을 한 겹 더 */
.course.is-bright .course-bg {
  filter: brightness(0.55) contrast(1.05);
}

.course.is-bright .course-dim {
  background:
    linear-gradient(150deg, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0.03) 40%, rgba(255, 255, 255, 0) 62%),
    linear-gradient(180deg, rgba(14, 14, 14, 0.62) 0%, rgba(14, 14, 14, 0.6) 45%, rgba(14, 14, 14, 0.72) 100%);
}

.course:hover .course-bg,
.course:focus-within .course-bg {
  opacity: 0;
  transform: scale(1.05);
}

.course:hover .course-dim,
.course:focus-within .course-dim {
  opacity: 0;
}

/* 11/13 과정명·회차는 가운데 맞춤 — 섹션 제목(교육과정, 왼쪽 맞춤)과 정보 단계가 구분되게 */
.course-head {
  padding: 6px 0 4px;
  text-align: center;
}

/* ── 글자 (기본: 흰색 → hover: 검정·회색) ── */
/* 11/13 "과정명·회차 글자 더 크게" — 고르는 대상이라 항목 제목(22)보다 한 단계 크게 */
.course-name {
  font-size: 28px;
  font-weight: 700;
  line-height: 1.4;
  letter-spacing: -0.025em;
  color: #ffffff;
  word-break: keep-all;
}

.course-meta {
  margin-top: 6px;
  font-size: var(--fs-body);
  color: rgba(255, 255, 255, 0.82);
}

.course-summary {
  margin-top: 24px;
  font-size: var(--fs-body);
  line-height: 1.7;
  color: #ffffff;
  word-break: keep-all;
}

.course-plan {
  margin-top: 24px;
  border-top: 1px solid rgba(255, 255, 255, 0.24);
}

.plan-row {
  display: grid;
  grid-template-columns: 84px minmax(0, 1fr);
  gap: 16px;
  padding: 12px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.24);
}

.plan-row dt {
  font-size: var(--fs-body);
  font-weight: 700;
  line-height: 1.6;
  color: #ffffff;
}

.plan-row dd {
  font-size: var(--fs-body);
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.8);
  word-break: keep-all;
}

.course-name,
.course-meta,
.course-summary,
.course-plan,
.plan-row,
.plan-row dt,
.plan-row dd {
  transition:
    color var(--ease),
    border-color var(--ease);
}

.course:hover .course-name,
.course:focus-within .course-name,
.course:hover .course-summary,
.course:focus-within .course-summary,
.course:hover .plan-row dt,
.course:focus-within .plan-row dt {
  color: var(--c-text);
}

.course:hover .course-meta,
.course:focus-within .course-meta,
.course:hover .plan-row dd,
.course:focus-within .plan-row dd {
  color: var(--c-sub);
}

.course:hover .course-plan,
.course:focus-within .course-plan,
.course:hover .plan-row,
.course:focus-within .plan-row {
  border-color: var(--c-line);
}

/* 11/13 커리큘럼 보기는 왼쪽(가운데 → 왼쪽으로 다시) */
.course-foot {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  margin-top: auto;
  padding-top: 28px;
}

/* 커리큘럼 보기: 밑줄 글자 + 화살표 (기본 흰색 → hover 검정) */
.course-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding-bottom: 3px;
  border-bottom: 1px solid currentColor;
  font-size: var(--fs-body);
  font-weight: 700;
  color: #ffffff;
  transition: color var(--ease);
}

.course-link-arrow {
  transition: transform var(--t-1) var(--ease-soft);
}

.course:hover .course-link-arrow {
  transform: translateX(4px);
}

/* 카드 전체를 덮는 링크 영역 — 카드 어디를 눌러도 커리큘럼으로 */
.course-link::after {
  content: '';
  position: absolute;
  inset: 0;
  z-index: 1;
}

.course:hover .course-link,
.course:focus-within .course-link {
  color: var(--c-text);
}

.course-link:focus-visible {
  outline: none;
}

.course-link:focus-visible::after {
  outline: 2px solid var(--c-text);
  outline-offset: 3px;
}

/* 카드 아래 과정별 문의 버튼 — 11/13 "배경색은 금색" (금색 위 글자는 읽히도록 검정) */
.ver-v3 .course-cta {
  width: 100%;
  height: 56px;
  margin-top: 14px;
  background: var(--jj-point);
  color: #161616;
}

.ver-v3 .course-cta:hover {
  background: var(--jj-point-deep);
}

.course-notice {
  margin-top: 24px;
  font-size: var(--fs-small);
  color: var(--c-sub);
}

@media (prefers-reduced-motion: reduce) {
  .course {
    --ease: 0s linear;
  }
}

@media (max-width: 900px) {
  .course-grid {
    grid-template-columns: 1fr;
    gap: 40px;
  }
}

@media (max-width: 560px) {
  .course {
    padding: 28px 20px 24px;
  }

  .course-name {
    font-size: 23px;
  }

  .course-num {
    top: 4px;
    left: 12px;
    font-size: 96px;
  }

  .plan-row {
    grid-template-columns: 64px minmax(0, 1fr);
    gap: 12px;
    padding: 10px 0;
  }

  .course-foot {
    padding-top: 22px;
  }

  .ver-v3 .course-cta {
    height: 52px;
  }
}
</style>
