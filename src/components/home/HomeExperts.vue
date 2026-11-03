<template>
  <section class="experts" aria-labelledby="experts-title">
    <div class="ui-container experts-inner">
      <div class="experts-copy">
        <p class="ui-eyebrow experts-eyebrow">전문가 네트워크</p>
        <h2 id="experts-title" class="experts-title">창업 이후까지 함께하는<br />전문가 그룹</h2>
        <p class="experts-desc">
          법률·세무·노무·법무·지식재산 분야의 전문가들이 진정성 협력점과 함께
          사업이 안전하게 자리 잡을 수 있도록 돕습니다.
        </p>
        <router-link to="/introduction/partners" class="experts-link">
          협력 전문가 소개
          <AppIcon name="arrowRight" :size="16" />
        </router-link>
      </div>

      <ul class="expert-grid">
        <li v-for="expert in EXPERT_FIELDS" :key="expert.title" class="expert-tile">
          <strong>{{ expert.title }}</strong>
          <span>{{ expert.desc }}</span>
        </li>
      </ul>
    </div>
  </section>
</template>

<script setup>
import AppIcon from '@/components/ui/AppIcon.js'

const EXPERT_FIELDS = Object.freeze([
  { title: '변호사', desc: '법률 자문' },
  { title: '세무사', desc: '세무 · 회계' },
  { title: '노무사', desc: '인사 · 노무' },
  { title: '법무사', desc: '등기 · 법무' },
  { title: '변리사', desc: '상표 · 지식재산' },
])
</script>

<style scoped>
.experts {
  background-color: var(--charcoal);
  color: #fff;
  padding: 88px 0;
}

.experts-inner {
  display: grid;
  grid-template-columns: 1fr 1.25fr;
  gap: 64px;
  align-items: center;
}

.experts-eyebrow {
  color: var(--gold-400);
}

.experts-eyebrow::before {
  background-color: var(--gold-400);
}

.experts-title {
  font-size: 2rem;
  line-height: 1.4;
  font-weight: 700;
  letter-spacing: -0.03em;
}

.experts-desc {
  margin-top: 16px;
  font-size: 1rem;
  line-height: 1.8;
  color: rgba(255, 255, 255, 0.68);
  word-break: keep-all;
}

.experts-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-top: 28px;
  padding-bottom: 4px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.4);
  font-size: 0.9375rem;
  font-weight: 600;
}

.experts-link:hover {
  color: var(--gold-400);
  border-color: var(--gold-400);
}

.expert-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 12px;
}

.expert-tile {
  display: grid;
  gap: 6px;
  justify-items: center;
  padding: 32px 8px;
  border-radius: var(--radius-md);
  border: 1px solid rgba(255, 255, 255, 0.1);
  background-color: rgba(255, 255, 255, 0.04);
  text-align: center;
}

.expert-tile strong {
  font-size: 1.1875rem;
  font-weight: 700;
}

.expert-tile span {
  font-size: 0.8125rem;
  color: rgba(255, 255, 255, 0.55);
  word-break: keep-all;
}

@media (max-width: 1024px) {
  .experts-inner {
    grid-template-columns: 1fr;
    gap: 36px;
  }
}

@media (max-width: 768px) {
  .experts {
    padding: 64px 0;
  }

  .experts-title {
    font-size: 1.5rem;
  }

  .expert-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 8px;
  }

  .expert-tile {
    padding: 20px 6px;
  }

  .expert-tile strong {
    font-size: 1.0625rem;
  }
}
</style>
