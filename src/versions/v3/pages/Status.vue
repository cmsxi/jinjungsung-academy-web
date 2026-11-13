<template>
  <!--
    수강현황 게시판 목록 (3차 시안 · 11/13 메인 규칙 적용)
    - 페이지 제목·하위 탭은 공통 머리(SectionLayout → PageHead)가 그린다. 여기서는 본문만
    - 게시글 카드 = 사진(4:3) + 굵은 제목. 메인 수강현황과 같은 모양
      제목 앞 반복 꼬리표는 덜어낸다(statusTitle.js — 메인 · 상세와 같은 이름). 11/13 "일자는 보여야" → 제목 아래 작성일(원본처럼)
    - 읽기만 하는 목록이라 카드에 상자 없음(규칙 5). 검색칸은 직접 입력하는 곳이라 연한 회색 상자
    - 원본 기능 유지: 제목 검색(지금 페이지 안에서 거르기), 총 게시글 수, 이전 · 다음 페이지, 불러오는 중 · 오류 · 없음 안내
  -->
  <div ref="listTop" class="jj-container st-root">
    <div class="st-toolbar">
      <p class="st-count">총 <strong>{{ displayTotalCount }}</strong>개 게시글</p>
      <label class="st-search">
        <span class="jj-sr-only">제목 검색</span>
        <input v-model="searchKeyword" type="search" placeholder="제목으로 검색하세요..." />
      </label>
    </div>

    <!-- 불러오는 중 -->
    <p v-if="showLoading" class="st-state">게시글을 불러오는 중...</p>

    <!-- 오류 -->
    <div v-else-if="showError" class="st-state st-state--error">
      <p>{{ errorMessage }}</p>
      <button type="button" class="v3-btn v3-btn--sm" @click="loadPosts(requestedPage)">다시 시도</button>
    </div>

    <template v-else>
      <ul v-if="filteredPosts.length" class="st-grid">
        <!-- 11/13 "수강현황 · 수강후기 페이지는 인터렉션 덜": 카드가 하나씩 떠오르는 효과 · 사진 확대를 빼고 그냥 보이게 -->
        <li v-for="post in filteredPosts" :key="post.id">
          <router-link :to="`/education/status/${post.id}`" class="st-card">
            <span class="st-media">
              <img :src="imageOf(post)" alt="" loading="lazy" @error="handleImageError" />
            </span>
            <span class="st-title">{{ statusTitle(post.title) }}</span>
            <span v-if="post.created_at" class="st-date">{{ formatDate(post.created_at) }}</span>
          </router-link>
        </li>
      </ul>

      <!-- 게시글이 없을 때 -->
      <p v-else class="st-state">{{ searchKeyword ? '검색 결과가 없습니다.' : '등록된 게시글이 없습니다.' }}</p>

      <!-- 페이지 이동: 다른 페이지로 가는 버튼이라 테두리 버튼(규칙 10) -->
      <nav v-if="totalPages > 1" class="st-pager" aria-label="수강현황 페이지">
        <button
          type="button"
          class="v3-btn v3-btn--line v3-btn--sm"
          :disabled="shownPage === 1"
          @click="changePage(shownPage - 1)"
        >
          이전
        </button>
        <span class="st-page-info"><strong>{{ shownPage }}</strong> / {{ totalPages }}</span>
        <button
          type="button"
          class="v3-btn v3-btn--line v3-btn--sm"
          :disabled="shownPage === totalPages"
          @click="changePage(shownPage + 1)"
        >
          다음
        </button>
      </nav>
    </template>
  </div>
</template>

