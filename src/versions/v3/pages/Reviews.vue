<template>
  <!--
    3차 시안 '수강후기' 목록 (11/13 메인 규칙 적용)
    - 공통 머리(PageHead) + 본문. 원본의 검색·후기 작성하기·이전/다음 넘기기는 그대로
    - 메인처럼 손글씨 후기 카드 사진을 7:4 틀에 꽉 채워 보여 준다
    - 11/13 "의미 없는 글자 빼기": 모든 글의 제목이 같으면(지금은 전부 '수강후기') 카드마다 되풀이하지 않는다
    - 11/13 "목록에서 제목 대신 기수" → 카드 제목 자리에 'N기 수강생'(cohort.js). 기수를 모르는 글은
      제목이 기본값('수강후기')이 아닐 때만 제목을 보여 준다. 검색도 기수로 찾아진다('8기')
    - 11/13 고객 요청: 목록에서는 사진 아래 작성일을 작게(14 회색) 보여 준다(메인은 날짜 없음 그대로)
    - 읽기만 하는 목록이라 상자 없이(규칙 5). 사진을 누르면 상세 페이지로
  -->
  <div class="page">
    <PageHead title="수강후기" />

    <div class="page-body">
      <div ref="boardTop" class="jj-container">
        <div class="board-bar">
          <p class="board-count">총 <strong>{{ displayTotalCount }}</strong>개 게시글</p>
          <div class="board-tools">
            <input
              v-model="searchKeyword"
              type="text"
              class="board-search"
              placeholder="제목으로 검색하세요..."
              aria-label="제목으로 검색"
            />
            <router-link to="/reviews/write" class="v3-btn v3-btn--line v3-btn--sm">후기 작성하기</router-link>
          </div>
        </div>

        <!-- 불러오는 중 -->
        <p v-if="isLoading && !usePreview" class="board-state" role="status">게시글을 불러오는 중...</p>

        <!-- 불러오지 못함 -->
        <div v-else-if="errorMessage && !usePreview" class="board-state board-error" role="alert">
          <p>{{ errorMessage }}</p>
          <button type="button" class="v3-btn v3-btn--sm" @click="loadReviews(currentPage)">다시 시도</button>
        </div>

        <template v-else>
          <ul v-if="filteredReviews.length" class="review-grid">
            <!-- 11/13 "수강현황 · 수강후기 페이지는 인터렉션 덜": 카드가 하나씩 떠오르는 효과 · 사진 확대를 빼고 그냥 보이게 -->
            <li v-for="review in filteredReviews" :key="review.id">
              <router-link :to="`/reviews/${review.id}`" class="review-card">
                <span class="review-media">
                  <img
                    :src="imageSrc(review)"
                    :alt="review.title"
                    loading="lazy"
                    @error="handleImageError"
                  />
                </span>
                <span class="review-info">
                  <span v-if="cardTitle(review)" class="review-title">{{ cardTitle(review) }}</span>
                  <span class="review-date">{{ formatDate(review.created_at) }}</span>
                </span>
              </router-link>
            </li>
          </ul>

          <!-- 게시글이 없을 때 -->
          <p v-else class="board-state">
            {{ searchKeyword ? '검색 결과가 없습니다.' : '등록된 게시글이 없습니다.' }}
          </p>

          <!-- 페이지 넘기기 -->
          <nav v-if="totalPages > 1" class="pager" aria-label="수강후기 페이지">
            <button
              type="button"
              class="v3-btn v3-btn--line v3-btn--sm"
              :disabled="currentPage === 1"
              @click="changePage(currentPage - 1)"
            >
              이전
            </button>
            <span class="pager-info"><strong>{{ currentPage }}</strong> / {{ totalPages }}</span>
            <button
              type="button"
              class="v3-btn v3-btn--line v3-btn--sm"
              :disabled="currentPage === totalPages"
              @click="changePage(currentPage + 1)"
            >
              다음
            </button>
          </nav>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import PageHead from './PageHead.vue'
