<template>
  <header
    ref="headerEl"
    class="site-header"
    :class="{ 'is-scrolled': isScrolled, 'is-gnb-open': isGnbOpen }"
    @mouseleave="closeGnb"
    @focusout="handleFocusOut"
    @keydown.esc="closeAll"
  >
    <div class="header-inner">
      <router-link to="/" class="brand" aria-label="국제명품감정교육원 홈">
        <img src="@/assets/images/logo.png" alt="국제명품감정교육원" class="brand-logo" />
      </router-link>

      <!-- 데스크톱 GNB -->
      <nav class="gnb" aria-label="주 메뉴" @mouseenter="openGnb" @focusin="openGnb">
        <ul class="gnb-list">
          <li v-for="menu in MAIN_MENUS" :key="menu.label" class="gnb-item">
            <router-link :to="menu.to" class="gnb-link">{{ menu.label }}</router-link>
            <ul class="gnb-sub">
              <li v-for="child in menu.children" :key="child.label">
                <a
                  v-if="child.href"
                  :href="child.href"
                  target="_blank"
                  rel="noopener noreferrer"
                >{{ child.label }}</a>
                <router-link v-else :to="child.to" @click="closeGnb">{{ child.label }}</router-link>
              </li>
            </ul>
          </li>
        </ul>
      </nav>

      <div class="header-actions">
        <a :href="PHONE_TEL" class="header-phone" :aria-label="`상담전화 ${PHONE_DISPLAY}`">
          <AppIcon name="phone" :size="17" />
          <span class="header-phone-label">상담전화</span>
          <strong>{{ PHONE_DISPLAY }}</strong>
        </a>
        <router-link to="/registration" class="ui-btn ui-btn--primary header-cta">
          수강신청문의
        </router-link>
      </div>

      <!-- 모바일 액션 -->
      <div class="mobile-actions">
        <a :href="PHONE_TEL" class="icon-btn" :aria-label="`전화 상담 ${PHONE_DISPLAY}`">
          <AppIcon name="phone" :size="21" />
        </a>
        <button
          type="button"
          class="icon-btn"
          :aria-expanded="isMenuOpen"
          aria-controls="mobile-drawer"
          :aria-label="isMenuOpen ? '메뉴 닫기' : '메뉴 열기'"
          @click="toggleMenu"
        >
          <AppIcon :name="isMenuOpen ? 'close' : 'menu'" :size="24" />
        </button>
      </div>
    </div>

    <!-- 메가메뉴 배경 -->
    <div class="gnb-panel" aria-hidden="true"></div>

    <!-- 모바일 드로어 -->
    <div class="drawer-dim" :class="{ 'is-open': isMenuOpen }" @click="closeMenu"></div>
    <aside
      id="mobile-drawer"
      class="drawer"
      :class="{ 'is-open': isMenuOpen }"
      :aria-hidden="!isMenuOpen"
      :inert="!isMenuOpen || undefined"
    >
      <a :href="PHONE_TEL" class="drawer-call">
        <span class="drawer-call-label">전화 상담</span>
        <strong class="drawer-call-number">{{ PHONE_DISPLAY }}</strong>
        <span class="drawer-call-hint">누르면 바로 연결됩니다</span>
      </a>

      <div v-for="menu in MAIN_MENUS" :key="menu.label" class="drawer-group">
        <router-link :to="menu.to" class="drawer-title">{{ menu.label }}</router-link>
        <ul class="drawer-sub">
          <li v-for="child in menu.children" :key="child.label">
            <a
              v-if="child.href"
              :href="child.href"
              target="_blank"
              rel="noopener noreferrer"
            >{{ child.label }}</a>
            <router-link v-else :to="child.to">{{ child.label }}</router-link>
          </li>
        </ul>
      </div>

      <router-link to="/registration" class="ui-btn ui-btn--primary ui-btn--block drawer-cta">
        수강신청문의
      </router-link>
    </aside>
  </header>
</template>