<script>
// 로컬 개발 화면은 서버에 연결되지 않아(요청 시간 초과) 목록이 비어 보인다.
// 개발 화면에서 서버 응답이 없을 때만 운영 사이트(luxacademy.kr)의 실제 수강현황 46건을 미리보기로 보여 준다. 배포본은 항상 서버 데이터.
// 수강현황 상세(StatusDetail.vue)도 같은 목록을 쓴다. [id, 제목, 사진 파일, 작성 시각(운영 사이트 값 그대로), 기수]
// 기수는 운영 DB 에 넣을 값과 같다(제목의 'N기' — globee-web/MultiSite_globee/scripts/jinjungsung_cohort.sql, 46번은 없음)
export const PREVIEW_POSTS = [
  [53, '국제명품감정교육원 명품감정 10기', '9ac050ed-c30c-421b-9743-5b10ef4a6e30.jpg', '2026-07-28T05:06:35.406996Z', 10],
  [52, '국제명품감정교육원 명품감정 9기 ', 'b93790e4-8d63-49a8-9849-85a8a40f1ff6.jpg', '2026-07-28T05:04:12.260212Z', 9],
  [51, '국제명품감정교육원 명품감정 강의 - 8기', '6871f84b-7322-4f00-aec6-6e0ce0283aa0.jpg', '2026-07-28T05:02:06.204596Z', 8],
  [50, '국제명품감정교육원 명품감정 강의 - 8기', '714c86fa-372e-4389-8e4a-8ceb82815d6f.jpg', '2026-07-28T05:01:52.636517Z', 8],
  [49, '국제명품감정교육원 명품감정 강의 - 8기', '984bac6b-f746-48fe-b61a-4502a5cce05b.jpg', '2026-07-28T05:01:41.397079Z', 8],
  [48, '국제명품감정교육원 명품감정 강의 - 8기', 'bd7eb6bf-f3f8-47de-8a7d-1f1b9a729d5d.jpg', '2026-07-28T05:01:30.703457Z', 8],
  [47, '국제명품감정교육원 명품감정 강의 - 8기', '5e5d24cc-c677-4cff-9493-fff909496b3e.jpg', '2026-07-28T05:01:11.621020Z', 8],
  [46, '국제명품감정교육원 명품감정 강의', '54a50998-cf8f-43a5-840c-e5157ea8e802.jpg', '2026-07-28T04:50:53.941384Z', null],
  [45, ' 국제명품감정교육원 명품감정 7기 강의', '493d8574-d4d5-49d0-a698-f6f187378d0c.jpg', '2026-07-28T04:43:11.634268Z', 7],
  [44, '[금융멘토 문초록] 진정성 명품감정 6기 강의', 'abfa54c3-6f9b-40c1-8b08-57bf7aa3b7fe.jpg', '2025-11-12T10:53:54.315200Z', 6],
  [43, '[금융멘토 문초록] 진정성 명품감정 6기 강의', '7429edf6-6011-4184-ba49-ab063d9efe79.jpg', '2025-11-12T10:53:41.901458Z', 6],
  [42, '[금융멘토 문초록] 진정성 명품감정 6기 강의', '9f195743-a4e9-4f2e-b27c-b3a9ce4f3d02.jpg', '2025-11-12T10:52:55.399256Z', 6],
  [41, '[금융멘토 문초록] 진정성 명품감정 6기 강의', '9c5fa4d3-ea3c-4b8b-bf78-d1b37f83c9c3.jpg', '2025-11-12T10:52:14.847331Z', 6],
  [40, '[금융멘토 문초록] 진정성 명품감정 6기 강의', 'aff42e44-53b8-4c9e-b0ba-f25d064eeefa.jpg', '2025-11-12T10:52:02.024883Z', 6],
  [39, '[금융멘토 문초록] 진정성 명품감정 6기 강의', 'c7cde9ff-a4bc-49c9-819a-ae39e6621438.jpg', '2025-11-12T10:51:38.982615Z', 6],
  [38, '[금융멘토 문초록] 진정성 명품감정 6기 강의', '9dafae1e-fd13-4ffc-9fd5-ee7587ad1c22.jpg', '2025-11-12T10:51:23.142503Z', 6],
  [37, '[금융멘토 문초록] 진정성 명품감정 5기 강의', '4c8ebe69-b1ee-4cb3-87a2-a97d642c1300.jpg', '2025-11-12T10:48:35.197098Z', 5],
  [36, '[금융멘토 문초록] 진정성 명품감정 5기 강의', '8e5099ac-ab20-42d5-bda1-1f7c206bf258.jpg', '2025-11-12T10:48:23.577136Z', 5],
  [35, '[금융멘토 문초록] 진정성 명품감정 5기 강의', '7215aed6-d076-4cc2-a502-03faa4a1da93.jpg', '2025-11-12T10:48:08.963952Z', 5],
  [34, '[금융멘토 문초록] 진정성 명품감정 5기 강의', '23514750-2bc6-480f-88e6-339dade0bb2d.jpg', '2025-11-12T10:47:58.374845Z', 5],
  [32, '[금융멘토 문초록] 진정성 명품감정 5기 강의', 'a8562959-e403-473c-84b5-66ee0b370917.jpg', '2025-11-12T10:47:40.416585Z', 5],
  [31, '[금융멘토 문초록] 진정성 명품감정 5기 강의', 'b5a508fb-83d1-46f4-8eca-936811d7fbce.jpg', '2025-11-12T10:47:28.709590Z', 5],
  [28, '[금융멘토 문초록] 진정성 명품감정 4기 강의', '1b871ec0-902f-4f9a-be2b-18789236525f.jpg', '2025-08-05T07:41:00.469239Z', 4],
  [27, '[금융멘토 문초록] 진정성 명품감정 4기 강의', '8d603680-55de-4a25-b502-d5b6092a9d16.jpg', '2025-08-05T07:40:49.800428Z', 4],
  [26, '[금융멘토 문초록] 진정성 명품감정 4기 강의', '1d35ef45-2b3e-49e3-9ca9-33a3a2951f66.jpg', '2025-08-05T07:40:39.254934Z', 4],
  [25, '[금융멘토 문초록] 진정성 명품감정 4기 강의', '0f0c4cea-0ba3-43f0-9214-f304c0dd527f.jpg', '2025-08-05T07:40:25.408075Z', 4],
  [24, ' [금융멘토 문초록] 진정성 명품감정 4기 강의', '43515520-4b72-423e-93c7-33770a1ea675.jpg', '2025-08-05T07:40:11.517878Z', 4],
  [23, '[금융멘토 문초록] 진정성 명품감정 3기 강의', '0710021e-3325-445f-9141-b69619d84092.jpg', '2025-08-01T05:25:13.565233Z', 3],
  [22, '[금융멘토 문초록] 진정성 명품감정 3기 강의', '4b31c8a6-1f2d-4393-a0f5-b9c5f6cd2eb9.jpg', '2025-08-01T05:24:48.151131Z', 3],
  [21, '[금융멘토 문초록] 진정성 명품감정 3기 강의', '7341291a-dc84-4023-bb66-f22fc951556c.jpg', '2025-08-01T05:24:31.956424Z', 3],
  [20, '[금융멘토 문초록] 진정성 명품감정 3기 강의', 'c01b5f51-e32a-40ac-833d-e727f1485e40.jpg', '2025-08-01T05:24:02.211088Z', 3],
  [19, '[금융멘토 문초록] 진정성 명품감정 3기 강의', 'eee4d26e-2f39-4033-aed5-d293d0302538.jpg', '2025-08-01T05:24:00.090721Z', 3],
  [18, '[금융멘토 문초록] 진정성 명품감정 2기 강의', '622ebc8c-72ac-4c10-af6c-cb0cd66273f9.jpg', '2025-06-19T02:18:39.342750Z', 2],
  [17, '[금융멘토 문초록] 진정성 명품감정 2기 강의', 'f4c4479b-2206-4353-88cc-e5d6cc507fe2.jpg', '2025-06-19T02:18:29.375247Z', 2],
  [16, '[금융멘토 문초록] 진정성 명품감정 2기 강의', '705c0de2-0a72-4ba0-b18b-c58de4a2af07.jpg', '2025-06-19T02:18:17.973167Z', 2],
  [15, '[금융멘토 문초록] 진정성 명품감정 2기 강의', '794872ab-3e9b-43ac-ab58-53bcb5a0c672.jpg', '2025-06-19T02:17:06.445054Z', 2],
  [14, '[금융멘토 문초록] 진정성 명품감정 2기 강의', '922ebe02-c8c9-477a-9d73-fb30f8fa4ad2.jpg', '2025-06-19T02:16:38.159596Z', 2],
  [13, '[금융멘토 문초록] 진정성 명품감정 2기 강의', '8ec848cc-37fe-45af-9574-34b3834854e0.jpg', '2025-06-19T02:16:05.339064Z', 2],
  [12, '[금융멘토 문초록] 진정성 명품감정 1기 강의', '6fcb2986-8d5b-4d08-a9e3-d6b3c77c14af.jpg', '2025-06-19T02:14:21.156807Z', 1],
  [11, '[금융멘토 문초록] 진정성 명품감정 1기 강의', 'fb237fc7-9177-42ca-8728-329035ce2b21.jpg', '2025-06-19T02:13:51.247128Z', 1],
  [10, '[금융멘토 문초록] 진정성 명품감정 1기 강의', '539b69f0-a6df-41f3-aa97-be2f0b127a56.jpg', '2025-06-19T02:13:40.946645Z', 1],
  [9, '[금융멘토 문초록] 진정성 명품감정 1기 강의', '7b0649b9-be47-4d04-8c7d-c2cc667e4549.jpg', '2025-06-19T02:13:30.964889Z', 1],
  [8, '[금융멘토 문초록] 진정성 명품감정 1기 강의', 'ec569884-b67b-4a2b-85e3-f15d97375322.jpg', '2025-06-19T02:12:56.569595Z', 1],
  [7, '[금융멘토 문초록] 진정성 명품감정 1기 강의', '653e6cea-a316-4978-a238-235a7ce92dc6.jpg', '2025-06-19T02:12:33.764765Z', 1],
  [5, '[금융멘토 문초록] 진정성 명품감정 1기 강의', '1efccf16-ade4-4751-8e3d-bb4e4dea3ba9.jpg', '2025-06-19T02:11:49.686583Z', 1],
  [3, '[금융멘토 문초록] 진정성 명품감정 1기 강의', 'a511bad7-1dfc-41a7-a8a0-509ba84e82fe.jpg', '2025-06-05T02:35:36.412295Z', 1],
].map(([id, title, file, createdAt, cohort]) => ({
  id,
  title,
  cohort,
  image_filename: file,
  image: `https://luxacademy.kr/uploads/${file}`,
  created_at: createdAt,
}))
</script>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { jinjungsungService } from '@/services/jinjungsungService.js'
import { useListState } from './useListState.js'
import { statusTitle } from '../statusTitle.js'
import { boardDate } from './boardNav.js'
import { cohortLabel } from '../cohort.js'
import defaultImage from '@/assets/images/business-1.jpg'

