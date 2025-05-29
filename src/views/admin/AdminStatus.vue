<template>
  <div class="admin-status-page">
    <div class="admin-status-content">
      <!-- 헤더 -->
      <div class="admin-header">
        <div class="header-left">
          <h3>수강현황 게시판 관리</h3>
          <div class="post-count">총 {{ posts.length }}개 게시글</div>
        </div>
        <div class="header-right">
          <router-link to="/admin" class="back-btn">← 관리자 메인</router-link>
          <router-link to="/admin/status/write" class="write-btn">새 글 작성</router-link>
        </div>
      </div>

      <!-- 로딩 상태 -->
      <div v-if="isLoading" class="loading-message">
        <p>게시글을 불러오는 중...</p>
      </div>

      <!-- 에러 메시지 -->
      <div v-if="errorMessage" class="error-message">
        <p>❌ {{ errorMessage }}</p>
        <button @click="loadPosts" class="retry-btn">다시 시도</button>
      </div>

      <!-- 성공 메시지 -->
      <div v-if="successMessage" class="success-message">
        <p>✅ {{ successMessage }}</p>
      </div>

      <!-- 게시글 목록 -->
      <div v-if="!isLoading && !errorMessage" class="posts-container">
        <div v-if="posts.length === 0" class="no-posts">
          <p>등록된 게시글이 없습니다.</p>
          <router-link to="/admin/status/write" class="create-link">첫 번째 게시글을 작성해보세요</router-link>
        </div>

        <div v-else class="posts-table">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>제목</th>
                <th>작성일</th>
                <th>이미지</th>
                <th>관리</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="post in posts" :key="post.id">
                <td>{{ post.id }}</td>
                <td class="title-cell">
                  <router-link :to="`/education/status/${post.id}`" target="_blank" class="post-title-link">
                    {{ post.title }}
                  </router-link>
                </td>
                <td>{{ formatDate(post.created_at) }}</td>
                <td>
                  <span v-if="post.image_filename" class="has-image">✅</span>
                  <span v-else class="no-image">❌</span>
                </td>
                <td class="actions-cell">
                  <router-link :to="`/admin/status/${post.id}`" class="edit-btn">수정</router-link>
                  <button @click="confirmDelete(post)" class="delete-btn">삭제</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- 페이지네이션 -->
        <div v-if="totalPages > 1" class="pagination">
          <button 
            @click="changePage(currentPage - 1)"
            :disabled="currentPage === 1"
            class="page-btn"
          >
            이전
          </button>
          
          <span class="page-info">
            {{ currentPage }} / {{ totalPages }}
          </span>
          
          <button 
            @click="changePage(currentPage + 1)"
            :disabled="currentPage === totalPages"
            class="page-btn"
          >
            다음
          </button>
        </div>
      </div>
    </div>

    <!-- 삭제 확인 모달 -->
    <div v-if="showDeleteModal" class="modal-overlay" @click="closeDeleteModal">
      <div class="modal-content" @click.stop>
        <h3>게시글 삭제</h3>
        <p>정말로 이 게시글을 삭제하시겠습니까?</p>
        <p class="post-title-preview">"{{ postToDelete?.title }}"</p>
        
        <div class="form-group">
          <label for="deletePassword">관리자 비밀번호</label>
          <input 
            type="password" 
            id="deletePassword" 
            v-model="deletePassword"
            placeholder="비밀번호를 입력하세요"
            :disabled="isDeleting"
          >
        </div>

        <div class="modal-actions">
          <button @click="closeDeleteModal" class="cancel-btn" :disabled="isDeleting">취소</button>
          <button @click="deletePost" class="confirm-delete-btn" :disabled="!deletePassword || isDeleting">
            <span v-if="isDeleting">삭제 중...</span>
            <span v-else>삭제</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { jinjungsungService } from '@/services/jinjungsungService.js';

const router = useRouter();

// 상태 관리
const isLoading = ref(false);
const errorMessage = ref('');
const successMessage = ref('');
const posts = ref([]);
const currentPage = ref(1);
const totalPosts = ref(0);
const itemsPerPage = 10;

// 삭제 관련 상태
const showDeleteModal = ref(false);
const postToDelete = ref(null);
const deletePassword = ref('');
const isDeleting = ref(false);

// 계산된 속성
const totalPages = computed(() => Math.ceil(totalPosts.value / itemsPerPage));

// 관리자 인증 확인
const checkAuth = () => {
  const authenticated = sessionStorage.getItem('admin_authenticated');
  if (authenticated !== 'true') {
    router.push('/admin');
    return false;
  }
  return true;
};

// 게시글 목록 로드
const loadPosts = async (page = 1) => {
  if (!checkAuth()) return;

  isLoading.value = true;
  errorMessage.value = '';

  try {
    const response = await jinjungsungService.getPosts(page, itemsPerPage);
    posts.value = response.items;
    totalPosts.value = response.total;
    currentPage.value = page;
  } catch (error) {
    errorMessage.value = error.message;
  } finally {
    isLoading.value = false;
  }
};

// 페이지 변경
const changePage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    loadPosts(page);
  }
};

// 삭제 확인 모달 열기
const confirmDelete = (post) => {
  postToDelete.value = post;
  showDeleteModal.value = true;
  deletePassword.value = '';
};

