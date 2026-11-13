<template>
  <!--
    첫 화면 (11/12) — 비교 버튼 '사진 후보 > 첫 화면'에서 바꿔 본다(photos.js)
    - 실제 사진 3장: 지금 사이트 메인 배너 3장의 사진(문구 없는 본)을 넘겨 가며 보여주고, 문구·어둡게 깔리는 그라데이션은 화면에서 직접 얹는다.
      문구는 지금 사이트 배너 3장에 들어 있던 문구 그대로.
    - 정물(시계·보석): 사진 1장 + 1번 배너 문구
    - 원본 배너 그대로: 문구가 들어간 이미지(main-first.png)를 그대로
    - 비율은 원본 배너와 같게(PC 1925×688, 모바일 400×650). 사진은 헤더 밑까지 올라가 헤더가 위쪽을 조금 가린다.
  -->
  <section class="hero" :class="`hero--${photo.kind}`" aria-labelledby="v3-hero-title">
    <h1 id="v3-hero-title" class="jj-sr-only">국제명품감정교육원</h1>

    <!-- 원본 배너 그대로 -->
    <template v-if="photo.kind === 'banner'">
      <picture>
        <source media="(max-width: 768px)" :srcset="bannerMobile" width="400" height="650" />
        <img class="banner-img" :src="bannerPc" width="1925" height="688" alt="" fetchpriority="high" />
      </picture>
      <p class="jj-sr-only">{{ COPY[0].title }} — {{ COPY[0].desc }}</p>
    </template>

    <!-- 실제 사진 3장 / 정물 1장: 사진 + 그라데이션 + 문구 -->
    <div
      v-else
      class="hero-stage"
      @mouseenter="paused = true"
      @mouseleave="paused = false"
      @focusin="paused = true"
      @focusout="paused = false"
    >
      <div
        v-for="(slide, i) in slides"
        :key="slide.src"
        class="hero-slide"
        :class="{ 'is-active': i === current }"
        aria-hidden="true"
      >
        <!-- 사진 전체를 보여 주는 장면(자격증 액자): 빈 양옆은 같은 사진을 흐리게 깔아 채운다 -->
        <img v-if="slide.fit === 'contain'" class="hero-fill" :src="slide.src" alt="" loading="lazy" />
        <img
          class="hero-img"
          :class="{ 'is-contain': slide.fit === 'contain' }"
          :src="slide.src"
          alt=""
          :loading="i === 0 ? 'eager' : 'lazy'"
          :fetchpriority="i === 0 ? 'high' : 'auto'"
          :style="{ '--pos': slide.pos, '--pos-m': slide.mobilePos || slide.pos }"
        />
      </div>

      <div class="hero-dim" :class="{ 'is-contain': slides[current]?.fit === 'contain' }" aria-hidden="true"></div>

      <div class="hero-copy" :key="`${photo.id}-${current}`" aria-live="polite">
        <p class="hero-eyebrow">Our Promise</p>
        <h2 class="hero-title">{{ activeCopy.title }}</h2>
        <p v-if="activeCopy.desc" class="hero-desc">{{ activeCopy.desc }}</p>
        <ul v-if="activeCopy.points" class="hero-points">
          <li v-for="point in activeCopy.points" :key="point">{{ point }}</li>
        </ul>
        <!-- 마무리 문장은 쉼표 앞뒤 덩어리가 중간에서 끊기지 않게 나눠 둔다 -->
        <p v-if="activeCopy.closing" class="hero-closing">
          <span v-for="part in activeCopy.closing" :key="part">{{ part }}</span>
        </p>
      </div>

      <div v-if="slides.length > 1" class="hero-dots" role="group" aria-label="첫 화면 사진 넘기기">
        <button
          v-for="(slide, i) in slides"
          :key="slide.src"
          type="button"
          class="hero-dot"
          :class="{ 'is-active': i === current }"
          :aria-label="`${i + 1}번째 사진 보기`"
          :aria-current="i === current ? 'true' : undefined"
          @click="go(i)"
        ></button>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'
