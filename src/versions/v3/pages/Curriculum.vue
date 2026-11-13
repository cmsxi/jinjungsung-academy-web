<template>
  <!--
    커리큘럼 (3차 시안 · 11/13 메인 규칙 적용)
    - 페이지 제목·하위 탭은 공통 머리(SectionLayout → PageHead)가 그린다. 여기서는 본문(표)만
      11/13 전당포 커리큘럼 · 명품창업 커리큘럼이 머리의 하위 탭으로 나뉘어서, 본문 안의 고르기 버튼 · 제목은 두지 않는다
    - 어느 커리큘럼인지는 주소의 course 로 정한다: ?course=pawnshop(없거나 모르는 값이면 이것) / ?course=luxury
      이 페이지에 있는 채로 탭을 눌러 course 만 바뀌어도 바로 따라간다
    - 전당포 커리큘럼은 원본에서 이미지(edu-step.png)였던 것을 같은 내용의 표로 옮겼다
    - 11/13 표는 원본 이미지(edu-step.png)의 표 구조로(CurriculumTable.vue) — 원래 디자인이 더 잘 보였다는 요청
    - 11/13 '한눈에 보기': 전체 화면 창에 표 전체를 화면에 맞춰 한 번에, 창 위쪽 버튼으로 다른 과정 커리큘럼
  -->
  <div class="jj-container">
    <!-- 커리큘럼이 바뀌면 다시 그려지며 부드럽게 나타난다 -->
    <div :key="selectedCourse" class="cur-panel" v-reveal>
      <!-- 표 위 줄: 왼쪽 '오프라인 커리큘럼'(원본 표 제목) · 오른쪽 '한눈에 보기'(11/13 — 전체 화면에 표 전체를 한 번에) -->
      <div class="cur-bar">
        <p class="cur-bar-title">
          오프라인 커리큘럼
          <span class="cur-bar-meta">{{ barMeta }}</span>
        </p>
        <button ref="overviewBtn" type="button" class="v3-btn v3-btn--line v3-btn--sm cur-overview-btn" @click="openOverview">
          <span class="cur-overview-icon" aria-hidden="true"></span>
          한눈에 보기
        </button>
      </div>

      <CurriculumTable :course="selectedCourse" :groups="groups" :caption="cta.name" />
    </div>

    <p class="cur-notice">※ 명품감정 자격증반은 커리큘럼이 달라질 수 있습니다.</p>

    <!-- 11/13 "커리큘럼 페이지에 문의 버튼" → "너무 밋밋하다, 디자인이 더 들어가면"
         메인 교육과정 카드와 같은 얼굴: 과정 사진 + 유리(흐림) + 흰 글자 + 왼쪽 위 금색 큰 번호(아주 연하게)
         왼쪽 과정 소개(메인 카드 문구 그대로), 오른쪽 금색 문의 버튼 + 전화 문의.
         버튼을 누르면 메인 맨 아래 문의 폼으로(useGoInquiry) -->
    <section :key="`cta-${selectedCourse}`" class="cur-cta" :class="{ 'is-bright': cta.bright }" aria-label="수강신청 문의">
      <img class="cur-cta-bg" :src="cta.photo" alt="" :style="{ objectPosition: cta.pos }" />
      <span class="cur-cta-dim" aria-hidden="true"></span>
      <span class="cur-cta-num" aria-hidden="true">{{ cta.num }}</span>

      <div class="cur-cta-body">
        <div class="cur-cta-text">
          <p class="cur-cta-meta">{{ cta.meta }}</p>
          <h2 class="cur-cta-name">{{ cta.name }}</h2>
          <p class="cur-cta-summary">{{ cta.summary }}</p>
        </div>

        <div class="cur-cta-actions">
          <a href="/#inquiry" class="v3-btn cur-cta-btn" @click.prevent="goInquiry">{{ cta.label }}</a>
          <a :href="PHONE_TEL" class="cur-cta-tel">전화 문의 <strong>{{ PHONE_DISPLAY }}</strong></a>
        </div>
      </div>
    </section>

    <!-- 한눈에 보기: 화면 전체를 덮는 창에 표 전체를 화면에 맞춰 줄여 한 번에
         11/13 "원래 크기 대신 다른 강의 커리큘럼이 보이는 게" → 위쪽에 전당포 과정 | 명품창업 과정 버튼(창을 닫지 않고 바꿈,
         뒤 페이지도 같은 과정으로 맞춰 둔다)
         문서 맨 끝(body)에 붙이므로 3차 시안 색 · 글자 값(.ver-v3 .pal-white)을 이 창에도 준다 -->
    <Teleport to="body">
      <div
        v-if="overview"
        class="cur-ov ver-v3 pal-white"
        role="dialog"
        aria-modal="true"
        :aria-label="`${cta.name} 커리큘럼 한눈에 보기`"
      >
        <div class="cur-ov-bar">
          <div class="cur-ov-head">
            <div class="cur-ov-tabs" role="tablist" aria-label="과정 고르기">
              <button
                v-for="id in COURSE_IDS"
                :key="id"
                type="button"
                role="tab"
                class="cur-ov-tab"
                :class="{ 'is-on': selectedCourse === id }"
                :aria-selected="selectedCourse === id"
                @click="showCourse(id)"
              >
                {{ CTA[id].name }}
              </button>
            </div>
            <p class="cur-ov-meta">오프라인 커리큘럼 · {{ barMeta }}</p>
          </div>
          <button ref="closeBtn" type="button" class="v3-btn v3-btn--sm" @click="closeOverview">닫기</button>
        </div>
        <div ref="stage" class="cur-ov-stage">
          <div class="cur-ov-frame" :style="frameStyle">
            <div ref="sheet" class="cur-ov-sheet" :style="sheetStyle">
              <CurriculumTable :course="selectedCourse" :groups="groups" :caption="cta.name" />
              <p class="cur-notice">※ 명품감정 자격증반은 커리큘럼이 달라질 수 있습니다.</p>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { vReveal } from '../useReveal.js'
