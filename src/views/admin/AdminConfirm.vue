<template>
  <!-- 삭제 등 되돌릴 수 없는 작업 확인 창 -->
  <div v-if="open" class="adm-modal-backdrop" @click.self="!busy && emit('cancel')">
    <div class="adm-modal" role="dialog" aria-modal="true" :aria-labelledby="titleId">
      <h2 :id="titleId">{{ title }}</h2>
      <p>{{ message }}</p>
      <div class="adm-modal-actions">
        <button type="button" class="adm-btn" :disabled="busy" @click="emit('cancel')">취소</button>
        <button ref="confirmBtn" type="button" class="adm-btn adm-btn--primary" :disabled="busy" @click="emit('confirm')">
          {{ busy ? '처리 중…' : confirmLabel }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, nextTick, onBeforeUnmount } from 'vue'

const props = defineProps({
  open: { type: Boolean, default: false },
  title: { type: String, default: '삭제할까요?' },
  message: { type: String, default: '' },
  confirmLabel: { type: String, default: '삭제' },
  busy: { type: Boolean, default: false },
})
const emit = defineEmits(['confirm', 'cancel'])

const titleId = `adm-confirm-${Math.random().toString(36).slice(2, 8)}`
const confirmBtn = ref(null)

const onKey = (event) => {
  if (event.key === 'Escape' && !props.busy) emit('cancel')
}

watch(
  () => props.open,
  async (open) => {
    if (open) {
      window.addEventListener('keydown', onKey)
      await nextTick()
      confirmBtn.value?.focus()
    } else {
      window.removeEventListener('keydown', onKey)
    }
  },
)

onBeforeUnmount(() => window.removeEventListener('keydown', onKey))
</script>
