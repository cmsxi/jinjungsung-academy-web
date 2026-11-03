<template>
  <div class="more">
    <router-link :to="to" class="more-link">{{ label }} →</router-link>
  </div>
</template>

<script setup>
defineProps({
  to: { type: [String, Object], required: true },
  label: { type: String, required: true },
})
</script>

<style scoped>
.more {
  margin-top: 36px;
  text-align: center;
}

.more-link {
  display: inline-block;
  padding: 13px 40px;
  border: 1px solid var(--secondary-color);
  color: var(--secondary-color);
  font-weight: 600;
  transition: background-color 0.2s ease, color 0.2s ease;
}

.more-link:hover {
  background: var(--secondary-color);
  color: #fff;
}
</style>
