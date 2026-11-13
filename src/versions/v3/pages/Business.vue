<template>
  <!--
    사업영역 — 3차 시안(11/13 디자인 규칙)
    - 11/13 "옛날처럼 아래로 스크롤하면서 내려갈 수 있게" → 원본처럼 한 사업씩 위에서 아래로(사진 · 글을 줄마다 좌우 번갈아)
      앞서 "정보 무게가 같은데 사진 크기가 달라 전당포가 주인공 같다" → 세 줄 모두 사진 크기 · 글 틀을 똑같이
    - 글은 원본 사업영역 문구 전체를 그대로. 원본 줄바꿈(<br>) 단위로 문단을 나눴다
    - 줄마다 화면에 들어오면 부드럽게 나타난다. 규칙 5: 읽기만 하는 정보라 상자 없이
  -->
  <div class="jj-container">
    <div class="biz-list">
      <article
        v-for="(item, i) in ITEMS"
        :key="item.title"
        class="biz"
        :class="{ 'is-reverse': i % 2 === 1 }"
        v-reveal
      >
        <div class="biz-media">
          <img :src="item.image" :alt="item.title" />
        </div>
        <div class="biz-body">
          <h2 class="biz-title">{{ item.title }}</h2>
          <div class="biz-text">
            <p v-for="line in item.text" :key="line">{{ line }}</p>
          </div>
        </div>
      </article>
    </div>
  </div>
</template>

<script setup>
import { vReveal } from '../useReveal.js'
// 원본 사업영역 사진(business-1~3)의 웹용 사본 — 같은 사진, 용량만 줄인 것
import biz1Image from '@/assets/images/web/business-1.jpg'
import biz3Image from '@/assets/images/web/business-3.jpg'
// 금거래소: 메인 사업영역과 같은 사진(Unsplash 1718752773168). 아직 주소를 그대로 불러온다 — 프로젝트에 내려받으면 함께 바꿀 것
const GOLD_NAVY = 'https://images.unsplash.com/photo-1718752773168-a44aa1601ddd?w=900&q=75&auto=format'

// 원본 사업영역(views/introduction/Business.vue) 문구 그대로. 새 내용을 추가하지 말 것.
const ITEMS = [
  {
    title: '전당포 창업',
    image: biz1Image,
    text: [
      '전당포사업은 담보 대출 이자수익을 통해 연 20%의 안정적인 수익 모델을 제공합니다.',
      '체계적인 귀금속·명품 감정 실습뿐 아니라 IT,기타 제품등 다양한 교육과 대출 프로세스 교육을 통해 수료 후 바로 전당포를 창업할 수 있습니다. 또한 국제명품감정교육원과 연계된 진정성ERP시스템을 통해 안정적인 전당포 운영이 가능합니다.',
    ],
  },
  {
    title: '금거래소 창업',
    image: GOLD_NAVY, // 11/13 금거래소는 메인과 같은 남색 바탕 금괴 사진(사용자 선택)
    text: [
      '금 매입을 위주로 진행하는 진정성금거래소 창업은 초기 큰 투자 없이 안정적인 시세차익을 거둘 수 있는 아이템입니다.',
      '국제명품감정교육원의 시세 조회, 매입 실습등의 교육을 마치면 교육 종료와 동시에 금거래소 창업 및 운영이 가능합니다.',
      '글로벌 금 시세 변동에 따른 시세 차익과 전국 협력점 네트워크 확장으로 안정적 매출 성장이 가능합니다.',
    ],
  },
  {
    title: '중고명품사업 창업',
    image: biz3Image,
    text: [
      '명품 감정 노하우와 온라인·오프라인 판매 전략을 모두 교육받아, 수료 즉시 중고명품샵을 개설할 수 있습니다.',
      '전국 협력점 네트워크 연계와 다양한 유통채널을 통해 프리미엄 고객 확보 및 프리미엄 시장 공략으로 수익 극대화를 노릴 수 있습니다.',
    ],
  },
]
</script>

<style scoped>
/* 한 사업 = 한 줄: 사진(7) · 글(5), 줄마다 좌우를 바꾼다. 세 줄 모두 같은 크기 */
.biz-list {
  display: flex;
  flex-direction: column;
  gap: var(--v3-section-y);
}

.biz {
  display: grid;
  grid-template-columns: minmax(0, 7fr) minmax(0, 5fr);
  gap: 64px;
  align-items: center;
}

/* 좌우를 바꾼 줄도 사진 칸(7) · 글 칸(5) 폭은 그대로 — 세 사진이 같은 크기로 */
.biz.is-reverse {
  grid-template-columns: minmax(0, 5fr) minmax(0, 7fr);
}

.biz.is-reverse .biz-media {
  order: 2;
}

/* 사진 비율 3:2 — 세 사진 같은 틀 */
.biz-media {
  aspect-ratio: 3 / 2;
  overflow: hidden;
  background: var(--c-bg);
}

.biz-media img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.biz-title {
  font-size: var(--fs-section);
  font-weight: 700;
  line-height: 1.35;
  letter-spacing: -0.03em;
  color: var(--c-text);
}

.biz-text {
  margin-top: 20px;
}

.biz-text p {
  font-size: var(--fs-body);
  line-height: 1.8;
  color: var(--c-sub);
  word-break: keep-all;
}

.biz-text p + p {
  margin-top: 12px;
}

/* 좁은 화면: 사진 위 · 글 아래(번갈아 바꾸지 않음) */
@media (max-width: 900px) {
  .biz-list {
    gap: 64px;
  }

  .biz,
  .biz.is-reverse {
    grid-template-columns: minmax(0, 1fr);
    gap: 24px;
  }

  .biz.is-reverse .biz-media {
    order: 0;
  }

  .biz-title {
    font-size: var(--fs-item);
  }

  .biz-text {
    margin-top: 14px;
  }
}
</style>