import { usePhoto } from '../photos.js'
import bannerPc from '@/assets/images/main-first.png'
import bannerMobile from '@/assets/images/main-first-mobile.png'
import realPractice from '@/assets/images/hero-real/real-1-practice.jpg'
import realCertificate from '@/assets/images/hero-real/real-2-certificate.jpg'
import realLecture from '@/assets/images/hero-real/real-3-lecture.jpg'

const photo = usePhoto('hero')

// 지금 사이트 메인 배너 3장(main-first/second/third.png)에 들어 있던 문구 그대로. 새 문구를 만들지 말 것.
const COPY = [
  {
    title: '올인원 패키지로 완성되는 창업 실무 역량',
    desc: '귀금속·시계·명품가방 감정부터 전당포·중고명품 매장·금거래소 창업 노하우까지, 국제명품감정교육원에서 한 번에 배워가세요',
  },
  {
    title: '수료 즉시 자격증·커뮤니티·멘토링 제공',
    points: [
      '수료 후 ‘명품 감정사’ 공식 자격증 취득 가능',
      '업계 리더들과의 네트워킹을 통한 비즈니스 인사이트 제공',
      '교육 후에도 계속되는 1:1 멘토링 지원',
    ],
  },
  {
    title: '실습 중심의 ‘바로 현장 투입’ 커리큘럼',
    points: [
      '이론만으로 끝내지 않는, 다양한 실제 정·가품 실습 가능',
      '현장 즉시 적용 가능한 판매·감정·운영 실전 노하우 제공',
      '수업 첫날부터 창업 시뮬레이션까지 완벽 지원',
    ],
    closing: ['이제 ‘배우기만’ 하지 말고,', '‘바로 해내는’ 전문가가 되십시오!'],
  },
]

// 실제 사진 3장(지금 사이트 배너 1·2·3번 사진). pos = 가로로 긴 화면에서 보일 자리, mobilePos = 세로 화면에서 보일 자리
const REAL_SLIDES = [
  { src: realPractice, pos: '50% 50%', mobilePos: '50% 50%', copy: COPY[0] },
  // 11/13 "자격증 액자가 같이 보여야" → PC는 사진 전체(얼굴+액자)를 보여 준다.
  // 11/13 "글자가 혼자 올라갔다" → 문구는 다른 장면과 같은 가운데에 두고, 사진을 조금 내려 액자가 문구 아래로 오게
  { src: realCertificate, pos: '50% 100%', mobilePos: '52% 40%', fit: 'contain', copy: COPY[1] },
  { src: realLecture, pos: '50% 28%', mobilePos: '72% 40%', copy: COPY[2] },
]

const slides = computed(() => {
  if (photo.value.kind === 'real') return REAL_SLIDES
  if (photo.value.kind === 'still') {
    return [{ src: photo.value.src, pos: photo.value.pos, mobilePos: photo.value.mobilePos, copy: COPY[0] }]
  }
  return []
})

const current = ref(0)
const paused = ref(false)
const activeCopy = computed(() => slides.value[current.value]?.copy || COPY[0])

// 6초마다 다음 사진. 마우스를 올리거나 버튼에 초점이 있으면 멈추고, 움직임 줄이기 설정이면 자동으로 넘기지 않는다.
const INTERVAL = 6000
let timer = null
const reduceMotion = () => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

const stop = () => {
  clearInterval(timer)
  timer = null
}

const start = () => {
  stop()
  if (slides.value.length < 2 || reduceMotion()) return
  timer = setInterval(() => {
    if (!paused.value && document.visibilityState === 'visible') {
      current.value = (current.value + 1) % slides.value.length
    }
  }, INTERVAL)
}

const go = (i) => {
  current.value = i
  start()
}

