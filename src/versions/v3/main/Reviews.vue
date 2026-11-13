<template>
  <!--
    수강후기 (11/13 확정: 흐르는 띠)
    - 제목·날짜 같은 의미 없는 글자는 빼고 손글씨 후기 카드 이미지만, 가로로 천천히 흘러간다(마우스를 올리면 멈춤)
    - 카드를 누르면 크게 보여 손글씨를 읽을 수 있다(이전·다음, ←·→·Esc)
  -->
  <section class="reviews">
    <div class="jj-container">
      <V3Head
        title="수강후기"
        desc="먼저 수강하신 분들이 직접 손으로 쓴 후기입니다."
        link-to="/reviews"
        link-label="수강후기 전체 보기"
      />

      <!-- 후기를 불러오지 못했을 때: 게시판으로 안내 -->
      <div v-if="!items.length && loaded" class="review-empty">
        <p>수강후기는 수강후기 게시판에서 보실 수 있습니다.</p>
        <router-link to="/reviews" class="v3-btn v3-btn--line">수강후기 게시판</router-link>
      </div>
    </div>

    <!-- 흐르는 띠: 화면 양끝까지 넓게 -->
    <div v-if="items.length" class="flow" :style="{ '--flow-duration': `${items.length * 6}s` }" v-reveal>
      <div class="flow-track">
        <button
          v-for="(item, i) in flowItems"
          :key="`${item.id}-${i}`"
          type="button"
          class="card flow-card"
          :aria-hidden="i >= items.length ? 'true' : undefined"
          :tabindex="i >= items.length ? -1 : 0"
          :aria-label="`수강후기 ${(i % items.length) + 1} 크게 보기`"
          @click="open(i % items.length)"
        >
          <img :src="item.src" alt="" loading="lazy" />
        </button>
      </div>
    </div>

    <!-- 크게 보기 -->
    <Teleport to="body">
      <div v-if="lightbox !== null" class="rv-lb" role="dialog" aria-modal="true" aria-label="수강후기 크게 보기" @click.self="close">
        <img :src="items[lightbox].src" :alt="`수강후기 손글씨 카드 ${lightbox + 1}`" />
        <p class="rv-lb-count">{{ lightbox + 1 }} / {{ items.length }}</p>
        <button ref="closeBtn" type="button" class="rv-lb-btn rv-lb-close" @click="close">닫기</button>
        <button type="button" class="rv-lb-btn rv-lb-prev" aria-label="이전 후기" @click="step(-1)">이전</button>
        <button type="button" class="rv-lb-btn rv-lb-next" aria-label="다음 후기" @click="step(1)">다음</button>
      </div>
    </Teleport>
  </section>
</template>

<script setup>
import { ref, computed, nextTick, onMounted, onBeforeUnmount } from 'vue'
import V3Head from './V3Head.vue'
import { vReveal } from '../useReveal.js'
import { jinjungsungService } from '@/services/jinjungsungService.js'

// 후기 API는 items_per_page 5~20 만 허용(gcg_reviews 라우터)
const PAGE_SIZE = 20

// 로컬 개발 화면은 후기 서버에 연결되지 않아 비어 보인다(11/13 "mock 사진이라도 넣어").
// 개발 화면에서 불러오기 전·실패 시에만 운영 사이트(luxacademy.kr)의 실제 후기 카드 23장 전부를 보여 준다. 배포본은 항상 서버 데이터.
const PREVIEW_FILES = [
  [29, '02589e11-f69b-4293-96e3-80607410c91c.jpg'],
  [28, 'f27060ab-4f1d-4c9b-a1c6-423f57150d60.jpg'],
  [27, '11fe9dd3-4729-4601-9825-340145b72864.jpg'],
  [26, '9871be05-1629-4eab-8ce0-ab8a55c66d0c.jpg'],
  [25, 'b759fcd0-eb48-4987-b35e-0a6addb390b8.jpg'],
  [23, '0e707c89-6043-40aa-9671-4a7be17dfbc5.jpg'],
  [22, '8b1a8019-a307-4ee5-a1bd-282d581f0787.jpg'],
  [21, 'd7a49746-0669-4181-9d86-88292106235f.jpg'],
  [20, 'b8d78584-50f6-4f6d-9277-70eb7f05f904.jpg'],
  [19, '73d3e8d1-3c9f-4790-a6e7-43dc644af6f4.jpg'],
  [18, '9cad402e-9543-4879-ad8d-9a0a4074f014.jpg'],
  [17, '2796f794-87c7-43c2-a45c-49a99eba9bfe.jpg'],
  [16, 'f87fb616-d2d7-4157-a05e-f4e596689521.jpg'],
  [15, '7cbe591b-6150-45eb-8f25-73925bec6d91.jpg'],
  [14, 'c4846a65-ac3f-41fc-bb8e-e0e269ca161d.jpg'],
  [13, '5a63591c-015a-4b2c-a4c1-84180d5c0701.jpg'],
  [12, '4c0e2354-33f2-416d-adfd-b96da1745b1b.jpg'],
  [11, 'adec4a06-a568-4c04-9841-bbc504f86979.jpg'],
  [9, '835fadcd-71b6-47bc-97cc-a55c06a235f8.jpg'],
  [7, '88ae9c1f-0e5d-477e-9634-df05062e33fc.jpg'],
  [6, 'c140f484-8cb6-4f64-aeee-49f2a58451bf.jpg'],
  [5, 'f595673d-3e84-4754-b00c-c845d5ce9838.jpg'],
  [3, 'd646b996-6ac7-4a09-9343-7385307ccaf5.jpg'],
]
const PREVIEW = PREVIEW_FILES.map(([id, file]) => ({ id, src: `https://luxacademy.kr/uploads/${file}` }))

