<template>
  <!-- 모바일 화면 아래 고정 '수강신청 문의' 버튼 (리드 유도). 첫 화면을 지나면 나타나고, 문의 폼·푸터가 보이면 숨는다 -->
  <div class="mcta" :class="{ 'is-on': visible }" aria-hidden="false">
    <a href="#inquiry" class="v3-btn mcta-btn" :tabindex="visible ? 0 : -1" @click.prevent="toInquiry">수강신청문의</a>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

const visible = ref(false)
const blockers = new Set()
let observer = null
let pastHero = false

const update = () => {
  visible.value = pastHero && blockers.size === 0
}

const onScroll = () => {
  pastHero = window.scrollY > window.innerHeight * 0.6
  update()
}

const toInquiry = () => {
  document.getElementById('inquiry')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true })
  onScroll()
  if ('IntersectionObserver' in window) {
    observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) blockers.add(entry.target)
        else blockers.delete(entry.target)
      })
      update()
    })
    // 문의 폼 영역과 푸터가 화면에 들어오면 버튼을 숨긴다
    requestAnimationFrame(() => {
      ;[document.getElementById('inquiry'), document.querySelector('footer')].forEach((el) => {
        if (el) observer.observe(el)
      })
    })
  }
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll)
  if (observer) observer.disconnect()
})
</script>

<style scoped>
.mcta {
  display: none;
}

@media (max-width: 768px) {
  .mcta {
    display: block;
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 900;
    padding: 10px 16px calc(10px + env(safe-area-inset-bottom));
    background: var(--c-bg);
    border-top: 1px solid var(--c-line);
    transform: translateY(110%);
    transition: transform 0.6s var(--ease-soft);
  }

  .mcta.is-on {
    transform: none;
  }

  .mcta-btn {
    width: 100%;
    height: 52px;
  }
}
</style>