import CurriculumTable from './CurriculumTable.vue'
import { useGoInquiry } from '@/versions/common/useGoInquiry.js'
import { PHONE_DISPLAY, PHONE_TEL } from '@/constants/contact.js'
// 메인 교육과정 카드와 같은 사진(금괴 / 흰 가방)
import pawnPhoto from '@/assets/images/stock/gold-bars.jpg'
import luxPhoto from '@/assets/images/stock/white-bag.jpg'

const COURSE_IDS = ['pawnshop', 'luxury']

// 원본 전당포 커리큘럼 이미지(edu-step.png)를 글자로 옮긴 것. 새 내용을 추가하지 말 것.
const PAWNSHOP_ROUNDS = [
  {
    title: '1회차',
    lessons: [
      '전당포 창업 개요(시장성, 사업성, 주고객층 등)',
      '귀금속(금, 은, 다이아몬드) 감정 및 실습',
      '롤렉스 브랜드 개요(모델별 특징)',
      '롤렉스 감정 실습(외부감정)',
    ],
  },
  {
    title: '2회차',
    lessons: [
      '롤렉스 구성품, 롤렉스 내부감정',
      '롤렉스 내부감정 및 실습, 롤렉스 시세파악 방법',
      '까르띠에, IWC, 오데마피게 감정',
      '내부 무브먼트 감정법',
    ],
  },
  {
    title: '3회차',
    lessons: [
      '명품가방 감정 및 실습(루이비통, 구찌, 샤넬, 보테가)',
      '명품가방 감정 및 실습(몽클레어, 프라다, 입생로랑, 고야드)',
      '명품가방 실습',
      '기타 고가품 감정법(IT기기, 카메라, 주류 등)',
    ],
  },
  {
    title: '4회차',
    lessons: ['전당포 실무', '전당포 세무처리', '명품감정 시험', '오답정리 및 수료식'],
  },
]

// 원본 Curriculum.vue 의 명품창업(명품감정) 과목표 그대로 (문대표님 확정본 오면 교체)
const LUXURY_MODULES = [
  {
    title: '귀금속 감정',
    lessons: ['귀금속(금, 은, 다이아몬드) 감정 및 실습'],
  },
  {
    title: '명품시계 감정',
    lessons: [
      '롤렉스 브랜드 개요(모델별 특징)',
      '롤렉스 감정 실습(외부감정)',
      '롤렉스 구성품, 롤렉스 내부감정',
      '롤렉스 내부감정 및 실습, 롤렉스 시세파악 방법',
      '까르띠에, IWC, 오데마피게 감정',
      '내부 무브먼트 감정법',
    ],
  },
  {
    title: '명품가방 감정',
    lessons: [
      '명품가방 감정 및 실습(루이비통, 구찌, 샤넬, 보테가)',
      '명품가방 감정 및 실습(몽클레어, 프라다, 입생로랑, 고야드)',
      '명품가방 실습',
    ],
  },
  {
    title: '기타 고가품 · 시험',
    lessons: ['기타 고가품 감정법(IT기기, 카메라, 주류 등)', '명품감정 시험', '오답정리 및 수료식'],
  },
]

