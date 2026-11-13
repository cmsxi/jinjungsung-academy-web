<template>
  <!--
    커리큘럼 (3차 시안 · 11/13 메인 규칙 적용)
    - 페이지 제목·하위 탭은 공통 머리(SectionLayout → PageHead)가 그린다. 여기서는 본문(표)만
      11/13 전당포 커리큘럼 · 명품창업 커리큘럼이 머리의 하위 탭으로 나뉘어서, 본문 안의 고르기 버튼 · 제목은 두지 않는다
    - 어느 커리큘럼인지는 주소의 course 로 정한다: ?course=pawnshop(없거나 모르는 값이면 이것) / ?course=luxury
      이 페이지에 있는 채로 탭을 눌러 course 만 바뀌어도 바로 따라간다
    - 전당포 커리큘럼은 원본에서 이미지(edu-step.png)였던 것을 같은 내용의 표로 옮겼다
    - 표: 읽기만 하는 정보라 상자 없이, 줄마다 옅은 선(규칙 6), 항목명은 왼쪽 같은 폭(규칙 7)
  -->
  <div class="jj-container">
    <!-- 커리큘럼이 바뀌면 다시 그려지며 부드럽게 나타난다 -->
    <div :key="selectedCourse" class="cur-panel" v-reveal>
      <!-- 전당포 커리큘럼: 회차 · 교시 · 강의 내용 (원본 edu-step.png 내용 그대로) -->
      <table v-if="selectedCourse === 'pawnshop'" class="cur-table cur-table--round">
        <caption class="jj-sr-only">전당포 과정</caption>
        <colgroup>
          <col class="col-group" />
          <col class="col-period" />
          <col />
        </colgroup>
        <thead>
          <tr>
            <th scope="col">회차</th>
            <th scope="col">교시</th>
            <th scope="col">강의 내용</th>
          </tr>
        </thead>
        <tbody v-for="round in PAWNSHOP_ROUNDS" :key="round.title">
          <tr v-for="(lesson, index) in round.lessons" :key="lesson">
            <th v-if="index === 0" scope="rowgroup" :rowspan="round.lessons.length" class="cur-group">
              {{ round.title }}
            </th>
            <td class="cur-period">{{ index + 1 }}교시</td>
            <td class="cur-text">{{ lesson }}</td>
          </tr>
        </tbody>
      </table>

      <!-- 명품창업(명품감정) 커리큘럼: 과목 · 강의 내용 (원본 Curriculum.vue 과목표 그대로) -->
      <table v-else class="cur-table cur-table--module">
        <caption class="jj-sr-only">명품창업 과정</caption>
        <colgroup>
          <col class="col-module" />
          <col />
        </colgroup>
        <thead>
          <tr>
            <th scope="col">과목</th>
            <th scope="col">강의 내용</th>
          </tr>
        </thead>
        <tbody v-for="module in LUXURY_MODULES" :key="module.title">
          <tr v-for="(lesson, index) in module.lessons" :key="lesson">
            <th v-if="index === 0" scope="rowgroup" :rowspan="module.lessons.length" class="cur-group">
              {{ module.title }}
            </th>
            <td class="cur-text">{{ lesson }}</td>
          </tr>
        </tbody>
      </table>
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
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { vReveal } from '../useReveal.js'
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
</script>

<style scoped>
/* ── 커리큘럼 표 ── */
.cur-table {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
  word-break: keep-all;
}

/* 항목명 칸 폭: 두 표의 '강의 내용' 시작 위치가 같도록(회차 + 교시 = 과목) */
.col-group {
  width: 180px;
}

.col-period {
  width: 140px;
}

.col-module {
  width: 320px;
}

.cur-table th,
.cur-table td {
  padding: 18px 24px 18px 0;
  border-bottom: 1px solid var(--c-line);
  font-size: var(--fs-body);
  line-height: 1.6;
  text-align: left;
  vertical-align: top;
}

.cur-table thead th {
  padding-top: 0;
  padding-bottom: 14px;
  font-size: var(--fs-small);
  font-weight: 700;
  color: var(--c-sub);
}

.cur-group {
  font-weight: 700;
  color: var(--c-text);
}

.cur-period {
  color: var(--c-sub);
}

.cur-text {
  color: var(--c-text);
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

@media (max-width: 900px) {
  .col-group {
    width: 120px;
  }

  .col-period {
    width: 100px;
  }

  .col-module {
    width: 220px;
  }
}

/* 휴대폰: 표를 세로로 — 회차(과목) 이름을 묶음 제목으로 위에, 그 아래 「교시 : 강의 내용」 한 줄씩 */
@media (max-width: 560px) {
  .cur-table,
  .cur-table tbody {
    display: block;
  }

  .cur-table thead {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip: rect(0 0 0 0);
    white-space: nowrap;
  }

  .cur-table tr {
    display: grid;
  }

  .cur-table--round tr {
    grid-template-columns: 56px minmax(0, 1fr);
  }

  .cur-table--module tr {
    grid-template-columns: minmax(0, 1fr);
  }

  .cur-table th,
  .cur-table td {
    display: block;
    padding: 12px 0;
  }

  .cur-group {
    grid-column: 1 / -1;
    padding-top: 28px;
  }

  .cur-table tbody:first-of-type .cur-group {
    padding-top: 0;
  }

  .cur-text {
    padding-left: 0;
  }
}
</style>
