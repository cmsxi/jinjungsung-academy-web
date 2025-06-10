<template>
  <div class="reviews-page">
    <div class="reviews-content">
      <!-- 게시판 스타일 -->
      <div class="board-frame">
        <div class="frame-header">
          <div class="header-left">
            <h3>수강후기</h3>
            <div class="post-count">총 {{ filteredReviews.length }}개 게시글</div>
          </div>
          <div class="header-right">
            <div class="search-box">
              <input
                v-model="searchKeyword"
                type="text"
                placeholder="제목으로 검색하세요..."
                @input="filterReviews"
              />
            </div>
          </div>
        </div>

        <!-- 로딩 상태 -->
        <div v-if="isLoading" class="loading-message">
          <p>게시글을 불러오는 중...</p>
        </div>

        <!-- 에러 메시지 -->
        <div v-if="errorMessage" class="error-message">
          <p>{{ errorMessage }}</p>
          <button @click="loadReviews" class="retry-btn">다시 시도</button>
        </div>

        <div v-if="!isLoading && !errorMessage" class="frame-content">
          <div class="post-grid">
            <div
              v-for="review in filteredReviews"
              :key="review.id"
              class="post-card"
              @click="goToDetail(review.id)"
            >
              <div class="post-image">
                <img
                  :src="
                    review.image_filename
                      ? getImageUrl(review.image_filename)
                      : defaultImagePath
                  "
                  :alt="review.title"
                  @error="handleImageError"
                />
              </div>
              <div class="post-info">
                <h4 class="post-title">{{ review.title }}</h4>
                <p class="post-date">{{ formatDate(review.created_at || review.date) }}</p>
              </div>
            </div>
          </div>

          <!-- 게시글이 없을 때 -->
          <div v-if="filteredReviews.length === 0" class="no-posts">
            <p>
              {{
                searchKeyword
                  ? "검색 결과가 없습니다."
                  : "등록된 게시글이 없습니다."
              }}
            </p>
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
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import defaultImage from "@/assets/images/business-1.jpg";

const defaultImagePath = defaultImage;

const handleImageError = (event) => {
  if (!event.target.dataset.fallback) {
    event.target.dataset.fallback = "true";
    event.target.src = defaultImagePath;
  }
};

const router = useRouter();

// 상태 관리
const isLoading = ref(false);
const errorMessage = ref("");
const searchKeyword = ref("");
const reviews = ref([]);
const currentPage = ref(1);
const totalReviews = ref(0);
const itemsPerPage = 10;

// 계산된 속성
const totalPages = computed(() => Math.ceil(totalReviews.value / itemsPerPage));

// 필터링된 게시글 (검색)
const filteredReviews = computed(() => {
  let filtered = reviews.value;

  // 검색 필터링
  if (searchKeyword.value.trim()) {
    filtered = filtered.filter((review) =>
      review.title.toLowerCase().includes(searchKeyword.value.toLowerCase())
    );
  }

  return filtered;
});

// 게시글 목록 로드
const loadReviews = async (page = 1) => {
  isLoading.value = true;
  errorMessage.value = "";

  try {
    // TODO: API 호출로 수강후기 목록 로드
    // const response = await api.getReviews(page, itemsPerPage);
    // reviews.value = response.items;
    // totalReviews.value = response.total;
    
    reviews.value = [];
    totalReviews.value = 0;
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
    loadReviews(page);
  }
};

// 이미지 URL 생성
const getImageUrl = (filename) => {
  // TODO: 실제 API 서비스로 변경
  return `/images/${filename}`;
};

// 메서드
const filterReviews = () => {
  // computed에서 자동으로 처리되므로 별도 로직 불필요
};

const goToDetail = (id) => {
  router.push(`/reviews/${id}`);
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

// 컴포넌트 마운트 시 초기화
onMounted(() => {
  loadReviews();
});
</script>

<style scoped>
.reviews-page {
  padding: 40px 20px;
  min-height: 100vh;
}

.reviews-content {
  max-width: 1100px;
  margin: 0 auto;
}

/* 게시판 스타일 */
.board-frame {
  background: transparent;
}

.frame-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 0;
  border-bottom: 3px solid #333;
  margin-bottom: 40px;
}

.header-left {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;
}

.frame-header h3 {
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
  align-items: center;
  gap: 15px;
}

.search-box input {
  padding: 10px 15px;
  border: 2px solid #ddd;
  font-size: 1rem;
  width: 250px;
  transition: border-color 0.3s ease;
}

.search-box input:focus {
  outline: none;
  border-color: var(--primary-color);
}

.loading-message {
  text-align: center;
  padding: 60px 0;
  font-size: 1.1rem;
  color: #666;
}

.error-message {
  text-align: center;
  padding: 40px 20px;
  background-color: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
  margin-bottom: 30px;
}

.retry-btn {
  margin-top: 15px;
  padding: 10px 20px;
  background-color: #dc3545;
  color: white;
  border: none;
  cursor: pointer;
  font-size: 1rem;
}

.retry-btn:hover {
  background-color: #c82333;
}

.frame-content {
  background: transparent;
}

.post-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 30px;
  margin-bottom: 40px;
}

.post-card {
  background: white;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  cursor: pointer;
  border: 1px solid #ddd;
}

.post-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.post-image {
  width: 100%;
  height: 200px;
  overflow: hidden;
}

.post-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.post-card:hover .post-image img {
  transform: scale(1.05);
}

.post-info {
  padding: 20px;
}

.post-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #333;
  margin: 0 0 10px 0;
  line-height: 1.4;
}

.post-date {
  color: #666;
  font-size: 0.9rem;
  margin: 0;
}

.no-posts {
  text-align: center;
  padding: 60px 20px;
  color: #666;
  font-size: 1.1rem;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  margin-top: 40px;
}

.page-btn {
  padding: 10px 20px;
  background-color: var(--primary-color);
  color: white;
  border: none;
  cursor: pointer;
  font-size: 1rem;
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
  font-size: 1.1rem;
  font-weight: 500;
  color: #333;
}

@media (max-width: 768px) {
  .reviews-page {
    padding: 20px 15px;
  }

  .frame-header {
    flex-direction: column;
    gap: 20px;
    align-items: stretch;
  }

  .header-left {
    justify-content: center;
  }

  .search-box input {
    width: 100%;
  }

  .post-grid {
    grid-template-columns: 1fr;
    gap: 20px;
  }

  .frame-header h3 {
    font-size: 1.5rem;
  }

  .pagination {
    gap: 15px;
  }

  .page-btn {
    padding: 8px 16px;
    font-size: 0.9rem;
  }
}
</style> 