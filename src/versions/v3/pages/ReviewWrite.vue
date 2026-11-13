<template>
  <!--
    3차 시안 '수강후기 작성' (11/13 메인 규칙 적용)
    - 공통 머리(PageHead): 상위 '수강후기' + 제목 '수강후기 작성' + 원본 안내 문구
    - 규칙 5: 작성하는 폼만 연한 회색 상자, 입력 칸은 흰색(문의 폼 InquiryForm 과 같은 모양)
    - 내용 칸은 세로 크기 고정(늘이기 손잡이 없음, 길어지면 칸 안에서 스크롤)
    - 접수 동작·봇 차단 칸(honeypot)·이미지 검사는 원본과 같다
  -->
  <div class="page">
    <PageHead group="수강후기" title="수강후기 작성" desc="작성하신 후기는 관리자 검토 후 게시됩니다." />

    <div class="page-body">
      <div class="jj-container">
        <div class="write-nav">
          <button type="button" class="v3-btn v3-btn--line v3-btn--sm" @click="goBack">
            <span aria-hidden="true">←</span>&nbsp;목록으로 돌아가기
          </button>
        </div>

        <div class="write-box" v-reveal>
          <!-- 접수 완료 -->
          <div v-if="isSubmitted" class="write-done" role="status">
            <p class="write-done-title">후기가 정상적으로 접수되었습니다.</p>
            <p class="write-done-text">관리자 검토 후 게시되며, 보통 1~2 영업일 내에 처리됩니다.</p>
            <button type="button" class="v3-btn v3-btn--line" @click="goBack">목록으로 돌아가기</button>
          </div>

          <form v-else @submit.prevent="submitReview">
            <div class="field">
              <label for="rw-username">작성자명 <span class="req">*</span></label>
              <input
                id="rw-username"
                v-model="formData.username"
                type="text"
                maxlength="20"
                placeholder="표시될 이름 (최대 20자)"
                required
                :disabled="isSubmitting"
              />
            </div>

            <!-- 11/13 기수(선택) — DB 에 숫자로 저장되어 목록 · 상세에 'N기 수강생'으로 보인다 -->
            <div class="field">
              <label for="rw-cohort">수강 기수 (선택)</label>
              <div class="cohort-field">
                <input
                  id="rw-cohort"
                  v-model="formData.cohort"
                  type="number"
                  inputmode="numeric"
                  min="1"
                  max="99"
                  placeholder="예: 8"
                  :disabled="isSubmitting"
                />
                <span class="cohort-unit">기</span>
              </div>
            </div>

            <div class="field">
              <label for="rw-title">제목 <span class="req">*</span></label>
              <input
                id="rw-title"
                v-model="formData.title"
                type="text"
                maxlength="100"
                placeholder="후기 제목"
                required
                :disabled="isSubmitting"
              />
            </div>

            <div class="field">
              <label for="rw-content">내용 <span class="req">*</span></label>
              <textarea
                id="rw-content"
                v-model="formData.content"
                maxlength="5000"
                placeholder="강의를 들으면서 느낀 점을 자유롭게 작성해 주세요."
                required
                :disabled="isSubmitting"
              ></textarea>
              <p class="char-count">{{ formData.content.length }}/5000자</p>
            </div>

            <div class="field">
              <label for="rw-image">이미지 (선택)</label>
              <input
                id="rw-image"
                ref="imageInput"
                type="file"
                class="file-input"
                accept="image/*"
                :disabled="isSubmitting"
                @change="handleImageChange"
              />
              <div v-if="imagePreview" class="image-preview-wrap">
                <img :src="imagePreview" alt="미리보기" class="image-preview" />
                <button type="button" class="v3-btn v3-btn--sm" :disabled="isSubmitting" @click="removeImage">
                  이미지 제거
                </button>
              </div>
            </div>

            <!-- Honeypot: 봇 차단용. 사용자 눈에는 절대 보이면 안 됨 -->
            <div class="hp-field" aria-hidden="true">
              <label for="_botcheck">이 필드는 비워두세요</label>
              <input id="_botcheck" v-model="formData.botcheck" type="text" tabindex="-1" autocomplete="off" />
            </div>

            <p v-if="errorMessage" class="form-error" role="alert">{{ errorMessage }}</p>

            <div class="form-actions">
              <button type="submit" class="v3-btn submit" :disabled="!isFormValid || isSubmitting">
                {{ isSubmitting ? '접수 중...' : '후기 등록' }}
              </button>
              <button type="button" class="v3-btn v3-btn--line" :disabled="isSubmitting" @click="goBack">취소</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import PageHead from './PageHead.vue'
import { vReveal } from '../useReveal.js'
import { jinjungsungService } from '@/services/jinjungsungService.js'

const router = useRouter()

const isSubmitting = ref(false)
const isSubmitted = ref(false)
const errorMessage = ref('')

const formData = ref({
  username: '',
  cohort: '',
  title: '',
  content: '',
  image: null,
  botcheck: '',
})

const imageInput = ref(null)
const imagePreview = ref('')

const isFormValid = computed(
  () => formData.value.username.trim() && formData.value.title.trim() && formData.value.content.trim(),
)

const handleImageChange = (event) => {
  const file = event.target.files[0]
  if (!file) return

  if (file.size > 10 * 1024 * 1024) {
    errorMessage.value = '이미지 파일 크기는 10MB 이하여야 합니다.'
    return
  }

  if (!file.type.startsWith('image/')) {
    errorMessage.value = '이미지 파일만 업로드 가능합니다.'
    return
  }

  formData.value.image = file

  const reader = new FileReader()
  reader.onload = (e) => {
    imagePreview.value = e.target.result
  }
  reader.readAsDataURL(file)

  errorMessage.value = ''
}