import { jinjungsungService } from '@/services/jinjungsungService.js'
import { useListState } from './useListState.js'
import { boardDate } from './boardNav.js'
import { reviewCohortLabel } from '../cohort.js'
import { PREVIEW_REVIEWS } from './reviewPreview.js'
import defaultImage from '@/assets/images/business-1.jpg'

// 한 쪽에 12개(원본과 같음). 후기 API는 items_per_page 5~20 만 허용
const PAGE_SIZE = 12

// 개발 화면 미리보기(운영 후기 23건 — 기수 포함): reviewPreview.js
const PREVIEW = PREVIEW_REVIEWS

// 처음 그릴 때 '등록된 게시글이 없습니다'가 잠깐 비치지 않게 불러오는 중으로 시작
const isLoading = ref(true)
const errorMessage = ref('')
const searchKeyword = ref('')
const reviews = ref([])
// 보던 쪽을 주소(?page=)로 기억 — 게시글에서 뒤로 오면 그 쪽·그 위치로(useListState.js)
const { initialPage, setPageQuery, restoreScroll } = useListState()
const currentPage = ref(initialPage())
const totalReviews = ref(0)
const boardTop = ref(null)

// 개발 화면 미리보기: 서버에서 받은 글이 없을 때만
const usePreview = computed(() => import.meta.env.DEV && !reviews.value.length)

// 지금 쪽에 보일 글
const pageReviews = computed(() => {
  if (!usePreview.value) return reviews.value
  const start = (currentPage.value - 1) * PAGE_SIZE
  return PREVIEW.slice(start, start + PAGE_SIZE)
})

const totalCount = computed(() => (usePreview.value ? PREVIEW.length : totalReviews.value))
const totalPages = computed(() => Math.ceil(totalCount.value / PAGE_SIZE))

// 제목 검색(원본과 같이 지금 쪽 안에서)
const filteredReviews = computed(() => {
  const keyword = searchKeyword.value.trim().toLowerCase()
  if (!keyword) return pageReviews.value
  return pageReviews.value.filter((review) =>
    `${review.title || ''} ${reviewCohortLabel(review)}`.toLowerCase().includes(keyword),
  )
})

const displayTotalCount = computed(() =>
  searchKeyword.value.trim() ? filteredReviews.value.length : totalCount.value,
)

// 카드 제목: 기수('8기 수강생'), 기수를 모르면 제목 — 단 기본값 '수강후기'는 페이지 제목과 겹쳐 숨긴다
const cardTitle = (review) => {
  const cohort = reviewCohortLabel(review)
  if (cohort) return cohort
  const title = (review.title || '').trim()
  return title && title !== '수강후기' ? title : ''
}

const loadReviews = async (page = 1) => {
  isLoading.value = true
  errorMessage.value = ''

  try {
    const response = await jinjungsungService.getReviews(page, PAGE_SIZE)
    reviews.value = Array.isArray(response?.items) ? response.items : []
    totalReviews.value = response?.total ?? 0
    currentPage.value = page
  } catch (error) {
    errorMessage.value = error.message
  } finally {
    isLoading.value = false
  }
}

const changePage = (page) => {
  if (page < 1 || page > totalPages.value) return
  setPageQuery(page)
  if (usePreview.value) currentPage.value = page
  else loadReviews(page)
  // 넘기면 목록 처음으로
  boardTop.value?.scrollIntoView({ block: 'start' })
}

const imageSrc = (review) => {
  if (review.image) return review.image
  return review.image_filename ? jinjungsungService.getImageUrl(review.image_filename) : defaultImage
}

const handleImageError = (event) => {
  if (!event.target.dataset.fallback) {
    event.target.dataset.fallback = 'true'
    event.target.src = defaultImage
  }
}

// 작성일 — 게시판 모양 2026.07.28(상세 · 수강현황과 같게)
const formatDate = boardDate

onMounted(async () => {
  // 개발 화면 미리보기는 바로 그려지므로 바로 위치를 되돌리고, 서버 데이터는 받은 뒤에 되돌린다
  if (usePreview.value) restoreScroll()
  await loadReviews(currentPage.value)
  if (!usePreview.value) restoreScroll()
})
</script>

