<template>
  <!-- 3차 시안 하위 페이지 묶음 틀: 공통 머리(PageHead) + 그 아래 페이지 본문(router-view) -->
  <div class="page">
    <PageHead :group="group" :title="title" :tabs="tabs" :rule="rule" />
    <div class="page-body">
      <router-view />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import PageHead from './PageHead.vue'

const props = defineProps({
  group: { type: String, required: true },
  // [{ label, to, name, match? }] — name: 이 탭에 해당하는 라우트 이름
  tabs: { type: Array, default: () => [] },
  rule: { type: Boolean, default: true },
})

const route = useRoute()
// 페이지 제목 = 지금 탭 이름(상세 페이지는 match 로 찾음), 없으면 묶음 이름
const title = computed(() => {
  const tab = props.tabs.find((t) =>
    typeof t.active === 'function' ? t.active(route) : t.name === route.name || (t.match || []).includes(route.name),
  )
  return tab ? tab.label : props.group
})
</script>

<style scoped>
.page {
  background: #ffffff;
}

/* 머리 아래 본문 — 각 페이지는 .jj-container 안에 내용을 넣는다 */
.page-body {
  padding: 64px 0 var(--v3-section-y);
}

@media (max-width: 768px) {
  .page-body {
    padding-top: 40px;
  }
}
</style>
