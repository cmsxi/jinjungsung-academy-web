<template>
  <div class="admin-reviews-page">
    <div class="admin-reviews-content">
      <div class="admin-header">
        <div class="header-left">
          <h3>수강후기 게시판 관리</h3>
          <div class="post-count">
            총 {{ totalReviews }}개 (미게시 {{ unpublishedCount }}개)
          </div>
        </div>
        <div class="header-right">
          <router-link to="/admin" class="back-btn">← 관리자 메인</router-link>
          <router-link to="/admin/reviews/write" class="write-btn">새 글 작성</router-link>
        </div>
      </div>

      <div class="filter-bar">
        <button
          :class="['filter-btn', { active: filter === 'all' }]"
          @click="setFilter('all')"
        >전체</button>
        <button
          :class="['filter-btn', { active: filter === 'unpublished' }]"
          @click="setFilter('unpublished')"
        >미게시 ({{ unpublishedCount }})</button>
        <button
          :class="['filter-btn', { active: filter === 'published' }]"
          @click="setFilter('published')"
        >게시됨</button>
      </div>

      <div v-if="isLoading" class="loading-message">
        <p>게시글을 불러오는 중...</p>
      </div>

      <div v-if="errorMessage" class="error-message">
        <p>❌ {{ errorMessage }}</p>
        <button @click="loadReviews" class="retry-btn">다시 시도</button>
      </div>

      <div v-if="successMessage" class="success-message">
        <p>✅ {{ successMessage }}</p>
      </div>

      <div v-if="!isLoading && !errorMessage" class="posts-container">
        <div v-if="filteredReviews.length === 0" class="no-posts">
          <p>{{ filter === 'unpublished' ? '미게시 후기가 없습니다.' : filter === 'published' ? '게시된 후기가 없습니다.' : '등록된 후기가 없습니다.' }}</p>
        </div>

        <div v-else class="posts-table">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>작성자</th>
                <th>제목</th>
                <th>접수일</th>
                <th>IP</th>
                <th>이미지</th>
                <th>공개</th>
                <th>관리</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="review in filteredReviews"
                :key="review.id"
                :class="{ unpublished: !review.is_published }"
              >
                <td>{{ review.id }}</td>
                <td>{{ review.username }}</td>
                <td class="title-cell">
                  <router-link
                    v-if="review.is_published"
                    :to="`/reviews/${review.id}`"
                    target="_blank"
                    class="post-title-link"
                  >{{ review.title }}</router-link>
                  <span v-else class="post-title-pending">{{ review.title }}</span>
                </td>
                <td>{{ formatDate(review.created_at) }}</td>
                <td class="ip-cell">{{ review.submitter_ip || '—' }}</td>
                <td>
                  <span v-if="review.image_filename" class="has-image">✅</span>
                  <span v-else class="no-image">❌</span>
                </td>
                <td>
                  <button
                    class="toggle-btn"
                    :class="review.is_published ? 'published' : 'unpublished-btn'"
                    @click="togglePublish(review)"
                    :disabled="togglingId === review.id"
                  >
                    {{ review.is_published ? '🟢 게시됨' : '⚪ 미게시' }}
                  </button>
                </td>
                <td class="actions-cell">
                  <router-link :to="`/admin/reviews/edit/${review.id}`" class="edit-btn">수정</router-link>
                  <button @click="confirmDelete(review)" class="delete-btn">삭제</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div v-if="totalPages > 1" class="pagination">
          <button
            @click="changePage(currentPage - 1)"
            :disabled="currentPage === 1"
            class="page-btn"
          >이전</button>
          <span class="page-info">{{ currentPage }} / {{ totalPages }}</span>
          <button
            @click="changePage(currentPage + 1)"
            :disabled="currentPage === totalPages"
            class="page-btn"
          >다음</button>
        </div>
      </div>
    </div>

    <!-- 삭제 확인 모달 -->
    <div v-if="showDeleteModal" class="modal-overlay" @click="closeDeleteModal">
      <div class="modal-content" @click.stop>
        <h3>후기 삭제</h3>
        <p>정말로 이 후기를 삭제하시겠습니까?</p>
        <p class="post-title-preview">"{{ reviewToDelete?.title }}"</p>

        <div class="form-group">
          <label for="deletePassword">관리자 비밀번호</label>
          <input
            type="password"
            id="deletePassword"
            v-model="deletePassword"
            placeholder="비밀번호를 입력하세요"
            :disabled="isDeleting"
          />
        </div>

        <div class="modal-actions">
          <button @click="closeDeleteModal" class="cancel-btn" :disabled="isDeleting">취소</button>
          <button @click="deleteReview" class="confirm-delete-btn" :disabled="!deletePassword || isDeleting">
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

