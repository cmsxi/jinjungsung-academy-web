<template>
  <!-- 수강현황 글 작성 · 수정 (/admin/status/write, /admin/status/:id) -->
  <div>
    <header class="adm-head">
      <div>
        <p class="adm-crumb"><router-link to="/admin/status">수강현황</router-link> ›</p>
        <h1>{{ isEdit ? '글 수정' : '새 글 작성' }}</h1>
      </div>
    </header>

    <p v-if="error" class="adm-note adm-note--error" role="alert">{{ error }}</p>

    <section class="adm-card">
      <p v-if="loading" class="adm-empty">불러오는 중…</p>

      <form v-else class="adm-form" @submit.prevent="save">
        <div class="adm-field">
          <label for="st-title">제목<span class="req">*</span></label>
          <input id="st-title" v-model="form.title" class="adm-input" maxlength="100" placeholder="예: 국제명품감정교육원 명품감정 11기" />
        </div>

        <div class="adm-field">
          <label for="st-cohort">기수</label>
          <div class="adm-inline">
            <input id="st-cohort" v-model="form.cohort" class="adm-input st-cohort" type="number" min="1" max="99" inputmode="numeric" />
            <span>기</span>
          </div>
          <p class="adm-help">몇 기 수업 사진인지 숫자로 적습니다. 기수와 관계없는 글이면 비워 두세요.</p>
        </div>

        <div class="adm-field">
          <label for="st-content">내용</label>
          <textarea id="st-content" v-model="form.content" class="adm-textarea" rows="8"></textarea>
          <p class="adm-help">사진만 올릴 때는 비워 두어도 됩니다.</p>
        </div>

        <div class="adm-field">
          <span class="adm-field-label">사진</span>
          <input ref="fileInput" type="file" accept="image/*" @change="pickImage" />
          <p class="adm-help">10MB 이하 이미지. {{ isEdit ? '새로 고르면 지금 사진이 바뀝니다.' : '' }}</p>
          <img v-if="preview" :src="preview" alt="" class="adm-image-preview" />
          <button v-if="form.image" type="button" class="adm-link st-undo" @click="clearImage">고른 사진 취소</button>
        </div>

        <div class="adm-form-actions">
          <button type="submit" class="adm-btn adm-btn--primary" :disabled="saving || !canSave">
            {{ saving ? '저장 중…' : isEdit ? '수정 저장' : '등록' }}
          </button>
          <router-link to="/admin/status" class="adm-btn">취소</router-link>
        </div>
      </form>
    </section>
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { adminService, errorText } from '@/services/adminService.js'

const route = useRoute()
const router = useRouter()
const isEdit = computed(() => Boolean(route.params.id))

const form = reactive({ title: '', cohort: '', content: '', image: null })
const currentImage = ref('')
const objectUrl = ref('')
const fileInput = ref(null)
const loading = ref(false)
const saving = ref(false)
const error = ref('')

const preview = computed(() => objectUrl.value || currentImage.value)
// 내용을 비우면 기존 글처럼 빈칸 한 칸(전각 공백)으로 — 서버는 빈 글자를 '값 없음'으로 거절하고, 홈페이지 상세는 빈칸 내용을 숨긴다
const BLANK = '\u3000'
const canSave = computed(() => form.title.trim())

const pickImage = (event) => {
  const file = event.target.files?.[0]
  if (!file) return
  if (!file.type.startsWith('image/')) {
    error.value = '이미지 파일만 올릴 수 있습니다.'
    event.target.value = ''
    return
  }
  if (file.size > 10 * 1024 * 1024) {
    error.value = '사진은 10MB 이하만 올릴 수 있습니다.'
    event.target.value = ''
    return
  }
  error.value = ''
  form.image = file
  if (objectUrl.value) URL.revokeObjectURL(objectUrl.value)
  objectUrl.value = URL.createObjectURL(file)
}

const clearImage = () => {
  form.image = null
  if (objectUrl.value) URL.revokeObjectURL(objectUrl.value)
  objectUrl.value = ''
  if (fileInput.value) fileInput.value.value = ''
}

const save = async () => {
  if (!canSave.value || saving.value) return
  saving.value = true
  error.value = ''
  try {
    await adminService.savePost(isEdit.value ? route.params.id : null, {
      title: form.title.trim(),
      content: form.content.trim() ? form.content : BLANK,
      cohort: form.cohort === '' || form.cohort === null ? null : Number(form.cohort),
      image: form.image,
    })
    router.push({ path: '/admin/status', query: { saved: '1' } })
  } catch (e) {
    error.value = errorText(e, '저장하지 못했습니다.')
  } finally {
    saving.value = false
  }
}

onMounted(async () => {
  if (!isEdit.value) return
  loading.value = true
  try {
    const post = await adminService.getPost(route.params.id)
    Object.assign(form, { title: post.title, cohort: post.cohort ?? '', content: (post.content || '').trim() ? post.content : '' })
    currentImage.value = adminService.imageUrl(post.image_filename)
  } catch (e) {
    error.value = errorText(e, '글을 불러오지 못했습니다.')
  } finally {
    loading.value = false
  }
})

onBeforeUnmount(() => {
  if (objectUrl.value) URL.revokeObjectURL(objectUrl.value)
})
</script>

<style scoped>
.st-cohort {
  width: 100px !important;
}

.st-undo {
  display: block;
  margin-top: 6px;
  font-size: 12px;
}
</style>
