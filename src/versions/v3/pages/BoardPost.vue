<template>
  <!--
    게시판 글 틀 — 수강현황 상세 · 수강후기 상세 공용 (11/13 "일반적인 게시판처럼" → 기본 게시판형 선택)
      ━ 굵은 선 ━  제목 · 작성일                       [← 목록]
      ─ 옅은 선 ─
                   (사진 · 본문 — 각 페이지가 넣음)
      ━ 굵은 선 ━  이전글  제목 ……………………… 2026.07.28
      ─ 옅은 선 ─  다음글  제목 ……………………… 2026.07.28
      ━ 굵은 선 ━
                        [ 목록 ]
    - 11/13 "뒤로 나가기 · 이전글 · 다음글 같은 기본 요소가 없다" → 위 오른쪽 작은 목록 버튼 + 아래 이전글 · 다음글 줄 + 목록 버튼
    - 이전글 = 바로 아래(더 오래된 글), 다음글 = 바로 위(더 최근 글). 줄 전체를 누르면 그 글로
      (주소를 바꿔 끼워서(replace) 뒤로 가기 · 목록 버튼은 처음 들어온 목록 쪽 · 위치로 돌아간다)
  -->
  <article class="bp">
    <header class="bp-head">
      <div class="bp-head-text">
        <h2 v-if="title" class="bp-title">{{ title }}</h2>
        <p v-if="meta.length" class="bp-meta">
          <span v-for="item in meta" :key="item.label" class="bp-meta-item">
            <span class="bp-meta-label">{{ item.label }}</span>{{ item.value }}
          </span>
        </p>
      </div>
      <a :href="listPath" class="v3-btn v3-btn--line v3-btn--sm bp-back" @click.prevent="emit('list')">
        <span aria-hidden="true">←</span>&nbsp;목록
      </a>
    </header>

    <div class="bp-body">
      <slot />
    </div>

    <nav class="bp-nav" aria-label="이전글 · 다음글">
      <div v-for="row in rows" :key="row.key" class="bp-nav-row" :class="{ 'is-empty': !row.item }">
        <span class="bp-nav-label">{{ row.label }}</span>
        <router-link v-if="row.item" :to="row.item.to" replace class="bp-nav-title">{{ row.item.title }}</router-link>
        <span v-else class="bp-nav-title">{{ row.empty }}</span>
        <span v-if="row.item && row.item.date" class="bp-nav-date">{{ row.item.date }}</span>
      </div>
    </nav>

    <div class="bp-foot">
      <a :href="listPath" class="v3-btn v3-btn--line bp-list" @click.prevent="emit('list')">목록</a>
    </div>
  </article>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  title: { type: String, default: '' },
  // [{ label: '작성일', value: '2026.07.28' }]
  meta: { type: Array, default: () => [] },
  listPath: { type: String, required: true },
  // { to, title, date } | null(없음) | undefined(아직 찾는 중)
  older: { type: Object, default: undefined },
  newer: { type: Object, default: undefined },
})

const emit = defineEmits(['list'])

// 찾는 중(undefined)에는 빈칸, 찾았는데 없으면(null) 안내 문구
const rows = computed(() => [
  { key: 'older', label: '이전글', item: props.older, empty: props.older === null ? '이전 글이 없습니다' : '' },
  { key: 'newer', label: '다음글', item: props.newer, empty: props.newer === null ? '다음 글이 없습니다' : '' },
])
</script>

<style scoped>
/* ── 머리: 위 굵은 선 + 제목 · 작성일 + 오른쪽 목록 버튼, 아래 옅은 선 ── */
.bp-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 24px;
  padding: 28px 0 24px;
  border-top: 2px solid var(--c-text);
  border-bottom: 1px solid var(--c-line);
}

.bp-head-text {
  min-width: 0;
}

.bp-title {
  font-size: var(--fs-section);
  font-weight: 700;
  line-height: 1.35;
  letter-spacing: -0.03em;
  color: var(--c-text);
  word-break: keep-all;
}

.bp-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 4px 20px;
  font-size: var(--fs-small);
  line-height: 1.6;
  color: var(--c-sub);
}

.bp-title + .bp-meta {
  margin-top: 10px;
}

.bp-meta-label {
  margin-right: 8px;
  font-weight: 700;
}

.bp-back {
  flex: none;
}

/* ── 본문(사진 · 글) ── */
.bp-body {
  padding: var(--v3-head-gap) 0 56px;
}

/* ── 이전글 · 다음글: 위아래 굵은 선, 사이 옅은 선. 줄 전체가 링크 ── */
.bp-nav {
  border-top: 2px solid var(--c-text);
  border-bottom: 2px solid var(--c-text);
}

.bp-nav-row {
  position: relative;
  display: grid;
  grid-template-columns: 120px minmax(0, 1fr) auto;
  gap: 24px;
  align-items: center;
  padding: 20px 0;
}

.bp-nav-row + .bp-nav-row {
  border-top: 1px solid var(--c-line);
}

.bp-nav-label {
  font-size: var(--fs-small);
  font-weight: 700;
  color: var(--c-text);
}

.bp-nav-title {
  overflow: hidden;
  font-size: var(--fs-body);
  line-height: 1.5;
  color: var(--c-text);
  white-space: nowrap;
  text-overflow: ellipsis;
}

.bp-nav-row.is-empty .bp-nav-title {
  color: var(--c-sub);
}

/* 줄 어디를 눌러도 그 글로 */
a.bp-nav-title::after {
  content: '';
  position: absolute;
  inset: 0;
}

.bp-nav-row:hover a.bp-nav-title,
a.bp-nav-title:focus-visible {
  text-decoration: underline;
  text-underline-offset: 3px;
}

a.bp-nav-title:focus-visible {
  outline: none;
}

.bp-nav-date {
  font-size: var(--fs-small);
  color: var(--c-sub);
}

/* ── 맨 아래 목록 버튼 ── */
.bp-foot {
  display: flex;
  justify-content: center;
  margin-top: 40px;
}

.bp-list {
  min-width: 160px;
}

@media (max-width: 768px) {
  .bp-head {
    padding: 20px 0 18px;
  }

  .bp-title {
    font-size: var(--fs-item);
  }

  .bp-body {
    padding: 24px 0 40px;
  }

  .bp-nav-row {
    grid-template-columns: 64px minmax(0, 1fr);
    gap: 12px;
    padding: 16px 0;
  }

  .bp-nav-date {
    display: none;
  }

  .bp-foot {
    margin-top: 32px;
  }
}
</style>