<style scoped>
.page {
  background: #ffffff;
}

/* 머리 아래 본문 — SectionLayout 의 .page-body 와 같은 간격 */
.page-body {
  padding: 64px 0 var(--v3-section-y);
}

.page-body .jj-container {
  scroll-margin-top: 140px;
}

/* 게시글 수 · 검색 · 후기 작성하기 */
.board-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px 24px;
  margin-bottom: var(--v3-gap);
}

.board-count {
  font-size: var(--fs-body);
  color: var(--c-sub);
}

.board-count strong {
  font-weight: 700;
  color: var(--c-text);
}

.board-tools {
  display: flex;
  align-items: center;
  gap: 12px;
}

/* 입력 칸: 문의 폼(InquiryForm)과 같은 모양, 높이만 옆 버튼(40)에 맞춤 */
.board-search {
  width: 280px;
  height: 40px;
  padding: 0 14px;
  border: 1px solid var(--c-field-line);
  border-radius: 2px;
  background: var(--c-field);
  font-size: var(--fs-body);
  color: var(--c-text);
  transition: border-color var(--t-1) var(--ease-soft);
}

.board-search::placeholder {
  color: var(--c-faint);
}

.board-search:focus {
  outline: none;
  border-color: var(--c-text);
}

/* 카드: 사진(7:4 꽉 채움) + 아래 작성일. 제목은 글마다 다를 때만
   11/13 "눌러 보기 전엔 구분이 안 된다" → 3열에서 2열로 키워 손글씨 · 'N기 수강생 : 이름'이 목록에서 읽히게
   휴대폰도 2열(한 줄에 한 장이면 한 쪽이 너무 길다) — 자세히는 눌러서 */
.review-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--v3-head-gap) var(--v3-gap);
}

.review-card {
  display: block;
}

.review-media {
  display: block;
  overflow: hidden;
  border: 1px solid var(--c-line);
  background: #ffffff;
}

.review-media img {
  display: block;
  width: 100%;
  aspect-ratio: 7 / 4;
  object-fit: cover;
  transition: opacity 0.3s var(--ease-soft);
}

/* 누를 수 있다는 표시만 살짝(움직임 없이) */
.review-card:hover .review-media img {
  opacity: 0.85;
}

.review-card:focus-visible {
  outline: 2px solid var(--c-text);
  outline-offset: 4px;
}

.review-info {
  display: block;
  margin-top: 12px;
}

.review-title {
  display: block;
  font-size: var(--fs-body);
  font-weight: 700;
  line-height: 1.5;
  color: var(--c-text);
  word-break: keep-all;
}

.review-date {
  display: block;
  font-size: var(--fs-small);
  line-height: 1.5;
  color: var(--c-sub);
}

.review-title + .review-date {
  margin-top: 4px;
}

/* 불러오는 중 · 없음 · 오류 */
.board-state {
  padding: 80px 0;
  font-size: var(--fs-body);
  line-height: 1.7;
  text-align: center;
  color: var(--c-sub);
}

.board-error p {
  margin-bottom: 20px;
  color: var(--c-text);
}

/* 이전 · 쪽 번호 · 다음 */
.pager {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 24px;
  margin-top: 56px;
}

.pager-info {
  min-width: 56px;
  font-size: var(--fs-body);
  text-align: center;
  color: var(--c-sub);
}

.pager-info strong {
  font-weight: 700;
  color: var(--c-text);
}

.pager .v3-btn:disabled {
  opacity: 0.35;
  cursor: not-allowed;
  background: transparent;
  color: var(--c-text);
}

@media (max-width: 768px) {
  .page-body {
    padding-top: 40px;
  }

  .page-body .jj-container {
    scroll-margin-top: 84px;
  }

  .board-bar {
    flex-direction: column;
    align-items: stretch;
  }

  .board-search {
    flex: 1;
    min-width: 0;
    width: auto;
  }

  .pager {
    margin-top: 40px;
  }
}

@media (max-width: 640px) {
  .review-grid {
    gap: 24px 12px;
  }

  .review-info {
    margin-top: 8px;
  }
}
</style>
