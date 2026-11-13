<template>
  <!--
    시안 공용 헤더 (임시). 색은 시안과 따로 비교 버튼에서 고른다: theme = light(흰색) | dark(차콜) | transparent(투명)
    - 투명: 메인('/') 맨 위에서만 투명. 스크롤하거나 메뉴를 열거나 다른 페이지에서는 흰색으로 바뀐다
    - 11/13 원본처럼 메뉴에 마우스를 올리면 전체 메뉴가 헤더 아래 판으로 한꺼번에 펼쳐진다(세부 메뉴가 각 항목 아래 열로)
    - '수강신청문의'는 오른쪽 끝 버튼과 겹쳐서 메뉴에서는 뺐다(11/12 요청)
    - 상담은 폼이 기본: 헤더에는 전화번호를 두지 않는다(11/12 요청)
  -->
  <header
    class="site-header"
    :class="[
      `theme-${theme}`,
      { 'is-scrolled': isScrolled, 'is-open': isMenuOpen, 'is-clear': isClear, 'is-mega': isMegaOpen, 'is-sub': isSubPage },
    ]"
  >
    <div class="header-inner">
      <router-link to="/" class="header-logo" aria-label="국제명품감정교육원 홈">
        <img :src="logoSrc" alt="국제명품감정교육원" />
      </router-link>

      <nav
        class="header-nav"
        aria-label="주 메뉴"
        @mouseenter="openMega"
        @mouseleave="closeMegaSoon"
        @focusin="openMega"
        @focusout="onNavFocusOut"
      >
        <ul class="nav-list">
          <li v-for="item in MENU" :key="item.label" class="nav-item">
            <router-link :to="item.to" class="nav-link" :class="{ 'is-current': isTopActive(item) }">
              <span class="nav-text" :data-text="item.label">{{ item.label }}</span>
            </router-link>
            <ul v-if="item.children" class="nav-sub">
              <li v-for="child in item.children" :key="child.label">
                <a v-if="child.href" :href="child.href" target="_blank" rel="noopener noreferrer">
                  <span class="nav-text" :data-text="child.label">{{ child.label }}</span>
                </a>
                <router-link v-else :to="child.to" :class="{ 'is-current': isChildActive(child) }">
                  <span class="nav-text" :data-text="child.label">{{ child.label }}</span>
                </router-link>
              </li>
            </ul>
          </li>
        </ul>
        <!-- 전체 메뉴 판(헤더 아래 화면 폭 전체). nav 안에 있어야 판 위로 마우스를 옮겨도 닫히지 않는다 -->
        <div class="mega-bg" aria-hidden="true"></div>
      </nav>

      <div class="header-actions">
        <a href="/#inquiry" class="jj-btn header-cta" @click.prevent="goInquiry">수강신청문의</a>
      </div>

      <button
        type="button"
        class="menu-toggle"
        :aria-expanded="isMenuOpen"
        aria-controls="mobile-menu"
        @click="toggleMenu"
      >
        <span class="jj-sr-only">{{ isMenuOpen ? '메뉴 닫기' : '메뉴 열기' }}</span>
        <span class="menu-toggle-bar"></span>
        <span class="menu-toggle-bar"></span>
        <span class="menu-toggle-bar"></span>
      </button>
    </div>

    <div id="mobile-menu" class="mobile-menu" v-show="isMenuOpen">
      <ul class="mobile-list">
        <li v-for="item in MENU" :key="item.label" class="mobile-item">
          <router-link :to="item.to" class="mobile-link" :class="{ 'is-current': isTopActive(item) }">{{ item.label }}</router-link>
          <ul v-if="item.children" class="mobile-sub">
            <li v-for="child in item.children" :key="child.label">
              <a v-if="child.href" :href="child.href" target="_blank" rel="noopener noreferrer">{{ child.label }}</a>
              <router-link v-else :to="child.to" :class="{ 'is-current': isChildActive(child) }">{{ child.label }}</router-link>
            </li>
          </ul>
        </li>
      </ul>
      <div class="mobile-actions">
        <a href="/#inquiry" class="jj-btn header-cta" @click.prevent="goInquiry">수강신청문의</a>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useGoInquiry } from './useGoInquiry.js'
