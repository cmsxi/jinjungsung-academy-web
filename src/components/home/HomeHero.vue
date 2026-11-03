<template>
  <section class="hero" aria-labelledby="hero-title">
    <div class="ui-container hero-inner">
      <div class="hero-copy">
        <p class="hero-eyebrow">전당포 · 명품 창업 전문 교육기관</p>
        <h1 id="hero-title" class="hero-title">
          정확한 감정에서 시작하는<br />
          <span class="hero-title-accent">안정적인 전당포 창업</span>
        </h1>
        <p class="hero-desc">
          귀금속·명품시계·명품가방 감정 실습부터 전당포 실무와 세무 처리까지.
          국제명품감정교육원이 창업의 전 과정을 함께 준비합니다.
        </p>
        <div class="hero-actions">
          <button type="button" class="ui-btn ui-btn--primary ui-btn--lg" @click="scrollToConsult">
            수강 상담 신청
            <AppIcon name="arrowRight" :size="18" />
          </button>
          <a :href="PHONE_TEL" class="ui-btn ui-btn--outline ui-btn--lg">
            <AppIcon name="phone" :size="18" />
            전화 상담 {{ PHONE_DISPLAY }}
          </a>
        </div>
      </div>

      <div class="hero-visual">
        <img
          :src="heroImage"
          alt="흰 장갑을 끼고 명품 시계를 감정하는 모습"
          class="hero-image"
          fetchpriority="high"
        />
        <nav class="hero-card" aria-label="개설 과정 바로가기">
          <span class="hero-card-label">개설 과정</span>
          <router-link
            v-for="course in COURSES"
            :key="course.id"
            :to="curriculumLink(course.id)"
            class="hero-card-link"
          >
            <span>
              <small>{{ course.badge }}</small>
              {{ course.name }}
            </span>
            <AppIcon name="chevronRight" :size="18" />
          </router-link>
        </nav>
      </div>
    </div>

    <div class="ui-container">
      <ul class="hero-facts">
        <li v-for="fact in FACTS" :key="fact.title" class="hero-fact">
          <span class="fact-icon"><AppIcon :name="fact.icon" :size="22" /></span>
          <span>
            <strong>{{ fact.title }}</strong>
            <span class="fact-desc">{{ fact.desc }}</span>
          </span>
        </li>
      </ul>
    </div>
  </section>
</template>

<script setup>
import AppIcon from '@/components/ui/AppIcon.js'
import heroImage from '@/assets/images/business-1.jpg'
import { COURSES } from '@/data/curriculum.js'
import { curriculumLink } from '@/constants/navigation.js'
import { PHONE_DISPLAY, PHONE_TEL } from '@/constants/contact.js'

const CONSULT_SECTION_ID = 'consult'

const FACTS = Object.freeze([
  { icon: 'book', title: '4회차 실습 과정', desc: '과정별 총 16교시 내외' },
  { icon: 'calendar', title: '매월 정기 개강', desc: '매월 1회 이상 개강' },
  { icon: 'award', title: '국제명품감정사', desc: '최종 시험 합격 시 자격 취득' },
  { icon: 'users', title: '5개 분야 전문가', desc: '법률·세무·노무 등 자문 협력' },
])

const scrollToConsult = () => {
  document.getElementById(CONSULT_SECTION_ID)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}
</script>

<style scoped>
.hero {
  background-color: var(--surface-warm);
  border-bottom: 1px solid var(--line);
  padding: 72px 0 56px;
}

.hero-inner {
  display: grid;
  grid-template-columns: 1.05fr 1fr;
  gap: 64px;
  align-items: center;
}

.hero-eyebrow {
  display: inline-block;
  padding: 7px 14px;
  border: 1px solid var(--line-strong);
  border-radius: 999px;
  background-color: var(--surface);
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--gold-700);
  margin-bottom: 24px;
}

.hero-title {
  font-size: 3rem;
  line-height: 1.3;
  font-weight: 700;
  color: var(--ink-900);
  letter-spacing: -0.035em;
  word-break: keep-all;
}

.hero-title-accent {
  color: var(--gold-700);
}

.hero-desc {
  margin-top: 22px;
  max-width: 520px;
  font-size: 1.125rem;
  line-height: 1.75;
  color: var(--ink-500);
  word-break: keep-all;
}

.hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 36px;
}

.hero-visual {
  position: relative;
}

.hero-image {
  display: block;
  width: 100%;
  aspect-ratio: 5 / 4;
  object-fit: cover;
  object-position: 30% 50%;
  border-radius: var(--radius-lg);
}

.hero-card {
  position: absolute;
  left: -36px;
  bottom: -28px;
  width: 300px;
  padding: 20px 20px 12px;
  background-color: var(--surface);
  border: 1px solid var(--line);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-card);
}

.hero-card-label {
  display: block;
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--ink-500);
  margin-bottom: 6px;
}

.hero-card-link {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 12px 0;
  font-size: 1rem;
  font-weight: 700;
  color: var(--ink-900);
  letter-spacing: -0.02em;
}

.hero-card-link + .hero-card-link {
  border-top: 1px solid var(--line);
}

.hero-card-link small {
  display: block;
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--gold-700);
  margin-bottom: 2px;
}

.hero-card-link .app-icon {
  color: var(--ink-400);
  flex-shrink: 0;
}

.hero-card-link:hover {
  color: var(--gold-700);
}

.hero-facts {
  margin-top: 72px;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  background-color: var(--surface);
  border: 1px solid var(--line);
  border-radius: var(--radius-md);
}

.hero-fact {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 22px 24px;
}

.hero-fact + .hero-fact {
  border-left: 1px solid var(--line);
}

.fact-icon {
  width: 44px;
  height: 44px;
  flex-shrink: 0;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background-color: var(--gold-100);
  color: var(--gold-700);
}

.hero-fact strong {
  display: block;
  font-size: 1.0625rem;
  font-weight: 700;
  color: var(--ink-900);
  letter-spacing: -0.02em;
}

.fact-desc {
  display: block;
  margin-top: 2px;
  font-size: 0.875rem;
  color: var(--ink-500);
}

@media (max-width: 1100px) {
  .hero-title {
    font-size: 2.5rem;
  }

  .hero-inner {
    gap: 48px;
  }

  .hero-facts {
    grid-template-columns: repeat(2, 1fr);
  }

  .hero-fact:nth-child(3) {
    border-left: none;
  }

  .hero-fact:nth-child(n + 3) {
    border-top: 1px solid var(--line);
  }
}

@media (max-width: 900px) {
  .hero {
    padding: 40px 0 40px;
  }

  .hero-inner {
    grid-template-columns: 1fr;
    gap: 32px;
  }

  .hero-title {
    font-size: 2rem;
  }

  .hero-desc {
    font-size: 1rem;
  }

  .hero-card {
    position: static;
    width: auto;
    margin-top: 12px;
  }

  .hero-facts {
    margin-top: 32px;
  }
}

@media (max-width: 768px) {
  .hero-eyebrow {
    margin-bottom: 18px;
  }

  .hero-title {
    font-size: 1.75rem;
  }

  .hero-actions {
    flex-direction: column;
    margin-top: 28px;
  }

  .hero-actions .ui-btn {
    width: 100%;
  }

  .hero-fact {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
    padding: 18px 16px;
  }

  .fact-icon {
    width: 38px;
    height: 38px;
  }

  .hero-fact strong {
    font-size: 0.9875rem;
  }

  .fact-desc {
    font-size: 0.8125rem;
    word-break: keep-all;
  }
}
</style>
