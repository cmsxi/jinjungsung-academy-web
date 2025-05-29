<template>
  <div class="status-detail-page">
    <div class="status-detail-content">
      <!-- 뒤로가기 버튼 -->
      <div class="back-section">
        <button @click="goBack" class="back-btn">
          ← 목록으로 돌아가기
        </button>
      </div>

      <!-- 게시글 상세 내용 -->
      <div v-if="post" class="post-detail">
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
      </div>

      <!-- 게시글을 찾을 수 없는 경우 -->
      <div v-else class="not-found">
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

// 더미 데이터 (실제로는 API에서 가져올 데이터)
const posts = [
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
];

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
  const postId = parseInt(route.params.id);
  post.value = posts.find(p => p.id === postId);
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
}

.content-text {
  color: #444;
  line-height: 1.8;
  margin: 0;
  font-size: 1.1rem;
  font-weight: 400;
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
  .status-detail-page {
    padding: 20px 10px;
  }

  .post-detail {
    padding: 20px;
  }

  .detail-header h1 {
    font-size: 1.8rem;
  }

  .detail-image {
    height: 250px;
  }

  .content-text {
    font-size: 1rem;
  }
}
</style> 