<script setup>
import { ref, watch, onMounted, onBeforeUnmount } from 'vue'
import { useRoute } from 'vue-router'
import AppIcon from '@/components/ui/AppIcon.js'
import { MAIN_MENUS } from '@/constants/navigation.js'
import { PHONE_DISPLAY, PHONE_TEL } from '@/constants/contact.js'

const MOBILE_QUERY = '(max-width: 1000px)'
const SCROLL_SHADOW_OFFSET = 4

const route = useRoute()
const headerEl = ref(null)
const isMenuOpen = ref(false)
const isGnbOpen = ref(false)
const isScrolled = ref(false)

let mobileMedia = null

// html/body 모두 overflow-x: hidden 이라 실제 스크롤 컨테이너는 html → 둘 다 잠가야 배경 스크롤이 멈춤
const setBodyLock = (locked) => {
  const value = locked ? 'hidden' : ''
  document.documentElement.style.overflow = value
  document.body.style.overflow = value
}

const openGnb = () => {
  if (mobileMedia?.matches) return
  isGnbOpen.value = true
}

const closeGnb = () => {
  isGnbOpen.value = false
}

const closeMenu = () => {
  isMenuOpen.value = false
}

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}

const closeAll = () => {
  closeGnb()
  closeMenu()
}

const handleFocusOut = (event) => {
  if (!headerEl.value?.contains(event.relatedTarget)) closeGnb()
}

const handleScroll = () => {
  isScrolled.value = window.scrollY > SCROLL_SHADOW_OFFSET
}

const handleBreakpoint = (event) => {
  if (!event.matches) closeMenu()
  closeGnb()
}

watch(isMenuOpen, setBodyLock)
watch(() => route.fullPath, closeAll)

onMounted(() => {
  mobileMedia = window.matchMedia(MOBILE_QUERY)
  mobileMedia.addEventListener('change', handleBreakpoint)
  window.addEventListener('scroll', handleScroll, { passive: true })
  handleScroll()
})

onBeforeUnmount(() => {
  mobileMedia?.removeEventListener('change', handleBreakpoint)
  window.removeEventListener('scroll', handleScroll)
  setBodyLock(false)
})
</script>

<style scoped>
.site-header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: var(--header-height);
  background-color: var(--surface);
  border-bottom: 1px solid var(--line);
  z-index: 1000;
  transition: box-shadow 0.2s ease;
}

.site-header.is-scrolled,
.site-header.is-gnb-open {
  box-shadow: 0 4px 18px rgba(28, 30, 34, 0.06);
}

.header-inner {
  position: relative;
  z-index: 2;
  height: 100%;
  max-width: 1320px;
  margin: 0 auto;
  padding: 0 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
}

.brand {
  display: flex;
  align-items: center;
  flex-shrink: 0;
}

.brand-logo {
  height: 42px;
  width: auto;
  display: block;
}

/* ── GNB ── */
.gnb {
  height: 100%;
  flex: 1;
  display: flex;
  justify-content: center;
}

.gnb-list {
  display: flex;
  height: 100%;
}

.gnb-item {
  position: relative;
  width: 128px;
  height: 100%;
}

.gnb-link {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.0625rem;
  font-weight: 600;
  color: var(--ink-900);
  letter-spacing: -0.02em;
  position: relative;
}

.gnb-link::after {
  content: "";
  position: absolute;
  left: 50%;
  bottom: -1px;
  width: 0;
  height: 2px;
  background-color: var(--gold-600);
  transform: translateX(-50%);
  transition: width 0.2s ease;
}

.gnb-item:hover .gnb-link::after,
.gnb-link.router-link-active::after {
  width: 56px;
}

.gnb-link.router-link-active {
  color: var(--gold-700);
}

