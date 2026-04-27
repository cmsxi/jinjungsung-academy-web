<template>
  <div class="review-write-page">
    <div class="review-write-content">
      <div class="write-header">
        <button @click="goBack" class="back-btn">← 목록으로 돌아가기</button>
        <h2>수강후기 작성</h2>
      </div>

      <div class="info-banner">
        <p>📝 작성하신 후기는 관리자 검토 후 게시됩니다.</p>
      </div>

      <div v-if="errorMessage" class="error-message">
        <p>❌ {{ errorMessage }}</p>
      </div>

      <div v-if="successMessage" class="success-message">
        <p>✅ {{ successMessage }}</p>
      </div>

      <div v-if="!isSubmitted" class="write-form">
        <form @submit.prevent="submitReview" class="form-content">
          <div class="form-row">
            <label for="username">작성자명 <span class="required">*</span></label>
            <input
              id="username"
              v-model="formData.username"
              type="text"
              maxlength="20"
              placeholder="표시될 이름 (최대 20자)"
              required
              :disabled="isSubmitting"
            />
          </div>

          <div class="form-row">
            <label for="title">제목 <span class="required">*</span></label>
            <input
              id="title"
              v-model="formData.title"
              type="text"
              maxlength="100"
              placeholder="후기 제목"
              required
              :disabled="isSubmitting"
            />
          </div>

          <div class="form-row">
            <label for="content">내용 <span class="required">*</span></label>
            <textarea
              id="content"
              v-model="formData.content"
              rows="12"
              maxlength="5000"
              placeholder="강의를 들으면서 느낀 점을 자유롭게 작성해 주세요."
              required
              :disabled="isSubmitting"
            ></textarea>
            <div class="char-count">{{ formData.content.length }}/5000자</div>
          </div>

          <div class="form-row">
            <label for="image">이미지 (선택)</label>
            <div class="image-upload-area">
              <input
                type="file"
                id="image"
                ref="imageInput"
                @change="handleImageChange"
                accept="image/*"
                :disabled="isSubmitting"
              />
              <div v-if="imagePreview" class="image-preview-wrap">
                <img :src="imagePreview" alt="미리보기" class="image-preview" />
                <button
                  type="button"
                  @click="removeImage"
                  class="remove-image-btn"
                  :disabled="isSubmitting"
                >
                  이미지 제거
                </button>
              </div>
            </div>
          </div>

          <!-- Honeypot: 봇 차단용. 사용자 눈에는 절대 보이면 안 됨 -->
          <div class="hp-field" aria-hidden="true">
            <label for="_botcheck">이 필드는 비워두세요</label>
            <input
              id="_botcheck"
              v-model="formData.botcheck"
              type="text"
              tabindex="-1"
              autocomplete="off"
            />
          </div>

          <div class="form-actions">
            <button
              type="submit"
              class="submit-btn"
              :disabled="!isFormValid || isSubmitting"
            >
              <span v-if="isSubmitting">접수 중...</span>
              <span v-else>후기 등록</span>
            </button>
            <button type="button" @click="goBack" class="cancel-btn" :disabled="isSubmitting">취소</button>
          </div>
        </form>
      </div>

      <div v-else class="post-submit">
        <h3>후기가 정상적으로 접수되었습니다.</h3>
        <p>관리자 검토 후 게시되며, 보통 1~2 영업일 내에 처리됩니다.</p>
        <button @click="goBack" class="back-btn">목록으로 돌아가기</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { jinjungsungService } from '@/services/jinjungsungService.js';

const router = useRouter();

const isSubmitting = ref(false);
const isSubmitted = ref(false);
const errorMessage = ref('');
const successMessage = ref('');

const formData = ref({
  username: '',
  title: '',
  content: '',
  image: null,
  botcheck: ''
});

const imageInput = ref(null);
const imagePreview = ref('');

const isFormValid = computed(() => {
  return (
    formData.value.username.trim() &&
    formData.value.title.trim() &&
    formData.value.content.trim()
  );
});

const handleImageChange = (event) => {
  const file = event.target.files[0];
  if (!file) return;

  if (file.size > 10 * 1024 * 1024) {
    errorMessage.value = '이미지 파일 크기는 10MB 이하여야 합니다.';
    return;
  }

  if (!file.type.startsWith('image/')) {
    errorMessage.value = '이미지 파일만 업로드 가능합니다.';
    return;
  }

  formData.value.image = file;

  const reader = new FileReader();
  reader.onload = (e) => {
    imagePreview.value = e.target.result;
  };
  reader.readAsDataURL(file);

  errorMessage.value = '';
};

const removeImage = () => {
  formData.value.image = null;
  imagePreview.value = '';
  if (imageInput.value) {
    imageInput.value.value = '';
  }
};

