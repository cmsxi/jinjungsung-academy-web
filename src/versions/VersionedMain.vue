<template>
  <!-- '/' 경로: 지금 고른 시안의 메인 화면을 보여 준다 (임시) -->
  <component :is="VERSION_MAP[currentVersion].main" :key="currentVersion" />
</template>

<script setup>
import { VERSION_MAP } from './registry.js'
import { currentVersion } from './useVersion.js'
</script>
