<template>
  <section v-if="reviews.length" class="main-section reviews">
    <div class="section-inner">
      <MainSectionHead eyebrow="review" title="수강후기" desc="먼저 수강하신 분들의 후기입니다." />

      <ul class="review-grid">
        <li v-for="review in reviews" :key="review.id">
          <router-link :to="`/reviews/${review.id}`" class="review-card">
            <div class="review-image">
              <img :src="thumbnailOf(review)" :alt="review.title" loading="lazy" @error="useFallback" />
            </div>
            <div class="review-body">
              <h3 class="review-title">{{ review.title }}</h3>
              <p class="review-date">{{ formatDate(review.created_at) }}</p>
            </div>
          </router-link>
        </li>
      </ul>

      <MainMoreLink to="/reviews" label="수강후기 전체 보기" />
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import MainSectionHead from './MainSectionHead.vue'
import MainMoreLink from './MainMoreLink.vue'
import fallbackImage from '@/assets/images/business-1.jpg'
import { jinjungsungService } from '@/services/jinjungsungService.js'

const PREVIEW_COUNT = 3
// 후기 API는 items_per_page >= 5 만 허용 (그 미만은 422)
const API_MIN_PAGE_SIZE = 5

const reviews = ref([])

const thumbnailOf = (review) =>
  review.image_filename ? jinjungsungService.getImageUrl(review.image_filename) : fallbackImage

const useFallback = (event) => {
  if (event.target.dataset.fallback) return
  event.target.dataset.fallback = 'true'
  event.target.src = fallbackImage
}

const formatDate = (value) => {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  return date.toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' })
}

// 후기를 불러오지 못하면 이 영역만 숨기고 나머지 메인 화면은 그대로 표시
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
.main-section {
  padding: 90px 2rem;
  background: #f5f5f5;
}

.section-inner {
  max-width: 1100px;
  margin: 0 auto;
}

.review-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}

.review-card {
  display: block;
  background: #fff;
  border: 1px solid #ddd;
  transition: border-color 0.2s ease;
}

.review-card:hover {
  border-color: var(--primary-color);
}

.review-image {
  aspect-ratio: 4 / 3;
  overflow: hidden;
  background: #eee;
}

.review-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: top;
  display: block;
}

.review-body {
  padding: 18px 20px 20px;
  border-top: 1px solid #eee;
}

.review-title {
  font-size: 1.05rem;
  font-weight: 600;
  color: #111;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.review-date {
  margin-top: 6px;
  font-size: 0.9rem;
  color: #888;
}

@media (max-width: 900px) {
  .review-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }
}

@media (max-width: 768px) {
  .main-section {
    padding: 60px 16px;
  }
}
</style>
