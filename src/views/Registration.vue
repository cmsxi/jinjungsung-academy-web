<template>
  <div class="registration-page">
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
                >
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
                >
              </div>

              <div class="form-group">
                <label for="location">거주지역 <span class="required">*</span></label>
                <input 
                  type="text" 
                  id="location" 
                  v-model="formData.location" 
                  required
                  placeholder="서울시 강남구"
                  :disabled="isLoading"
                >
              </div>

              <div class="form-group">
                <label for="message">문의사항</label>
                <textarea 
                  id="message" 
                  v-model="formData.message" 
                  rows="4"
                  placeholder="수강 관련 문의사항을 입력해주세요."
                  :disabled="isLoading"
                ></textarea>
              </div>

              <div class="form-group checkbox-group">
                <label>
                  <input 
                    type="checkbox" 
                    v-model="formData.agreeTerms"
                    required
                    :disabled="isLoading"
                  >
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
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import Block from "@/components/Block.vue";
import { jinjungsungService } from '@/services/jinjungsungService.js';

// 상태 관리
const isLoading = ref(false);
const showSuccessMessage = ref(false);
const errorMessage = ref('');

// 폼 데이터
const formData = ref({
  name: '',
  phone: '',
  location: '',
  message: '',
  agreeTerms: false
});

// 폼 유효성 검사
const isFormValid = computed(() => {
  return formData.value.name && 
         formData.value.phone && 
         formData.value.location &&
         formData.value.agreeTerms;
});

// 메시지 초기화
const clearMessages = () => {
  showSuccessMessage.value = false;
  errorMessage.value = '';
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
      message: formData.value.message || ''
    };

    await jinjungsungService.submitCourseRegistration(registrationData);
    
    showSuccessMessage.value = true;
    resetForm();
    
    // 3초 후 성공 메시지 숨기기
    setTimeout(() => {
      showSuccessMessage.value = false;
    }, 5000);

  } catch (error) {
    errorMessage.value = error.message;
    
    // 5초 후 에러 메시지 숨기기
    setTimeout(() => {
      errorMessage.value = '';
    }, 5000);
  } finally {
    isLoading.value = false;
  }
};

const resetForm = () => {
  formData.value = {
    name: '',
    phone: '',
    location: '',
    message: '',
    agreeTerms: false
  };
};
</script>

<style scoped>
.registration-page {
  min-height: 100vh;
}

.page-header {
  background-color: var(--primary-color);
  color: white;
  padding: 60px 0;
  text-align: center;
}

.page-header h1 {
  font-size: 2.5rem;
  font-weight: 700;
  margin: 0;
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
  border-radius: 8px;
  text-align: center;
  font-weight: 500;
}

.success-message {
  background-color: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}

.error-message {
  background-color: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
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
  padding: 20px 15px;
  border: 2px solid #ddd;
  font-size: 16px; /* iOS 줌 방지 */
  box-sizing: border-box;
  transition: border-color 0.3s ease;
  min-height: 55px;
}

.form-group input:disabled,
.form-group textarea:disabled {
  background-color: #f5f5f5;
  cursor: not-allowed;
}

.form-group textarea {
  min-height: 100px;
  resize: none;
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

.checkbox-group input[type="checkbox"]:disabled {
  cursor: not-allowed;
}

.submit-btn {
  width: 100%;
  max-width: 500px;
  margin: 0 auto;
  display: block;
  padding: 20px;
  background-color: var(--primary-color);
  color: white;
  border: none;
  font-size: 1.4rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  min-height: 60px;
}

.submit-btn:hover:not(:disabled) {
  background-color: #003e80;
  transform: translateY(-2px);
}

.submit-btn:disabled {
  background-color: #ccc;
  cursor: not-allowed;
  transform: none;
}

@media (max-width: 768px) {
  .page-header {
    padding: 40px 0;
  }

  .page-header h1 {
    font-size: 2rem;
  }

  .registration-form {
    padding: 0 15px;
  }

  .form-group input,
  .form-group textarea {
    font-size: 16px; /* iOS 줌 방지 */
    padding: 20px 15px;
    min-height: 55px;
  }

  .form-group label {
    font-size: 1.1rem;
    margin-bottom: 10px;
  }

  .checkbox-group label {
    font-size: 1.1rem;
  }

  .checkbox-group input[type="checkbox"] {
    transform: scale(1.3);
    margin-right: 12px;
  }

  .submit-btn {
    font-size: 1.2rem;
    padding: 20px;
    max-width: 100%;
    min-height: 60px;
  }

  .success-message,
  .error-message {
    margin: 0 15px 30px 15px;
    padding: 15px;
  }
}
</style> 