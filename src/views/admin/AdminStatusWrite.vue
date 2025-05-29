<template>
  <div class="admin-write-page">
    <div class="admin-write-content">
      <!-- 헤더 -->
      <div class="write-header">
        <router-link to="/admin/status" class="back-btn">← 목록으로 돌아가기</router-link>
        <h2>{{ isEditMode ? '수강현황 수정' : '새 수강현황 작성' }}</h2>
      </div>

      <!-- 로딩 상태 -->
      <div v-if="isLoading" class="loading-message">
        <p>{{ isEditMode ? '게시글을 불러오는 중...' : '처리 중...' }}</p>
      </div>

      <!-- 에러 메시지 -->
      <div v-if="errorMessage" class="error-message">
        <p>❌ {{ errorMessage }}</p>
      </div>

      <!-- 성공 메시지 -->
      <div v-if="successMessage" class="success-message">
        <p>✅ {{ successMessage }}</p>
      </div>

      <!-- 작성 폼 -->
      <div v-if="!isLoading" class="write-form">
        <form @submit.prevent="submitPost" class="form-content">
          <div class="form-row">
            <label for="title">제목 <span class="required">*</span></label>
            <input 
              id="title"
              v-model="formData.title" 
              type="text" 
              placeholder="게시글 제목을 입력하세요"
              required
              :disabled="isSubmitting"
            />
          </div>

          <div class="form-row">
            <label for="content">내용 <span class="required">*</span></label>
            <textarea 
              id="content"
              v-model="formData.content" 
              rows="15" 
              placeholder="게시글 내용을 입력하세요"
              required
              :disabled="isSubmitting"
            ></textarea>
          </div>

          <div class="form-row">
            <label for="image">이미지</label>
            <div class="image-upload-area">
              <input 
                type="file" 
                id="image" 
                ref="imageInput"
                @change="handleImageChange"
                accept="image/*"
                :disabled="isSubmitting"
              >
              
              <!-- 현재 이미지 미리보기 -->
              <div v-if="currentImageUrl" class="current-image">
                <p>현재 이미지:</p>
                <img :src="currentImageUrl" alt="현재 이미지" class="image-preview">
                <button 
                  type="button" 
                  @click="removeCurrentImage" 
                  class="remove-image-btn"
                  :disabled="isSubmitting"
                >
                  이미지 제거
                </button>
              </div>

              <!-- 새 이미지 미리보기 -->
              <div v-if="newImagePreview" class="new-image">
                <p>새 이미지:</p>
                <img :src="newImagePreview" alt="새 이미지" class="image-preview">
                <button 
                  type="button" 
                  @click="removeNewImage" 
                  class="remove-image-btn"
                  :disabled="isSubmitting"
                >
                  이미지 제거
                </button>
              </div>
            </div>
          </div>

          <div class="form-row">
            <label for="adminPassword">관리자 비밀번호 <span class="required">*</span></label>
            <input 
              type="password" 
              id="adminPassword" 
              v-model="formData.adminPassword"
              required
              placeholder="관리자 비밀번호를 입력하세요"
              :disabled="isSubmitting"
            >
          </div>

          <div class="form-actions">
            <button 
              type="submit" 
              class="save-btn"
              :disabled="!isFormValid || isSubmitting"
            >
              <span v-if="isSubmitting">{{ isEditMode ? '수정 중...' : '작성 중...' }}</span>
              <span v-else>{{ isEditMode ? '수정하기' : '작성하기' }}</span>
            </button>
            <router-link to="/admin/status" class="cancel-btn">취소</router-link>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { jinjungsungService } from '@/services/jinjungsungService.js';

const route = useRoute();
const router = useRouter();

// 상태 관리
const isLoading = ref(false);
const isSubmitting = ref(false);
const errorMessage = ref('');
const successMessage = ref('');
const isEditMode = ref(false);
const postId = ref(null);

// 폼 데이터
const formData = ref({
  title: '',
  content: '',
  adminPassword: '',
  image: null
});

// 이미지 관련 상태
const imageInput = ref(null);
const currentImageUrl = ref('');
const newImagePreview = ref('');
const removeCurrentImageFlag = ref(false);

// 계산된 속성
const isFormValid = computed(() => {
  return formData.value.title && 
         formData.value.content && 
         formData.value.adminPassword;
});

// 관리자 인증 확인
const checkAuth = () => {
  const authenticated = sessionStorage.getItem('admin_authenticated');
  if (authenticated !== 'true') {
    router.push('/admin');
    return false;
  }
  
  // 세션에서 비밀번호 자동 입력
  const savedPassword = sessionStorage.getItem('admin_password');
  if (savedPassword) {
    formData.value.adminPassword = savedPassword;
  }
  
  return true;
};

// 수정 모드 확인 및 게시글 로드
const initializeForm = async () => {
  if (!checkAuth()) return;

  const id = route.params.id;
  if (id) {
    isEditMode.value = true;
    postId.value = parseInt(id);
    await loadPost();
  }
};