// 원본과 같이 한 페이지 12개 (게시글 API는 items_per_page 5~20 만 허용)
const itemsPerPage = 12

// 상태 관리 (처음부터 '불러오는 중'으로 — 불러오기 전에 '없음' 안내가 잠깐 비치지 않게)
const isLoading = ref(true)
const errorMessage = ref('')
const searchKeyword = ref('')
const posts = ref([])
// 보던 쪽을 주소(?page=)로 기억 — 게시글에서 뒤로 오면 그 쪽·그 위치로(useListState.js)
const { initialPage, setPageQuery, restoreScroll } = useListState()
const currentPage = ref(initialPage())
const totalPosts = ref(0)
const requestedPage = ref(currentPage.value) // 다시 시도할 때 마지막으로 요청한 페이지를 다시 부른다

// 개발 화면 미리보기: 서버에서 받은 게시글이 없을 때(불러오는 중 · 실패 · 0건)만 운영 사이트 목록을 쓴다
const previewPage = ref(currentPage.value)
const isPreview = computed(() => import.meta.env.DEV && posts.value.length === 0)

const shownPosts = computed(() =>
  isPreview.value
    ? PREVIEW_POSTS.slice((previewPage.value - 1) * itemsPerPage, previewPage.value * itemsPerPage)
    : posts.value,
)
const shownTotal = computed(() => (isPreview.value ? PREVIEW_POSTS.length : totalPosts.value))
const shownPage = computed(() => (isPreview.value ? previewPage.value : currentPage.value))
const showLoading = computed(() => isLoading.value && !isPreview.value)
const showError = computed(() => Boolean(errorMessage.value) && !isPreview.value)

