<template>
  <!--
    3차 시안 하위 페이지 공통 머리 (11/13 메인 규칙 적용)
    - 상위 메뉴명(작게, 회색) → 페이지 제목(40, 첫 화면 단계) → 하위 탭(같은 묶음 페이지로 이동)
    - 하위 탭: 지금 페이지는 굵은 검정, 나머지는 회색(헤더 메뉴와 같은 '굵게' 규칙, 밑줄 막대 없음). 아래 옅은 선 한 줄(규칙 6)
  -->
  <section class="page-head">
    <div class="jj-container">
      <!-- 상위 메뉴명이 제목과 같으면(자주묻는질문) 한 번만 -->
      <p v-if="group && group !== title" class="page-group">{{ group }}</p>
      <h1 class="page-title">{{ title }}</h1>
      <p v-if="desc" class="page-desc">{{ desc }}</p>

      <!-- 11/13 페이지가 하나뿐인 묶음(자주묻는질문)은 탭을 숨긴다 — 제목과 탭이 같은 글자로 겹치지 않게 -->
      <nav v-if="tabs && tabs.length > 1" class="page-tabs" :aria-label="`${group || title} 하위 메뉴`">
        <router-link
          v-for="tab in tabs"
          :key="tab.label"
          :to="tab.to"
          class="page-tab"
          :class="{ 'is-active': isActive(tab) }"
          :aria-current="isActive(tab) ? 'page' : undefined"
        >
          <span class="page-tab-text" :data-text="tab.label">{{ tab.label }}</span>
        </router-link>
      </nav>
      <div v-else-if="rule" class="page-rule" aria-hidden="true">
        <!-- 11/13 탭이 없는 페이지(수강현황 · 수강후기 · 자주묻는질문 · 수강신청문의)도 탭 있는 페이지처럼
             머리 끝을 옅은 선으로 닫는다 — 제목 아래가 비어 떠 보이지 않게 -->
      </div>
    </div>
  </section>
</template>

<script setup>
import { useRoute } from 'vue-router'

defineProps({
  group: { type: String, default: '' },
  title: { type: String, required: true },
  desc: { type: String, default: '' },
  // [{ label, to, match?: ['라우트 이름', ...], active?: (route) => boolean }]
  // match 로 상세 페이지에서도 탭을 켜 두고, active 로 같은 경로·다른 query 탭(커리큘럼)을 구분한다
  tabs: { type: Array, default: () => [] },
  // 탭 없는 머리 끝의 옅은 선. 게시판 상세는 글 틀(BoardPost)의 굵은 선이 대신하므로 끈다
  rule: { type: Boolean, default: true },
})

const route = useRoute()
const isActive = (tab) => {
  if (typeof tab.active === 'function') return tab.active(route)
  return route.path === tab.to || (tab.match || []).includes(route.name)
}
</script>

<style scoped>
.page-head {
  padding-top: 72px;
  background: #ffffff;
}

.page-group {
  font-size: var(--fs-small);
  font-weight: 700;
  letter-spacing: 0.02em;
  color: var(--c-sub);
}

.page-title {
  margin-top: 10px;
  font-size: var(--fs-hero);
  font-weight: 700;
  line-height: 1.3;
  letter-spacing: -0.03em;
  color: var(--c-text);
  word-break: keep-all;
}

.page-desc {
  max-width: 720px;
  margin-top: 14px;
  font-size: var(--fs-body);
  line-height: 1.7;
  color: var(--c-sub);
  word-break: keep-all;
}

.page-tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 8px 36px;
  margin-top: 40px;
  border-bottom: 1px solid var(--c-line);
}

.page-tab {
  padding: 4px 0 16px;
  font-size: 17px;
  color: var(--c-sub);
  transition: color var(--t-1) var(--ease-soft);
}

.page-tab:hover,
.page-tab.is-active {
  font-weight: 700;
  color: var(--c-text);
}

.page-rule {
  margin-top: 40px;
  border-bottom: 1px solid var(--c-line);
}

/* 굵어져도 옆 탭이 밀리지 않게 굵은 폭을 미리 잡아 둔다 */
.page-tab-text {
  display: inline-flex;
  flex-direction: column;
}

.page-tab-text::after {
  content: attr(data-text);
  height: 0;
  overflow: hidden;
  visibility: hidden;
  font-weight: 700;
  pointer-events: none;
}

@media (max-width: 768px) {
  .page-head {
    padding-top: 40px;
  }

  .page-title {
    font-size: 28px;
  }

  .page-tabs {
    gap: 6px 24px;
    margin-top: 28px;
  }

  .page-rule {
    margin-top: 28px;
  }

  .page-tab {
    font-size: 16px;
    padding-bottom: 12px;
  }
}
</style>