const route = useRoute()
const router = useRouter()

// 주소의 course 로 커리큘럼을 고른다(없거나 모르는 값이면 전당포). computed 라 탭을 눌러 course 만 바뀌어도 따라간다
const selectedCourse = computed(() => (COURSE_IDS.includes(route.query.course) ? route.query.course : 'pawnshop'))

// 아래 문의 칸 — 이름은 메뉴 이름(11/13), 한 줄 설명 · 소개 · 버튼 문구 · 사진은 메인 교육과정 카드(main/Courses.vue)와 같게
const CTA = {
  pawnshop: {
    num: '01',
    name: '전당포 과정',
    meta: '오프라인 4회차 · 16교시',
    summary: '전당포 창업에 필요한 감정 실습과 운영 실무를 함께 배웁니다.',
    label: '전당포 과정 수강신청 문의하기',
    photo: pawnPhoto,
    pos: '50% 45%',
  },
  luxury: {
    num: '02',
    name: '명품창업 과정',
    meta: '과목별 감정 실습',
    summary: '귀금속 · 명품시계 · 명품가방 감정을 과목별로 배웁니다.',
    label: '명품창업 과정 수강신청 문의하기',
    photo: luxPhoto,
    pos: '50% 52%',
    bright: true, // 밝은 사진이라 흰 글자가 읽히게 더 어둡게(메인 카드와 같음)
  },
}
const cta = computed(() => CTA[selectedCourse.value])
const goInquiry = useGoInquiry()

// 표 위 줄 설명 — '오프라인 커리큘럼' 옆이라 앞의 '오프라인'은 겹치지 않게 뺀다(4회차 · 16교시)
const barMeta = computed(() => cta.value.meta.replace(/^오프라인\s*/, ''))

// 표에 넣을 묶음(전당포 = 회차, 명품창업 = 과목)
const groups = computed(() => (selectedCourse.value === 'luxury' ? LUXURY_MODULES : PAWNSHOP_ROUNDS))

// ── 한눈에 보기 ──
const overview = ref(false)
const scale = ref(1)
const sheetWidth = ref(1100)
const sheetHeight = ref(0)
const stage = ref(null)
const sheet = ref(null)
const overviewBtn = ref(null)
const closeBtn = ref(null)

const SHEET_MAX = 1100 // 한눈에 보기 표 폭(넓은 화면에서도 이 이상 키우지 않음)

const sheetStyle = computed(() => ({
  width: `${sheetWidth.value}px`,
  transform: `scale(${scale.value})`,
}))
// 줄인 만큼 자리도 줄여 아래 · 옆에 빈 스크롤이 생기지 않게
const frameStyle = computed(() => ({
  width: `${sheetWidth.value * scale.value}px`,
  height: sheetHeight.value ? `${sheetHeight.value * scale.value}px` : 'auto',
}))

const fit = async () => {
  if (!overview.value || !stage.value) return
  scale.value = 1
  const box = stage.value.getBoundingClientRect()
  const pad = window.innerWidth <= 640 ? 16 : 32
  sheetWidth.value = Math.min(SHEET_MAX, Math.floor(box.width - pad * 2))
  await nextTick()
  const height = sheet.value?.offsetHeight || 0
  sheetHeight.value = height
  scale.value = height ? Math.min(1, (box.height - pad * 2) / height) : 1
}

const onKey = (event) => {
  if (event.key === 'Escape') closeOverview()
}

const openOverview = async () => {
  overview.value = true
  document.body.style.overflow = 'hidden'
  window.addEventListener('resize', fit)
  window.addEventListener('keydown', onKey)
  await nextTick()
  await fit()
  closeBtn.value?.focus()
}

const closeOverview = () => {
  if (!overview.value) return
  overview.value = false
  document.body.style.overflow = ''
  window.removeEventListener('resize', fit)
  window.removeEventListener('keydown', onKey)
  overviewBtn.value?.focus()
}

// 창 안에서 다른 과정으로 — 주소의 course 만 바꾸므로 창은 그대로, 뒤 페이지도 같은 과정이 된다
const showCourse = (id) => {
  if (id === selectedCourse.value) return
  router.replace({ query: { ...route.query, course: id } })
}

