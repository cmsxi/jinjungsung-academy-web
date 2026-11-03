<template>
  <div class="admin-detail-page">
    <div class="admin-detail-content">
      <!-- 뒤로가기 버튼 -->
      <div class="back-section">
        <button @click="goBack" class="back-btn">
          ← 목록으로 돌아가기
        </button>
      </div>

      <!-- 게시글 상세 내용 -->
      <div v-if="post && !isEditing" class="post-detail">
        <div class="detail-header">
          <h1>제목: {{ post.title }}</h1>
          <div class="detail-meta">
            <span class="date">작성일: {{ formatDate(post.date) }}</span>
          </div>
        </div>

        <div class="detail-image">
          <img :src="post.image" :alt="post.title" />
        </div>

        <div class="detail-content">
          <div class="content-text">
            {{ post.content }}
          </div>
        </div>

        <!-- 관리자 액션 버튼 -->
        <div class="admin-actions">
          <button @click="startEdit" class="edit-btn">수정</button>
          <button @click="deletePost" class="delete-btn">삭제</button>
        </div>
      </div>

      <!-- 수정 폼 -->
      <div v-if="isEditing" class="edit-form">
        <div class="form-header">
          <h2>게시글 수정</h2>
        </div>
        <div class="form-content">
          <div class="form-row">
            <label>제목</label>
            <input v-model="editData.title" type="text" />
          </div>
          <div class="form-row">
            <label>이미지</label>
            <div class="image-upload-section">
              <input 
                ref="imageInput"
                type="file" 
                accept="image/*"
                @change="handleImageUpload"
                class="file-input"
              />
              <button @click="triggerImageUpload" class="upload-btn" type="button">
                이미지 변경
              </button>
              <span class="file-info">{{ imageFileName || '기존 이미지 유지' }}</span>
            </div>
            
            <!-- 이미지 미리보기 -->
            <div v-if="imagePreview" class="image-preview">
              <img :src="imagePreview" alt="미리보기" />
              <button @click="removeImage" class="remove-image-btn" type="button">
                ×
              </button>
            </div>
            <div v-else-if="editData.image" class="current-image">
              <p class="current-image-label">현재 이미지:</p>
              <img :src="editData.image" alt="현재 이미지" />
            </div>
          </div>
          <div class="form-row">
            <label>내용</label>
            <textarea v-model="editData.content" rows="10"></textarea>
          </div>
          <div class="form-actions">
            <button @click="saveEdit" class="save-btn">저장</button>
            <button @click="cancelEdit" class="cancel-btn">취소</button>
          </div>
        </div>
      </div>

      <!-- 게시글을 찾을 수 없는 경우 -->
      <div v-if="!post && !isEditing" class="not-found">
        <h2>게시글을 찾을 수 없습니다</h2>
        <p>요청하신 게시글이 존재하지 않거나 삭제되었습니다.</p>
        <button @click="goBack" class="back-btn">목록으로 돌아가기</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();
const post = ref(null);
const isEditing = ref(false);
const editData = ref({});

// 이미지 관련 상태
const imageInput = ref(null);
const imageFileName = ref('');
const imagePreview = ref('');
const newImageFile = ref(null);

// 더미 데이터 (실제로는 API에서 가져올 데이터)
const posts = [];

// 메서드
const goBack = () => {
  router.push('/admin/status');
};

const startEdit = () => {
  editData.value = { ...post.value };
  isEditing.value = true;
  // 이미지 관련 상태 초기화
  imageFileName.value = '';
  imagePreview.value = '';
  newImageFile.value = null;
};

const saveEdit = async () => {
  if (!editData.value.title || !editData.value.content) {
    alert('제목과 내용을 입력해주세요.');
    return;
  }

  try {
    // FormData 생성 (백엔드로 전송할 데이터)
    const formData = new FormData();
    formData.append('title', editData.value.title);
    formData.append('content', editData.value.content);
    
    if (newImageFile.value) {
      // 새 이미지가 있으면 추가
      formData.append('image', newImageFile.value);
    } else if (editData.value.image) {
      // 기존 이미지 유지
      formData.append('existingImage', editData.value.image);
    }

    // 실제 환경에서는 여기서 API 호출
    // const response = await fetch(`/api/admin/posts/${post.value.id}`, {
    //   method: 'PUT',
    //   body: formData,
    //   headers: {
    //     'Authorization': `Bearer ${sessionStorage.getItem('adminToken')}`
    //   }
    // });

    // 임시로 로컬 데이터 업데이트
    post.value = { ...editData.value };
    if (newImageFile.value) {
      // 새 이미지가 있으면 미리보기 URL을 사용 (실제로는 서버에서 받은 URL 사용)
      post.value.image = imagePreview.value;
    }
    
    isEditing.value = false;
    alert('게시글이 수정되었습니다.');

  } catch (error) {
    console.error('수정 실패:', error);
    alert('수정 중 오류가 발생했습니다.');
  }
};

const cancelEdit = () => {
  isEditing.value = false;
  editData.value = {};
  // 이미지 관련 상태 초기화
  imageFileName.value = '';
  imagePreview.value = '';
  newImageFile.value = null;
  if (imageInput.value) {
    imageInput.value.value = '';
  }
};