const removeImage = () => {
  formData.value.image = null
  imagePreview.value = ''
  if (imageInput.value) {
    imageInput.value.value = ''
  }
}

// 접수(운영 서버로 전송된다) — 원본과 같은 값, 같은 순서
const submitReview = async () => {
  if (!isFormValid.value || isSubmitting.value) return

  isSubmitting.value = true
  errorMessage.value = ''

  try {
    await jinjungsungService.submitReview({
      username: formData.value.username.trim(),
      // 기수: 적은 경우에만(1~99 숫자)
      cohort: formData.value.cohort === '' || formData.value.cohort === null ? '' : String(formData.value.cohort),
      title: formData.value.title.trim(),
      content: formData.value.content.trim(),
      image: formData.value.image,
      botcheck: formData.value.botcheck,
    })

    isSubmitted.value = true
  } catch (error) {
    errorMessage.value = error.message
  } finally {
    isSubmitting.value = false
  }
}

const goBack = () => {
  router.push('/reviews')
}
</script>

<style scoped>
.page {
  background: #ffffff;
}

/* 머리 아래 본문 — SectionLayout 의 .page-body 와 같은 간격 */
.page-body {
  padding: 64px 0 var(--v3-section-y);
}

.write-nav {
  margin-bottom: var(--v3-gap);
}

/* 작성 폼 상자: 흰 페이지 위 연한 회색(규칙 5) */
.write-box {
  max-width: 880px;
  padding: 40px;
  background: var(--c-bg);
}

/* ── 입력 칸: InquiryForm 과 같은 모양 ── */
.field {
  margin-bottom: 20px;
}

.field label {
  display: block;
  margin-bottom: 8px;
  font-size: var(--fs-small);
  font-weight: 700;
  color: var(--c-text);
}

.req {
  color: var(--c-accent);
}

.field input,
.field textarea {
  width: 100%;
  height: 52px;
  padding: 0 14px;
  border: 1px solid var(--c-field-line);
  border-radius: 2px;
  background: var(--c-field);
  font-size: var(--fs-body);
  color: var(--c-text);
  transition: border-color var(--t-1) var(--ease-soft);
}

/* 내용 칸 세로 크기 고정 — 늘이기 손잡이 없이, 길어지면 칸 안에서 스크롤 */
.field textarea {
  height: 280px;
  padding: 13px 14px;
  line-height: 1.6;
  resize: none;
  overflow-y: auto;
}

.field input::placeholder,
.field textarea::placeholder {
  color: var(--c-faint);
}

.field input:focus,
.field textarea:focus {
  outline: none;
  border-color: var(--c-text);
}

.field input:disabled,
.field textarea:disabled {
  cursor: not-allowed;
}

/* 기수: 숫자 칸 + '기' */
.cohort-field {
  display: flex;
  align-items: center;
  gap: 10px;
}

.field .cohort-field input {
  width: 140px;
}

.cohort-unit {
  font-size: var(--fs-body);
  font-weight: 700;
  color: var(--c-text);
}

.char-count {
  margin-top: 6px;
  font-size: var(--fs-small);
  text-align: right;
  color: var(--c-sub);
}

/* 파일 고르기: 같은 흰 칸 안에 테두리 버튼(브라우저 기본 글자 그대로) */
.field .file-input {
  height: 52px;
  padding: 7px 8px;
  font-size: var(--fs-small);
  color: var(--c-sub);
  cursor: pointer;
}

.file-input::file-selector-button {
  height: 36px;
  margin-right: 14px;
  padding: 0 16px;
  border: 1px solid var(--c-text);
  border-radius: 2px;
  background: transparent;
  font: inherit;
  font-weight: 700;
  color: var(--c-text);
  cursor: pointer;
  transition:
    background-color var(--t-1) var(--ease-soft),
    color var(--t-1) var(--ease-soft);
}

.file-input:hover::file-selector-button {
  background: var(--c-text);
  color: #ffffff;
}

.image-preview-wrap {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 12px;
  margin-top: 12px;
}

.image-preview {
  display: block;
  max-width: 100%;
  max-height: 300px;
  border: 1px solid var(--c-line);
  background: #ffffff;
}

/* Honeypot — 절대 보이지 않게 + 스크린리더에도 안내 */
.hp-field {
  position: absolute;
  left: -10000px;
  top: auto;
  width: 1px;
  height: 1px;
  overflow: hidden;
}

.form-error {
  margin-bottom: 16px;
  padding: 12px 14px;
  border-left: 3px solid #b3261e;
  background: rgba(179, 38, 30, 0.08);
  font-size: var(--fs-small);
  color: #b3261e;
}

.form-actions {
  display: flex;
  gap: 12px;
  margin-top: 28px;
}

.form-actions .v3-btn {
  min-width: 160px;
}

.form-actions .v3-btn:disabled,
.image-preview-wrap .v3-btn:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

.form-actions .v3-btn--line:disabled {
  pointer-events: none;
}

/* 접수 완료 */
.write-done {
  padding: 8px 0;
}

.write-done-title {
  font-size: var(--fs-item);
  font-weight: 700;
  color: var(--c-text);
}

.write-done-text {
  margin: 12px 0 28px;
  font-size: var(--fs-body);
  line-height: 1.7;
  color: var(--c-sub);
}

@media (max-width: 768px) {
  .page-body {
    padding-top: 40px;
  }

  .write-box {
    padding: 28px 20px;
  }

  .field textarea {
    height: 240px;
  }

  .form-actions {
    flex-direction: column;
  }

  .form-actions .v3-btn {
    width: 100%;
  }
}
</style>
