<template>
  <!-- 쪽 넘기기: ‹ 이전 · 번호(최대 10개) · 다음 › -->
  <nav v-if="totalPages > 1" class="adm-pager" aria-label="쪽 이동">
    <button type="button" :disabled="page <= 1" @click="go(page - 1)">‹ 이전</button>
    <button
      v-for="n in pages"
      :key="n"
      type="button"
      :class="{ 'is-current': n === page }"
      :aria-current="n === page ? 'page' : undefined"
      @click="go(n)"
    >
      {{ n }}
    </button>
    <button type="button" :disabled="page >= totalPages" @click="go(page + 1)">다음 ›</button>
  </nav>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  page: { type: Number, required: true },
  total: { type: Number, required: true },
  size: { type: Number, required: true },
})
const emit = defineEmits(['change'])

const totalPages = computed(() => Math.max(1, Math.ceil(props.total / props.size)))
const pages = computed(() => {
  const start = Math.floor((props.page - 1) / 10) * 10 + 1
  const end = Math.min(totalPages.value, start + 9)
  return Array.from({ length: end - start + 1 }, (_, i) => start + i)
})

const go = (n) => {
  if (n >= 1 && n <= totalPages.value && n !== props.page) emit('change', n)
}
</script>
