<template>
  <div class="status-detail-page">
    <div class="status-detail-content">
      <!-- 뒤로가기 버튼 -->
      <div class="back-section">
        <button @click="goBack" class="back-btn">
          ← 목록으로 돌아가기
        </button>
      </div>

      <!-- 로딩 상태 -->
      <div v-if="isLoading" class="loading-message">
        <p>게시글을 불러오는 중...</p>
      </div>

      <!-- 에러 메시지 -->
      <div v-if="errorMessage" class="error-message">
        <p>{{ errorMessage }}</p>
        <button @click="loadPost" class="retry-btn">다시 시도</button>
      </div>

      <!-- 게시글 상세 내용 -->
      <div v-if="post && !isLoading && !errorMessage" class="post-detail">
        <div class="detail-header">
          <h1>제목: {{ post.title }}</h1>
          <div class="detail-meta">
            <span class="date">작성일: {{ formatDate(post.created_at) }}</span>
          </div>
        </div>

        <div v-if="post.image_filename" class="detail-image">
          <img 
            :src="getImageUrl(post.image_filename)" 
            :alt="post.title"
            @error="handleImageError"
          />
        </div>

        <div class="detail-content">
          <div class="content-text" v-html="formatContent(post.content)">
          </div>
        </div>
      </div>

      <!-- 게시글을 찾을 수 없는 경우 -->
      <div v-if="!post && !isLoading && !errorMessage" class="not-found">
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
import { jinjungsungService } from '@/services/jinjungsungService.js';

const route = useRoute();
const router = useRouter();

// 상태 관리
const isLoading = ref(false);
const errorMessage = ref('');
const post = ref(null);

// 게시글 로드
const loadPost = async () => {
  const postId = route.params.id;
  if (!postId) {
    errorMessage.value = '잘못된 게시글 ID입니다.';
    return;
  }

  isLoading.value = true;
  errorMessage.value = '';

  try {
    const response = await jinjungsungService.getPost(postId);
    post.value = response;
  } catch (error) {
    errorMessage.value = error.message;
  } finally {
    isLoading.value = false;
  }
};

// 이미지 URL 생성
const getImageUrl = (filename) => {
  return jinjungsungService.getImageUrl(filename);
};

// 이미지 에러 처리
const handleImageError = (event) => {
  event.target.style.display = 'none';
};

// 내용 포맷팅 (줄바꿈 처리)
const formatContent = (content) => {
  if (!content) return '';
  return content.replace(/\n/g, '<br>');
};

// 메서드
const goBack = () => {
  router.push('/education/status');
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

// 컴포넌트 마운트 시 게시글 로드
onMounted(() => {
  loadPost();
});
</script>

<style scoped>
.status-detail-page {
  padding: 40px 20px;
  min-height: 100vh;
}

.status-detail-content {
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
  border-radius: 8px;
  margin-bottom: 30px;
}

.retry-btn {
  margin-top: 15px;
  padding: 10px 20px;
  background-color: #dc3545;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
}

.retry-btn:hover {
  background-color: #c82333;
}

/* 게시글 상세 */
.post-detail {
  background: white;
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
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
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.detail-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* 내용 */
.detail-content {
  line-height: 1.8;
}

.content-text {
  color: #333;
  font-size: 1.1rem;
  line-height: 1.8;
}

.content-text :deep(br) {
  margin-bottom: 10px;
}

/* 게시글 없음 */
.not-found {
  text-align: center;
  padding: 80px 20px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.not-found h2 {
  color: #333;
  font-size: 1.5rem;
  margin-bottom: 15px;
}

.not-found p {
  color: #666;
  font-size: 1.1rem;
  margin-bottom: 30px;
}

@media (max-width: 768px) {
  .status-detail-page {
    padding: 20px 15px;
  }

  .post-detail {
    padding: 20px;
  }

  .detail-header h1 {
    font-size: 1.1rem;
  }

  .detail-meta .date {
    font-size: 1rem;
  }

  .detail-image {
    height: 250px;
    margin-bottom: 30px;
  }

  .content-text {
    font-size: 1rem;
    line-height: 1.7;
  }

  .not-found {
    padding: 60px 15px;
  }

  .not-found h2 {
    font-size: 1.3rem;
  }

  .not-found p {
    font-size: 1rem;
  }
}
</style> 