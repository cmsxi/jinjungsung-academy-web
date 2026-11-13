<template>
  <!-- 시안 비교용 임시 버튼: 화면 오른쪽 아래 고정, 접기 가능 -->
  <div class="vs">
    <div v-if="isOpen" id="vs-panel" class="vs-panel" role="group" aria-label="시안 비교">
      <div class="vs-head">
        <span class="vs-title">시안 비교 <em>임시</em></span>
        <button type="button" class="vs-fold" @click="setOpen(false)">접기</button>
      </div>

      <p class="vs-group-label">시안 (메인 본문)</p>
      <ul class="vs-list">
        <li v-for="v in VERSIONS" :key="v.id">
          <button
            type="button"
            class="vs-item"
            :class="{ 'is-active': v.id === currentVersion }"
            :aria-pressed="v.id === currentVersion"
            @click="currentVersion = v.id"
          >
            <span class="vs-label">{{ v.label }}</span>
            <span class="vs-desc">{{ v.desc }}</span>
          </button>
        </li>
      </ul>

      <div class="vs-themes">
        <div class="vs-theme-row" :class="{ 'is-disabled': !hasPalettes }">
          <span class="vs-group-label">색 구성</span>
          <div class="vs-seg" role="group" aria-label="색 구성">
            <button
              v-for="p in PALETTES"
              :key="p.id"
              type="button"
              :class="{ 'is-active': p.id === palette }"
              :aria-pressed="p.id === palette"
              :disabled="!hasPalettes"
              @click="palette = p.id"
            >
              {{ p.label }}
            </button>
          </div>
        </div>
        <p v-if="!hasPalettes" class="vs-note">색 구성은 3차 시안부터 바꿀 수 있습니다.</p>
      </div>

      <div class="vs-themes" :class="{ 'is-disabled': !themable }">
        <div class="vs-theme-row">
          <span class="vs-group-label">헤더 색</span>
          <div class="vs-seg" role="group" aria-label="헤더 색">
            <button
              v-for="t in HEADER_THEMES"
              :key="t.id"
              type="button"
              :class="{ 'is-active': t.id === headerTheme }"
              :aria-pressed="t.id === headerTheme"
              :disabled="!themable"
              @click="headerTheme = t.id"
            >
              {{ t.label }}
            </button>
          </div>
        </div>
        <div class="vs-theme-row">
          <span class="vs-group-label">푸터 색</span>
          <div class="vs-seg" role="group" aria-label="푸터 색">
            <button
              v-for="t in FOOTER_THEMES"
              :key="t.id"
              type="button"
              :class="{ 'is-active': t.id === footerTheme }"
              :aria-pressed="t.id === footerTheme"
              :disabled="!themable"
              @click="footerTheme = t.id"
            >
              {{ t.label }}
            </button>
          </div>
        </div>
        <p v-if="!themable" class="vs-note">원본은 운영 중인 헤더·푸터 그대로라 색을 바꾸지 않습니다.</p>
      </div>

      <!-- 3차 시안: 자리별 사진 후보 바꿔 끼우기 (사진 고르기 보드에서 '후보에 담은' 사진) -->
      <div v-if="hasPhotos" class="vs-themes">
        <span class="vs-group-label">첫 화면 후보 (3차 시안)</span>
        <label v-for="slot in PHOTO_SLOTS" :key="slot.id" class="vs-photo-row">
          <span>{{ slot.label }}</span>
          <select
            :value="photoPicks[slot.id] || slot.options[0].id"
            @change="photoPicks = { ...photoPicks, [slot.id]: $event.target.value }"
          >
            <option v-for="o in slot.options" :key="o.id" :value="o.id">{{ o.label }}</option>
          </select>
        </label>
      </div>

      <p class="vs-note">하위 페이지는 헤더·푸터만 바뀌고 본문은 아직 원본입니다.</p>
    </div>

    <button
      v-else
      type="button"
      class="vs-toggle"
      aria-controls="vs-panel"
      :aria-expanded="isOpen"
      @click="setOpen(true)"
    >
      시안 비교 · <strong>{{ VERSION_MAP[currentVersion].label }}</strong>
    </button>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { VERSIONS, VERSION_MAP, HEADER_THEMES, FOOTER_THEMES, PALETTES } from './registry.js'
import { currentVersion, headerTheme, footerTheme, palette, photoPicks } from './useVersion.js'
import { PHOTO_SLOTS } from './v3/photos.js'

const OPEN_KEY = 'jj-preview-switcher-open'

const readOpen = () => {
  try {
    return localStorage.getItem(OPEN_KEY) !== '0'
  } catch {
    return true
  }
}

const isOpen = ref(readOpen())
const themable = computed(() => VERSION_MAP[currentVersion.value].themable)
const hasPalettes = computed(() => !!VERSION_MAP[currentVersion.value].palettes)
const hasPhotos = computed(() => !!VERSION_MAP[currentVersion.value].photos)