const reviews = ref([])
const loaded = ref(false)

const items = computed(() => {
  const live = reviews.value
    .filter((review) => review.image_filename)
    .map((review) => ({ id: review.id, src: jinjungsungService.getImageUrl(review.image_filename) }))
  if (live.length) return live
  return import.meta.env.DEV ? PREVIEW : []
})

// 같은 목록을 두 번 이어 붙여 끊김 없이 돈다(두 번째 묶음은 읽기 프로그램에서 숨김)
const flowItems = computed(() => [...items.value, ...items.value])

// ── 크게 보기 ──
const lightbox = ref(null)
const closeBtn = ref(null)
let lastFocus = null
const open = async (i) => {
  lastFocus = document.activeElement
  lightbox.value = i
  document.body.style.overflow = 'hidden'
  await nextTick()
  closeBtn.value?.focus()
}
const close = () => {
  lightbox.value = null
  document.body.style.overflow = ''
  lastFocus?.focus?.()
}
const step = (dir) => {
  const n = items.value.length
  lightbox.value = (lightbox.value + dir + n) % n
}
const onKey = (event) => {
  if (lightbox.value === null) return
  if (event.key === 'Escape') close()
  else if (event.key === 'ArrowLeft') step(-1)
  else if (event.key === 'ArrowRight') step(1)
}

onMounted(async () => {
  window.addEventListener('keydown', onKey)
  try {
    const response = await jinjungsungService.getReviews(1, PAGE_SIZE)
    reviews.value = Array.isArray(response?.items) ? response.items : []
  } catch {
    reviews.value = []
  } finally {
    loaded.value = true
  }
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKey)
  document.body.style.overflow = ''
})
</script>

<style scoped>
/* 읽기만 하는 목록이라 상자 없이(규칙 5).
   후기 사진마다 비율(1.4~2.0)이 달라 모든 카드를 7:4 틀에 꽉 채운다(제목·손글씨·서명이 남는 비율). 전체는 눌러서 크게 보기로 */
.reviews {
  padding: var(--v3-section-y) 0;
  background: var(--c-bg);
  overflow: hidden;
}

.card {
  display: block;
  width: 100%;
  padding: 0;
  border: 1px solid var(--c-line);
  background: #ffffff;
  cursor: zoom-in;
}

.card img {
  display: block;
  width: 100%;
  aspect-ratio: 7 / 4;
  object-fit: cover;
}

.card:focus-visible {
  outline: 2px solid var(--c-text);
  outline-offset: 3px;
}

.flow {
  margin-top: 4px;
  overflow: hidden;
  -webkit-mask-image: linear-gradient(90deg, transparent 0, #000 6%, #000 94%, transparent 100%);
  mask-image: linear-gradient(90deg, transparent 0, #000 6%, #000 94%, transparent 100%);
}

.flow-track {
  display: flex;
  width: max-content;
  animation: flow var(--flow-duration, 60s) linear infinite;
}

/* 마우스를 올리거나 키보드로 고르면 멈춘다 */
.flow:hover .flow-track,
.flow:focus-within .flow-track {
  animation-play-state: paused;
}

/* 11/13 "사진이 조금 더 크게 보여도" → 460 */
.flow-card {
  flex: none;
  width: 460px;
  margin-right: 24px;
  transition: transform 0.6s var(--ease-soft);
}

.flow-card:hover {
  transform: translateY(-4px);
}

@keyframes flow {
  to {
    transform: translateX(-50%);
  }
}

.review-empty {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
}

.review-empty p {
  font-size: var(--fs-body);
  color: var(--c-sub);
}

@media (prefers-reduced-motion: reduce) {
  /* 움직임 줄이기: 흐르지 않고 손으로 밀어 보는 줄로 */
  .flow {
    overflow-x: auto;
    -webkit-mask-image: none;
    mask-image: none;
  }

  .flow-track {
    animation: none;
  }
}

@media (max-width: 900px) {
  .review-empty {
    flex-direction: column;
    align-items: flex-start;
  }
}

@media (max-width: 560px) {
  .flow-card {
    width: 300px;
    margin-right: 14px;
  }
}
</style>

<style>
/* 크게 보기 창은 body 로 옮겨 그리므로(Teleport) 범위 없는 스타일 — 색은 고정값 */
.rv-lb {
  position: fixed;
  inset: 0;
  z-index: 6000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 64px 88px;
  background: rgba(10, 10, 10, 0.88);
}

.rv-lb img {
  max-width: 100%;
  max-height: 100%;
  background: #ffffff;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.4);
}

.rv-lb-count {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 22px;
  margin: 0;
  font-size: 14px;
  text-align: center;
  color: rgba(255, 255, 255, 0.75);
}

.rv-lb-btn {
  position: absolute;
  height: 40px;
  padding: 0 16px;
  border: 1px solid rgba(255, 255, 255, 0.7);
  border-radius: 2px;
  background: transparent;
  font: inherit;
  font-size: 14px;
  font-weight: 700;
  color: #ffffff;
  cursor: pointer;
}

.rv-lb-btn:hover {
  background: #ffffff;
  color: #161616;
}

.rv-lb-close {
  top: 16px;
  right: 16px;
}

.rv-lb-prev,
.rv-lb-next {
  top: 50%;
  transform: translateY(-50%);
}

.rv-lb-prev {
  left: 16px;
}

.rv-lb-next {
  right: 16px;
}

@media (max-width: 560px) {
  .rv-lb {
    padding: 64px 12px 72px;
  }

  .rv-lb-prev,
  .rv-lb-next {
    top: auto;
    bottom: 12px;
    transform: none;
  }
}
</style>