// 과정이 바뀌면(창 안 버튼 · 페이지 탭) 열려 있는 창의 표 크기를 다시 맞춘다
// 주소가 바뀌면 헤더(SiteHeader)가 모바일 메뉴를 닫으며 뒤 페이지 스크롤 잠금을 풀어 버리므로, 창이 열려 있으면 다시 잠근다
watch(selectedCourse, async () => {
  if (!overview.value) return
  await nextTick()
  document.body.style.overflow = 'hidden'
  fit()
})
onBeforeUnmount(closeOverview)
</script>

<style scoped>
/* ── 표 위 줄 ── */
.cur-bar {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  justify-content: space-between;
  gap: 12px 24px;
  margin-bottom: 16px;
}

.cur-bar-title {
  font-size: var(--fs-item);
  font-weight: 700;
  line-height: 1.4;
  letter-spacing: -0.02em;
  color: var(--c-text);
}

.cur-bar-meta {
  margin-left: 10px;
  font-size: var(--fs-body);
  font-weight: 400;
  color: var(--c-sub);
}

.cur-overview-btn {
  gap: 8px;
}

/* 네 귀퉁이 꺾쇠(전체 화면) 표시 */
.cur-overview-icon {
  position: relative;
  width: 12px;
  height: 12px;
  background:
    linear-gradient(currentColor, currentColor) left top / 5px 1.5px no-repeat,
    linear-gradient(currentColor, currentColor) left top / 1.5px 5px no-repeat,
    linear-gradient(currentColor, currentColor) right top / 5px 1.5px no-repeat,
    linear-gradient(currentColor, currentColor) right top / 1.5px 5px no-repeat,
    linear-gradient(currentColor, currentColor) left bottom / 5px 1.5px no-repeat,
    linear-gradient(currentColor, currentColor) left bottom / 1.5px 5px no-repeat,
    linear-gradient(currentColor, currentColor) right bottom / 5px 1.5px no-repeat,
    linear-gradient(currentColor, currentColor) right bottom / 1.5px 5px no-repeat;
}

.cur-notice {
  margin-top: 24px;
  font-size: var(--fs-small);
  line-height: 1.6;
  color: var(--c-sub);
  word-break: keep-all;
}

/* ── 문의 칸: 메인 교육과정 카드와 같은 사진 + 유리 + 흰 글자 ── */
.cur-cta {
  position: relative;
  isolation: isolate;
  margin-top: 64px;
  overflow: hidden;
  color: #ffffff;
}

.cur-cta-bg,
.cur-cta-dim {
  position: absolute;
  inset: 0;
  z-index: -1;
}

.cur-cta-bg {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* 유리: 사진을 많이 흐리게 + 왼쪽 위 빛 반사 + 글자 쪽(왼쪽)을 조금 더 어둡게 */
.cur-cta-dim {
  background:
    linear-gradient(150deg, rgba(255, 255, 255, 0.14) 0%, rgba(255, 255, 255, 0.03) 38%, rgba(255, 255, 255, 0) 60%),
    linear-gradient(90deg, rgba(14, 14, 14, 0.62) 0%, rgba(14, 14, 14, 0.46) 55%, rgba(14, 14, 14, 0.4) 100%);
  -webkit-backdrop-filter: blur(18px) saturate(125%);
  backdrop-filter: blur(18px) saturate(125%);
}

/* 유리 가장자리: 아주 얇은 밝은 테 */
.cur-cta::after {
  content: '';
  position: absolute;
  inset: 0;
  border: 1px solid rgba(255, 255, 255, 0.16);
  pointer-events: none;
}

.cur-cta.is-bright .cur-cta-bg {
  filter: brightness(0.55) contrast(1.05);
}

.cur-cta.is-bright .cur-cta-dim {
  background:
    linear-gradient(150deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.02) 38%, rgba(255, 255, 255, 0) 60%),
    linear-gradient(90deg, rgba(14, 14, 14, 0.7) 0%, rgba(14, 14, 14, 0.58) 55%, rgba(14, 14, 14, 0.52) 100%);
}

/* 왼쪽 위 큰 번호 — 메인 카드처럼 금색 아주 연하게 */
.cur-cta-num {
  position: absolute;
  top: 2px;
  left: 30px;
  z-index: -1;
  font-size: 170px;
  font-weight: 700;
  line-height: 1;
  letter-spacing: -0.05em;
  color: rgba(229, 183, 82, 0.1);
  pointer-events: none;
  user-select: none;
}

