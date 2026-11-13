<template>
  <!--
    3차 시안(11/12 레퍼런스 보드 결과): 원래 사이트만큼 정보 많이 + 신뢰 요소
    첫 화면 → 교육과정 → 수강후기 → 수강현황 → 사업영역 → 교육 안내 → 수강신청문의
    (11/13 요청: 수강현황도 메인에 — 수강후기 바로 아래)
    (11/12 요청: 협력 전문가는 메인에서 뺀다 — 교육원 소개 > 협력업체 페이지에만)
    (11/12 요청: 교육과정 바로 아래에 수강후기)
    (11/12 요청: 원장 인사말은 메인에서 아예 뺀다 — 인사말은 교육원 소개 > 인사말 페이지에만)
  -->
  <div class="home">
    <Hero />
    <Courses />
    <Reviews />
    <Status />
    <Business />
    <Info />
    <Inquiry />
    <MobileCta />
  </div>
</template>

<script setup>
import Hero from '@/versions/v3/main/Hero.vue'
import Courses from '@/versions/v3/main/Courses.vue'
import Business from '@/versions/v3/main/Business.vue'
import Info from '@/versions/v3/main/Info.vue'
import Reviews from '@/versions/v3/main/Reviews.vue'
import Status from '@/versions/v3/main/Status.vue'
import Inquiry from '@/versions/v3/main/Inquiry.vue'
import MobileCta from '@/versions/v3/MobileCta.vue'
import { useSEO } from '@/composables/useSEO.js'

useSEO({ path: '/' })
</script>

<style scoped>
.home {
  background: var(--c-bg);
  color: var(--c-text);
}
</style>
