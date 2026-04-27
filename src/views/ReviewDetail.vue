<template>
  <div class="review-detail-page">
    <div class="review-detail-content">
      <!-- 뒤로가기 버튼 -->
      <div class="back-section">
        <button @click="goBack" class="back-btn">
          ← 목록으로 돌아가기
        </button>
      </div>

      <!-- 로딩 상태 -->
      <div v-if="isLoading" class="loading-message">
        <p>수강후기를 불러오는 중...</p>
      </div>

      <!-- 에러 메시지 -->
      <div v-if="errorMessage" class="error-message">
        <p>{{ errorMessage }}</p>
        <button @click="loadReview" class="retry-btn">다시 시도</button>
      </div>

      <!-- 수강후기 상세 내용 -->
      <div v-if="review && !isLoading && !errorMessage" class="review-detail">
        <div class="detail-header">
          <h1>{{ review.title }}</h1>
          <div class="detail-meta">
            <div class="meta-row">
              <span class="label">수강생:</span>
              <span class="value">{{ review.name }}</span>
            </div>
            <div class="meta-row">
              <span class="label">과정명:</span>
              <span class="value">{{ review.course }}</span>
            </div>
            <div class="meta-row">
              <span class="label">작성일:</span>
              <span class="value">{{ formatDate(review.created_at || review.date) }}</span>
            </div>
          </div>
        </div>

        <div v-if="review.image_filename" class="detail-image">
          <img 
            :src="getImageUrl(review.image_filename)" 
            :alt="review.title"
            @error="handleImageError"
          />
        </div>

        <div class="detail-content">
          <div class="content-text" v-html="formatContent(review.content)">
          </div>
        </div>
      </div>

      <!-- 수강후기를 찾을 수 없는 경우 -->
      <div v-if="!review && !isLoading && !errorMessage" class="not-found">
        <h2>수강후기를 찾을 수 없습니다</h2>
        <p>요청하신 수강후기가 존재하지 않거나 삭제되었습니다.</p>
        <button @click="goBack" class="back-btn">목록으로 돌아가기</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import defaultImage from "@/assets/images/business-1.jpg";

const route = useRoute();
const router = useRouter();

// 상태 관리
const isLoading = ref(false);
const errorMessage = ref('');
const review = ref(null);

// 수강후기 로드
const loadReview = async () => {
  isLoading.value = true;
  errorMessage.value = "";

  try {
    // TODO: API 호출로 수강후기 상세 정보 로드
    // const response = await api.getReview(route.params.id);
    // review.value = response;
    
    review.value = null;
  } catch (error) {
    console.error('리뷰 로드 실패:', error);
    errorMessage.value = error.message;
  } finally {
    isLoading.value = false;
  }
};

// 이미지 URL 생성
const getImageUrl = (filename) => {
  // TODO: 실제 API 서비스로 변경
  return `/images/${filename}`;
};

// 이미지 에러 처리
const handleImageError = (event) => {
  event.target.src = defaultImage;
};

// 내용 포맷팅 (줄바꿈 처리)
const formatContent = (content) => {
  if (!content) return '';
  return content.replace(/\n/g, '<br>');
};

// 메서드
const goBack = () => {
  router.push('/reviews');
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

// 컴포넌트 마운트 시 수강후기 로드
onMounted(() => {
  loadReview();
});
</script>

<style scoped>
.review-detail-page {
  padding: 40px 20px;
  min-height: 100vh;
}

.review-detail-content {
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

/* 수강후기 상세 */
.review-detail {
  background: white;
  padding: 40px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border: 1px solid #ddd;
}

.detail-header {
  border-bottom: 3px solid #333;
  padding-bottom: 20px;
  margin-bottom: 30px;
}

.detail-header h1 {
  margin: 0 0 20px 0;
  font-size: 1.8rem;
  font-weight: 700;
  color: #333;
  line-height: 1.4;
}

.detail-meta {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.meta-row {
  display: flex;
  align-items: center;
  gap: 10px;
}

.label {
  font-weight: 600;
  color: #333;
  min-width: 80px;
}

.value {
  color: #666;
}

.detail-image {
  margin-bottom: 30px;
  text-align: center;
}

.detail-image img {
  max-width: 100%;
  height: auto;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.detail-content {
  margin-bottom: 30px;
}

.content-text {
  font-size: 1.1rem;
  line-height: 1.8;
  color: #333;
  text-align: justify;
}

.not-found {
  text-align: center;
  padding: 60px 20px;
  background: white;
  border: 1px solid #ddd;
}

.not-found h2 {
  color: #333;
  margin-bottom: 20px;
}

.not-found p {
  color: #666;
  margin-bottom: 30px;
  font-size: 1.1rem;
}

@media (max-width: 768px) {
  .review-detail-page {
    padding: 20px 15px;
  }

  .review-detail {
    padding: 20px;
  }

  .detail-header h1 {
    font-size: 1.5rem;
  }

  .meta-row {
    flex-direction: column;
    align-items: flex-start;
    gap: 5px;
  }

  .label {
    min-width: auto;
  }

  .content-text {
    font-size: 1rem;
  }
}
</style> 