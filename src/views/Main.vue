<template>
  <div class="main-banner">
    <div class="banner-slider" ref="slider">
      <div class="slide" v-for="(slide, index) in slides" :key="index" :class="{ active: currentSlide === index }">
        <div class="slide-image" :style="{ backgroundImage: `url(${slide.image})` }">
          <div class="slide-content">
            <h2 class="slide-title">{{ slide.title }}</h2>
            <p class="slide-description">{{ slide.description }}</p>
            <router-link v-if="slide.link" :to="slide.link" class="slide-button">자세히 보기</router-link>
          </div>
        </div>
      </div>
    </div>
    <div class="slider-controls">
      <button class="control-button prev" @click="prevSlide">
        <span class="arrow">←</span>
      </button>
      <div class="slider-dots">
        <button v-for="(slide, idx) in slides" :key="idx" class="dot" :class="{ active: currentSlide === idx }" @click="goToSlide(idx)"></button>
      </div>
      <button class="control-button next" @click="nextSlide">
        <span class="arrow">→</span>
      </button>
    </div>
  </div>

  <Block backgroundColor="#fdfdfd">
    <div class="page-container section-container">
      <div class="services-content" ref="servicesContent">
        <h2 class="section-title">주요 서비스</h2>
        <div class="services-list">
         
        </div>
      </div>
    </div>
  </Block>

  <SideBar />
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { useRouter } from 'vue-router';
import Block from "@/components/Block.vue";
import SideBar from "@/components/SideBar.vue";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const router = useRouter();
const servicesContent = ref(null);
const isMobile = ref(false);
const slider = ref(null);
const currentSlide = ref(0);
const slideInterval = ref(null);

const checkMobile = () => {
  isMobile.value = window.innerWidth <= 768;
};

const slides = [
  {
    image: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2074&q=80',
    title: '테스트1',
    description: '테스트2',
    link: '/introduction'
  },
  {
    image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80',
    title: '테스트3',
    description: '테스트4',
    link: '/education'
  },
  {
    image: 'https://images.unsplash.com/photo-1426604966848-d7adac402bff?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    title: '테스트5',
    description: '테스트6',
    link: '/registration'
  }
];

const nextSlide = () => {
  currentSlide.value = (currentSlide.value + 1) % slides.length;
};

const prevSlide = () => {
  currentSlide.value = (currentSlide.value - 1 + slides.length) % slides.length;
};

const goToSlide = (idx) => {
  currentSlide.value = idx;
};

const startSlideInterval = () => {
  stopSlideInterval();
  slideInterval.value = setInterval(nextSlide, 4000);
};

const stopSlideInterval = () => {
  if (slideInterval.value) {
    clearInterval(slideInterval.value);
    slideInterval.value = null;
  }
};

onMounted(() => {
  try {
    startSlideInterval();
    
    // 호버 이벤트 등록
    if (slider.value) {
      slider.value.addEventListener('mouseenter', stopSlideInterval);
      slider.value.addEventListener('mouseleave', startSlideInterval);
    }
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
  } catch (error) {
    console.error('Mounting error:', error);
  }
});

onUnmounted(() => {
  try {
    stopSlideInterval();
    
    // 이벤트 리스너 제거
    if (slider.value) {
      slider.value.removeEventListener('mouseenter', stopSlideInterval);
      slider.value.removeEventListener('mouseleave', startSlideInterval);
    }
    
    window.removeEventListener('resize', checkMobile);
  } catch (error) {
    console.error('Unmounting error:', error);
  }
});
</script>

<style scoped>
.main-banner {
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
}

.banner-slider {
  width: 100%;
  height: 100%;
}

.slide {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  transition: opacity 1s ease-in-out;
}

.slide.active {
  opacity: 1;
}

.slide-image {
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  position: relative;
}

.slide-image::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
}

.slide-content {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  color: white;
  width: 90%;
  max-width: 800px;
  z-index: 1;
}

.slide-title {
  font-size: 3.5rem;
  font-weight: 700;
  margin-bottom: 20px;
  opacity: 0;
  transform: translateY(30px);
  animation: slideUp 0.8s forwards;
}

.slide.active .slide-title {
  animation: slideUp 0.8s forwards;
}

.slide-description {
  font-size: 1.5rem;
  margin-bottom: 30px;
  opacity: 0;
  transform: translateY(30px);
  animation: slideUp 0.8s 0.2s forwards;
}

.slide.active .slide-description {
  animation: slideUp 0.8s 0.2s forwards;
}

.slider-controls {
  position: absolute;
  bottom: 40px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 20px;
  z-index: 2;
}

.control-button {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.control-button:hover {
  background: rgba(255, 255, 255, 0.3);
}

.arrow {
  color: white;
  font-size: 1.5rem;
}

@keyframes slideUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 768px) {
  .slide-title {
    font-size: 2.5rem;
  }

  .slide-description {
    font-size: 1.2rem;
  }

  .control-button {
    width: 40px;
    height: 40px;
  }

  .arrow {
    font-size: 1.2rem;
  }
  
  .slide-button {
    padding: 12px 30px;
    font-size: 1rem;
  }
}

.slider-dots {
  display: flex;
  gap: 10px;
}
.dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.3);
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
}
.dot.active {
  background: white;
  transform: scale(1.2);
}
.slide-button {
  display: inline-block;
  padding: 15px 40px;
  background-color: var(--primary-color, #0056b3);
  color: white;
  text-decoration: none;
  border-radius: 5px;
  font-size: 1.2rem;
  font-weight: 500;
  transition: all 0.3s ease;
  margin-top: 20px;
}
.slide-button:hover {
  background-color: #003e80;
  transform: translateY(-2px);
}
</style>