// 11/13 사용자가 준 로고(Group 191/195): 엠블럼은 금색 그대로, 글자만 검정/흰색
import logoTextBlack from '@/assets/images/logo-text-black.svg'
import logoTextWhite from '@/assets/images/logo-text-white.svg'

const props = defineProps({
  theme: { type: String, default: 'light' }, // light | dark | transparent
})

const MENU = [
  {
    label: '교육원 소개',
    to: '/introduction',
    children: [
      { label: '인사말', to: '/introduction/greeting' },
      { label: '사업영역', to: '/introduction/business' },
      { label: '협력업체', to: '/introduction/partners' },
    ],
  },
  {
    label: '교육안내',
    to: '/education',
    children: [
      // 11/13 커리큘럼을 전당포·명품창업 두 갈래로(교육안내 하위 탭과 같은 구성)
      { label: '전당포 과정', to: '/education/curriculum?course=pawnshop' },
      { label: '명품창업 과정', to: '/education/curriculum?course=luxury' },
    ],
  },
  // 11/13 수강현황은 '무엇을 배우나'(교육안내)가 아니라 '실제 수업 기록'이라 따로 — 수강후기 옆에. 주소는 원본과 같이 /education/status
  { label: '수강현황', to: '/education/status' },
  { label: '수강후기', to: '/reviews' },
  // 11/13: 카카오톡 문의는 화면 오른쪽 아래 버튼이 있으니 메뉴에서 빼고, 세부 메뉴 없이 바로 FAQ로
  { label: '자주묻는질문', to: '/faq/questions' },
]

const route = useRoute()
const router = useRouter()
const isMenuOpen = ref(false)

// 세부 메뉴의 '지금 페이지' 표시 — 11/13 "커리큘럼 누르면 메뉴가 두 개 활성화"
// 라우터 기본 표시(router-link-active)는 주소 뒤 ?course= 를 보지 않아 커리큘럼 두 개가 함께 켜진다 → 직접 판단
// 커리큘럼은 같은 주소에서 ?course= 로 나뉘고, 없으면 전당포(EduLayout 탭과 같은 규칙)
const courseOf = (query) => (query.course === 'luxury' ? 'luxury' : 'pawnshop')
const isChildActive = (child) => {
  const target = router.resolve(child.to)
  if (target.path !== route.path) return false
  if ('course' in target.query) return courseOf(target.query) === courseOf(route.query)
  return true
}

// 위 메뉴의 '지금 페이지' 표시 — 수강현황(/education/status)이 교육안내(/education) 주소 아래에 있어
// 라우터 기본 표시로는 둘이 함께 켜진다 → 지금 주소에 가장 길게 들어맞는 메뉴 하나만 켠다
const topPathOf = (item) => router.resolve(item.to).path
const currentTop = computed(() => {
  const path = route.path
  let best = null
  for (const item of MENU) {
    const base = topPathOf(item)
    const hit = path === base || path.startsWith(base.endsWith('/') ? base : `${base}/`)
    if (hit && (!best || base.length > topPathOf(best).length)) best = item
  }
  return best
})
const isTopActive = (item) => currentTop.value === item
const isScrolled = ref(false)

// 전체 메뉴(PC): 메뉴에 마우스를 올리거나 키보드로 들어오면 펼치고, 벗어나면 잠깐 뒤 닫는다(스칠 때 깜빡이지 않게)
const isMegaOpen = ref(false)
let megaTimer = null
const openMega = () => {
  clearTimeout(megaTimer)
  isMegaOpen.value = true
}
const closeMega = () => {
  clearTimeout(megaTimer)
  isMegaOpen.value = false
}
const closeMegaSoon = () => {
  clearTimeout(megaTimer)
  megaTimer = setTimeout(closeMega, 140)
}
const onNavFocusOut = (event) => {
  if (!event.currentTarget.contains(event.relatedTarget)) closeMega()
}

