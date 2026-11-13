<template>
  <!-- 3차 시안 '자주묻는질문' 묶음 틀 (11/13) — 공통 머리 + 하위 탭 + 본문 -->
  <SectionLayout group="자주묻는질문" :tabs="TABS" />
</template>

<script setup>
import SectionLayout from './SectionLayout.vue'

const TABS = [
  { label: '자주묻는질문', to: '/faq/questions', name: 'Questions' },
]
</script>
