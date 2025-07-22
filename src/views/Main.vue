<template>
  <div class="main-banner">
    <div class="banner-slider" ref="slider">
      <div
        class="slide"
        v-for="(slide, index) in slides"
        :key="index"
        :class="{ active: currentSlide === index }"
      >
        <div
          class="slide-image"
          :style="{ backgroundImage: `url(${slide.image})` }"
        >
          <!-- 슬라이드 콘텐츠 제거 -->
        </div>
      </div>
    </div>
    <div class="slider-controls">
      <button class="control-button prev" @click="prevSlide">
        <span class="arrow">←</span>
      </button>
      <div class="slider-dots">
        <button
          v-for="(slide, idx) in slides"
          :key="idx"
          class="dot"
          :class="{ active: currentSlide === idx }"
          @click="goToSlide(idx)"
        ></button>
      </div>
      <button class="control-button next" @click="nextSlide">
        <span class="arrow">→</span>
      </button>
    </div>
  </div>

  <Block backgroundColor="#fdfdfd">
    <div class="page-container section-container">
      <div class="services-content" ref="servicesContent">
        <h2 class="section-title">수강신청문의</h2>
        <p class="required-notice">*표시는 필수 입력요소입니다</p>

        <!-- 성공 메시지 -->
        <div v-if="showSuccessMessage" class="success-message">
          <p>수강신청문의가 완료되었습니다. 빠른 시일 내에 연락드리겠습니다.</p>
        </div>

        <!-- 에러 메시지 -->
        <div v-if="errorMessage" class="error-message">
          <p>{{ errorMessage }}</p>
        </div>

        <div class="registration-form">
          <form @submit.prevent="submitRegistration">
            <div class="form-group">
              <label for="name">성함 <span class="required">*</span></label>
              <input
                type="text"
                id="name"
                v-model="formData.name"
                required
                placeholder="홍길동"
                :disabled="isLoading"
              />
            </div>

            <div class="form-group">
              <label for="phone">연락처 <span class="required">*</span></label>
              <input
                type="tel"
                id="phone"
                v-model="formData.phone"
                required
                placeholder="010-0000-0000"
                :disabled="isLoading"
              />
            </div>

            <div class="form-group">
              <label for="location"
                >거주지역 <span class="required">*</span></label
              >
              <input
                type="text"
                id="location"
                v-model="formData.location"
                required
                placeholder="서울시 강남구"
                :disabled="isLoading"
              />
            </div>

            <div class="form-group checkbox-group">
              <label>
                <input
                  type="checkbox"
                  v-model="formData.agreeTerms"
                  required
                  :disabled="isLoading"
                />
                개인정보 수집 및 이용에 동의합니다.
              </label>
            </div>

            <button
              type="submit"
              class="submit-btn"
              :disabled="!isFormValid || isLoading"
            >
              <span v-if="isLoading">처리 중...</span>
              <span v-else>신청하기</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  </Block>

  <!-- <SideBar /> -->
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from "vue";
import { useRouter } from "vue-router";
import Block from "@/components/Block.vue";
// import SideBar from "@/components/SideBar.vue";
import { jinjungsungService } from "@/services/jinjungsungService.js";
import { useSEO } from "@/composables/useSEO.js";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// 이미지 import
import mainFirstImage from "@/assets/images/main-first.png";
import mainSecondImage from "@/assets/images/main-second.png";
import mainThirdImage from "@/assets/images/main-third.png";
import mainFirstMobileImage from "@/assets/images/main-first-mobile.png";
import mainSecondMobileImage from "@/assets/images/main-second-mobile.png";
import mainThirdMobileImage from "@/assets/images/main-third-mobile.png";

gsap.registerPlugin(ScrollTrigger);

// SEO 설정
useSEO({
  path: "/",
});

const router = useRouter();
const servicesContent = ref(null);
const isMobile = ref(false);
const slider = ref(null);
const currentSlide = ref(0);
const slideInterval = ref(null);

// 상태 관리
const isLoading = ref(false);
const showSuccessMessage = ref(false);
const errorMessage = ref("");

// 폼 데이터
const formData = ref({
  name: "",
  phone: "",
  location: "",
  message: "",
  agreeTerms: false,
});

// 폼 유효성 검사
const isFormValid = computed(() => {
  return (
    formData.value.name &&
    formData.value.phone &&
    formData.value.location &&
    formData.value.agreeTerms
  );
});

