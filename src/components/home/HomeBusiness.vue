<template>
  <section class="ui-section ui-section--white" aria-labelledby="business-title">
    <div class="ui-container">
      <div class="ui-section-head head-row">
        <div>
          <p class="ui-eyebrow">사업 분야</p>
          <h2 id="business-title" class="ui-title">교육을 마치면, 바로 사업으로 이어집니다</h2>
          <p class="ui-desc">
            정확한 감정 역량은 모든 명품 비즈니스의 출발점입니다. 전당포 창업을 중심으로
            금거래소, 중고명품 매장, 명품 수출까지 사업 영역을 넓힐 수 있습니다.
          </p>
        </div>
        <router-link to="/introduction/business" class="ui-link-arrow head-link">
          사업영역 자세히 보기
          <AppIcon name="arrowRight" :size="16" />
        </router-link>
      </div>

      <!-- 대표 사업: 전당포 창업 -->
      <article class="featured">
        <div class="featured-copy">
          <span class="featured-badge">대표 사업</span>
          <h3 class="featured-title">전당포 창업</h3>
          <p class="featured-desc">
            귀금속·명품 감정 실습과 대출 프로세스 교육을 통해 수료 후 바로 전당포를 창업할 수
            있습니다. 국제명품감정교육원과 연계된 진정성 ERP 시스템으로 안정적인 운영을 지원합니다.
          </p>
          <router-link :to="curriculumLink('pawnshop')" class="ui-btn ui-btn--primary featured-cta">
            전당포 창업 과정 보기
            <AppIcon name="arrowRight" :size="18" />
          </router-link>
        </div>
        <ul class="featured-list">
          <li v-for="item in PAWNSHOP_POINTS" :key="item.title">
            <span class="check"><AppIcon name="check" :size="16" :stroke-width="2.2" /></span>
            <span>
              <strong>{{ item.title }}</strong>
              <span class="point-desc">{{ item.desc }}</span>
            </span>
          </li>
        </ul>
      </article>

      <!-- 확장 사업 -->
      <ul class="biz-grid">
        <li v-for="biz in BUSINESSES" :key="biz.title" class="biz-card">
          <div class="biz-visual" :class="{ 'biz-visual--icon': !biz.image }">
            <img v-if="biz.image" :src="biz.image" :alt="biz.alt" loading="lazy" />
            <AppIcon v-else :name="biz.icon" :size="44" :stroke-width="1.3" />
          </div>
          <div class="biz-body">
            <h3 class="biz-title">{{ biz.title }}</h3>
            <p class="biz-desc">{{ biz.desc }}</p>
          </div>
        </li>
      </ul>
    </div>
  </section>
</template>

<script setup>
import AppIcon from '@/components/ui/AppIcon.js'
import goldImage from '@/assets/images/business-2.jpg'
import storeImage from '@/assets/images/business-3.jpg'
import { curriculumLink } from '@/constants/navigation.js'

const PAWNSHOP_POINTS = Object.freeze([
  { title: '담보물 감정', desc: '귀금속 · 명품시계 · 명품가방 · IT기기 등' },
  { title: '대출 프로세스 · 전당포 실무', desc: '담보 대출 프로세스와 매장 운영 실무' },
  { title: '전당포 세무 처리', desc: '창업 후 필요한 세무 실무' },
  { title: '진정성 ERP 시스템 연계', desc: '안정적인 전당포 운영 지원' },
])

const BUSINESSES = Object.freeze([
  {
    title: '금거래소 창업',
    desc: '시세 조회와 매입 실습을 마치면 큰 초기 투자 없이 금 매입 중심의 금거래소를 운영할 수 있습니다.',
    image: goldImage,
    alt: '골드바',
  },
  {
    title: '중고명품 매장 창업',
    desc: '명품 감정 노하우와 온·오프라인 판매 전략을 함께 배워 수료 후 중고명품샵 개설을 준비할 수 있습니다.',
    image: storeImage,
    alt: '명품 가방이 진열된 매장',
  },
  {
    title: '명품 수출 · 관련 업무',
    desc: '정확한 감정 역량을 바탕으로 명품 수출 등 명품 관련 업무로 사업 영역을 넓힐 수 있도록 안내합니다.',
    icon: 'globe',
  },
])
</script>

<style scoped>
.head-row {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 32px;
}

.head-row .ui-desc {
  max-width: 640px;
}

.head-link {
  flex-shrink: 0;
  margin-bottom: 6px;
}

/* ── 대표 사업 ── */
.featured {
  display: grid;
  grid-template-columns: 1.1fr 1fr;
  gap: 48px;
  padding: 48px;
  border-radius: var(--radius-lg);
  background-color: var(--charcoal);
  color: #fff;
}

.featured-badge {
  display: inline-block;
  padding: 5px 12px;
  border-radius: 999px;
  background-color: rgba(201, 164, 92, 0.16);
  color: var(--gold-400);
  font-size: 0.8125rem;
  font-weight: 600;
}

.featured-title {
  margin-top: 16px;
  font-size: 2rem;
  font-weight: 700;
  letter-spacing: -0.03em;
}

.featured-desc {
  margin-top: 14px;
  font-size: 1.0625rem;
  line-height: 1.8;
  color: rgba(255, 255, 255, 0.72);
  word-break: keep-all;
}

.featured-cta {
  margin-top: 28px;
}

.featured-list {
  display: grid;
  gap: 4px;
  align-content: center;
  padding: 8px 28px;
  border-radius: var(--radius-md);
  background-color: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.featured-list li {
  display: flex;
  gap: 14px;
  padding: 16px 0;
}

.featured-list li + li {
  border-top: 1px solid rgba(255, 255, 255, 0.08);
}

.check {
  width: 26px;
  height: 26px;
  flex-shrink: 0;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background-color: var(--gold-700);
  color: #fff;
}

.featured-list strong {
  display: block;
  font-size: 1.0625rem;
  font-weight: 600;
}

.point-desc {
  display: block;
  margin-top: 2px;
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.55);
}

/* ── 확장 사업 ── */
.biz-grid {
  margin-top: 24px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}

.biz-card {
  border: 1px solid var(--line);
  border-radius: var(--radius-lg);
  overflow: hidden;
  background-color: var(--surface);
}

.biz-visual {
  aspect-ratio: 16 / 9;
  background-color: var(--surface-sub);
}

.biz-visual img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.biz-visual--icon {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--gold-100);
  color: var(--gold-700);
}

.biz-body {
  padding: 26px 26px 30px;
}

.biz-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--ink-900);
  letter-spacing: -0.02em;
}

.biz-desc {
  margin-top: 10px;
  font-size: 0.9875rem;
  line-height: 1.75;
  color: var(--ink-500);
  word-break: keep-all;
}

@media (max-width: 1024px) {
  .featured {
    grid-template-columns: 1fr;
    gap: 32px;
    padding: 36px;
  }

  .biz-grid {
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 768px) {
  .head-row {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }

  .featured {
    padding: 28px 20px;
  }

  .featured-title {
    font-size: 1.625rem;
  }

  .featured-desc {
    font-size: 0.9875rem;
  }

  .featured-cta {
    width: 100%;
  }

  .featured-list {
    padding: 4px 18px;
  }

  .biz-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }
}
</style>
