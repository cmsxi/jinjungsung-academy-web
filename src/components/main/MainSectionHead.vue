<template>
  <div class="section-head">
    <p class="section-eyebrow">{{ eyebrow }}</p>
    <h2 class="section-heading">{{ title }}</h2>
    <p v-if="desc" class="section-desc">{{ desc }}</p>
  </div>
</template>

<script setup>
defineProps({
  eyebrow: { type: String, required: true },
  title: { type: String, required: true },
  desc: { type: String, default: '' },
})
</script>

<style scoped>
.section-head {
  text-align: center;
  margin-bottom: 48px;
}

.section-eyebrow {
  font-size: 1rem;
  font-weight: 600;
  color: var(--primary-color);
  margin-bottom: 8px;
}

.section-heading {
  font-size: 1.9rem;
  font-weight: 700;
  color: #111;
}

.section-desc {
  margin-top: 12px;
  font-size: 1.05rem;
  color: #666;
  word-break: keep-all;
}

@media (max-width: 768px) {
  .section-head {
    margin-bottom: 32px;
  }

  .section-heading {
    font-size: 1.5rem;
  }

  .section-desc {
    font-size: 0.95rem;
  }
}
</style>