const isLoading = ref(false);
const errorMessage = ref('');
const successMessage = ref('');
const reviews = ref([]);
const currentPage = ref(1);
const totalReviews = ref(0);
const itemsPerPage = 10;
const filter = ref('all');
const togglingId = ref(null);

const showDeleteModal = ref(false);
const reviewToDelete = ref(null);
const deletePassword = ref('');
const isDeleting = ref(false);

const totalPages = computed(() => Math.ceil(totalReviews.value / itemsPerPage));

const filteredReviews = computed(() => {
  if (filter.value === 'unpublished') {
    return reviews.value.filter(r => !r.is_published);
  }
  if (filter.value === 'published') {
    return reviews.value.filter(r => r.is_published);
  }
  return reviews.value;
});

const unpublishedCount = computed(() => reviews.value.filter(r => !r.is_published).length);

const setFilter = (f) => { filter.value = f; };

const flashMessage = (type, msg, ms = 3000) => {
  if (type === 'success') {
    successMessage.value = msg;
    setTimeout(() => { successMessage.value = ''; }, ms);
  } else {
    errorMessage.value = msg;
    setTimeout(() => { errorMessage.value = ''; }, ms);
  }
};

const checkAuth = () => {
  const authenticated = sessionStorage.getItem('admin_authenticated');
  if (authenticated !== 'true') {
    router.push('/admin');
    return false;
  }
  return true;
};

const getAdminPassword = () => sessionStorage.getItem('admin_password') || '';

const loadReviews = async (page = 1) => {
  if (!checkAuth()) return;

  isLoading.value = true;
  errorMessage.value = '';

  try {
    const adminPassword = getAdminPassword();
    const response = await jinjungsungService.getReviewsAdmin(page, itemsPerPage, adminPassword);
    reviews.value = response.items;
    totalReviews.value = response.total;
    currentPage.value = page;
  } catch (error) {
    errorMessage.value = error.message;
  } finally {
    isLoading.value = false;
  }
};

const changePage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    loadReviews(page);
  }
};

const togglePublish = async (review) => {
  if (togglingId.value) return;
  togglingId.value = review.id;

  try {
    const adminPassword = getAdminPassword();
    const result = await jinjungsungService.setReviewPublished(
      review.id,
      !review.is_published,
      adminPassword
    );
    review.is_published = result.is_published;
    flashMessage('success', result.is_published ? '게시되었습니다.' : '미게시 처리되었습니다.');
  } catch (error) {
    flashMessage('error', error.message, 5000);
  } finally {
    togglingId.value = null;
  }
};

const confirmDelete = (review) => {
  reviewToDelete.value = review;
  showDeleteModal.value = true;
  deletePassword.value = '';
};

const closeDeleteModal = () => {
  showDeleteModal.value = false;
  reviewToDelete.value = null;
  deletePassword.value = '';
};