// 게시글 로드 (수정 모드)
const loadPost = async () => {
  isLoading.value = true;
  errorMessage.value = '';

  try {
    const post = await jinjungsungService.getPost(postId.value);
    
    formData.value.title = post.title;
    formData.value.content = post.content;
    
    if (post.image_filename) {
      currentImageUrl.value = jinjungsungService.getImageUrl(post.image_filename);
    }
  } catch (error) {
    errorMessage.value = error.message;
  } finally {
    isLoading.value = false;
  }
};

// 이미지 변경 처리
const handleImageChange = (event) => {
  const file = event.target.files[0];
  if (!file) return;

  // 파일 크기 체크 (5MB)
  if (file.size > 5 * 1024 * 1024) {
    errorMessage.value = '이미지 파일 크기는 5MB 이하여야 합니다.';
    return;
  }

  // 파일 타입 체크
  if (!file.type.startsWith('image/')) {
    errorMessage.value = '이미지 파일만 업로드 가능합니다.';
    return;
  }

  formData.value.image = file;
  
  // 미리보기 생성
  const reader = new FileReader();
  reader.onload = (e) => {
    newImagePreview.value = e.target.result;
  };
  reader.readAsDataURL(file);
  
  errorMessage.value = '';
};

// 현재 이미지 제거
const removeCurrentImage = () => {
  currentImageUrl.value = '';
  removeCurrentImageFlag.value = true;
};

// 새 이미지 제거
const removeNewImage = () => {
  formData.value.image = null;
  newImagePreview.value = '';
  if (imageInput.value) {
    imageInput.value.value = '';
  }
};

// 폼 제출
const submitPost = async () => {
  if (!isFormValid.value || isSubmitting.value) return;

  isSubmitting.value = true;
  errorMessage.value = '';
  successMessage.value = '';

  try {
    const postData = {
      title: formData.value.title,
      content: formData.value.content,
      adminPassword: formData.value.adminPassword
    };

    // 이미지 처리
    if (formData.value.image) {
      postData.image = formData.value.image;
    } else if (removeCurrentImageFlag.value) {
      // 현재 이미지를 제거하는 경우, 이미지 없이 전송
    }

    let result;
    if (isEditMode.value) {
      result = await jinjungsungService.updatePost(postId.value, postData);
    } else {
      result = await jinjungsungService.createPost(postData);
    }

    successMessage.value = isEditMode.value ? 
      '게시글이 성공적으로 수정되었습니다.' : 
      '게시글이 성공적으로 작성되었습니다.';

    // 2초 후 목록 페이지로 이동
    setTimeout(() => {
      router.push('/admin/status');
    }, 2000);

  } catch (error) {
    errorMessage.value = error.message;
  } finally {
    isSubmitting.value = false;
  }
};

// 컴포넌트 마운트 시 초기화
onMounted(() => {
  initializeForm();
});
</script>

<style scoped>
.admin-write-page {
  padding: 40px 20px;
  min-height: 100vh;
  background: #f8f9fa;
}

.admin-write-content {
  max-width: 800px;
  margin: 0 auto;
}

/* 헤더 */
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
  background-color: #6c757d;
  color: white;
  text-decoration: none;
  font-weight: 500;
  transition: background-color 0.3s ease;
  border: 1px solid #6c757d;
}

.back-btn:hover {
  background-color: #5a6268;
}

.write-header h2 {
  color: #333;
  font-size: 1.8rem;
  font-weight: 700;
  margin: 0;
}

.loading-message {
  text-align: center;
  padding: 60px 0;
  font-size: 1.1rem;
  color: #666;
}

.error-message, .success-message {
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

/* 폼 */
.write-form {
  background: white;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 30px;
  border: 1px solid #ddd;
}

.form-content {
  width: 100%;
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
  min-height: 300px;
  font-family: inherit;
  line-height: 1.6;
}

.image-upload-area {
  border: 2px dashed #ddd;
  padding: 20px;
  text-align: center;
  transition: border-color 0.3s ease;
}

.image-upload-area:hover {
  border-color: var(--primary-color);
}

.current-image,
.new-image {
  margin-top: 20px;
  text-align: center;
}

.current-image p,
.new-image p {
  margin-bottom: 10px;
  font-weight: 500;
  color: #333;
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
  transition: background-color 0.3s ease;
}

.remove-image-btn:hover:not(:disabled) {
  background-color: #c82333;
}

.remove-image-btn:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.form-actions {
  display: flex;
  gap: 15px;
  justify-content: center;
  margin-top: 30px;
}

.save-btn, .cancel-btn {
  padding: 15px 40px;
  font-size: 1.1rem;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s ease;
  border: none;
  cursor: pointer;
}

.save-btn {
  background-color: var(--primary-color);
  color: white;
}

.save-btn:hover:not(:disabled) {
  background-color: #003e80;
  transform: translateY(-2px);
}

.save-btn:disabled {
  background-color: #ccc;
  cursor: not-allowed;
  transform: none;
}

.cancel-btn {
  background-color: #6c757d;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
}

.cancel-btn:hover {
  background-color: #5a6268;
}

@media (max-width: 768px) {
  .admin-write-page {
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
    font-size: 16px; /* iOS 줌 방지 */
  }

  .form-row textarea {
    min-height: 250px;
  }

  .form-actions {
    flex-direction: column;
  }

  .save-btn, .cancel-btn {
    width: 100%;
    padding: 15px;
  }
}
</style>