watch(
  () => photo.value.id,
  () => {
    current.value = 0
    start()
  },
)

onMounted(start)
onBeforeUnmount(stop)
// 첫 화면의 '수강신청 문의' 버튼은 헤더에 같은 버튼이 있어서 뺐다(11/12)
</script>

<style scoped>
/* 사진을 헤더 밑까지 끌어올려 헤더가 사진 위쪽을 조금 가리게 — 헤더 높이 100px / 64px */
.hero {
  position: relative;
  margin-top: -100px;
  background: #0d0d0d;
  color: #fff;
}

/* ── 원본 배너 그대로 ── */
.banner-img {
  display: block;
  width: 100%;
  height: auto;
  aspect-ratio: 1925 / 688;
  object-fit: cover;
}

/* ── 사진 + 문구 ── */
.hero-stage {
  position: relative;
  aspect-ratio: 1925 / 688;
  min-height: 540px;
  overflow: hidden;
}

.hero-slide {
  position: absolute;
  inset: 0;
  opacity: 0;
  transition: opacity var(--t-3) var(--ease-soft);
}

.hero-slide.is-active {
  opacity: 1;
}

.hero-img,
.hero-fill {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}

.hero-img {
  object-fit: cover;
  object-position: var(--pos, 50% 50%);
  transform: scale(1.04);
  transition: transform 7s var(--ease-soft);
}

/* 사진 전체를 보여 주는 장면: 조금 아래로 내려(아래쪽 손 부분만 살짝 잘림) 액자가 가운데 문구 밑으로 오게 */
.hero-img.is-contain {
  inset: 7% 0 -7% 0;
  object-fit: contain;
  object-position: 50% 100%;
}

.hero-fill {
  object-fit: cover;
  filter: blur(28px) brightness(0.7);
  transform: scale(1.15);
}

/* 보이는 동안 아주 천천히 제자리로 */
.hero-slide.is-active .hero-img {
  transform: scale(1);
}

/* 글자가 읽히도록 전체를 어둡게 + 가운데를 조금 더 (11/12 "조금 더 어둡게") */
/* 11/12 "더 진하게, 좌측부터 더 진하게" → 왼쪽이 가장 어둡고 오른쪽으로 갈수록 옅어지는 층을 하나 더 */
.hero-dim {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(90deg, rgba(6, 6, 6, 0.62) 0%, rgba(6, 6, 6, 0.34) 45%, rgba(6, 6, 6, 0.06) 100%),
    radial-gradient(ellipse 58% 62% at 50% 56%, rgba(0, 0, 0, 0.4) 0%, rgba(0, 0, 0, 0) 72%),
    linear-gradient(180deg, rgba(10, 10, 10, 0.76) 0%, rgba(10, 10, 10, 0.66) 42%, rgba(10, 10, 10, 0.8) 100%);
}

.hero-copy {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 100px var(--jj-gutter) 48px;
  text-align: center;
}

/* 자격증 액자 장면: 위·가운데(문구)는 어둡게, 아래 액자 쪽은 옅게 해서 액자가 또렷이 보이게 */
.hero-dim.is-contain {
  background:
    linear-gradient(90deg, rgba(6, 6, 6, 0.5) 0%, rgba(6, 6, 6, 0.22) 45%, rgba(6, 6, 6, 0.04) 100%),
    linear-gradient(180deg, rgba(10, 10, 10, 0.82) 0%, rgba(10, 10, 10, 0.62) 46%, rgba(10, 10, 10, 0.22) 72%, rgba(10, 10, 10, 0.3) 100%);
}

.hero-copy > * {
  animation: hero-rise 0.8s var(--ease-reveal) both;
}

/* 11/12 "조금 더 눈에 띄게" → 더 크고 굵게, 밝은 금색 + 글자 뒤 그림자 */
.hero-eyebrow {
  font-size: 23px;
  font-weight: 700;
  letter-spacing: 0.04em;
  color: var(--jj-point);
  text-shadow: 0 1px 10px rgba(0, 0, 0, 0.5);
}

