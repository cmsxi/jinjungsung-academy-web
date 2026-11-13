<template>
  <!--
    수강현황 (11/13 "수강현황도 메인에 올리면") — 최신 게시글 4개를 사진 + 기수 제목으로.
    - 날짜는 빼고(게시글이 같은 날 한꺼번에 올라가 의미가 없음), 제목 앞 반복 꼬리표는 덜어낸다(statusTitle.js — 목록 · 상세와 같은 이름)
    - 누르면 해당 게시글(수강현황 상세)로
    - 읽기만 하는 목록이라 상자 없이(규칙 5)
  -->
  <section class="status">
    <div class="jj-container">
      <V3Head
        title="수강현황"
        desc="기수별 수업 현장을 확인해 보세요."
        link-to="/education/status"
        link-label="수강현황 전체 보기"
      />

      <ul v-if="items.length" class="status-grid">
        <li v-for="(item, i) in items" :key="item.id" v-reveal="i * 90">
          <router-link :to="`/education/status/${item.id}`" class="status-card">
            <span class="status-media">
              <img :src="item.src" alt="" loading="lazy" />
            </span>
            <span class="status-title">{{ item.title }}</span>
          </router-link>
        </li>
      </ul>

      <div v-else-if="loaded" class="status-empty">
        <p>수강현황은 수강현황 게시판에서 보실 수 있습니다.</p>
        <router-link to="/education/status" class="v3-btn v3-btn--line">수강현황 게시판</router-link>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import V3Head from './V3Head.vue'
import { vReveal } from '../useReveal.js'
import { jinjungsungService } from '@/services/jinjungsungService.js'
import { statusTitle } from '../statusTitle.js'

const COUNT = 4
// 게시글 API는 items_per_page >= 5
const PAGE_SIZE = 5

// 로컬 개발 화면은 서버에 연결되지 않아 비어 보인다 — 개발 화면에서만 운영 사이트의 최신 수강현황 4건을 미리보기로
const PREVIEW = [
  [53, '국제명품감정교육원 명품감정 10기', '9ac050ed-c30c-421b-9743-5b10ef4a6e30.jpg'],
  [52, '국제명품감정교육원 명품감정 9기', 'b93790e4-8d63-49a8-9849-85a8a40f1ff6.jpg'],
  [51, '국제명품감정교육원 명품감정 강의 - 8기', '6871f84b-7322-4f00-aec6-6e0ce0283aa0.jpg'],
  [50, '국제명품감정교육원 명품감정 강의 - 8기', '714c86fa-372e-4389-8e4a-8ceb82815d6f.jpg'],
].map(([id, title, file]) => ({ id, title, image: `https://luxacademy.kr/uploads/${file}` }))

const posts = ref([])
const loaded = ref(false)

const items = computed(() => {
  const source = posts.value.length ? posts.value : import.meta.env.DEV ? PREVIEW : []
  return source.slice(0, COUNT).map((post) => ({
    id: post.id,
    title: statusTitle(post.title),
    src: post.image || jinjungsungService.getImageUrl(post.image_filename),
  }))
})

onMounted(async () => {
  try {
    const response = await jinjungsungService.getPosts(1, PAGE_SIZE)
    posts.value = Array.isArray(response?.items) ? response.items.filter((post) => post.image_filename) : []
  } catch {
    posts.value = []
  } finally {
    loaded.value = true
  }
})
</script>

<style scoped>
.status {
  padding: var(--v3-section-y) 0;
  background: var(--c-bg);
}

.status-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: var(--v3-gap);
}

.status-card {
  display: block;
}

.status-media {
  display: block;
  aspect-ratio: 4 / 3;
  overflow: hidden;
  background: var(--c-bg-alt);
}

.status-media img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform var(--t-3) var(--ease-soft);
}

.status-card:hover .status-media img {
  transform: scale(1.04);
}

.status-title {
  display: block;
  margin-top: 14px;
  font-size: var(--fs-body);
  font-weight: 700;
  line-height: 1.5;
  color: var(--c-text);
  word-break: keep-all;
}

.status-card:focus-visible {
  outline: 2px solid var(--c-text);
  outline-offset: 4px;
}

.status-empty {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
}

.status-empty p {
  font-size: var(--fs-body);
  color: var(--c-sub);
}

@media (max-width: 900px) {
  .status-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .status-empty {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
