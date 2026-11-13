<template>
  <!-- 3차 시안 문의 폼 — 색은 색 구성(--c-*)을 따른다 -->
  <div class="inquiry-form">
    <div v-if="isDone" class="form-done" role="status">
      <p class="form-done-title">수강신청문의가 접수되었습니다.</p>
      <p class="form-done-text">남겨 주신 연락처로 담당자가 빠른 시일 내에 연락드리겠습니다.</p>
      <button type="button" class="v3-btn" @click="isDone = false">새 문의 작성</button>
    </div>

    <form v-else novalidate @submit.prevent="submit">
      <div class="field-row">
        <div class="field">
          <label :for="`${idPrefix}-name`">성함 <span class="req">*</span></label>
          <input
            :id="`${idPrefix}-name`"
            v-model.trim="form.name"
            type="text"
            maxlength="50"
            autocomplete="name"
            placeholder="홍길동"
            required
            :disabled="isSending"
          />
        </div>
        <div class="field">
          <label :for="`${idPrefix}-phone`">연락처 <span class="req">*</span></label>
          <input
            :id="`${idPrefix}-phone`"
            v-model="form.phone"
            type="tel"
            inputmode="numeric"
            maxlength="13"
            autocomplete="tel"
            placeholder="010-0000-0000"
            required
            :disabled="isSending"
            @input="formatPhone"
          />
        </div>
      </div>

      <div class="field-row">
        <div class="field">
          <label :for="`${idPrefix}-location`">거주지역 <span class="req">*</span></label>
          <input
            :id="`${idPrefix}-location`"
            v-model.trim="form.location"
            type="text"
            maxlength="100"
            placeholder="예: 서울시 강남구"
            required
            :disabled="isSending"
          />
        </div>
        <div class="field">
          <label :for="`${idPrefix}-referral`">알게 된 경로</label>
          <select :id="`${idPrefix}-referral`" v-model="form.referral" :disabled="isSending">
            <option value="">선택해 주세요</option>
            <option v-for="option in REFERRAL_OPTIONS" :key="option" :value="option">{{ option }}</option>
          </select>
        </div>
      </div>

      <div class="field">
        <label :for="`${idPrefix}-message`">문의 내용</label>
        <textarea
          :id="`${idPrefix}-message`"
          v-model="form.message"
          rows="4"
          maxlength="1000"
          placeholder="관심 있는 과정이나 궁금하신 점을 자유롭게 적어 주세요."
          :disabled="isSending"
        ></textarea>
      </div>

      <label class="agree">
        <input v-model="form.agree" type="checkbox" :disabled="isSending" />
        <span>개인정보 수집 및 이용에 동의합니다. <span class="req">(필수)</span></span>
      </label>

      <p v-if="errorMessage" class="form-error" role="alert">{{ errorMessage }}</p>

      <button type="submit" class="v3-btn submit" :disabled="isSending">
        {{ isSending ? '접수 중입니다…' : '문의 접수하기' }}
      </button>
      <p class="form-note"><span class="req">*</span> 표시는 필수 입력 항목입니다.</p>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { jinjungsungService } from '@/services/jinjungsungService.js'

defineProps({
  idPrefix: { type: String, default: 'v3-inquiry' },
})

const REFERRAL_OPTIONS = ['네이버 검색', '네이버 블로그·카페', '유튜브', '인스타그램', '지인 소개', '기타']

const emptyForm = () => ({ name: '', phone: '', location: '', referral: '', message: '', agree: false })

const form = ref(emptyForm())
const isSending = ref(false)
const isDone = ref(false)
const errorMessage = ref('')

const formatPhone = () => {
  let digits = form.value.phone.replace(/[^\d]/g, '')
  if (digits.startsWith('02')) {
    digits = digits.slice(0, 10)
    if (digits.length <= 2) form.value.phone = digits
    else if (digits.length <= 6) form.value.phone = `${digits.slice(0, 2)}-${digits.slice(2)}`
    else {
      const mid = digits.length === 10 ? 6 : 5
      form.value.phone = `${digits.slice(0, 2)}-${digits.slice(2, mid)}-${digits.slice(mid)}`
    }
  } else {
    digits = digits.slice(0, 11)
    if (digits.length <= 3) form.value.phone = digits
    else if (digits.length <= 7) form.value.phone = `${digits.slice(0, 3)}-${digits.slice(3)}`
    else form.value.phone = `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`
  }
}

const validate = () => {
  const { name, phone, location, agree } = form.value
  if (!name) return '성함을 입력해 주세요.'
  if (phone.replace(/[^\d]/g, '').length < 9) return '연락처를 정확히 입력해 주세요.'
  if (!location) return '거주지역을 입력해 주세요.'
  if (!agree) return '개인정보 수집 및 이용에 동의해 주세요.'
  return ''
}

const submit = async () => {
  if (isSending.value) return
  errorMessage.value = validate()
  if (errorMessage.value) return

  isSending.value = true
  try {
    await jinjungsungService.submitCourseRegistration({
      name: form.value.name,
      phone: form.value.phone,
      location: form.value.location,
      message: form.value.message.trim(),
      referral: form.value.referral,
    })
    form.value = emptyForm()
    isDone.value = true
  } catch (error) {
    errorMessage.value = error.message || '접수 중 문제가 생겼습니다. 잠시 후 다시 시도해 주세요.'
  } finally {
    isSending.value = false
  }
}
</script>

<style scoped>
.field-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

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
.field select,
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

/* 11/13 "문의 내용 칸 세로 크기 고정" — 늘이기 손잡이 없이, 길어지면 칸 안에서 스크롤 */
.field textarea {
  height: 140px;
  padding: 13px 14px;
  line-height: 1.6;
  resize: none;
  overflow-y: auto;
}

.field select {
  appearance: none;
  padding-right: 40px;
  background-image: linear-gradient(45deg, transparent 50%, currentColor 50%),
    linear-gradient(135deg, currentColor 50%, transparent 50%);
  background-position: calc(100% - 20px) 50%, calc(100% - 15px) 50%;
  background-size: 5px 5px, 5px 5px;
  background-repeat: no-repeat;
}

.field input::placeholder,
.field textarea::placeholder {
  color: var(--c-faint);
}

.field input:focus,
.field select:focus,
.field textarea:focus {
  outline: none;
  border-color: var(--c-text);
}

.agree {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  margin: 4px 0 22px;
  font-size: var(--fs-small);
  line-height: 1.5;
  color: var(--c-text);
  cursor: pointer;
}

.agree input {
  flex-shrink: 0;
  width: 18px;
  height: 18px;
  margin-top: 1px;
  accent-color: var(--c-text);
}

.form-error {
  margin-bottom: 16px;
  padding: 12px 14px;
  border-left: 3px solid #b3261e;
  background: rgba(179, 38, 30, 0.08);
  font-size: var(--fs-small);
  color: #b3261e;
}

.submit {
  width: 100%;
  height: 58px;
  font-size: var(--fs-body);
}

.submit:disabled {
  opacity: 0.55;
  cursor: wait;
}

.form-note {
  margin-top: 14px;
  font-size: var(--fs-small);
  color: var(--c-sub);
}

.form-done {
  padding: 32px 0;
}

.form-done-title {
  font-size: var(--fs-item);
  font-weight: 700;
  color: var(--c-text);
}

.form-done-text {
  margin: 12px 0 28px;
  font-size: var(--fs-body);
  line-height: 1.7;
  color: var(--c-sub);
}

@media (max-width: 560px) {
  .field-row {
    grid-template-columns: 1fr;
    gap: 0;
  }
}
</style>