.hero-title {
  max-width: 900px;
  margin-top: 14px;
  font-size: 40px;
  font-weight: 700;
  line-height: 1.35;
  letter-spacing: -0.03em;
  word-break: keep-all;
  text-wrap: balance;
  animation-delay: 0.08s;
}

.hero-desc {
  max-width: 900px;
  margin-top: 18px;
  font-size: 22px;
  line-height: 1.7;
  color: rgba(255, 255, 255, 0.82);
  word-break: keep-all;
  text-wrap: balance;
  animation-delay: 0.16s;
}

.hero-points {
  margin-top: 18px;
  text-align: left;
  animation-delay: 0.16s;
}

.hero-points li {
  position: relative;
  padding-left: 16px;
  font-size: 18.5px;
  line-height: 1.75;
  color: rgba(255, 255, 255, 0.85);
  word-break: keep-all;
}

.hero-points li::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0.8em;
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: currentColor;
}

/* 뒤 사진(화면·흰 티셔츠)이 밝아 잘 안 보인다는 요청(11/12) → 크게·굵게 + 글자 뒤 그림자 */
.hero-closing {
  margin-top: 18px;
  font-size: 20px;
  font-weight: 700;
  color: #fff;
  text-shadow:
    0 1px 2px rgba(0, 0, 0, 0.55),
    0 0 18px rgba(0, 0, 0, 0.6);
  word-break: keep-all;
  animation-delay: 0.22s;
}

.hero-closing span {
  display: inline-block;
  margin: 0 0.15em;
}

.hero-dots {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 22px;
  display: flex;
  justify-content: center;
  gap: 6px;
}

/* 눌리는 칸은 넉넉하게, 보이는 막대는 얇게 */
.hero-dot {
  position: relative;
  width: 36px;
  height: 24px;
  padding: 0;
  border: 0;
  background: none;
  cursor: pointer;
}

.hero-dot::before {
  content: '';
  position: absolute;
  left: 4px;
  right: 4px;
  top: 11px;
  height: 2px;
  background: rgba(255, 255, 255, 0.4);
  transition: background-color var(--t-1) var(--ease-soft);
}

.hero-dot.is-active::before,
.hero-dot:hover::before {
  background: #fff;
}

.hero-dot:focus-visible {
  outline: 2px solid #fff;
  outline-offset: 2px;
}

@keyframes hero-rise {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: none;
  }
}

@media (prefers-reduced-motion: reduce) {
  .hero-slide,
  .hero-img {
    transition: none;
  }

  .hero-img {
    transform: none;
  }

  .hero-copy > * {
    animation: none;
  }
}

@media (max-width: 1080px) {
  .hero {
    margin-top: -64px;
  }

  .hero-stage {
    min-height: 520px;
  }

  .hero-copy {
    padding-top: 64px;
  }



  .hero-title {
    font-size: 32px;
  }
}

@media (max-width: 768px) {
  .banner-img,
  .hero-stage {
    aspect-ratio: 400 / 650;
  }

  .hero-stage {
    min-height: 0;
  }

  .hero-img {
    object-position: var(--pos-m, var(--pos, 50% 50%));
  }

  /* 세로 화면에서는 사진 전체를 넣으면 너무 작아져서 원래처럼 꽉 채운다(액자는 가운데에 보임) */
  .hero-img.is-contain {
    inset: 0;
    object-fit: cover;
    object-position: var(--pos-m, var(--pos, 50% 50%));
  }

  .hero-fill {
    display: none;
  }



  .hero-eyebrow {
    font-size: 18px;
  }

  .hero-title {
    font-size: 25px;
  }

  .hero-desc {
    font-size: 17.5px;
  }

  .hero-points li {
    font-size: 16px;
  }

  .hero-closing {
    font-size: 16.5px;
  }
}
</style>