.gnb-sub {
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  padding: 22px 0;
  display: none;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.is-gnb-open .gnb-sub {
  display: flex;
}

.gnb-sub a {
  display: block;
  padding: 6px 4px;
  font-size: 0.9375rem;
  color: var(--ink-500);
  white-space: nowrap;
  letter-spacing: -0.02em;
}

.gnb-sub a:hover,
.gnb-sub a:focus-visible {
  color: var(--gold-700);
  text-decoration: underline;
  text-underline-offset: 4px;
}

.gnb-panel {
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  height: 152px;
  background-color: var(--surface);
  border-top: 1px solid var(--line);
  border-bottom: 1px solid var(--line);
  box-shadow: 0 12px 24px rgba(28, 30, 34, 0.06);
  display: none;
  z-index: 1;
}

.is-gnb-open .gnb-panel {
  display: block;
}

/* ── 우측 액션 ── */
.header-actions {
  display: flex;
  align-items: center;
  gap: 18px;
  flex-shrink: 0;
}

.header-phone {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: var(--ink-900);
  font-size: 0.9375rem;
}

.header-phone .app-icon {
  color: var(--gold-700);
}

.header-phone-label {
  color: var(--ink-500);
  font-weight: 500;
}

.header-phone strong {
  font-size: 1.0625rem;
  font-weight: 700;
  letter-spacing: 0;
}

.header-phone:hover strong {
  color: var(--gold-700);
}

.header-cta {
  height: 44px;
  padding: 0 20px;
  font-size: 0.9375rem;
}

.mobile-actions {
  display: none;
  align-items: center;
  gap: 4px;
}

.icon-btn {
  width: 44px;
  height: 44px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: none;
  color: var(--ink-900);
  border-radius: var(--radius-sm);
  cursor: pointer;
}

.icon-btn:first-child {
  color: var(--gold-700);
}

/* ── 모바일 드로어 ── */
.drawer,
.drawer-dim {
  display: none;
}

@media (max-width: 1360px) {
  .header-phone-label {
    display: none;
  }
}

@media (max-width: 1160px) {
  .header-phone {
    display: none;
  }

  .gnb-item {
    width: 116px;
  }
}

@media (max-width: 1000px) {
  .gnb,
  .gnb-panel,
  .header-actions {
    display: none !important;
  }

  .mobile-actions {
    display: flex;
  }

  .header-inner {
    padding: 0 8px 0 16px;
  }

  .brand-logo {
    height: 36px;
  }

  .drawer-dim {
    display: block;
    position: fixed;
    inset: var(--header-height) 0 0 0;
    background-color: rgba(28, 30, 34, 0.4);
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.25s ease;
  }

  .drawer-dim.is-open {
    opacity: 1;
    pointer-events: auto;
  }

  .drawer {
    display: block;
    position: fixed;
    top: var(--header-height);
    right: 0;
    width: min(100%, 420px);
    height: calc(100dvh - var(--header-height));
    padding: 20px 20px 32px;
    background-color: var(--surface);
    overflow-y: auto;
    transform: translateX(100%);
    transition: transform 0.28s ease;
  }

  .drawer.is-open {
    transform: translateX(0);
  }

  .drawer-call {
    display: grid;
    gap: 2px;
    padding: 18px 20px;
    margin-bottom: 12px;
    border-radius: var(--radius-md);
    background-color: var(--surface-warm);
    border: 1px solid var(--line);
  }

  .drawer-call-label {
    font-size: 0.875rem;
    color: var(--ink-500);
  }

  .drawer-call-number {
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--ink-900);
    letter-spacing: 0;
  }

  .drawer-call-hint {
    font-size: 0.8125rem;
    color: var(--gold-700);
  }

  .drawer-group {
    padding: 16px 4px;
    border-bottom: 1px solid var(--line);
  }

  .drawer-title {
    display: block;
    font-size: 1.0625rem;
    font-weight: 700;
    color: var(--ink-900);
    margin-bottom: 8px;
  }

  .drawer-sub {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 4px 12px;
  }

  .drawer-sub a {
    display: block;
    padding: 6px 0;
    font-size: 0.9375rem;
    color: var(--ink-500);
  }

  .drawer-cta {
    margin-top: 24px;
  }
}
</style>