// 투명 헤더는 첫 화면 사진 위에 있을 때만(메인 맨 위, 메뉴 닫힘). 전체 메뉴가 펼쳐지면 판과 한 덩어리가 되게 불투명으로
const isClear = computed(
  () =>
    props.theme === 'transparent' &&
    route.path === '/' &&
    !isScrolled.value &&
    !isMenuOpen.value &&
    !isMegaOpen.value,
)

// 메인이 아닌 페이지(하위 페이지)는 헤더를 흰색으로 — 메인만 페이지와 같은 연한 회색(11/13)
const isSubPage = computed(() => route.path !== '/')

// 로고 글자색: 흰 바탕이면 검정 글자, 사진 위(투명)·차콜 바탕이면 흰 글자
const logoSrc = computed(() => (props.theme === 'dark' || isClear.value ? logoTextWhite : logoTextBlack))


// '수강신청 문의'는 새 페이지로 가지 않고 메인 맨 아래 문의 폼으로(useGoInquiry.js)
const goInquiryBase = useGoInquiry()
const goInquiry = () => {
  closeMenu()
  goInquiryBase()
}

const setBodyLock = (locked) => {
  document.body.style.overflow = locked ? 'hidden' : ''
}

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
  setBodyLock(isMenuOpen.value)
}

const closeMenu = () => {
  isMenuOpen.value = false
  setBodyLock(false)
}

const onScroll = () => {
  isScrolled.value = window.scrollY > 8
}

const onResize = () => {
  if (window.innerWidth > 1080 && isMenuOpen.value) closeMenu()
}

watch(
  () => route.fullPath,
  () => {
    closeMenu()
    closeMega()
  },
)

onMounted(() => {
  onScroll()
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('resize', onResize)
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll)
  window.removeEventListener('resize', onResize)
  clearTimeout(megaTimer)
  setBodyLock(false)
})
</script>

