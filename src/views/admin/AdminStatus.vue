<template>
  <!-- 수강현황 관리 — 목록(최신순) · 새 글 · 수정 · 삭제 -->
  <div>
    <header class="adm-head">
      <div>
        <h1>수강현황</h1>
        <p>홈페이지 '수강현황'에 올라가는 기수별 수업 사진입니다.</p>
      </div>
      <router-link to="/admin/status/write" class="adm-btn adm-btn--primary">새 글 작성</router-link>
    </header>

    <p v-if="notice" class="adm-note adm-note--ok">{{ notice }}</p>

    <section class="adm-card">
      <p class="adm-count">총 <strong>{{ total }}</strong>개</p>

      <p v-if="error" class="adm-empty">
        {{ error }}
        <button type="button" class="adm-link" @click="load">다시 시도</button>
      </p>
      <p v-else-if="loading && !items.length" class="adm-empty">불러오는 중…</p>
      <p v-else-if="!items.length" class="adm-empty">등록된 글이 없습니다.</p>

      <div v-else class="adm-table-wrap">
        <table class="adm-table">
          <thead>
            <tr>
              <th class="num">번호</th>
              <th>사진</th>
              <th>제목</th>
              <th>기수</th>
              <th>작성일</th>
              <th class="actions">관리</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="post in items" :key="post.id">
              <td class="num">{{ post.id }}</td>
              <td>
                <img v-if="post.image_filename" :src="adminService.imageUrl(post.image_filename)" alt="" class="adm-thumb" loading="lazy" />
                <span v-else class="muted">없음</span>
              </td>
              <td>
                <router-link :to="`/admin/status/${post.id}`" class="st-title">{{ post.title }}</router-link>
              </td>
              <td class="nowrap" :class="{ muted: !post.cohort }">{{ post.cohort ? `${post.cohort}기` : '—' }}</td>
              <td class="nowrap">{{ dateOnly(post.created_at) }}</td>
              <td class="actions">
                <a :href="`/education/status/${post.id}`" target="_blank" rel="noopener" class="adm-btn adm-btn--sm">보기</a>
                <router-link :to="`/admin/status/${post.id}`" class="adm-btn adm-btn--sm">수정</router-link>
                <button type="button" class="adm-btn adm-btn--sm adm-btn--danger" @click="target = post">삭제</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <AdminPager :page="page" :total="total" :size="SIZE" @change="goPage" />
    </section>

    <AdminConfirm
      :open="Boolean(target)"
      title="이 글을 삭제할까요?"
      :message="target ? `「${target.title}」 글과 사진이 홈페이지에서 지워지고 되돌릴 수 없습니다.` : ''"
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

const SIZE = 20 // 게시글 API 한 쪽 최대
const route = useRoute()
const router = useRouter()

const items = ref([])
const total = ref(0)
const loading = ref(false)
const error = ref('')
const notice = ref(typeof route.query.saved === 'string' ? '저장했습니다.' : '')
const target = ref(null)
const deleting = ref(false)

const page = computed(() => Math.max(1, parseInt(route.query.page, 10) || 1))
const goPage = (n) => router.replace({ query: n > 1 ? { page: String(n) } : {} })

const load = async () => {
  loading.value = true
  error.value = ''
  try {
    const data = await adminService.getPosts(page.value, SIZE)
    items.value = data.items
    total.value = data.total
  } catch (e) {
    error.value = errorText(e, '목록을 불러오지 못했습니다.')
  } finally {
    loading.value = false
  }
}

const remove = async () => {
  if (!target.value) return
  deleting.value = true
  try {
    await adminService.deletePost(target.value.id)
    notice.value = '삭제했습니다.'
    target.value = null
    if (items.value.length === 1 && page.value > 1) goPage(page.value - 1)
    else load()
  } catch (e) {
    target.value = null
    error.value = errorText(e, '삭제하지 못했습니다.')
  } finally {
    deleting.value = false
  }
}

watch(() => route.query.page, load)
onMounted(load)
</script>

<style scoped>
.st-title {
  font-weight: 600;
  text-decoration: none;
}

.st-title:hover {
  text-decoration: underline;
}
</style>