const deletePost = () => {
  if (confirm('정말로 이 게시글을 삭제하시겠습니까?')) {
    // 실제로는 API 호출
    alert('게시글이 삭제되었습니다.');
    goBack();
  }
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

const triggerImageUpload = () => {
  imageInput.value.click();
};

const handleImageUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    // 파일 크기 체크 (10MB 제한)
    if (file.size > 10 * 1024 * 1024) {
      alert('파일 크기는 10MB 이하여야 합니다.');
      return;
    }

    // 이미지 파일 타입 체크
    if (!file.type.startsWith('image/')) {
      alert('이미지 파일만 업로드 가능합니다.');
      return;
    }

    newImageFile.value = file;
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
  newImageFile.value = null;
  imageFileName.value = '';
  imagePreview.value = '';
  editData.value.image = null; // 기존 이미지도 제거
  if (imageInput.value) {
    imageInput.value.value = '';
  }
};

// 컴포넌트 마운트 시 게시글 로드
onMounted(() => {
  // 인증 확인
  if (!sessionStorage.getItem('adminAuth')) {
    router.push('/admin/login');
    return;
  }

  // TODO: API 호출로 게시글 상세 정보 로드
  // const postId = parseInt(route.params.id);
  // post.value = await api.getPost(postId);
  
  post.value = null;
});
</script>

<style scoped>
.admin-detail-page {
  padding: 40px 20px;
  min-height: 100vh;
  background: #f8f9fa;
}

.admin-detail-content {
  max-width: 1100px;
  margin: 0 auto;
}

/* 뒤로가기 버튼 */
.back-section {
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

/* 게시글 상세 */
.post-detail {
  background: white;
  padding: 40px;
}

.detail-header {
  border-bottom: 3px solid #333;
  padding-bottom: 20px;
  margin-bottom: 30px;
}

.detail-header h1 {
  color: #333;
  font-size: 1.25rem;
  margin: 0 0 10px 0;
  line-height: 1.3;
}

.detail-meta {
  display: flex;
  gap: 20px;
  align-items: center;
}

.detail-meta .date {
  color: #666;
  font-size: 1.1rem;
  font-weight: 500;
}

/* 이미지 */
.detail-image {
  width: 100%;
  max-width: 600px;
  height: 400px;
  overflow: hidden;
  margin-bottom: 40px;
}

.detail-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* 내용 */
.detail-content {
  padding: 0;
  margin-bottom: 40px;
}

.content-text {
  color: #444;
  line-height: 1.8;
  margin: 0;
  font-size: 1.1rem;
  font-weight: 400;
}

/* 관리자 액션 */
.admin-actions {
  display: flex;
  gap: 15px;
  justify-content: flex-end;
  padding-top: 30px;
  border-top: 2px solid #eee;
}

.edit-btn, .delete-btn {
  padding: 12px 25px;
  border: 2px solid;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.edit-btn {
  background: white;
  color: var(--primary-color);
  border-color: var(--primary-color);
}

.edit-btn:hover {
  background: var(--primary-color);
  color: white;
}

.delete-btn {
  background: white;
  color: #dc3545;
  border-color: #dc3545;
}

.delete-btn:hover {
  background: #dc3545;
  color: white;
}

/* 수정 폼 */
.edit-form {
  background: white;
  border: 2px solid #333;
}

.form-header {
  padding: 20px 30px;
  background: #333;
  color: white;
}

.form-header h2 {
  margin: 0;
  font-size: 1.3rem;
}

.form-content {
  padding: 20px;
}

.form-row {
  margin-bottom: 20px;
}

.form-row label {
  display: block;
  margin-bottom: 8px;
  color: #333;
  font-weight: 600;
}

.form-row input,
.form-row textarea {
  width: 100%;
  padding: 12px;
  border: 2px solid #666;
  font-size: 1rem;
  resize: none;
}

.form-row input:focus,
.form-row textarea:focus {
  outline: none;
  border-color: var(--primary-color);
}

.form-actions {
  display: flex;
  gap: 15px;
  justify-content: flex-end;
}

.save-btn, .cancel-btn {
  padding: 12px 25px;
  border: none;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
}

.save-btn {
  background: var(--primary-color);
  color: white;
}

.cancel-btn {
  background: #6c757d;
  color: white;
}

/* 404 페이지 */
.not-found {
  text-align: center;
  padding: 80px 20px;
  background: white;
}

.not-found h2 {
  color: #333;
  font-size: 2rem;
  margin-bottom: 15px;
}

.not-found p {
  color: #666;
  font-size: 1.1rem;
  margin-bottom: 30px;
}

/* 반응형 */
@media (max-width: 768px) {
  .admin-detail-page {
    padding: 20px 10px;
  }

  .post-detail {
    padding: 20px;
  }

  .detail-header h1 {
    font-size: 1.1rem;
  }

  .detail-image {
    height: 250px;
  }

  .content-text {
    font-size: 1rem;
  }

  .admin-actions {
    flex-direction: column;
  }

  .edit-btn, .delete-btn {
    width: 100%;
  }

  .form-content {
    padding: 20px;
  }

  .form-actions {
    flex-direction: column;
  }

  .save-btn, .cancel-btn {
    width: 100%;
  }

  .image-upload-section {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }

  .image-preview img,
  .current-image img {
    max-width: 100%;
  }
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
  margin-bottom: 15px;
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

/* 현재 이미지 */
.current-image {
  margin-bottom: 15px;
}

.current-image-label {
  color: #666;
  font-size: 0.9rem;
  margin-bottom: 10px;
}

.current-image img {
  max-width: 200px;
  max-height: 150px;
  object-fit: cover;
  border: 2px solid #ddd;
  padding: 5px;
  background: #f8f9fa;
}
</style> 