const totalPages = computed(() => Math.ceil(shownTotal.value / itemsPerPage))

// 검색: 원본과 같이 지금 페이지의 게시글을 제목으로 거른다(대소문자 무시)
const filteredPosts = computed(() => {
  const keyword = searchKeyword.value.trim().toLowerCase()
  if (!keyword) return shownPosts.value
  // 제목 + 기수('8기')로 찾는다
  return shownPosts.value.filter((post) => `${post.title || ''} ${cohortLabel(post)}`.toLowerCase().includes(keyword))
})

// 표시할 총 개수: 검색 중이면 걸러진 개수, 아니면 전체 게시글 수
const displayTotalCount = computed(() => (searchKeyword.value.trim() ? filteredPosts.value.length : shownTotal.value))

const imageOf = (post) =>
  post.image || (post.image_filename ? jinjungsungService.getImageUrl(post.image_filename) : defaultImage)

// 작성일 — 원본 목록처럼 카드마다(11/13 "제목 · 사진 · 일자 정도는 보여야"). 상세 · 수강후기와 같은 모양 2026.07.28
const formatDate = boardDate

// 사진을 못 불러오면 기본 사진으로 (원본과 같음)
const handleImageError = (event) => {
  if (!event.target.dataset.fallback) {
    event.target.dataset.fallback = 'true'
    event.target.src = defaultImage
  }
}

// 게시글 목록 로드
const loadPosts = async (page = 1) => {
  isLoading.value = true
  errorMessage.value = ''
  requestedPage.value = page

  try {
    const response = await jinjungsungService.getPosts(page, itemsPerPage)
    posts.value = Array.isArray(response?.items) ? response.items : []
    totalPosts.value = response?.total || 0
    currentPage.value = page
  } catch (error) {
    errorMessage.value = error.message
  } finally {
    isLoading.value = false
  }
}

