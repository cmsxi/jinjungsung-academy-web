<template>
  <!--
    수강현황 게시글 상세 (3차 시안)
    - 페이지 제목('수강현황')은 공통 머리(SectionLayout → PageHead)가 그린다
    - 11/13 "일반적인 게시판처럼" → 기본 게시판형(BoardPost.vue): 제목 · 작성일 / 사진 / 이전글 · 다음글 / 목록
    - 제목은 메인 · 목록과 같은 이름(statusTitle.js), 날짜는 게시판 모양 2026.07.28
    - 사진은 자르지 않고 원래 비율로 가운데, 화면 높이 안
    - 원본 기능 유지: 제목 · 작성일 · 사진 · 본문(줄바꿈 유지), 불러오는 중 · 오류(다시 시도) · 없는 글 안내
  -->
  <div class="jj-container">
    <!-- 불러오는 중 -->
    <p v-if="showLoading" class="sd-state">게시글을 불러오는 중...</p>

    <!-- 오류 -->
    <div v-else-if="showError" class="sd-state sd-state--error">
      <p>{{ errorMessage }}</p>
      <button type="button" class="v3-btn v3-btn--sm" @click="loadPost">다시 시도</button>
    </div>

    <!-- 게시글 -->
    <BoardPost
      v-else-if="shownPost"
      :title="titleText"
      :meta="meta"
      list-path="/education/status"
      :older="neighbors.older"
      :newer="neighbors.newer"
      @list="backToList"
    >
      <figure v-if="imageSrc && !imageFailed" class="post-media">
        <img :src="imageSrc" :alt="titleText" @error="imageFailed = true" />
      </figure>

      <div v-if="shownPost.content" class="post-content" v-html="formatContent(shownPost.content)"></div>
    </BoardPost>

    <!-- 게시글을 찾을 수 없는 경우 -->
    <div v-else class="sd-state sd-state--empty">
      <h2 class="sd-empty-title">게시글을 찾을 수 없습니다</h2>
      <p>요청하신 게시글이 존재하지 않거나 삭제되었습니다.</p>
      <a href="/education/status" class="v3-btn v3-btn--line v3-btn--sm" @click.prevent="backToList">목록으로 돌아가기</a>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { jinjungsungService } from '@/services/jinjungsungService.js'
import { useBackToList } from './useListState.js'
import { statusTitle } from '../statusTitle.js'
import { cohortLabel } from '../cohort.js'
import BoardPost from './BoardPost.vue'
import { boardDate, neighborsIn, findNeighbors } from './boardNav.js'
// 개발 화면 미리보기용 운영 사이트 수강현황 목록(목록 페이지와 같은 것)
import { PREVIEW_POSTS } from './Status.vue'

const route = useRoute()
// 목록에서 들어왔으면 뒤로 가기(보던 쪽·위치 그대로), 아니면 목록 첫 쪽
const backToList = useBackToList('/education/status')

// 상태 관리 (처음부터 '불러오는 중'으로 — 불러오기 전에 '없는 글' 안내가 잠깐 비치지 않게)
const isLoading = ref(true)
const errorMessage = ref('')
const post = ref(null)
const imageFailed = ref(false)
// 이전글 · 다음글(서버에서 찾은 것). undefined = 아직 찾는 중
const serverNeighbors = ref({ older: undefined, newer: undefined })

// 개발 화면 미리보기: 로컬에서는 서버에 연결되지 않으므로, 서버 글이 없을 때(불러오는 중 · 실패)만
// 운영 사이트 목록에서 같은 번호의 제목 · 사진 · 작성일을 보여 준다. 배포본은 항상 서버 데이터.
const previewPost = computed(() => {
  if (!import.meta.env.DEV || post.value) return null
  return PREVIEW_POSTS.find((item) => String(item.id) === String(route.params.id)) || null
})