<style scoped>
/* 색 묶음: 흰색(light) / 차콜(dark) / 투명(transparent — 사진 위가 아닐 때는 흰색과 같다) */
.site-header.theme-light,
.site-header.theme-transparent {
  --h-bg: var(--c-bg, #ffffff); /* 11/13 3차 시안은 페이지와 같은 연한 회색 */
  --h-border: var(--jj-line);
  --h-text: var(--jj-text);
  --h-text-sub: var(--jj-text-sub);
  --h-accent: var(--jj-ink); /* 11/12 색 정리: 금색 빼고 글자색 */
  --h-active: var(--jj-ink);
  --h-cta-bg: var(--jj-ink);
  --h-cta-text: #ffffff;
  --h-cta-hover: #000000;
  --h-toggle: var(--jj-ink);
}

.site-header.theme-dark {
  --h-bg: #1b1b1c;
  --h-border: rgba(255, 255, 255, 0.12);
  --h-text: rgba(255, 255, 255, 0.92);
  --h-text-sub: rgba(255, 255, 255, 0.6);
  --h-accent: #ffffff;
  --h-active: #ffffff;
  --h-cta-bg: #ffffff;
  --h-cta-text: #161616;
  --h-cta-hover: #f0ede6;
  --h-toggle: #ffffff;
}

/* 하위 페이지: 흰색·투명 테마 모두 헤더(와 전체 메뉴 판)는 흰색 */
.site-header.is-sub.theme-light,
.site-header.is-sub.theme-transparent {
  --h-bg: #ffffff;
}

/* 첫 화면 사진 위: 배경 없이 흰 글자 (위쪽만 아주 옅게 어둡게 해 글자가 묻히지 않게) */
.site-header.is-clear {
  --h-bg: transparent;
  --h-border: transparent;
  --h-text: #ffffff;
  --h-accent: #ffffff;
  --h-cta-bg: #ffffff;
  --h-cta-text: #161616;
  --h-cta-hover: #f0ede6;
  --h-toggle: #ffffff;
  background-image: linear-gradient(180deg, rgba(0, 0, 0, 0.32) 0%, rgba(0, 0, 0, 0) 100%);
  /* 투명 테두리 칸에 그라데이션이 한 줄 반복돼 선처럼 보이지 않게 */
  background-origin: border-box;
  background-repeat: no-repeat;
}

.site-header {
  position: fixed;
  inset: 0 0 auto 0;
  z-index: 1000;
  height: 100px; /* 11/13 "헤더 높이를 키워, 요소는 그대로" 80 → 92 → 100 (본문·첫 화면·문의 위치도 100 기준) */
  background-color: var(--h-bg);
  border-bottom: 1px solid var(--h-border);
  /* 11/13 '스르륵' — 시작·끝이 부드러운 곡선 */
  transition:
    box-shadow 0.6s cubic-bezier(0.37, 0, 0.63, 1),
    background-color 0.6s cubic-bezier(0.37, 0, 0.63, 1),
    border-color 0.6s cubic-bezier(0.37, 0, 0.63, 1);
}

.nav-link,
.header-cta,
.menu-toggle-bar {
  transition:
    color 0.6s cubic-bezier(0.37, 0, 0.63, 1),
    background-color 0.6s cubic-bezier(0.37, 0, 0.63, 1);
}

.site-header.is-scrolled {
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
}

/* 11/13 "로고·버튼 폭이 달라 가운데가 이상하다" → 왼쪽 | 가운데 | 오른쪽 3칸.
   양쪽 칸을 같은 폭(1fr)으로 두어 메뉴가 로고·버튼 폭과 상관없이 화면 정가운데에 온다 */
.header-inner {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
  align-items: center;
  gap: 40px;
  height: 100%;
  max-width: calc(var(--jj-container) + var(--jj-gutter) * 2);
  margin: 0 auto;
  padding: 0 var(--jj-gutter);
}

.header-logo {
  display: flex;
  align-items: center;
  justify-self: start;
}

.header-logo img {
  display: block;
  height: 44px; /* 11/13 "로고 조금만 줄이고" 48 → 42 → "아주 조금만 키워" 44 */
  width: auto;
}

.header-nav {
  height: 100%;
}

.nav-list {
  display: flex;
  justify-content: center;
  gap: 8px;
  height: 100%;
}

.nav-item {
  position: relative;
  display: flex;
  align-items: center;
}

/* 11/13 "메뉴 hover 시 밑줄 말고 글자가 굵게, 헤더 글자 키워" — 16 → 17px, 지금 페이지 메뉴도 굵게 */
.nav-link {
  position: relative;
  display: flex;
  align-items: center;
  height: 100%;
  padding: 0 24px; /* 11/13 "메뉴 사이 간격 좀만 늘리자" 18 → 24 */
  font-size: 18px; /* 11/13 "헤더 글자 키워도" 17 → 18 */
  font-weight: 400; /* 규칙 3: 굵기는 700/400 두 가지 */
  color: var(--h-text);
  letter-spacing: -0.01em;
  white-space: nowrap;
}

/* 굵어져도 옆 메뉴가 밀리지 않게, 굵은 글자 폭을 미리 잡아 둔다(보이지 않는 굵은 사본) */
.nav-text {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
}

.nav-text::after {
  content: attr(data-text);
  height: 0;
  overflow: hidden;
  visibility: hidden;
  font-weight: 700;
  pointer-events: none;
  user-select: none;
}

.nav-item:hover .nav-link,
.nav-item:focus-within .nav-link,
.nav-link.is-current {
  font-weight: 700;
}


/* ── 전체 메뉴(11/13): 헤더 아래 판 + 각 메뉴 아래 세부 메뉴 열 ──
   색: 판은 헤더와 같은 바탕(흰색 테마=연한 회색, 차콜=차콜)으로 이어지고 아래에만 옅은 선·그림자 */
.mega-bg {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  z-index: 0;
  height: 168px;
  border-bottom: 1px solid var(--h-border);
  background: var(--h-bg);
  box-shadow: 0 18px 30px rgba(0, 0, 0, 0.06);
  opacity: 0;
  visibility: hidden;
  transition:
    opacity 0.35s cubic-bezier(0.37, 0, 0.63, 1),
    visibility 0.35s;
}

.nav-sub {
  position: absolute;
  top: 100%;
  left: 50%;
  z-index: 1;
  min-width: 140px;
  padding-top: 18px;
  text-align: center;
  transform: translateX(-50%);
  opacity: 0;
  visibility: hidden;
  transition:
    opacity 0.35s cubic-bezier(0.37, 0, 0.63, 1),
    visibility 0.35s;
}

.is-mega .mega-bg,
.is-mega .nav-sub {
  opacity: 1;
  visibility: visible;
}

/* 판이 펼쳐지면 헤더와 판 사이 선·그림자는 없애 한 덩어리로 */
.site-header.is-mega {
  border-bottom-color: transparent;
  box-shadow: none;
}

.nav-sub a {
  display: block;
  padding: 9px 12px;
  font-size: 16px;
  color: var(--h-text-sub);
  white-space: nowrap;
  transition: color 0.35s cubic-bezier(0.37, 0, 0.63, 1);
}

.nav-sub .nav-text {
  align-items: center;
}

.nav-sub a:hover,
.nav-sub a:focus-visible,
.nav-sub a.is-current {
  font-weight: 700;
  color: var(--h-text);
}

.header-actions {
  display: flex;
  align-items: center;
  justify-self: end;
}

.header-cta {
  height: 46px;
  padding: 0 24px;
  font-size: 16px;
  font-weight: 700;
  background: var(--h-cta-bg);
  color: var(--h-cta-text);
}

.header-cta:hover {
  background: var(--h-cta-hover);
}

.menu-toggle {
  display: none;
  flex-direction: column;
  justify-content: center;
  gap: 6px;
  width: 44px;
  height: 44px;
  margin-left: auto;
  padding: 0 10px;
  background: none;
  border: 0;
  cursor: pointer;
}

.menu-toggle-bar {
  display: block;
  height: 2px;
  background: var(--h-toggle);
  transition:
    transform 0.35s cubic-bezier(0.37, 0, 0.63, 1),
    opacity 0.35s cubic-bezier(0.37, 0, 0.63, 1);
}

.is-open .menu-toggle-bar:nth-child(2) {
  transform: translateY(8px) rotate(45deg);
}

.is-open .menu-toggle-bar:nth-child(3) {
  opacity: 0;
}

.is-open .menu-toggle-bar:nth-child(4) {
  transform: translateY(-8px) rotate(-45deg);
}

.mobile-menu {
  position: fixed;
  top: 64px;
  left: 0;
  right: 0;
  bottom: 0;
  overflow-y: auto;
  padding: 8px var(--jj-gutter) 32px;
  background: var(--h-bg);
}

.mobile-item {
  padding: 18px 0;
  border-bottom: 1px solid var(--h-border);
}

.mobile-link {
  font-size: 18px;
  font-weight: 700;
  color: var(--h-text);
}

.mobile-sub {
  display: flex;
  flex-wrap: wrap;
  gap: 8px 20px;
  margin-top: 12px;
}

.mobile-sub a {
  font-size: 15px;
  color: var(--h-text-sub);
}

.mobile-sub a.is-current,
.mobile-link.is-current {
  color: var(--h-active);
}

.mobile-actions {
  display: grid;
  margin-top: 28px;
}

.mobile-actions .header-cta {
  height: 54px;
  font-size: 16px;
}

/* 메뉴가 두 줄로 꺾이지 않도록: 좁은 PC 폭에서는 간격을 줄인다 */
@media (max-width: 1280px) {
  .header-inner {
    gap: 24px;
  }

  .nav-list {
    gap: 4px;
  }

  .nav-link {
    padding: 0 16px;
    font-size: 17px;
  }
}

@media (max-width: 1080px) {
  .site-header {
    height: 64px;
  }

  /* 모바일: 메뉴가 숨으므로 로고 · 메뉴 버튼 두 칸 */
  .header-inner {
    display: flex;
  }

  .header-nav,
  .header-actions {
    display: none;
  }

  .menu-toggle {
    display: flex;
  }

  .header-logo img {
    height: 37px;
  }
}
</style>
