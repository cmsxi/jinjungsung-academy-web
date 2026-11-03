<template>
  <div class="home">
    <HomeHero />
    <HomeBusiness />
    <HomeStrengths />
    <HomeProcess />
    <HomeCurriculum />
    <HomeExperts />
    <HomeReviews />
    <HomeConsult />
  </div>
</template>

<script setup>
import HomeHero from '@/components/home/HomeHero.vue'
import HomeBusiness from '@/components/home/HomeBusiness.vue'
import HomeStrengths from '@/components/home/HomeStrengths.vue'
import HomeProcess from '@/components/home/HomeProcess.vue'
import HomeCurriculum from '@/components/home/HomeCurriculum.vue'
import HomeExperts from '@/components/home/HomeExperts.vue'
import HomeReviews from '@/components/home/HomeReviews.vue'
import HomeConsult from '@/components/home/HomeConsult.vue'
import { useSEO } from '@/composables/useSEO.js'

useSEO({
  path: '/',
  title: '국제명품감정교육원 | 전당포 창업 · 명품감정 교육',
  description:
    '전당포 창업과 명품감정 실무를 함께 배우는 국제명품감정교육원입니다. 귀금속·시계·명품가방 감정부터 전당포·금거래소·중고명품 창업까지 실습 중심으로 교육합니다.',
  keywords:
    '전당포창업, 전당포창업교육, 명품감정, 명품감정교육, 명품감정사, 명품감정사자격증, 금거래소창업, 중고명품창업, 명품수출, 국제명품감정교육원',
})
</script>

<style scoped>
.home {
  background-color: var(--surface);
  color: var(--ink-900);
}
</style>
