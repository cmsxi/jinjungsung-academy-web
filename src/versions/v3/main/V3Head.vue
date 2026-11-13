<template>
  <!-- 섹션 머리: 위에 가는 선 + 왼쪽 제목, 오른쪽 '전체 보기' (HODINKEE 배치 참고) -->
  <header class="v3-head" v-reveal>
    <div class="v3-head-row">
      <h2 class="v3-head-title">{{ title }}</h2>
      <router-link v-if="linkTo" :to="linkTo" class="v3-btn v3-btn--line v3-btn--sm v3-head-link">{{ linkLabel }}</router-link>
    </div>
    <p v-if="desc" class="v3-head-desc">{{ desc }}</p>
  </header>
</template>

<script setup>
import { vReveal } from '../useReveal.js'

defineProps({
  title: { type: String, required: true },
  desc: { type: String, default: '' },
  linkTo: { type: [String, Object], default: '' },
  linkLabel: { type: String, default: '' },
})
</script>

<style scoped>
/* 규칙 8: 모든 섹션 같은 머리 — 왼쪽 위 제목, 아래 한 줄 설명, 오른쪽 끝 이동 버튼(규칙 10 테두리 버튼) */
.v3-head {
  margin-bottom: var(--v3-head-gap);
}

.v3-head-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
}

.v3-head-title {
  font-size: var(--fs-section);
  font-weight: 700;
  line-height: 1.35;
  letter-spacing: -0.03em;
  color: var(--c-text);
  word-break: keep-all;
}

.v3-head-link {
  flex-shrink: 0;
}

.v3-head-desc {
  max-width: 620px;
  margin-top: 10px;
  font-size: var(--fs-body);
  line-height: 1.7;
  color: var(--c-sub);
  white-space: pre-line;
  word-break: keep-all;
}
</style>