const checkMobile = () => {
  isMobile.value = window.innerWidth <= 1200;
};

const slides = computed(() => [
  {
    image: isMobile.value ? mainFirstMobileImage : mainFirstImage,
    link: "/introduction",
  },
  {
    image: isMobile.value ? mainSecondMobileImage : mainSecondImage,
    link: "/education",
  },
  {
    image: isMobile.value ? mainThirdMobileImage : mainThirdImage,
    link: "/registration",
  },
]);

const nextSlide = () => {
  currentSlide.value = (currentSlide.value + 1) % slides.value.length;
};

const prevSlide = () => {
  currentSlide.value =
    (currentSlide.value - 1 + slides.value.length) % slides.value.length;
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

// 메시지 초기화
const clearMessages = () => {
  showSuccessMessage.value = false;
  errorMessage.value = "";
};

// 폼 제출 메서드
const submitRegistration = async () => {
  if (!isFormValid.value || isLoading.value) return;

  isLoading.value = true;
  clearMessages();

  try {
    const registrationData = {
      name: formData.value.name,
      phone: formData.value.phone,
      location: formData.value.location,
      message: formData.value.message || "",
    };

    await jinjungsungService.submitCourseRegistration(registrationData);

    showSuccessMessage.value = true;
    resetForm();

    // 5초 후 성공 메시지 숨기기
    setTimeout(() => {
      showSuccessMessage.value = false;
    }, 5000);
  } catch (error) {
    errorMessage.value = error.message;

    // 5초 후 에러 메시지 숨기기
    setTimeout(() => {
      errorMessage.value = "";
    }, 5000);
  } finally {
    isLoading.value = false;
  }
};

const resetForm = () => {
  formData.value = {
    name: "",
    phone: "",
    location: "",
    agreeTerms: false,
  };
};

onMounted(() => {
  try {
    startSlideInterval();

    // 호버 이벤트 등록
    if (slider.value) {
      slider.value.addEventListener("mouseenter", stopSlideInterval);
      slider.value.addEventListener("mouseleave", startSlideInterval);
    }

    checkMobile();
    window.addEventListener("resize", checkMobile);
  } catch (error) {
    console.error("Mounting error:", error);
  }
});

onUnmounted(() => {
  try {
    stopSlideInterval();

    // 이벤트 리스너 제거
    if (slider.value) {
      slider.value.removeEventListener("mouseenter", stopSlideInterval);
      slider.value.removeEventListener("mouseleave", startSlideInterval);
    }

    window.removeEventListener("resize", checkMobile);
  } catch (error) {
    console.error("Unmounting error:", error);
  }
});
</script>

<style scoped>
.main-banner {
  position: relative;
  width: 100%;
  height: 78vh;
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
  visibility: hidden;
  transition: opacity 0.3s ease-in-out, visibility 0.3s ease-in-out;
}

.slide.active {
  opacity: 1;
  visibility: visible;
}

.slide-image {
  width: 100%;
  height: 100%;
  margin-top: -20px;
  background-size: cover;
  background-position: center;
  position: relative;
}

.slide-image::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  /* background: rgba(0, 0, 0, 0.4); */
}

.slide-content {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  width: 100%;
  max-width: 800px;
  z-index: 1;
}