// 페이지를 바꾸면 목록 맨 위가 보이도록(이미 보이면 그대로) — 고정 헤더 높이만큼은 CSS scroll-margin-top 으로 띄운다
const listTop = ref(null)
const toListTop = () => {
  const el = listTop.value
  if (el && el.getBoundingClientRect().top < 120) el.scrollIntoView({ block: 'start' })
}

// 페이지 변경
const changePage = async (page) => {
  if (page < 1 || page > totalPages.value) return
  setPageQuery(page)
  if (isPreview.value) {
    previewPage.value = page
  } else {
    await loadPosts(page)
  }
  toListTop()
}

onMounted(async () => {
  // 개발 화면 미리보기는 바로 그려지므로 바로 위치를 되돌리고, 서버 데이터는 받은 뒤에 되돌린다
  if (isPreview.value) restoreScroll()
  await loadPosts(currentPage.value)
  if (!isPreview.value) restoreScroll()
})
</script>

<style scoped>
/* 페이지를 넘길 때 목록 맨 위로 — 고정 헤더(100px) 아래에 오도록 */
.st-root {
  scroll-margin-top: 140px;
}

/* ── 위 줄: 총 게시글 수(왼쪽) + 제목 검색(오른쪽) ── */
.st-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px 24px;
  margin-bottom: var(--v3-gap);
}

.st-count {
  font-size: var(--fs-body);
  color: var(--c-sub);
}

.st-count strong {
  font-weight: 700;
  color: var(--c-text);
}

/* 검색칸: 11/13 수강후기 검색칸과 같은 모양(문의 폼 입력칸 모양 · 높이 40) */
.st-search {
  display: block;
  width: 280px;
}

.st-search input {
  width: 100%;
  height: 40px;
  padding: 0 14px;
  border: 1px solid var(--c-field-line);
  border-radius: 2px;
  background: var(--c-field);
  font: inherit;
  font-size: var(--fs-body);
  color: var(--c-text);
  transition: border-color var(--t-1) var(--ease-soft);
}

.st-search input::placeholder {
  color: var(--c-faint);
}

.st-search input:focus {
  outline: none;
  border-color: var(--c-text);
}

/* ── 게시글 카드: 사진 + 굵은 제목 (메인 수강현황과 같은 모양) ── */
.st-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: var(--v3-head-gap) var(--v3-gap);
}

.st-card {
  display: block;
}

.st-media {
  display: block;
  aspect-ratio: 4 / 3;
  overflow: hidden;
  background: var(--c-bg);
}

.st-media img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: opacity 0.3s var(--ease-soft);
}

/* 누를 수 있다는 표시만 살짝(움직임 없이) */
.st-card:hover .st-media img {
  opacity: 0.85;
}

.st-title {
  display: block;
  margin-top: 14px;
  font-size: var(--fs-body);
  font-weight: 700;
  line-height: 1.5;
  color: var(--c-text);
  word-break: keep-all;
}

.st-date {
  display: block;
  margin-top: 4px;
  font-size: var(--fs-small);
  line-height: 1.5;
  color: var(--c-sub);
}

.st-card:focus-visible {
  outline: 2px solid var(--c-text);
  outline-offset: 4px;
}

/* ── 불러오는 중 · 오류 · 없음 안내 ── */
.st-state {
  padding: var(--v3-section-y) 0;
  font-size: var(--fs-body);
  line-height: 1.6;
  color: var(--c-sub);
  text-align: center;
}

.st-state--error {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.st-state--error p {
  color: var(--c-text);
}

/* ── 페이지 이동 (11/13 수강후기와 같은 모양 · 간격) ── */
.st-pager {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 24px;
  margin-top: 56px;
}

.st-pager .v3-btn:disabled {
  opacity: 0.35;
  cursor: not-allowed;
  background: transparent;
  color: var(--c-text);
}

.st-page-info {
  min-width: 56px;
  font-size: var(--fs-body);
  color: var(--c-sub);
  text-align: center;
}

.st-page-info strong {
  font-weight: 700;
  color: var(--c-text);
}

@media (max-width: 1100px) {
  .st-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

@media (max-width: 900px) {
  .st-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 768px) {
  .st-root {
    scroll-margin-top: 96px;
  }

  .st-pager {
    margin-top: 40px;
  }
}

@media (max-width: 560px) {
  .st-toolbar {
    flex-direction: column;
    align-items: stretch;
  }

  .st-search {
    width: 100%;
  }
}
</style>
