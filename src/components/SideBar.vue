<template>
  <div class="side-menu">
    <a href="http://pf.kakao.com/_FxjVuG" target='_blank' class="side-menu-item">
      <span class="side-menu-text">카카오톡</span>
      <div class="side-menu-circle">
      </div>
    </a>
    <a :href="phoneLink" target='_blank' class="side-menu-item">
      <span class="side-menu-text">전화</span>
      <div class="side-menu-circle">
      </div>
    </a>
    <a href="#" @click.prevent="goToConsultationForm" class="side-menu-item">
      <span class="side-menu-text">상담폼 연결</span>
      <div class="side-menu-circle">
      </div>
    </a>
  </div>
</template>
  
<script setup>
import { ref, onMounted, inject } from 'vue';
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();
const route = useRoute();
const phoneLink = ref('http://pf.kakao.com/_FxjVuG');

onMounted(() => {
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  if (isMobile) {
    phoneLink.value = 'tel:010-1234-1243';
  }
});

const goToConsultationForm = () => {
  if (route.path !== '/') {
    // 현재 메인 페이지가 아니면 메인 페이지('/')로 이동
    router.push('/').then(() => {
      scrollToForm();
    });
  } else {
    // 이미 메인 페이지에 있으면 바로 스크롤
    scrollToForm();
  }
};

const scrollToForm = () => {
  setTimeout(() => {
    const form = document.querySelector('.consultation-form');
    if (form) {
      form.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    }
  }, 100);
};

defineOptions({
  name: "SideBar",
});
</script>
  
<style>
.side-menu {
  position: fixed;
  right: 2.75rem;
  bottom: 2.25rem;
  z-index: 100;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 1rem;
}

.side-menu-item {
  text-decoration: none;
  color: white;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
}

.side-menu-circle {
  width: 3rem;
  height: 3rem;
  background:var(--primary-color);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border: 1px solid var(--primary-color);
}

.side-menu-icon {
  width: 1.5rem;
  height: 1.5rem;
  object-fit: contain;
}

.side-menu-text {
  background: var(--secondary-color);
  color: white;
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
  opacity: 0;
  transform: translateX(-1rem);
  transition: all 0.3s ease;
  white-space: nowrap;
  border: 1px solid var(--secondary-color);
}

.side-menu-item:hover .side-menu-text {
  opacity: 1;
  transform: translateX(0);
}

@media (max-width: 768px) {
  .side-menu {
    right: 1rem;
  }

  .side-menu-text {
    display: none;
  }
}
</style>