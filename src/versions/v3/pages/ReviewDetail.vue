<template>
  <!--
    3차 시안 '수강후기' 상세
    - 공통 머리(PageHead)는 목록과 같이 '수강후기'
    - 11/13 "일반적인 게시판처럼" → 수강현황 상세와 같은 기본 게시판형(BoardPost.vue):
      (제목) · 작성일 / 손글씨 사진 / 이전글 · 다음글 / 목록
    - '작성자: 관리자'는 방문자에게 의미 없는 정보라 숨긴다. 제목도 기본값('수강후기')이면 머리와 겹쳐 숨긴다
    - 11/13 "상세 · 이전글 · 다음글에도 기수" → 글 제목 자리와 이전글 · 다음글 줄에 'N기 수강생'(목록과 같은 cohort.js)
      기수를 모르는 글은 제목(기본값 '수강후기'면 위에선 숨기고, 이전글 · 다음글 줄에선 '수강후기')
      (방문자가 직접 쓴 후기는 제목 · 작성자를 그대로 보여 준다)
    - 손글씨 후기 사진은 읽을 수 있게 자르지 않고 전체를 보여 준다. 본문이 비어 있으면(공백만) 칸을 두지 않는다
  -->
  <div class="page">
    <PageHead title="수강후기" :rule="false" />

    <div class="page-body">
      <div class="jj-container">
        <!-- 불러오는 중 -->
        <p v-if="isLoading && !shown" class="detail-state" role="status">게시글을 불러오는 중...</p>

        <!-- 불러오지 못함 -->
        <div v-else-if="errorMessage && !shown" class="detail-state detail-error" role="alert">
          <p>{{ errorMessage }}</p>
          <button type="button" class="v3-btn v3-btn--sm" @click="loadReview">다시 시도</button>
        </div>

        <!-- 수강후기 상세 내용 -->
        <BoardPost
          v-else-if="shown"
          :title="headTitle"
          :meta="meta"
          list-path="/reviews"
          :older="neighbors.older"
          :newer="neighbors.newer"
          @list="backToList"
        >
          <div v-if="imageSrc" class="post-image">
            <img :src="imageSrc" :alt="shown.title" @error="imageFailed = true" />
          </div>

          <!-- 줄바꿈을 그대로 살린다(원본과 같은 모양). 글은 글자로만 넣어 태그가 실행되지 않게 -->
          <p v-if="hasContent" class="post-content">{{ shown.content }}</p>
        </BoardPost>

        <!-- 게시글을 찾을 수 없는 경우 -->
        <div v-else class="detail-state not-found">
          <h2>게시글을 찾을 수 없습니다</h2>
          <p>요청하신 게시글이 존재하지 않거나 삭제되었습니다.</p>
          <button type="button" class="v3-btn v3-btn--line" @click="backToList">목록으로 돌아가기</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import PageHead from './PageHead.vue'
import BoardPost from './BoardPost.vue'
import { boardDate, neighborsIn, findNeighbors } from './boardNav.js'
import { reviewCohortLabel } from '../cohort.js'
// 개발 화면 미리보기(운영 후기 23건 — 기수 포함)
import { PREVIEW_REVIEWS as PREVIEW } from './reviewPreview.js'
import { jinjungsungService } from '@/services/jinjungsungService.js'
import { useBackToList } from './useListState.js'

const route = useRoute()
// 목록에서 들어왔으면 뒤로 가기(보던 쪽·위치 그대로), 아니면 목록 첫 쪽
const backToList = useBackToList('/reviews')


// 처음 그릴 때 '찾을 수 없음'이 잠깐 비치지 않게 불러오는 중으로 시작
const isLoading = ref(true)
const errorMessage = ref('')
const review = ref(null)
const imageFailed = ref(false)
// 이전글 · 다음글(서버에서 찾은 것). undefined = 아직 찾는 중
const serverNeighbors = ref({ older: undefined, newer: undefined })

const previewReview = computed(() => {
  if (!import.meta.env.DEV || review.value) return null
  return PREVIEW.find((item) => String(item.id) === String(route.params.id)) || null
})

// 화면에 보일 글: 서버 글, 없으면(개발 화면에서만) 미리보기
const shown = computed(() => review.value || previewReview.value)

const imageSrc = computed(() => {
  const item = shown.value
  if (!item || imageFailed.value) return ''
  if (item.image) return item.image
  return item.image_filename ? jinjungsungService.getImageUrl(item.image_filename) : ''
})

