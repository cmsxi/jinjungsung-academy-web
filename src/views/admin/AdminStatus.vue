<template>
  <div class="admin-status-page">
    <div class="admin-status-content">
      <!-- 헤더 -->
      <div class="admin-header">
        <div class="header-left">
          <h3>수강현황 게시판 관리</h3>
          <div class="post-count">총 {{ filteredPosts.length }}개 게시글</div>
        </div>
        <div class="header-right">
          <button @click="goToWrite" class="write-btn">
            새 글 작성
          </button>
          <button @click="logout" class="logout-btn">
            로그아웃
          </button>
        </div>
      </div>

      <!-- 검색 -->
      <div class="search-section">
        <input 
          v-model="searchKeyword" 
          type="text" 
          placeholder="제목으로 검색하세요..."
          class="search-input"
        />
      </div>

      <!-- 게시글 목록 -->
      <div class="post-grid">
        <div 
          v-for="post in filteredPosts" 
          :key="post.id"
          class="post-card"
          @click="goToDetail(post.id)"
        >
          <div class="post-image">
            <img :src="post.image" :alt="post.title" />
          </div>
          <div class="post-info">
            <h4 class="post-title">{{ post.title }}</h4>
            <p class="post-date">{{ formatDate(post.date) }}</p>
          </div>
        </div>
      </div>

      <!-- 게시글이 없을 때 -->
      <div v-if="filteredPosts.length === 0" class="no-posts">
        <p>검색 결과가 없습니다.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

// 상태 관리
const searchKeyword = ref('');

// 더미 데이터
const posts = ref([
  {
    id: 1,
    title: '1주차 전당포 창업 기초과정',
    date: '2024-02-15',
    course: '전당포 창업 기초과정',
    week: 1,
    image: '/src/assets/images/business-1.jpg',
    content: '전당포 사업의 기본 개념과 법적 요건에 대해 학습했습니다. 사업자등록 절차와 필요 서류에 대해 상세히 다뤘으며, 실제 창업 사례를 통해 이해도를 높였습니다. 전당포업 관련 법규와 규제사항, 허가 절차 등을 체계적으로 학습하여 창업 준비에 필요한 기초 지식을 습득했습니다.'
  },
  {
    id: 2,
    title: '2주차 귀금속 감정 실무',
    date: '2024-02-10',
    course: '전당포 창업 기초과정',
    week: 2,
    image: '/src/assets/images/business-2.jpg',
    content: '귀금속 감정 기초와 시세 파악 방법을 학습했습니다. 금, 은, 백금의 특성과 순도 측정법을 실습을 통해 익혔으며, 시장 동향 분석 방법을 배웠습니다. 감정 도구 사용법과 위조품 판별 기술, 시세 변동 요인 분석 등 실무에 직접 활용할 수 있는 전문 지식을 습득했습니다.'
  },
  {
    id: 3,
    title: '3주차 금거래소 운영 시스템',
    date: '2024-02-05',
    course: '금거래소 창업과정',
    week: 3,
    image: '/src/assets/images/business-3.jpg',
    content: '금거래소 운영 시스템과 고객 관리 방법에 대해 학습했습니다. POS 시스템 활용법과 재고 관리, 회계 처리 방법을 실무 중심으로 교육했습니다. 고객 상담 기법과 매장 운영 노하우, 리스크 관리 방법 등을 종합적으로 다뤄 실제 창업 시 필요한 운영 역량을 기를 수 있었습니다.'
  }
]);

// 필터링된 게시글
const filteredPosts = computed(() => {
  let filtered = posts.value;
  
  if (searchKeyword.value.trim()) {
    filtered = filtered.filter(post => 
      post.title.toLowerCase().includes(searchKeyword.value.toLowerCase())
    );
  }
  
  return filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
});

// 메서드
const goToDetail = (id) => {
  router.push(`/admin/status/${id}`);
};

const goToWrite = () => {
  router.push('/admin/status/write');
};

const logout = () => {
  if (confirm('로그아웃 하시겠습니까?')) {
    sessionStorage.removeItem('adminAuth');
    router.push('/admin/login');
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

// 인증 확인
onMounted(() => {
  if (!sessionStorage.getItem('adminAuth')) {
    router.push('/admin/login');
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
  max-width: 1100px;
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

.write-btn, .logout-btn {
  padding: 12px 20px;
  border: 2px solid #333;
  background: white;
  color: #333;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.write-btn:hover {
  background: var(--primary-color);
  color: white;
  border-color: var(--primary-color);
}

.logout-btn:hover {
  background: #dc3545;
  color: white;
  border-color: #dc3545;
}

/* 검색 */
.search-section {
  margin-bottom: 30px;
  display: flex;
  justify-content: center;
}

.search-input {
  border: 2px solid #666;
  padding: 12px 15px;
  font-size: 1rem;
  min-width: 300px;
  transition: border-color 0.3s ease;
}

.search-input:focus {
  outline: none;
  border-color: var(--primary-color);
}

/* 게시글 그리드 */
.post-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 40px;
}

.post-card {
  background: transparent;
  transition: all 0.3s ease;
  cursor: pointer;
}

.post-card:hover {
  transform: translateY(-3px);
}

.post-image {
  width: 100%;
  height: 200px;
  overflow: hidden;
  margin-bottom: 15px;
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
  padding: 0;
  background: transparent;
}

.post-title {
  color: #333;
  font-size: 1.3rem;
  font-weight: 600;
  margin: 0 0 8px 0;
  line-height: 1.4;
  letter-spacing: 0.5px;
}

.post-date {
  color: #666;
  font-size: 0.95rem;
  margin: 0;
  font-weight: 400;
}

.no-posts {
  text-align: center;
  padding: 80px 20px;
  color: #666;
}

.no-posts p {
  font-size: 1.2rem;
  margin: 0;
  font-weight: 400;
}

/* 반응형 */
@media (max-width: 1024px) {
  .post-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 30px;
  }
}

@media (max-width: 768px) {
  .admin-status-page {
    padding: 20px 10px;
  }

  .admin-header {
    flex-direction: column;
    gap: 20px;
    align-items: flex-start;
  }

  .header-left {
    width: 100%;
  }

  .header-right {
    width: 100%;
    justify-content: flex-start;
  }

  .search-input {
    min-width: 100%;
  }

  .post-grid {
    grid-template-columns: 1fr;
    gap: 25px;
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
}
</style> 