.cur-cta-body {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 32px 56px;
  padding: 64px;
}

.cur-cta-meta {
  font-size: var(--fs-small);
  font-weight: 700;
  letter-spacing: 0.02em;
  color: rgba(255, 255, 255, 0.72);
}

.cur-cta-name {
  margin-top: 10px;
  font-size: var(--fs-section);
  font-weight: 700;
  line-height: 1.3;
  letter-spacing: -0.03em;
  color: #ffffff;
}

.cur-cta-summary {
  margin-top: 12px;
  font-size: var(--fs-body);
  line-height: 1.7;
  color: rgba(255, 255, 255, 0.86);
  word-break: keep-all;
}

.cur-cta-actions {
  display: flex;
  flex: none;
  flex-direction: column;
  align-items: stretch;
  gap: 14px;
  width: 340px;
}

/* 금색 = 과정 문의 버튼에만(메인 .course-cta 와 같은 색) */
.ver-v3 .cur-cta-btn {
  height: 56px;
  padding: 0 24px;
  background: var(--jj-point);
  color: #161616;
}

.ver-v3 .cur-cta-btn:hover {
  background: var(--jj-point-deep);
}

.cur-cta-tel {
  font-size: var(--fs-small);
  text-align: center;
  color: rgba(255, 255, 255, 0.72);
  transition: color var(--t-1) var(--ease-soft);
}

.cur-cta-tel strong {
  margin-left: 6px;
  font-weight: 700;
  color: #ffffff;
}

.cur-cta-tel:hover {
  color: #ffffff;
}

@media (max-width: 900px) {
  .cur-cta-body {
    flex-direction: column;
    align-items: stretch;
    padding: 48px 32px 32px;
  }

  .cur-cta-actions {
    width: auto;
  }
}

@media (max-width: 640px) {
  .cur-cta {
    margin-top: 48px;
  }

  .cur-cta-body {
    padding: 40px 20px 24px;
  }

  .cur-cta-num {
    left: 12px;
    font-size: 110px;
  }

  .cur-cta-name {
    font-size: var(--fs-item);
  }

  .ver-v3 .cur-cta-btn {
    height: 52px;
    padding: 0 20px;
  }
}



/* ── 한눈에 보기(전체 화면 창) ── */
.cur-ov {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  background: #ffffff;
}

.cur-ov-bar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 10px 16px;
  padding: 14px 24px;
  border-bottom: 1px solid var(--c-line);
}

.cur-ov-head {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px 16px;
}

/* 과정 고르기: 두 칸짜리 버튼, 지금 과정은 검정 */
.cur-ov-tabs {
  display: inline-flex;
  border: 1px solid var(--c-text);
}

.cur-ov-tab {
  height: 40px;
  padding: 0 18px;
  border: 0;
  background: #ffffff;
  font: inherit;
  font-size: var(--fs-body);
  font-weight: 700;
  color: var(--c-text);
  cursor: pointer;
  transition: background-color var(--t-1) var(--ease-soft), color var(--t-1) var(--ease-soft);
}

.cur-ov-tab + .cur-ov-tab {
  border-left: 1px solid var(--c-text);
}

.cur-ov-tab.is-on {
  background: var(--c-text);
  color: #ffffff;
}

.cur-ov-tab:not(.is-on):hover {
  background: var(--c-bg);
}

.cur-ov-meta {
  font-size: var(--fs-small);
  color: var(--c-sub);
}

.cur-ov-stage {
  flex: 1;
  overflow: hidden;
  padding: 32px;
}

.cur-ov-frame {
  margin: 0 auto;
}

.cur-ov-sheet {
  transform-origin: top left;
}

.cur-ov-sheet .cur-notice {
  margin-top: 16px;
}

@media (max-width: 640px) {
  .cur-bar-meta {
    display: block;
    margin: 4px 0 0;
  }

  /* 첫 줄: 과정 버튼 · 닫기 / 둘째 줄: 설명 */
  .cur-ov-bar {
    flex-wrap: nowrap;
    align-items: flex-start;
    padding: 12px 16px;
  }

  .cur-ov-head {
    flex: 1;
    min-width: 0;
  }

  .cur-ov-tab {
    height: 36px;
    padding: 0 12px;
    font-size: 14px;
  }

  .cur-ov-stage {
    padding: 16px;
  }
}
</style>