const setOpen = (open) => {
  isOpen.value = open
  try {
    localStorage.setItem(OPEN_KEY, open ? '1' : '0')
  } catch {
    // 저장이 막힌 브라우저에서는 무시
  }
}
</script>

<style scoped>
/* 사이트 디자인과 섞이지 않도록 도구 느낌의 중립 스타일 */
/* 오른쪽 아래는 카카오톡 문의 자리라 왼쪽 아래로(11/12) */
.vs {
  position: fixed;
  left: 20px;
  bottom: 20px;
  z-index: 5000;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Malgun Gothic', sans-serif;
  font-size: 13px;
  color: #1f2328;
}

.vs-toggle {
  padding: 10px 14px;
  border: 1px solid #c9ccd1;
  border-radius: 999px;
  background: #fff;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.15);
  font: inherit;
  color: inherit;
  cursor: pointer;
}

.vs-toggle strong {
  font-weight: 700;
  color: #0b57d0;
}

.vs-photo-row {
  display: grid;
  grid-template-columns: 96px 1fr;
  align-items: center;
  gap: 8px;
  margin-top: 6px;
  font-size: 12px;
}

.vs-photo-row select {
  width: 100%;
  padding: 4px 6px;
  border: 1px solid #c9ccd1;
  border-radius: 6px;
  background: #fff;
  font: inherit;
  font-size: 12px;
}

.vs-panel {
  max-height: calc(100vh - 40px);
  overflow-y: auto;
  width: 290px;
  padding: 12px;
  border: 1px solid #c9ccd1;
  border-radius: 10px;
  background: #fff;
  box-shadow: 0 8px 28px rgba(0, 0, 0, 0.2);
}

.vs-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
}

.vs-title {
  font-weight: 700;
}

.vs-title em {
  margin-left: 4px;
  padding: 1px 6px;
  border-radius: 4px;
  background: #fff4ce;
  font-style: normal;
  font-size: 11px;
  font-weight: 600;
  color: #7a5b00;
}

.vs-fold {
  padding: 4px 8px;
  border: 1px solid #c9ccd1;
  border-radius: 6px;
  background: #f6f8fa;
  font: inherit;
  font-size: 12px;
  cursor: pointer;
}

.vs-group-label {
  display: block;
  margin-bottom: 6px;
  font-size: 12px;
  font-weight: 600;
  color: #59636e;
}

.vs-list {
  display: grid;
  gap: 6px;
}

.vs-item {
  display: block;
  width: 100%;
  padding: 8px 10px;
  border: 1px solid #d8dbe0;
  border-radius: 8px;
  background: #fff;
  font: inherit;
  text-align: left;
  color: inherit;
  cursor: pointer;
}

.vs-item:hover {
  background: #f6f8fa;
}

.vs-item.is-active {
  border-color: #0b57d0;
  background: #eef4ff;
}

.vs-label {
  display: block;
  font-weight: 700;
}

.vs-desc {
  display: block;
  margin-top: 2px;
  font-size: 12px;
  color: #59636e;
}

.vs-themes {
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid #e5e7eb;
}

.vs-theme-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.vs-theme-row + .vs-theme-row {
  margin-top: 8px;
}

.vs-theme-row .vs-group-label {
  margin-bottom: 0;
}

.vs-seg {
  display: inline-flex;
  border: 1px solid #c9ccd1;
  border-radius: 7px;
  overflow: hidden;
}

.vs-seg button {
  padding: 5px 12px;
  border: 0;
  background: #fff;
  font: inherit;
  font-size: 12px;
  color: inherit;
  cursor: pointer;
}

.vs-seg button + button {
  border-left: 1px solid #c9ccd1;
}

.vs-seg button.is-active {
  background: #0b57d0;
  color: #fff;
  font-weight: 600;
}

.vs-themes.is-disabled .vs-seg,
.vs-theme-row.is-disabled .vs-seg {
  opacity: 0.45;
}

.vs-seg button:disabled {
  cursor: not-allowed;
}

.vs-note {
  margin-top: 8px;
  font-size: 11.5px;
  line-height: 1.5;
  color: #59636e;
}

.vs-toggle:focus-visible,
.vs-fold:focus-visible,
.vs-item:focus-visible,
.vs-seg button:focus-visible {
  outline: 2px solid #0b57d0;
  outline-offset: 2px;
}

/* 모바일: 3차 시안의 화면 아래 고정 문의 버튼과 겹치지 않게 위로 */
@media (max-width: 768px) {
  .vs {
    bottom: 84px;
  }
}

@media (max-width: 480px) {
  .vs {
    left: 12px;
  }

  .vs-panel {
    width: min(290px, calc(100vw - 24px));
  }
}
</style>