const deleteReview = async () => {
  if (!deletePassword.value || isDeleting.value || !reviewToDelete.value) return;

  isDeleting.value = true;

  try {
    await jinjungsungService.deleteReview(reviewToDelete.value.id, deletePassword.value);
    flashMessage('success', '후기가 삭제되었습니다.');
    closeDeleteModal();
    loadReviews(currentPage.value);
  } catch (error) {
    flashMessage('error', error.message, 5000);
  } finally {
    isDeleting.value = false;
  }
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric', month: '2-digit', day: '2-digit'
  });
};

onMounted(() => {
  if (checkAuth()) loadReviews();
});
</script>

<style scoped>
.admin-reviews-page {
  padding: 40px 20px;
  min-height: 100vh;
  background: #f8f9fa;
}

.admin-reviews-content {
  max-width: 1300px;
  margin: 0 auto;
}

.admin-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 0;
  border-bottom: 3px solid #333;
  margin-bottom: 20px;
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
  text-decoration: none;
  font-weight: 500;
  border: 1px solid #333;
}

.back-btn {
  background-color: #6c757d;
  color: white;
}

.write-btn {
  background-color: var(--primary-color);
  color: white;
}

.filter-bar {
  display: flex;
  gap: 10px;
  margin-bottom: 25px;
}

.filter-btn {
  padding: 8px 18px;
  background: white;
  color: #333;
  border: 1px solid #ddd;
  cursor: pointer;
  font-weight: 500;
}

.filter-btn.active {
  background: var(--primary-color);
  color: white;
  border-color: var(--primary-color);
}

.loading-message {
  text-align: center;
  padding: 60px 0;
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

.retry-btn {
  margin-top: 10px;
  padding: 8px 16px;
  background-color: #dc3545;
  color: white;
  border: none;
  cursor: pointer;
}

.no-posts {
  text-align: center;
  padding: 60px 20px;
  background: white;
  border: 1px solid #ddd;
}

.posts-table {
  background: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  overflow: auto;
  margin-bottom: 30px;
  border: 1px solid #ddd;
}

table {
  width: 100%;
  border-collapse: collapse;
  min-width: 900px;
}

th, td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #eee;
  vertical-align: middle;
}

th {
  background-color: #f8f9fa;
  font-weight: 600;
  color: #333;
}

tr.unpublished {
  background-color: #fff8e6;
}

.title-cell {
  max-width: 280px;
}

.post-title-link {
  color: var(--primary-color);
  text-decoration: none;
  font-weight: 500;
}

.post-title-link:hover {
  text-decoration: underline;
}

.post-title-pending {
  color: #999;
  font-style: italic;
}

.ip-cell {
  font-family: monospace;
  font-size: 0.85rem;
  color: #666;
}

.has-image {
  color: #28a745;
}

.no-image {
  color: #dc3545;
}

.toggle-btn {
  padding: 6px 14px;
  border: 1px solid #ddd;
  background: white;
  cursor: pointer;
  font-size: 0.9rem;
  white-space: nowrap;
  transition: all 0.2s ease;
}

.toggle-btn.published {
  background: #d4edda;
  color: #155724;
  border-color: #c3e6cb;
}

.toggle-btn.unpublished-btn {
  background: #f0f0f0;
  color: #555;
}

.toggle-btn:hover:not(:disabled) {
  transform: translateY(-1px);
}

.toggle-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.actions-cell {
  white-space: nowrap;
}

.edit-btn, .delete-btn {
  padding: 6px 12px;
  text-decoration: none;
  font-size: 0.9rem;
  margin-right: 5px;
  border: none;
  cursor: pointer;
}

.edit-btn {
  background-color: #28a745;
  color: white;
}

.delete-btn {
  background-color: #dc3545;
  color: white;
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
  cursor: pointer;
}

.page-btn:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.page-info {
  font-weight: 500;
  color: #333;
}

.modal-overlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 30px;
  max-width: 400px;
  width: 90%;
  border: 1px solid #ddd;
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

  .header-right {
    justify-content: center;
  }

  th, td {
    padding: 8px;
    font-size: 0.85rem;
  }

  .modal-content {
    padding: 20px;
    margin: 15px;
  }
}
</style>