const submitReview = async () => {
  if (!isFormValid.value || isSubmitting.value) return;

  isSubmitting.value = true;
  errorMessage.value = '';
  successMessage.value = '';

  try {
    await jinjungsungService.submitReview({
      username: formData.value.username.trim(),
      title: formData.value.title.trim(),
      content: formData.value.content.trim(),
      image: formData.value.image,
      botcheck: formData.value.botcheck
    });

    successMessage.value = '후기가 접수되었습니다. 검토 후 게시됩니다.';
    isSubmitted.value = true;
  } catch (error) {
    errorMessage.value = error.message;
  } finally {
    isSubmitting.value = false;
  }
};

const goBack = () => {
  router.push('/reviews');
};
</script>

<style scoped>
.review-write-page {
  padding: 40px 20px;
  min-height: 100vh;
}

.review-write-content {
  max-width: 800px;
  margin: 0 auto;
}

.write-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  flex-wrap: wrap;
  gap: 15px;
}

.back-btn {
  padding: 10px 20px;
  background: none;
  border: 2px solid #333;
  color: #333;
  font-weight: 500;
  cursor: pointer;
  text-decoration: none;
  transition: all 0.3s ease;
}

.back-btn:hover {
  background: #333;
  color: white;
}

.write-header h2 {
  color: #333;
  font-size: 1.8rem;
  font-weight: 700;
  margin: 0;
}

.info-banner {
  background: #fff8e6;
  border: 1px solid #f5d680;
  padding: 15px 20px;
  margin-bottom: 25px;
  color: #6b5300;
}

.error-message,
.success-message {
  text-align: center;
  padding: 15px 20px;
  margin-bottom: 20px;
  border: 1px solid;
}

.error-message {
  background-color: #f8d7da;
  color: #721c24;
  border-color: #f5c6cb;
}

.success-message {
  background-color: #d4edda;
  color: #155724;
  border-color: #c3e6cb;
}

.write-form {
  background: white;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 30px;
  border: 1px solid #ddd;
}

.form-row {
  margin-bottom: 25px;
}

.form-row label {
  display: block;
  margin-bottom: 8px;
  color: #333;
  font-weight: 500;
  font-size: 1.1rem;
}

.required {
  color: #e74c3c;
  font-weight: bold;
}

.form-row input,
.form-row textarea {
  width: 100%;
  padding: 12px 15px;
  border: 2px solid #ddd;
  font-size: 1rem;
  box-sizing: border-box;
  transition: border-color 0.3s ease;
}

.form-row input:focus,
.form-row textarea:focus {
  outline: none;
  border-color: var(--primary-color);
}

.form-row input:disabled,
.form-row textarea:disabled {
  background-color: #f5f5f5;
  cursor: not-allowed;
}

.form-row textarea {
  resize: vertical;
  min-height: 250px;
  font-family: inherit;
  line-height: 1.6;
}

.char-count {
  text-align: right;
  color: #666;
  font-size: 0.9rem;
  margin-top: 5px;
}

.image-upload-area {
  border: 2px dashed #ddd;
  padding: 20px;
  text-align: center;
}

.image-preview-wrap {
  margin-top: 15px;
}

.image-preview {
  max-width: 100%;
  max-height: 300px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 10px;
  border: 1px solid #ddd;
}

.remove-image-btn {
  padding: 6px 12px;
  background-color: #dc3545;
  color: white;
  border: none;
  cursor: pointer;
  font-size: 0.9rem;
}

.remove-image-btn:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

/* Honeypot — 절대 보이지 않게 + 스크린리더에도 안내 */
.hp-field {
  position: absolute;
  left: -10000px;
  top: auto;
  width: 1px;
  height: 1px;
  overflow: hidden;
}

.form-actions {
  display: flex;
  gap: 15px;
  justify-content: center;
  margin-top: 30px;
}

.submit-btn,
.cancel-btn {
  padding: 15px 40px;
  font-size: 1.1rem;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
}

.submit-btn {
  background-color: var(--primary-color);
  color: white;
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

.cancel-btn {
  background-color: #6c757d;
  color: white;
}

.cancel-btn:hover:not(:disabled) {
  background-color: #5a6268;
}

.post-submit {
  background: white;
  padding: 60px 30px;
  border: 1px solid #ddd;
  text-align: center;
}

.post-submit h3 {
  color: #333;
  font-size: 1.5rem;
  margin-bottom: 15px;
}

.post-submit p {
  color: #666;
  margin-bottom: 30px;
}

@media (max-width: 768px) {
  .review-write-page {
    padding: 20px 15px;
  }

  .write-header {
    flex-direction: column;
    align-items: stretch;
  }

  .write-header h2 {
    font-size: 1.5rem;
    text-align: center;
  }

  .write-form {
    padding: 20px;
  }

  .form-row input,
  .form-row textarea {
    font-size: 16px;
  }

  .form-actions {
    flex-direction: column;
  }

  .submit-btn,
  .cancel-btn {
    width: 100%;
  }
}
</style>