// 삭제 확인 모달 닫기
const closeDeleteModal = () => {
  showDeleteModal.value = false;
  postToDelete.value = null;
  deletePassword.value = '';
};

// 게시글 삭제
const deletePost = async () => {
  if (!deletePassword.value || isDeleting.value || !postToDelete.value) return;

  isDeleting.value = true;

  try {
    await jinjungsungService.deletePost(postToDelete.value.id, deletePassword.value);
    
    successMessage.value = '게시글이 성공적으로 삭제되었습니다.';
    closeDeleteModal();
    loadPosts(currentPage.value);
    
    // 3초 후 성공 메시지 숨기기
    setTimeout(() => {
      successMessage.value = '';
    }, 3000);

  } catch (error) {
    errorMessage.value = error.message;
    
    // 5초 후 에러 메시지 숨기기
    setTimeout(() => {
      errorMessage.value = '';
    }, 5000);
  } finally {
    isDeleting.value = false;
  }
};

// 날짜 포맷팅
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
};

// 컴포넌트 마운트 시 게시글 로드
onMounted(() => {
  if (checkAuth()) {
    loadPosts();
  }
});
</script>

<style scoped>
.admin-status-page {
  padding: 40px 20px;
  min-height: 100vh;
  background: #f8f9fa;
}

.admin-status-content {
  max-width: 1200px;
  margin: 0 auto;
}

/* 헤더 */
.admin-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 0;
  border-bottom: 3px solid #333;
  margin-bottom: 30px;
  flex-wrap: wrap;
  gap: 15px;
}

.header-left {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;
}

.admin-header h3 {
  margin: 0;
  font-size: 1.8rem;
  font-weight: 700;
  letter-spacing: 1px;
  color: #333;
}

.post-count {
  color: #666;
  font-size: 1rem;
  font-weight: 500;
}

.header-right {
  display: flex;
  gap: 10px;
}

.back-btn, .write-btn {
  padding: 10px 20px;
  border-radius: 6px;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.3s ease;
}

.back-btn {
  background-color: #6c757d;
  color: white;
}

.back-btn:hover {
  background-color: #5a6268;
}

.write-btn {
  background-color: var(--primary-color);
  color: white;
}

.write-btn:hover {
  background-color: #003e80;
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
  border-radius: 8px;
  margin-bottom: 20px;
}

.error-message {
  background-color: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}

.success-message {
  background-color: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}

.retry-btn {
  margin-top: 10px;
  padding: 8px 16px;
  background-color: #dc3545;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.no-posts {
  text-align: center;
  padding: 60px 20px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.create-link {
  display: inline-block;
  margin-top: 15px;
  padding: 10px 20px;
  background-color: var(--primary-color);
  color: white;
  text-decoration: none;
  border-radius: 6px;
  transition: background-color 0.3s ease;
}

.create-link:hover {
  background-color: #003e80;
}

.posts-table {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  margin-bottom: 30px;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  padding: 15px;
  text-align: left;
  border-bottom: 1px solid #eee;
}

th {
  background-color: #f8f9fa;
  font-weight: 600;
  color: #333;
}

.title-cell {
  max-width: 300px;
}

.post-title-link {
  color: var(--primary-color);
  text-decoration: none;
  font-weight: 500;
}

.post-title-link:hover {
  text-decoration: underline;
}

.has-image {
  color: #28a745;
}

.no-image {
  color: #dc3545;
}

.actions-cell {
  white-space: nowrap;
}

.edit-btn, .delete-btn {
  padding: 6px 12px;
  border-radius: 4px;
  text-decoration: none;
  font-size: 0.9rem;
  margin-right: 8px;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
}

.edit-btn {
  background-color: #28a745;
  color: white;
}

.edit-btn:hover {
  background-color: #218838;
}

.delete-btn {
  background-color: #dc3545;
  color: white;
}

.delete-btn:hover {
  background-color: #c82333;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  margin-top: 30px;
}

.page-btn {
  padding: 10px 20px;
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.page-btn:hover:not(:disabled) {
  background-color: #003e80;
}

.page-btn:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.page-info {
  font-weight: 500;
  color: #333;
}

/* 모달 스타일 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  max-width: 400px;
  width: 90%;
}

.modal-content h3 {
  margin-bottom: 15px;
  color: #333;
}

.post-title-preview {
  font-weight: 500;
  color: var(--primary-color);
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  color: #333;
  font-weight: 500;
}

.form-group input {
  width: 100%;
  padding: 10px 12px;
  border: 2px solid #ddd;
  border-radius: 6px;
  box-sizing: border-box;
}

.modal-actions {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
}

.cancel-btn, .confirm-delete-btn {
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
}

.cancel-btn {
  background-color: #6c757d;
  color: white;
}

.confirm-delete-btn {
  background-color: #dc3545;
  color: white;
}

.confirm-delete-btn:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .admin-header {
    flex-direction: column;
    align-items: stretch;
  }

  .admin-header h3 {
    font-size: 1.5rem;
    text-align: center;
  }

  .header-right {
    justify-content: center;
  }

  .posts-table {
    overflow-x: auto;
  }

  table {
    min-width: 600px;
  }

  th, td {
    padding: 10px 8px;
    font-size: 0.9rem;
  }

  .modal-content {
    padding: 20px;
    margin: 15px;
  }
}
</style> 