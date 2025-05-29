<template>
  <div class="admin-write-page">
    <div class="admin-write-content">
      <!-- 헤더 -->
      <div class="write-header">
        <button @click="goBack" class="back-btn">
          ← 목록으로 돌아가기
        </button>
        <h2>새 글 작성</h2>
      </div>

      <!-- 작성 폼 -->
      <div class="write-form">
        <div class="form-content">
          <div class="form-row">
            <label for="title">제목 <span class="required">*</span></label>
            <input 
              id="title"
              v-model="postData.title" 
              type="text" 
              placeholder="게시글 제목을 입력하세요"
              required
            />
          </div>

          <div class="form-row">
            <label for="image">이미지</label>
            <div class="image-upload-section">
              <input 
                id="image"
                ref="imageInput"
                type="file" 
                accept="image/*"
                @change="handleImageUpload"
                class="file-input"
              />
              <button @click="triggerImageUpload" class="upload-btn" type="button">
                이미지 선택
              </button>
              <span class="file-info">{{ imageFileName || '선택된 파일 없음' }}</span>
            </div>
            
            <!-- 이미지 미리보기 -->
            <div v-if="imagePreview" class="image-preview">
              <img :src="imagePreview" alt="미리보기" />
              <button @click="removeImage" class="remove-image-btn" type="button">
                ×
              </button>
            </div>
          </div>

          <div class="form-row">
            <label for="content">내용 <span class="required">*</span></label>
            <textarea 
              id="content"
              v-model="postData.content" 
              rows="15" 
              placeholder="게시글 내용을 입력하세요"
              required
            ></textarea>
          </div>

          <div class="form-actions">
            <button @click="savePost" class="save-btn" :disabled="saving">
              {{ saving ? '저장 중...' : '저장' }}
            </button>
            <button @click="goBack" class="cancel-btn" type="button">
              취소
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

// 상태 관리
const saving = ref(false);
const imageInput = ref(null);
const imageFileName = ref('');
const imagePreview = ref('');

// 게시글 데이터
const postData = ref({
  title: '',
  content: '',
  image: null
});

// 메서드
const goBack = () => {
  if (confirm('작성 중인 내용이 있습니다. 정말로 나가시겠습니까?')) {
    router.push('/admin/status');
  }
};

const triggerImageUpload = () => {
  imageInput.value.click();
};

const handleImageUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    // 파일 크기 체크 (5MB 제한)
    if (file.size > 5 * 1024 * 1024) {
      alert('파일 크기는 5MB 이하여야 합니다.');
      return;
    }

    // 이미지 파일 타입 체크
    if (!file.type.startsWith('image/')) {
      alert('이미지 파일만 업로드 가능합니다.');
      return;
    }

    postData.value.image = file;
    imageFileName.value = file.name;

    // 미리보기 생성
    const reader = new FileReader();
    reader.onload = (e) => {
      imagePreview.value = e.target.result;
    };
    reader.readAsDataURL(file);
  }
};

const removeImage = () => {
  postData.value.image = null;
  imageFileName.value = '';
  imagePreview.value = '';
  if (imageInput.value) {
    imageInput.value.value = '';
  }
};

const savePost = async () => {
  // 유효성 검사
  if (!postData.value.title.trim()) {
    alert('제목을 입력해주세요.');
    return;
  }

  if (!postData.value.content.trim()) {
    alert('내용을 입력해주세요.');
    return;
  }

  saving.value = true;

  try {
    // FormData 생성 (백엔드로 전송할 데이터)
    const formData = new FormData();
    formData.append('title', postData.value.title);
    formData.append('content', postData.value.content);
    
    if (postData.value.image) {
      formData.append('image', postData.value.image);
    }

    // 실제 환경에서는 여기서 API 호출
    // const response = await fetch('/api/admin/posts', {
    //   method: 'POST',
    //   body: formData,
    //   headers: {
    //     'Authorization': `Bearer ${sessionStorage.getItem('adminToken')}`
    //   }
    // });

    // 임시 지연 효과
    await new Promise(resolve => setTimeout(resolve, 1000));

    alert('게시글이 저장되었습니다.');
    router.push('/admin/status');

  } catch (error) {
    console.error('저장 실패:', error);
    alert('저장 중 오류가 발생했습니다.');
  } finally {
    saving.value = false;
  }
};

// 인증 확인
onMounted(() => {
  if (!sessionStorage.getItem('adminAuth')) {
    router.push('/admin/login');
  }
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
  align-items: center;
  gap: 20px;
  margin-bottom: 30px;
}

.back-btn {
  background: none;
  border: 2px solid #333;
  color: #333;
  padding: 12px 20px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
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

/* 폼 */
.write-form {
  background: white;
  border: 2px solid #333;
}

.form-content {
  padding: 40px;
}

.form-row {
  margin-bottom: 30px;
}

.form-row label {
  display: block;
  margin-bottom: 10px;
  color: #333;
  font-weight: 600;
  font-size: 1.1rem;
}

.required {
  color: #dc3545;
}

.form-row input[type="text"],
.form-row textarea {
  width: 100%;
  padding: 15px;
  border: 2px solid #666;
  font-size: 1rem;
  resize: vertical;
  transition: border-color 0.3s ease;
}

.form-row input[type="text"]:focus,
.form-row textarea:focus {
  outline: none;
  border-color: var(--primary-color);
}

/* 이미지 업로드 */
.image-upload-section {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 15px;
}

.file-input {
  display: none;
}

.upload-btn {
  background: #6c757d;
  color: white;
  border: none;
  padding: 12px 20px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.upload-btn:hover {
  background: #5a6268;
}

.file-info {
  color: #666;
  font-size: 0.9rem;
}

/* 이미지 미리보기 */
.image-preview {
  position: relative;
  display: inline-block;
  border: 2px solid #ddd;
  padding: 10px;
  background: #f8f9fa;
}

.image-preview img {
  max-width: 200px;
  max-height: 150px;
  object-fit: cover;
  display: block;
}

.remove-image-btn {
  position: absolute;
  top: -10px;
  right: -10px;
  background: #dc3545;
  color: white;
  border: none;
  width: 30px;
  height: 30px;
  font-size: 1.2rem;
  font-weight: bold;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.remove-image-btn:hover {
  background: #c82333;
}

/* 액션 버튼 */
.form-actions {
  display: flex;
  gap: 15px;
  justify-content: flex-end;
  padding-top: 30px;
  border-top: 2px solid #eee;
}

.save-btn, .cancel-btn {
  padding: 15px 30px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.save-btn {
  background: var(--primary-color);
  color: white;
  border: none;
}

.save-btn:hover:not(:disabled) {
  background: #0056b3;
}

.save-btn:disabled {
  background: #999;
  cursor: not-allowed;
}

.cancel-btn {
  background: white;
  color: #6c757d;
  border: 2px solid #6c757d;
}

.cancel-btn:hover {
  background: #6c757d;
  color: white;
}

/* 반응형 */
@media (max-width: 768px) {
  .admin-write-page {
    padding: 20px 10px;
  }

  .admin-write-content {
    max-width: 100%;
  }

  .write-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
  }

  .write-header h2 {
    font-size: 1.5rem;
  }

  .form-content {
    padding: 20px;
  }

  .image-upload-section {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }

  .image-preview img {
    max-width: 100%;
  }

  .form-actions {
    flex-direction: column;
  }

  .save-btn, .cancel-btn {
    width: 100%;
  }
}
</style> 