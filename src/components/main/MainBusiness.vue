<template>
  <section class="main-section business">
    <div class="section-inner">
      <MainSectionHead eyebrow="business" title="사업영역" desc="교육을 마치면 바로 창업으로 이어집니다." />

      <ul class="business-grid">
        <li v-for="item in BUSINESSES" :key="item.title" class="business-item">
          <div class="business-image">
            <img :src="item.image" :alt="item.title" loading="lazy" />
          </div>
          <h3 class="business-title">{{ item.title }}</h3>
          <p class="business-text">{{ item.text }}</p>
        </li>
      </ul>

      <MainMoreLink to="/introduction/business" label="사업영역 자세히 보기" />
    </div>
  </section>
</template>

<script setup>
import MainSectionHead from './MainSectionHead.vue'
import MainMoreLink from './MainMoreLink.vue'
import business1Image from '@/assets/images/business-1.jpg'
import business2Image from '@/assets/images/business-2.jpg'
import business3Image from '@/assets/images/business-3.jpg'

// 사업영역 페이지(Business.vue) 문구 기준 요약
const BUSINESSES = [
  {
    title: '전당포 창업',
    image: business1Image,
    text: '귀금속·명품 감정 실습과 대출 프로세스 교육을 통해 수료 후 바로 전당포를 창업할 수 있습니다. 진정성 ERP 시스템으로 안정적인 운영이 가능합니다.',
  },
  {
    title: '금거래소 창업',
    image: business2Image,
    text: '시세 조회, 매입 실습 등의 교육을 마치면 교육 종료와 동시에 금거래소 창업 및 운영이 가능합니다.',
  },
  {
    title: '중고명품사업 창업',
    image: business3Image,
    text: '명품 감정 노하우와 온라인·오프라인 판매 전략을 모두 교육받아 수료 즉시 중고명품샵을 개설할 수 있습니다.',
  },
]
</script>

<style scoped>
.main-section {
  padding: 90px 2rem;
  background: #f5f5f5;
}

.section-inner {
  max-width: 1100px;
  margin: 0 auto;
}

.business-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}

.business-item {
  background: #fff;
  border: 1px solid #ddd;
  padding-bottom: 28px;
}

.business-image {
  aspect-ratio: 4 / 3;
  overflow: hidden;
  background: #eee;
}

.business-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.business-title {
  margin: 24px 24px 0;
  padding-left: 12px;
  border-left: 3px solid var(--primary-color);
  font-size: 1.25rem;
  font-weight: 700;
  color: #111;
}

.business-text {
  margin: 12px 24px 0;
  font-size: 0.98rem;
  line-height: 1.75;
  color: #555;
  word-break: keep-all;
}

@media (max-width: 900px) {
  .business-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }
}

@media (max-width: 768px) {
  .main-section {
    padding: 60px 16px;
  }

  .business-title {
    margin: 20px 18px 0;
    font-size: 1.15rem;
  }

  .business-text {
    margin: 10px 18px 0;
  }
}
</style>
