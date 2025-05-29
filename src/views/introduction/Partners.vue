<template>
  <div class="partners-page">
    <div class="partners-content">
      <div class="partners-header">
        <h2>협력업체</h2>
        <p class="partners-subtitle">
          - 국제명품감정교육원, 진정성 협력점과 함께
          사업의 성공을 도와줄 최적의 진정성 전문가 그룹 -
        </p>

      </div>
      
      <div class="experts-grid">
        <div class="expert-item" :class="{ 'has-profile': expert.profile }" v-for="expert in experts" :key="expert.name">
          <div class="expert-image">
            <img :src="expert.image" :alt="expert.name" loading="lazy" />
          </div>
          <div class="expert-info">
            <h3>{{ expert.name }} {{ expert.title }}</h3>
            
            <div v-if="expert.profile" class="expert-profile">
              <div class="profile-section" v-if="expert.profile.education">
                <h4>[학력]</h4>
                <ul>
                  <li v-for="item in expert.profile.education" :key="item">{{ item }}</li>
                </ul>
              </div>
              
              <div class="profile-section" v-if="expert.profile.certification">
                <h4>[자격]</h4>
                <ul>
                  <li v-for="item in expert.profile.certification" :key="item">{{ item }}</li>
                </ul>
              </div>
              
              <div class="profile-section" v-if="expert.profile.career">
                <h4>[이력]</h4>
                <ul>
                  <li v-for="item in expert.profile.career" :key="item">{{ item }}</li>
                </ul>
              </div>
              
              <div class="profile-section" v-if="expert.profile.experience">
                <h4>[주요 경력]</h4>
                <ul>
                  <li v-for="item in expert.profile.experience" :key="item">{{ item }}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// 전문가 이미지 import
import 이제민변호사 from '@/assets/images/expert/이제민 변호사 사진.jpg';
import 공정훈노무사 from '@/assets/images/expert/공정훈 노무사 사진.jpg';
import 김상철세무사 from '@/assets/images/expert/김상철 세무사 사진.jpg';
import 김선우변리사 from '@/assets/images/expert/김선우 변리사 사진 3.jpg';
import 김홍범법무사 from '@/assets/images/expert/김홍범 법무사 사진.jpg';
import 문초록세무사 from '@/assets/images/expert/문초록 세무사 사진.png';
import 손석구법무사 from '@/assets/images/expert/손석구 법무사 사진.png';
import 안소윤변호사 from '@/assets/images/expert/안소윤 변호사 사진 2.jpg';
import 윤형석노무사 from '@/assets/images/expert/윤형석 노무사 사진.png';
import 조승현변리사 from '@/assets/images/expert/조승현 변리사 사진.png';

const experts = [
  { 
    name: '공정훈', 
    title: '노무사', 
    image: 공정훈노무사,
    profile: {
      education: ['광운대학교 법학, 경영학과 졸업'],
      certification: ['공인노무사(CPLA)'],
      career: [
        '노무법인 수 서울(광명)지사 대표노무사',
        '노무법인 파로스 파트너 노무사'
      ],
      experience: [
        '이코노미스트 노동법 칼럼 <공정훈의 공정노무> 위원',
        '대전, 광주 학원연합회 노무자문 위원',
        '삼일인포마인 노동법 전문 칼럼위원'
      ]
    }
  },
  { name: '김상철', title: '세무사', image: 김상철세무사 },
  { name: '김선우', title: '변리사', image: 김선우변리사 },
  { name: '김홍범', title: '법무사', image: 김홍범법무사 },
  { name: '문초록', title: '세무사', image: 문초록세무사 },
  { name: '손석구', title: '법무사', image: 손석구법무사 },
  { name: '안소윤', title: '변호사', image: 안소윤변호사 },
  { name: '윤형석', title: '노무사', image: 윤형석노무사 },
  { name: '이제민', title: '변호사', image: 이제민변호사 },
  { name: '조승현', title: '변리사', image: 조승현변리사 }
];
</script>

<style scoped>
.partners-page {
  padding: 40px 20px;
  min-height: 100vh;
  background-color: #fff;
}

.partners-content {
  max-width: 1100px;
  margin: 0 auto;
}

.partners-header {
  text-align: left;
  margin-bottom: 50px;
}

.partners-header h2 {
  color: var(--primary-color);
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 20px;
}

.partners-subtitle {
  color: #666;
  font-size: 1.25rem;
  line-height: 1.6;
  margin: 0;
}

.experts-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.experts-grid p {
  grid-column: 1 / -1;
  color: var(--primary-color);
  font-size: 1.3rem;
  font-weight: 600;
  margin: 0 0 20px 0;
}

.expert-item {
  background: white;
  border: 1px solid #e0e0e0;
  padding: 20px;
  display: flex;
  align-items: flex-start;
  gap: 20px;
}

.expert-item.has-profile {
  align-items: flex-start;
}

.expert-item.has-profile .expert-image {
  flex-shrink: 0;
  width: 120px;
  height: 120px;
}

.expert-item.has-profile .expert-info {
  flex: 1;
}

.expert-image {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  overflow: hidden;
  border: 2px solid var(--primary-color);
  flex-shrink: 0;
}

.expert-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.expert-info {
  flex: 1;
}

.expert-info h3 {
  color: var(--primary-color);
  font-size: 1.3rem;
  font-weight: 600;
  margin-bottom: 5px;
}

.expert-info p {
  color: #666;
  font-size: 1rem;
  margin: 0;
}

.expert-profile {
  margin-top: 10px;
}

.profile-section {
  margin-bottom: 10px;
}

.profile-section h4 {
  color: var(--primary-color);
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 5px;
}

.profile-section ul {
  list-style-type: disc;
  padding-left: 20px;
}

.profile-section li {
  color: #666;
  font-size: 1rem;
  margin-bottom: 5px;
}

@media (max-width: 1024px) {
  .partners-content {
    max-width: 900px;
  }
}

@media (max-width: 768px) {
  .partners-page {
    padding: 30px 15px;
  }

  .partners-content {
    max-width: 100%;
  }

  .partners-header {
    text-align: center;
    margin-bottom: 40px;
  }

  .partners-header h2 {
    font-size: 1.8rem;
  }

  .partners-subtitle {
    font-size: 1.1rem;
  }

  .experts-grid {
    grid-template-columns: 1fr;
    gap: 15px;
  }

  .expert-item {
    padding: 15px;
    gap: 15px;
  }

  .expert-image {
    width: 70px;
    height: 70px;
  }

  .expert-info h3 {
    font-size: 1.2rem;
  }

  .expert-info p {
    font-size: 0.95rem;
  }

  .profile-section h4 {
    font-size: 1.1rem;
  }

  .profile-section li {
    font-size: 0.9rem;
  }
}

@media (max-width: 480px) {
  .partners-page {
    padding: 20px 10px;
  }

  .partners-header h2 {
    font-size: 1.6rem;
  }

  .partners-subtitle {
    font-size: 1rem;
    line-height: 1.5;
  }

  .experts-grid {
    gap: 12px;
  }

  .expert-item {
    padding: 12px;
    gap: 12px;
  }

  .expert-image {
    width: 60px;
    height: 60px;
  }

  .expert-info h3 {
    font-size: 1.1rem;
  }

  .expert-info p {
    font-size: 0.9rem;
  }

  .experts-grid p {
    font-size: 1.2rem;
    margin-bottom: 15px;
  }

  .profile-section h4 {
    font-size: 1.1rem;
  }

  .profile-section li {
    font-size: 0.9rem;
  }
}
</style> 