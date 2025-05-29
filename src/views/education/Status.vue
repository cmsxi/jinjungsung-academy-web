<template>
  <div class="status-page">
    <div class="status-content">

      <!-- 게시판 스타일 -->
      <div class="board-frame">
        <div class="frame-header">
          <div class="header-left">
            <h3>수강현황</h3>
            <div class="post-count">총 {{ filteredPosts.length }}개 게시글</div>
          </div>
          <div class="header-right">
            <div class="search-box">
              <input 
                v-model="searchKeyword" 
                type="text" 
                placeholder="제목으로 검색하세요..."
                @input="filterPosts"
              />
            </div>
          </div>
        </div>
        
        <div class="frame-content">
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
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

// 상태 관리
const searchKeyword = ref('');

// 더미 데이터 (날짜 최신순으로 정렬)
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
  },
  {
    id: 4,
    title: '4주차 중고명품 진위 감별법',
    date: '2024-01-30',
    course: '중고명품사업 고급과정',
    week: 4,
    image: '/src/assets/images/business-1.jpg',
    content: '명품 브랜드별 진위 감별 기법을 심화 학습했습니다. 루이비통, 샤넬, 에르메스 등 주요 브랜드의 특징과 위조품 판별 포인트를 실제 제품을 통해 실습했습니다. 시리얼 넘버 확인법, 소재 품질 검증, 제작 기법 분석 등 전문적인 감정 능력을 향상시켰습니다.'
  },
  {
    id: 5,
    title: '5주차 온라인 마케팅 전략',
    date: '2024-01-25',
    course: '전당포 창업 기초과정',
    week: 5,
    image: '/src/assets/images/business-2.jpg',
    content: '디지털 시대에 맞는 온라인 마케팅 전략을 학습했습니다. SNS 활용법, 네이버 블로그 운영, 구글 광고 등 다양한 온라인 채널을 통한 고객 유치 방법을 배웠습니다. 브랜딩 전략과 콘텐츠 마케팅, 고객 리뷰 관리 등 실무에 바로 적용할 수 있는 마케팅 노하우를 습득했습니다.'
  },
  {
    id: 6,
    title: '6주차 세무 및 회계 관리',
    date: '2024-01-20',
    course: '금거래소 창업과정',
    week: 6,
    image: '/src/assets/images/business-3.jpg',
    content: '사업 운영에 필수적인 세무 및 회계 관리 방법을 학습했습니다. 부가가치세 신고, 종합소득세 처리, 장부 작성법 등 기본적인 세무 업무를 익혔습니다. 회계 프로그램 사용법과 재무제표 작성, 자금 관리 방법 등 체계적인 사업 관리를 위한 실무 지식을 습득했습니다.'
  }
]);

// 필터링된 게시글 (검색 + 날짜 최신순 정렬)
const filteredPosts = computed(() => {
  let filtered = posts.value;
  
  // 검색 필터링
  if (searchKeyword.value.trim()) {
    filtered = filtered.filter(post => 
      post.title.toLowerCase().includes(searchKeyword.value.toLowerCase())
    );
  }
  
  // 날짜 최신순 정렬
  return filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
});

// 메서드
const filterPosts = () => {
  // computed에서 자동으로 처리되므로 별도 로직 불필요
};

const goToDetail = (id) => {
  router.push(`/education/status/${id}`);
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

// 컴포넌트 마운트 시 초기화
onMounted(() => {
  // 필요한 초기화 작업
});
</script>

<style scoped>
.status-page {
  padding: 40px 20px;
  min-height: 100vh;
}

.status-content {
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
}

.search-box {
  display: flex;
  align-items: center;
  border: 2px solid #666;
  padding: 0;
  min-width: 300px;
  transition: border-color 0.3s ease;
}

.search-box input {
  flex: 1;
  border: none;
  outline: none;
  padding: 12px 18px;
  font-size: 1rem;
  background: transparent;
  color: #333;
}

.search-box input::placeholder {
  color: #999;
}

.frame-content {
  padding: 0;
}

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

/* 검색 결과 없음 */
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
  .status-page {
    padding: 20px 10px;
  }

  .frame-header {
    flex-direction: column;
    gap: 20px;
    align-items: flex-start;
    padding: 15px 0;
  }

  .header-left {
    width: 100%;
  }

  .header-right {
    width: 100%;
  }

  .search-box {
    min-width: 100%;
    width: 100%;
  }

  .post-grid {
    grid-template-columns: 1fr;
    gap: 25px;
  }

  .post-image {
    height: 150px;
  }

  .post-title {
    font-size: 1.1rem;
  }

  .post-date {
    font-size: 0.85rem;
  }
}
</style> 