const shownPost = computed(() => post.value || previewPost.value)
// 메인 · 목록과 같은 이름으로(앞머리 반복 꼬리표를 덜어냄)
const titleText = computed(() => statusTitle(shownPost.value?.title || ''))
// 글 정보: 기수(DB, 있을 때) · 작성일
const meta = computed(() => {
  const item = shownPost.value
  if (!item) return []
  const list = []
  if (cohortLabel(item)) list.push({ label: '기수', value: cohortLabel(item) })
  if (item.created_at) list.push({ label: '작성일', value: boardDate(item.created_at) })
  return list
})
const showLoading = computed(() => isLoading.value && !previewPost.value)
const showError = computed(() => Boolean(errorMessage.value) && !previewPost.value)

const imageSrc = computed(() => {
  const item = shownPost.value
  if (!item) return null
  return item.image || (item.image_filename ? jinjungsungService.getImageUrl(item.image_filename) : null)
})

// 이전글 · 다음글 줄에 넣을 모양으로
const toNavItem = (item) =>
  item ? { to: `/education/status/${item.id}`, title: statusTitle(item.title), date: boardDate(item.created_at) } : null

const neighbors = computed(() => {
  // 서버 글을 보고 있으면 서버에서 찾은 것, 개발 화면 미리보기면 미리보기 목록에서
  if (post.value) {
    const { older, newer } = serverNeighbors.value
    return {
      older: older === undefined ? undefined : toNavItem(older),
      newer: newer === undefined ? undefined : toNavItem(newer),
    }
  }
  if (previewPost.value) {
    const { older, newer } = neighborsIn(PREVIEW_POSTS, route.params.id)
    return { older: toNavItem(older), newer: toNavItem(newer) }
  }
  return { older: undefined, newer: undefined }
})

// 게시글 로드
const loadPost = async () => {
  const postId = route.params.id
  post.value = null
  imageFailed.value = false
  serverNeighbors.value = { older: undefined, newer: undefined }
  if (!postId) {
    isLoading.value = false
    errorMessage.value = '잘못된 게시글 ID입니다.'
    return
  }

  isLoading.value = true
  errorMessage.value = ''

  try {
    const response = await jinjungsungService.getPost(postId)
    if (String(route.params.id) !== String(postId)) return // 그 사이 다른 글로 넘어감
    post.value = response
    loadNeighbors(postId)
  } catch (error) {
    errorMessage.value = error.message
  } finally {
    isLoading.value = false
  }
}

const loadNeighbors = async (postId) => {
  try {
    const found = await findNeighbors((page, size) => jinjungsungService.getPosts(page, size), postId)
    if (String(route.params.id) === String(postId)) serverNeighbors.value = found
  } catch {
    if (String(route.params.id) === String(postId)) serverNeighbors.value = { older: null, newer: null }
  }
}

// 내용 포맷팅 (줄바꿈 처리) — 원본과 같음
const formatContent = (content) => {
  if (!content) return ''
  return content.replace(/\n/g, '<br>')
}

// 처음 들어올 때 + 이전글 · 다음글로 옮겨 갈 때(같은 화면이 다시 쓰이므로 번호가 바뀌면 다시 불러온다)
watch(() => route.params.id, (id) => id && loadPost(), { immediate: true })
</script>

<style scoped>
/* 사진은 자르지 않고 원래 비율로, 가운데. 화면 높이 안에 들어오게 */
.post-media img {
  display: block;
  max-width: 100%;
  max-height: calc(100vh - 200px);
  width: auto;
  height: auto;
  margin: 0 auto;
}

.post-content {
  max-width: 880px;
  margin: 0 auto;
  font-size: var(--fs-body);
  line-height: 1.8;
  color: var(--c-text);
  word-break: keep-all;
}

.post-media + .post-content {
  margin-top: var(--v3-head-gap);
}

/* ── 불러오는 중 · 오류 · 없는 글 안내 ── */
.sd-state {
  padding: var(--v3-section-y) 0;
  font-size: var(--fs-body);
  line-height: 1.6;
  color: var(--c-sub);
  text-align: center;
}

.sd-state--error,
.sd-state--empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.sd-state--error p {
  color: var(--c-text);
}

.sd-empty-title {
  font-size: var(--fs-item);
  font-weight: 700;
  line-height: 1.4;
  color: var(--c-text);
}

.sd-state--empty p {
  margin-top: -8px;
}
</style>
