<template>
  <!--
    사업영역 — 11/13 "세 사업의 정보 무게가 같은데 사진 크기가 달라 전당포가 주인공처럼 보인다"
    → 세 가지를 같은 크기 3칸으로. 읽기만 하는 정보라 상자 없이(규칙 5)
  -->
  <section class="business">
    <div class="jj-container">
      <V3Head
        title="사업영역"
        desc="교육을 마치면 바로 창업으로 이어집니다."
        link-to="/introduction/business"
        link-label="사업영역 자세히 보기"
      />

      <div class="biz-grid">
        <article v-for="(item, i) in ITEMS" :key="item.title" class="biz" v-reveal="i * 120">
          <div class="biz-media">
            <img :key="photos[i].src" :src="photos[i].src" :alt="item.title" loading="lazy" />
          </div>
          <h3 class="biz-title">{{ item.title }}</h3>
          <p class="biz-text">{{ item.text }}</p>
        </article>
      </div>
    </div>
  </section>
</template>

<script setup>
import V3Head from './V3Head.vue'
import { vReveal } from '../useReveal.js'
import biz1Photo from '@/assets/images/web/business-1.jpg'
import biz3Photo from '@/assets/images/web/business-3.jpg'

// 사진(11/13 확정): 전당포·중고명품은 지금 사이트 사진, 금거래소는 '남색 바탕 가운데 금괴'(Unsplash 1718752773168)
// ⚠ 금거래소 사진은 아직 Unsplash 주소를 그대로 불러온다 — 프로젝트에 내려받아 넣으면 이 주소를 바꿀 것
const GOLD_NAVY = 'https://images.unsplash.com/photo-1718752773168-a44aa1601ddd?w=900&q=75&auto=format'
const photos = [{ src: biz1Photo }, { src: GOLD_NAVY }, { src: biz3Photo }]

// 사업영역 페이지(Business.vue) 문구 기준 요약. 새 내용을 추가하지 말 것.
const ITEMS = [
  {
    title: '전당포 창업',
    text: '귀금속·명품 감정 실습과 대출 프로세스 교육을 통해 수료 후 바로 전당포를 창업할 수 있습니다. 진정성 ERP 시스템으로 안정적인 운영이 가능합니다.',
  },
  {
    title: '금거래소 창업',
    text: '시세 조회, 매입 실습 등의 교육을 마치면 교육 종료와 동시에 금거래소 창업 및 운영이 가능합니다.',
  },
  {
    title: '중고명품사업 창업',
    text: '명품 감정 노하우와 온라인·오프라인 판매 전략을 모두 교육받아 수료 즉시 중고명품샵을 개설할 수 있습니다.',
  },
]
</script>

<style scoped>
.business {
  padding: var(--v3-section-y) 0;
  background: var(--c-bg);
}

.biz-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: var(--v3-gap);
  align-items: start;
}

.biz-media {
  aspect-ratio: 4 / 3;
  margin-bottom: 20px;
  overflow: hidden;
  background: var(--c-bg-alt);
}

.biz-media img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform var(--t-3) var(--ease-soft);
}

.biz:hover .biz-media img {
  transform: scale(1.035);
}

.biz-title {
  font-size: var(--fs-item);
  font-weight: 700;
  line-height: 1.4;
  letter-spacing: -0.025em;
  color: var(--c-text);
}

.biz-text {
  margin-top: 8px;
  font-size: var(--fs-body);
  line-height: 1.7;
  color: var(--c-sub);
  word-break: keep-all;
}

@media (max-width: 900px) {
  .biz-grid {
    grid-template-columns: 1fr;
  }

  .biz {
    display: grid;
    grid-template-columns: 160px minmax(0, 1fr);
    column-gap: 20px;
  }

  .biz-media {
    grid-row: span 2;
    margin-bottom: 0;
  }
}

@media (max-width: 560px) {
  .biz {
    grid-template-columns: 104px minmax(0, 1fr);
    column-gap: 16px;
  }
}
</style>
