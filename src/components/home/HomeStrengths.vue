<template>
  <section class="ui-section ui-section--warm" aria-labelledby="strengths-title">
    <div class="ui-container strengths">
      <div class="ui-section-head strengths-head">
        <p class="ui-eyebrow">교육원의 강점</p>
        <h2 id="strengths-title" class="ui-title">
          배우는 데서 끝나지 않도록,<br />현장의 방식으로 가르칩니다
        </h2>
        <p class="ui-desc">
          이론만으로는 창업할 수 없습니다. 실제 정·가품을 다루는 실습과 수료 이후까지 이어지는
          지원으로 바로 현장에 설 수 있는 역량을 만듭니다.
        </p>
      </div>

      <ol class="strength-list">
        <li v-for="(item, index) in STRENGTHS" :key="item.title" class="strength-item">
          <span class="strength-no">{{ String(index + 1).padStart(2, '0') }}</span>
          <h3 class="strength-title">{{ item.title }}</h3>
          <p class="strength-desc">{{ item.desc }}</p>
        </li>
      </ol>
    </div>
  </section>
</template>

<script setup>
const STRENGTHS = Object.freeze([
  {
    title: '감정부터 창업까지, 올인원 과정',
    desc: '귀금속·시계·명품가방 감정부터 전당포·중고명품 매장·금거래소 창업 노하우까지 한 번에 배웁니다.',
  },
  {
    title: '실습 중심의 현장형 커리큘럼',
    desc: '다양한 실제 정·가품으로 실습하고, 판매·감정·운영 실전 노하우와 창업 시뮬레이션까지 진행합니다.',
  },
  {
    title: '수료 후에도 이어지는 지원',
    desc: '국제명품감정사 자격 취득과 업계 네트워킹, 교육 이후에도 계속되는 1:1 멘토링을 제공합니다.',
  },
  {
    title: '운영 시스템과 전문가 자문',
    desc: '진정성 ERP 시스템 연계와 변호사·세무사 등 전문가 그룹의 자문으로 안정적인 운영을 돕습니다.',
  },
])
</script>

<style scoped>
.strengths {
  display: grid;
  grid-template-columns: 0.9fr 1.1fr;
  gap: 64px;
  align-items: start;
}

.strengths-head {
  margin-bottom: 0;
}

.strength-list {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  list-style: none;
}

.strength-item {
  padding: 30px 28px 32px;
  background-color: var(--surface);
  border: 1px solid var(--line);
  border-radius: var(--radius-lg);
}

.strength-no {
  display: block;
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--gold-600);
  letter-spacing: -0.02em;
  font-variant-numeric: tabular-nums;
}

.strength-title {
  margin-top: 28px;
  font-size: 1.1875rem;
  font-weight: 700;
  color: var(--ink-900);
  letter-spacing: -0.02em;
  word-break: keep-all;
}

.strength-desc {
  margin-top: 10px;
  font-size: 0.9875rem;
  line-height: 1.75;
  color: var(--ink-500);
  word-break: keep-all;
}

@media (max-width: 1024px) {
  .strengths {
    grid-template-columns: 1fr;
    gap: 0;
  }

  .strengths-head {
    margin-bottom: 40px;
  }
}

@media (max-width: 640px) {
  .strength-list {
    grid-template-columns: 1fr;
    gap: 12px;
  }

  .strength-item {
    padding: 24px 20px;
  }

  .strength-title {
    margin-top: 16px;
  }
}
</style>
