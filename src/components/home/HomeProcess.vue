<template>
  <section class="ui-section ui-section--white" aria-labelledby="process-title">
    <div class="ui-container">
      <div class="ui-section-head ui-section-head--center">
        <p class="ui-eyebrow">창업까지의 과정</p>
        <h2 id="process-title" class="ui-title">상담부터 창업까지, 단계별로 함께합니다</h2>
      </div>

      <ol class="steps">
        <li v-for="(step, index) in STEPS" :key="step.title" class="step">
          <div class="step-marker">
            <span class="step-icon"><AppIcon :name="step.icon" :size="24" /></span>
          </div>
          <span class="step-no">STEP {{ String(index + 1).padStart(2, '0') }}</span>
          <h3 class="step-title">{{ step.title }}</h3>
          <p class="step-desc">{{ step.desc }}</p>
        </li>
      </ol>
    </div>
  </section>
</template>

<script setup>
import AppIcon from '@/components/ui/AppIcon.js'

const STEPS = Object.freeze([
  { icon: 'phone', title: '상담 신청', desc: '전화 또는 상담 신청서로 과정과 개강 일정을 안내받습니다.' },
  { icon: 'file', title: '수강 등록', desc: '계약금 결제 후 교육 안내 문자와 카카오톡 채팅방을 보내드립니다.' },
  { icon: 'book', title: '교육 수강', desc: '교재와 실습 장비를 제공하며 이론과 정·가품 실습을 진행합니다.' },
  { icon: 'award', title: '시험 · 자격 취득', desc: '최종 시험에 합격하면 국제명품감정사 자격증을 취득합니다.' },
  { icon: 'store', title: '창업 · 운영', desc: '진정성 ERP 시스템과 1:1 멘토링으로 창업과 운영을 돕습니다.' },
])
</script>

<style scoped>
.steps {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 20px;
  list-style: none;
}

.step {
  position: relative;
  text-align: center;
  padding: 0 4px;
}

/* 단계 연결선 */
.step:not(:last-child) .step-marker::after {
  content: "";
  position: absolute;
  top: 36px;
  left: calc(50% + 48px);
  width: calc(100% - 96px + 20px);
  height: 1px;
  background-image: linear-gradient(to right, var(--line-strong) 50%, transparent 50%);
  background-size: 8px 1px;
}

.step-marker {
  display: flex;
  justify-content: center;
}

.step-icon {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background-color: var(--surface-warm);
  border: 1px solid var(--line);
  color: var(--gold-700);
}

.step:last-child .step-icon {
  background-color: var(--gold-700);
  border-color: var(--gold-700);
  color: #fff;
}

.step-no {
  display: block;
  margin-top: 20px;
  font-size: 0.8125rem;
  font-weight: 700;
  color: var(--gold-700);
  letter-spacing: 0.04em;
}

.step-title {
  margin-top: 6px;
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--ink-900);
  letter-spacing: -0.02em;
}

.step-desc {
  margin-top: 10px;
  font-size: 0.9375rem;
  line-height: 1.7;
  color: var(--ink-500);
  word-break: keep-all;
}

@media (max-width: 1024px) {
  .steps {
    grid-template-columns: 1fr;
    gap: 0;
    max-width: 560px;
    margin: 0 auto;
  }

  .step {
    display: grid;
    grid-template-columns: 56px 1fr;
    column-gap: 18px;
    text-align: left;
    padding: 0 0 28px;
  }

  .step-marker {
    grid-row: 1 / span 3;
    position: relative;
  }

  .step:not(:last-child) .step-marker::after {
    top: 60px;
    left: 50%;
    width: 1px;
    height: calc(100% - 36px);
    background-image: linear-gradient(to bottom, var(--line-strong) 50%, transparent 50%);
    background-size: 1px 8px;
  }

  .step-icon {
    width: 56px;
    height: 56px;
  }

  .step-no {
    margin-top: 4px;
  }

  .step-desc {
    margin-top: 6px;
  }
}
</style>