// 제목이 기본값('수강후기')이면 머리 제목과 같아 숨긴다. 작성자가 '관리자'(교육원이 대신 올린 손글씨 후기)면 숨긴다
const showTitle = computed(() => {
  const title = (shown.value?.title || '').trim()
  return Boolean(title) && title !== '수강후기'
})
// 글 제목 자리: 기수('8기 수강생') 먼저, 모르면 제목(기본값이면 비움)
const headTitle = computed(() => {
  if (!shown.value) return ''
  return reviewCohortLabel(shown.value) || (showTitle.value ? shown.value.title : '')
})
const showAuthor = computed(() => {
  const name = (shown.value?.username || '').trim()
  return Boolean(name) && name !== '관리자'
})

const meta = computed(() => {
  const item = shown.value
  if (!item) return []
  const list = []
  if (showAuthor.value) list.push({ label: '작성자', value: item.username })
  if (item.created_at) list.push({ label: '작성일', value: boardDate(item.created_at) })
  return list
})

// 본문이 공백뿐이면 칸을 두지 않는다(운영 글 대부분이 전각 공백 한 칸)
const hasContent = computed(() => Boolean(shown.value?.content && shown.value.content.trim()))

// 이전글 · 다음글 줄에 넣을 모양으로
// 이전글 · 다음글 줄 이름도 기수 먼저(목록과 같게)
const toNavItem = (item) =>
  item
    ? {
        to: `/reviews/${item.id}`,
        title: reviewCohortLabel(item) || (item.title || '').trim() || '수강후기',
        date: boardDate(item.created_at),
      }
    : null

const neighbors = computed(() => {
  if (review.value) {
    const { older, newer } = serverNeighbors.value
    return {
      older: older === undefined ? undefined : toNavItem(older),
      newer: newer === undefined ? undefined : toNavItem(newer),
    }
  }
  if (previewReview.value) {
    const { older, newer } = neighborsIn(PREVIEW, route.params.id)
    return { older: toNavItem(older), newer: toNavItem(newer) }
  }
  return { older: undefined, newer: undefined }
})

const loadReview = async () => {
  const reviewId = route.params.id
  review.value = null
  imageFailed.value = false
  serverNeighbors.value = { older: undefined, newer: undefined }
  if (!reviewId) {
    errorMessage.value = '잘못된 게시글 ID입니다.'
    isLoading.value = false
    return
  }

  isLoading.value = true
  errorMessage.value = ''

  try {
    const response = await jinjungsungService.getReview(reviewId)
    if (String(route.params.id) !== String(reviewId)) return // 그 사이 다른 글로 넘어감
    review.value = response
    loadNeighbors(reviewId)
  } catch (error) {
    errorMessage.value = error.message
  } finally {
    isLoading.value = false
  }
}

const loadNeighbors = async (reviewId) => {
  try {
    const found = await findNeighbors((page, size) => jinjungsungService.getReviews(page, size), reviewId)
    if (String(route.params.id) === String(reviewId)) serverNeighbors.value = found
  } catch {
    if (String(route.params.id) === String(reviewId)) serverNeighbors.value = { older: null, newer: null }
  }
}

// 처음 들어올 때 + 이전글 · 다음글로 옮겨 갈 때(같은 화면이 다시 쓰이므로 번호가 바뀌면 다시 불러온다)
watch(() => route.params.id, (id) => id && loadReview(), { immediate: true })
</script>

<style scoped>
.page {
  background: #ffffff;
}

/* 머리 아래 본문 — SectionLayout 의 .page-body 와 같은 간격 */
.page-body {
  padding: 64px 0 var(--v3-section-y);
}

/* 손글씨 사진: 자르지 않고 전체를, 읽기 좋은 폭으로 가운데. 흰 종이라 옅은 선으로 가장자리만 */
.post-image {
  max-width: 1000px;
  margin: 0 auto;
  border: 1px solid var(--c-line);
  background: #ffffff;
}

.post-image img {
  display: block;
  width: 100%;
  height: auto;
}

.post-content {
  max-width: 880px;
  margin: 0 auto;
  font-size: var(--fs-body);
  line-height: 1.8;
  color: var(--c-text);
  white-space: pre-line;
  word-break: keep-all;
  overflow-wrap: anywhere;
}

.post-image + .post-content {
  margin-top: var(--v3-head-gap);
}

/* 불러오는 중 · 오류 · 없음 */
.detail-state {
  padding: 80px 0;
  font-size: var(--fs-body);
  line-height: 1.7;
  text-align: center;
  color: var(--c-sub);
}

.detail-error p {
  margin-bottom: 20px;
  color: var(--c-text);
}

.not-found h2 {
  font-size: var(--fs-item);
  font-weight: 700;
  color: var(--c-text);
}

.not-found p {
  margin: 12px 0 28px;
}

@media (max-width: 768px) {
  .page-body {
    padding-top: 40px;
  }
}
</style>
