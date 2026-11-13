<template>
  <!--
    수강후기 관리 — 방문자가 쓴 후기는 '비공개'로 들어오고, 확인 후 '공개'로 바꾸면 홈페이지에 보인다.
    전체 · 공개 · 비공개 거르기는 서버에서(쪽이 넘어가도 정확하게). 공개 칸을 누르면 바로 바뀐다.
  -->
  <div>
    <header class="adm-head">
      <div>
        <h1>수강후기</h1>
        <p>방문자가 쓴 후기는 비공개로 들어옵니다. 내용을 확인하고 공개로 바꾸면 홈페이지에 보입니다.</p>
      </div>
      <router-link to="/admin/reviews/write" class="adm-btn adm-btn--primary">새 후기 등록</router-link>
    </header>

    <p v-if="notice" class="adm-note" :class="noticeError ? 'adm-note--error' : 'adm-note--ok'">{{ notice }}</p>

    <section class="adm-card">
      <div class="adm-toolbar">
        <button
          v-for="tab in TABS"
          :key="tab.id"
          type="button"
          class="adm-btn adm-btn--sm"
          :class="{ 'is-on': status === tab.id }"
          @click="setStatus(tab.id)"
        >
          {{ tab.label }}
        </button>
      </div>

      <p class="adm-count">총 <strong>{{ total }}</strong>개</p>

      <p v-if="error" class="adm-empty">
        {{ error }}
        <button type="button" class="adm-link" @click="load">다시 시도</button>
      </p>
      <p v-else-if="loading && !items.length" class="adm-empty">불러오는 중…</p>
      <p v-else-if="!items.length" class="adm-empty">{{ status === 'pending' ? '공개를 기다리는 후기가 없습니다.' : '후기가 없습니다.' }}</p>

      <div v-else class="adm-table-wrap">
        <table class="adm-table">
          <thead>
            <tr>
              <th class="num">번호</th>
              <th>사진</th>
              <th>기수</th>
              <th>제목</th>
              <th>작성자</th>
              <th>접수일</th>
              <th>공개</th>
              <th class="actions">관리</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="review in items" :key="review.id">
              <td class="num">{{ review.id }}</td>
              <td>
                <img v-if="review.image_filename" :src="adminService.imageUrl(review.image_filename)" alt="" class="adm-thumb" loading="lazy" />
                <span v-else class="muted">없음</span>
              </td>
              <td class="nowrap" :class="{ muted: !review.cohort }">{{ review.cohort ? `${review.cohort}기` : '—' }}</td>
              <td>
                <router-link :to="`/admin/reviews/edit/${review.id}`" class="rv-title">{{ review.title }}</router-link>
              </td>
              <td class="nowrap">
                {{ review.username }}
                <span v-if="review.submitter_ip" class="rv-ip">방문자 작성</span>
              </td>
              <td class="nowrap">{{ dateOnly(review.created_at) }}</td>
              <td>
                <button
                  type="button"
                  class="adm-badge"
                  :class="review.is_published ? 'adm-badge--on' : 'adm-badge--off'"
                  :disabled="toggling === review.id"
                  :title="review.is_published ? '눌러서 비공개로' : '눌러서 공개로'"
                  @click="togglePublish(review)"
                >
                  {{ review.is_published ? '공개' : '비공개' }}
                </button>
              </td>
              <td class="actions">
                <a v-if="review.is_published" :href="`/reviews/${review.id}`" target="_blank" rel="noopener" class="adm-btn adm-btn--sm">보기</a>
                <router-link :to="`/admin/reviews/edit/${review.id}`" class="adm-btn adm-btn--sm">수정</router-link>
                <button type="button" class="adm-btn adm-btn--sm adm-btn--danger" @click="target = review">삭제</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <AdminPager :page="page" :total="total" :size="SIZE" @change="goPage" />
    </section>

    <AdminConfirm
      :open="Boolean(target)"
      title="이 후기를 삭제할까요?"
      :message="target ? `${target.username} 님의 「${target.title}」 후기와 사진이 지워지고 되돌릴 수 없습니다.` : ''"
      :busy="deleting"
      @cancel="target = null"
      @confirm="remove"
    />
  </div>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { adminService, errorText } from '@/services/adminService.js'
import { dateOnly } from './adminFormat.js'
import AdminPager from './AdminPager.vue'
import AdminConfirm from './AdminConfirm.vue'

const SIZE = 20
const TABS = [
  { id: '', label: '전체' },
  { id: 'published', label: '공개' },
  { id: 'pending', label: '비공개' },
]

const route = useRoute()
const router = useRouter()

const items = ref([])
const total = ref(0)
const loading = ref(false)
const error = ref('')
const notice = ref(typeof route.query.saved === 'string' ? '저장했습니다.' : '')
const noticeError = ref(false)
const toggling = ref(null)
const target = ref(null)
const deleting = ref(false)

const page = computed(() => Math.max(1, parseInt(route.query.page, 10) || 1))
const status = computed(() => (['published', 'pending'].includes(route.query.status) ? route.query.status : ''))

const pushQuery = (next) => {
  const query = {}
  if (next.status) query.status = next.status
  if (next.page > 1) query.page = String(next.page)
  router.replace({ query })
}
const setStatus = (id) => pushQuery({ status: id, page: 1 })
const goPage = (n) => pushQuery({ status: status.value, page: n })

const say = (text, isError = false) => {
  notice.value = text
  noticeError.value = isError
}

const load = async () => {
  loading.value = true
  error.value = ''
  try {
    const data = await adminService.getReviews({ page: page.value, size: SIZE, status: status.value })
    items.value = data.items
    total.value = data.total
  } catch (e) {
    error.value = errorText(e, '후기 목록을 불러오지 못했습니다.')
  } finally {
    loading.value = false
  }
}

const togglePublish = async (review) => {
  toggling.value = review.id
  try {
    const result = await adminService.setReviewPublished(review.id, !review.is_published)
    review.is_published = result.is_published
    say(`「${review.title}」 후기를 ${result.is_published ? '공개' : '비공개'}로 바꿨습니다.`)
    if (status.value) load() // 거르는 중이면 목록에서 빠지도록 다시 불러온다
  } catch (e) {
    say(errorText(e, '공개 여부를 바꾸지 못했습니다.'), true)
  } finally {
    toggling.value = null
  }
}

const remove = async () => {
  if (!target.value) return
  deleting.value = true
  try {
    await adminService.deleteReview(target.value.id)
    say('삭제했습니다.')
    target.value = null
    if (items.value.length === 1 && page.value > 1) goPage(page.value - 1)
    else load()
  } catch (e) {
    target.value = null
    say(errorText(e, '삭제하지 못했습니다.'), true)
  } finally {
    deleting.value = false
  }
}

watch(() => route.query, load)
onMounted(load)
</script>

<style scoped>
.rv-title {
  font-weight: 600;
  text-decoration: none;
}

.rv-title:hover {
  text-decoration: underline;
}

.rv-ip {
  display: block;
  font-size: 12px;
  color: var(--adm-faint);
}
</style>
