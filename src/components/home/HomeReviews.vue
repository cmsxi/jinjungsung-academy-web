<template>
  <section v-if="reviews.length" class="ui-section ui-section--white" aria-labelledby="reviews-title">
    <div class="ui-container">
      <div class="ui-section-head head-row">
        <div>
          <p class="ui-eyebrow">수강후기</p>
          <h2 id="reviews-title" class="ui-title">먼저 수강하신 분들의 이야기</h2>
        </div>
        <router-link to="/reviews" class="ui-link-arrow">
          전체 후기 보기
          <AppIcon name="arrowRight" :size="16" />
        </router-link>
      </div>

      <ul class="review-grid">
        <li v-for="review in reviews" :key="review.id">
          <router-link :to="`/reviews/${review.id}`" class="review-card">
            <div class="review-thumb">
              <img
                :src="getThumb(review)"
                :alt="review.title"
                loading="lazy"
                @error="useFallbackImage"
              />
            </div>
            <div class="review-body">
              <h3 class="review-title">{{ review.title }}</h3>
              <time class="review-date" :datetime="review.created_at">{{ formatDate(review.created_at) }}</time>
            </div>
          </router-link>
        </li>
      </ul>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import AppIcon from '@/components/ui/AppIcon.js'
import fallbackImage from '@/assets/images/business-1.jpg'
import { jinjungsungService } from '@/services/jinjungsungService.js'

const PREVIEW_COUNT = 3
// 후기 API는 items_per_page >= 5 만 허용합니다 (그 미만은 422)
const API_MIN_PAGE_SIZE = 5

const reviews = ref([])

const getThumb = (review) =>
  review.image_filename ? jinjungsungService.getImageUrl(review.image_filename) : fallbackImage

const useFallbackImage = (event) => {
  if (event.target.dataset.fallback) return
  event.target.dataset.fallback = 'true'
  event.target.src = fallbackImage
}

const formatDate = (value) => {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  return date.toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' })
}

// 후기를 불러오지 못하면 섹션을 숨깁니다 (메인 페이지 나머지 영역에는 영향 없음)
onMounted(async () => {
  try {
    const response = await jinjungsungService.getReviews(1, API_MIN_PAGE_SIZE)
    reviews.value = Array.isArray(response?.items) ? response.items.slice(0, PREVIEW_COUNT) : []
  } catch {
    reviews.value = []
  }
})
</script>

<style scoped>
.head-row {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 24px;
}

.review-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}

.review-card {
  display: block;
  border: 1px solid var(--line);
  border-radius: var(--radius-lg);
  overflow: hidden;
  background-color: var(--surface);
  transition: border-color 0.2s ease;
}

.review-card:hover {
  border-color: var(--line-strong);
}

.review-card:hover .review-title {
  color: var(--gold-700);
}

.review-thumb {
  aspect-ratio: 4 / 3;
  background-color: var(--surface-sub);
}

.review-thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.review-body {
  padding: 20px 22px 24px;
}

.review-title {
  font-size: 1.0625rem;
  font-weight: 700;
  color: var(--ink-900);
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  word-break: keep-all;
}

.review-date {
  display: block;
  margin-top: 8px;
  font-size: 0.875rem;
  color: var(--ink-400);
}

@media (max-width: 768px) {
  .head-row {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .review-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }
}
</style>
