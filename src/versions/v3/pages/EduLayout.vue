<template>
  <!--
    3차 시안 '교육안내' 묶음 틀 (11/13) — 공통 머리 + 하위 탭 + 본문
    11/13 "전당포 커리큘럼·명품창업 커리큘럼을 하나의 큰 분류로 수강현황과 같은 단에" → 탭 3개
    11/13 메뉴 이름은 「전당포 과정」「명품창업 과정」(헤더 세부 메뉴와 같게)
    11/13 수강현황은 따로 떨어진 메뉴 → 교육안내 탭은 과정 2개만. 수강현황 페이지는 '수강현황' 머리만(탭 없음)
      주소는 원본과 함께 쓰는 /education/status 그대로라 같은 틀(이 파일)을 거쳐 그려진다
    수강현황 상세는 글 틀(BoardPost)의 굵은 선이 머리 끝 선을 대신한다(rule 끔)
  -->
  <SectionLayout
    :group="isStatus ? '수강현황' : '교육안내'"
    :tabs="isStatus ? [] : TABS"
    :rule="route.name !== 'StatusDetail'"
  />
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import SectionLayout from './SectionLayout.vue'

// 커리큘럼 두 탭은 같은 페이지(/education/curriculum)에서 ?course= 로 나뉜다(없으면 전당포)
const isCourse = (id) => (route) => route.name === 'Curriculum' && (route.query.course === 'luxury' ? 'luxury' : 'pawnshop') === id

const TABS = [
  { label: '전당포 과정', to: { path: '/education/curriculum', query: { course: 'pawnshop' } }, active: isCourse('pawnshop') },
  { label: '명품창업 과정', to: { path: '/education/curriculum', query: { course: 'luxury' } }, active: isCourse('luxury') },
]

const route = useRoute()
const isStatus = computed(() => route.name === 'Status' || route.name === 'StatusDetail')
</script>