.slide-title {
  font-size: 2.5rem;
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

.services-content {
  min-width: 600px;
}

.section-title {
  text-align: center;
  font-size: 1.75rem;
  font-weight: 700;
  margin-bottom: 25px;
}

.required-notice {
  text-align: right;
  color: #666;
  font-size: 0.9rem;
  margin-bottom: 30px;
  margin-right: 10px;
}

.required {
  color: #e74c3c;
  font-weight: bold;
}

/* 메시지 스타일 */
.success-message,
.error-message {
  max-width: 1200px;
  margin: 0 auto 30px auto;
  padding: 15px 20px;
  text-align: center;
  font-weight: 500;
  border: 1px solid;
}

.success-message {
  background-color: #d4edda;
  color: #155724;
  border-color: #c3e6cb;
}

.error-message {
  background-color: #f8d7da;
  color: #721c24;
  border-color: #f5c6cb;
}

@keyframes slideUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 1200px) {
  .services-content {
    min-width: auto;
    padding: 0 20px;
  }

  .section-title {
    font-size: 1.6rem;
    margin-bottom: 20px;
  }

  .required-notice {
    font-size: 0.85rem;
    margin-bottom: 25px;
    margin-right: 5px;
  }

  .registration-form {
    padding: 0 10px;
    max-width: 100%;
  }

  .form-group {
    margin-bottom: 20px;
  }

  .form-group label {
    font-size: 1rem;
    margin-bottom: 8px;
  }

  .form-group input,
  .form-group textarea {
    font-size: 16px;
    padding: 12px 15px;
    min-height: 42px;
    border-radius: 8px;
  }

  .checkbox-group {
    flex-direction: column;
    align-items: flex-start;
    padding: 15px;
    background-color: #f8f9fa;
    border-radius: 8px;
    margin-bottom: 25px;
  }

  .checkbox-group label {
    font-size: 1rem;
    line-height: 1.4;
  }

  .checkbox-group input[type="checkbox"] {
    transform: scale(1.2);
    margin-right: 10px;
    margin-bottom: 5px;
  }

  .submit-btn {
    font-size: 1.2rem;
    padding: 12px;
    min-height: 42px;
    margin-top: 10px;
  }

  .success-message,
  .error-message {
    margin: 0 auto 25px auto;
    padding: 12px 15px;
    font-size: 0.95rem;
    border-radius: 8px;
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

  .services-content {
    min-width: auto;
    padding: 0 15px;
  }

  .section-title {
    font-size: 1.5rem;
    margin-bottom: 15px;
  }

  .required-notice {
    font-size: 0.8rem;
    margin-bottom: 20px;
    text-align: center;
  }

  .registration-form {
    padding: 0;
  }

  .form-group {
    margin-bottom: 18px;
  }

  .form-group label {
    font-size: 0.95rem;
    margin-bottom: 6px;
  }

  .form-group input,
  .form-group textarea {
    font-size: 16px; /* iOS 줌 방지 */
    padding: 10px 12px;
    min-height: 38px;
    border-radius: 6px;
  }

  .checkbox-group {
    flex-direction: column;
    align-items: flex-start;
    padding: 12px;
    margin-bottom: 20px;
  }

  .checkbox-group label {
    font-size: 0.9rem;
    line-height: 1.3;
  }

  .checkbox-group input[type="checkbox"] {
    transform: scale(1.1);
    margin-right: 8px;
    margin-bottom: 3px;
  }

  .submit-btn {
    font-size: 1rem;
    padding: 10px;
    max-width: 100%;
    min-height: 30px;
    border-radius: 6px;
  }

  .success-message,
  .error-message {
    margin: 0 auto 20px auto;
    padding: 10px 12px;
    font-size: 0.9rem;
    border-radius: 6px;
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
  font-size: 1.2rem;
  font-weight: 500;
  transition: all 0.3s ease;
  margin-top: 20px;
}
.slide-button:hover {
  transform: translateY(-2px);
}

.registration-form {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 15px;
}

.form-group {
  margin-bottom: 25px;
}

.form-group label {
  display: block;
  margin-bottom: 10px;
  color: #333;
  font-weight: 500;
  font-size: 1.1rem;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 12px 15px;
  border: 2px solid #ddd;
  font-size: 16px; /* iOS 줌 방지 */
  box-sizing: border-box;
  transition: border-color 0.3s ease;
  min-height: 45px;
}

.form-group textarea {
  min-height: 80px;
  resize: vertical;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: var(--primary-color);
}

.checkbox-group {
  display: flex;
  align-items: center;
  margin-bottom: 30px;
  justify-content: center;
}

.checkbox-group label {
  display: flex;
  align-items: center;
  margin: 0;
  cursor: pointer;
  font-size: 1.1rem;
}

.checkbox-group input[type="checkbox"] {
  width: auto;
  margin-right: 12px;
  transform: scale(1.3);
  min-height: auto;
}

.submit-btn {
  width: 100%;
  max-width: 500px;
  margin: 0 auto;
  display: block;
  padding: 14px;
  background-color: var(--primary-color);
  color: white;
  border: none;
  font-size: 1.25rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  min-height: 50px;
}

.submit-btn:hover:not(:disabled) {
  transform: translateY(-2px);
}

.submit-btn:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}
</style>