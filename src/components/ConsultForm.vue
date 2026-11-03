<template>
  <form class="consult-form" novalidate @submit.prevent="submit">
    <div class="field">
      <label for="consult-name">성함 <span class="req" aria-hidden="true">*</span></label>
      <input
        id="consult-name"
        v-model.trim="form.name"
        type="text"
        autocomplete="name"
        placeholder="홍길동"
        required
        :disabled="isLoading"
      />
    </div>

    <div class="field">
      <label for="consult-phone">연락처 <span class="req" aria-hidden="true">*</span></label>
      <input
        id="consult-phone"
        :value="form.phone"
        type="tel"
        inputmode="numeric"
        autocomplete="tel"
        placeholder="010-0000-0000"
        required
        :disabled="isLoading"
        @input="handlePhoneInput"
      />
    </div>

    <div class="field">
      <label for="consult-location">거주지역 <span class="req" aria-hidden="true">*</span></label>
      <input
        id="consult-location"
        v-model.trim="form.location"
        type="text"
        autocomplete="address-level2"
        placeholder="서울시 강남구"
        required
        :disabled="isLoading"
      />
    </div>

    <fieldset class="field">
      <legend>관심 과정 <span class="optional">(선택)</span></legend>
      <div class="chip-group">
        <label v-for="option in INTEREST_OPTIONS" :key="option" class="chip">
          <input
            v-model="form.interest"
            type="radio"
            name="consult-interest"
            :value="option"
            :disabled="isLoading"
          />
          <span>{{ option }}</span>
        </label>
      </div>
    </fieldset>

    <label class="agree">
      <input v-model="form.agreeTerms" type="checkbox" required :disabled="isLoading" />
      <span>개인정보 수집 및 이용에 동의합니다. <span class="req">(필수)</span></span>
    </label>

    <button type="submit" class="ui-btn ui-btn--primary ui-btn--lg ui-btn--block" :disabled="!isValid || isLoading">
      {{ isLoading ? '처리 중...' : '상담 신청하기' }}
    </button>

    <p v-if="status === 'success'" class="form-message form-message--success" role="status">
      상담 신청이 접수되었습니다. 빠른 시일 내에 연락드리겠습니다.
    </p>
    <p v-else-if="status === 'error'" class="form-message form-message--error" role="alert">
      {{ errorMessage }}
    </p>
  </form>
</template>

<script setup>
import { ref, computed, onBeforeUnmount } from 'vue'
import { jinjungsungService } from '@/services/jinjungsungService.js'
import { formatPhoneNumber } from '@/utils/phone.js'

const INTEREST_OPTIONS = Object.freeze(['전당포 창업', '명품창업(명품감정)', '상담 후 결정'])
const MESSAGE_HIDE_DELAY_MS = 5000
const MIN_PHONE_DIGITS = 9

const createEmptyForm = () => ({
  name: '',
  phone: '',
  location: '',
  interest: '',
  agreeTerms: false,
})

const form = ref(createEmptyForm())
const isLoading = ref(false)
const status = ref('idle') // 'idle' | 'success' | 'error'
const errorMessage = ref('')
let hideTimer = null

const isValid = computed(() => {
  const { name, phone, location, agreeTerms } = form.value
  return Boolean(name && location && agreeTerms && phone.replace(/\D/g, '').length >= MIN_PHONE_DIGITS)
})

const handlePhoneInput = (event) => {
  const formatted = formatPhoneNumber(event.target.value)
  form.value = { ...form.value, phone: formatted }
  event.target.value = formatted
}

const showStatus = (nextStatus) => {
  status.value = nextStatus
  clearTimeout(hideTimer)
  hideTimer = setTimeout(() => {
    status.value = 'idle'
  }, MESSAGE_HIDE_DELAY_MS)
}

const submit = async () => {
  if (!isValid.value || isLoading.value) return

  isLoading.value = true
  status.value = 'idle'

  const { name, phone, location, interest } = form.value
  try {
    await jinjungsungService.submitCourseRegistration({
      name,
      phone,
      location,
      message: interest ? `관심 과정: ${interest}` : '',
    })
    form.value = createEmptyForm()
    showStatus('success')
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : '상담 신청 처리 중 오류가 발생했습니다.'
    showStatus('error')
  } finally {
    isLoading.value = false
  }
}

onBeforeUnmount(() => clearTimeout(hideTimer))
</script>

<style scoped>
.consult-form {
  display: grid;
  gap: 18px;
}

.field {
  display: grid;
  gap: 8px;
  border: none;
  margin: 0;
  padding: 0;
  min-width: 0;
}

.field label,
.field legend {
  font-size: 0.9375rem;
  font-weight: 600;
  color: var(--ink-800);
  padding: 0;
}

.field legend {
  margin-bottom: 8px;
}

.req {
  color: #c0392b;
}

.optional {
  font-weight: 400;
  color: var(--ink-400);
}

.field input[type="text"],
.field input[type="tel"] {
  height: 52px;
  padding: 0 16px;
  border: 1px solid var(--line-strong);
  border-radius: var(--radius-sm);
  background-color: var(--surface);
  font-size: 16px; /* iOS 확대 방지 */
  color: var(--ink-900);
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.field input::placeholder {
  color: var(--ink-400);
}

.field input:focus {
  outline: none;
  border-color: var(--gold-700);
  box-shadow: 0 0 0 3px rgba(130, 96, 31, 0.12);
}

.field input:disabled {
  background-color: var(--surface-warm);
}

.chip-group {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.chip {
  position: relative;
  cursor: pointer;
}

.chip input {
  position: absolute;
  opacity: 0;
  inset: 0;
  cursor: pointer;
}

.chip span {
  display: inline-flex;
  align-items: center;
  height: 40px;
  padding: 0 16px;
  border: 1px solid var(--line-strong);
  border-radius: 999px;
  font-size: 0.9375rem;
  color: var(--ink-700);
  background-color: var(--surface);
  transition: all 0.2s ease;
}

.chip input:checked + span {
  border-color: var(--gold-700);
  background-color: var(--gold-100);
  color: var(--gold-700);
  font-weight: 600;
}

.chip input:focus-visible + span {
  outline: 2px solid var(--gold-600);
  outline-offset: 2px;
}

.agree {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 14px 16px;
  border-radius: var(--radius-sm);
  background-color: var(--surface-warm);
  font-size: 0.9375rem;
  color: var(--ink-700);
  cursor: pointer;
  line-height: 1.5;
}

.agree input {
  width: 18px;
  height: 18px;
  margin-top: 2px;
  accent-color: var(--gold-700);
  flex-shrink: 0;
}

.consult-form .ui-btn:disabled {
  background-color: var(--line-strong);
  color: #fff;
  cursor: not-allowed;
}

.form-message {
  padding: 14px 16px;
  border-radius: var(--radius-sm);
  font-size: 0.9375rem;
  line-height: 1.5;
}

.form-message--success {
  background-color: #eef6ef;
  color: #1e5b2c;
}

.form-message--error {
  background-color: #fbeeee;
  color: #8a1f1f;
}
</style>
