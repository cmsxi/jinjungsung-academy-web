<template>
  <!-- 3차 시안 '교육원 소개' 묶음 틀 (11/13) — 공통 머리 + 하위 탭 + 본문 -->
  <SectionLayout group="교육원 소개" :tabs="TABS" />
</template>

<script setup>
import SectionLayout from './SectionLayout.vue'

const TABS = [
  { label: '인사말', to: '/introduction/greeting', name: 'Greeting' },
  { label: '사업영역', to: '/introduction/business', name: 'Business' },
  { label: '협력업체', to: '/introduction/partners', name: 'Partners' },
]
</script>
