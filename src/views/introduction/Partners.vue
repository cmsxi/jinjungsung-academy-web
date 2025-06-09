<template>
  <div class="partners-page">
    <div class="partners-content">
      <div class="partners-header">
        <h2>협력업체</h2>
        <p class="partners-subtitle">
          국제명품감정교육원, 진정성 협력점과 함께 사업의 성공을 안전하게 도와줄 최적의 진정성 전문가 그룹을 소개합니다.
        </p>

      </div>
      
      <div class="experts-grid">
        <div class="expert-item" :class="{ 'has-profile': expert.profile }" v-for="expert in experts" :key="expert.name">
          <div class="expert-image">
            <div 
              class="expert-photo"
              :style="{
                backgroundImage: `url(${expert.image})`,
                backgroundPosition: `${expert.imagePosition?.x || '50%'} ${expert.imagePosition?.y || '50%'}`,
                backgroundSize: `${(expert.imageScale || 1) * 100}%`
              }"
            ></div>
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
              
              <div class="profile-section" v-if="expert.profile.약력">
                <h4>[약력]</h4>
                <ul>
                  <li v-for="item in expert.profile.약력" :key="item">{{ item }}</li>
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
    imagePosition: { x: '57%', y: '10%' },
    imageScale: 1.1,
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
  { 
    name: '김상철', 
    title: '세무사', 
    image: 김상철세무사,
    imagePosition: { x: '45%', y: '20%' },
    imageScale: 2,
    profile: {
      education: ['고려대학교 법무대학원 조세법 석사'],
      certification: ['세무사(CTA)'],
      career: ['세무법인 글로비 대표세무사'],
      experience: [
        '한국세무사회지방세제도 연구위원',
        '서울지방세무사회 조세제도연구위원',
        '중소벤처기업부 창업진흥원 평가위원'
      ]
    }
  },
  { 
    name: '김선우', 
    title: '변리사', 
    image: 김선우변리사,
    imagePosition: { x: '45%', y: '20%' },
    imageScale: 1.1,
    profile: {
      education: [
        '경희대학교 기계공학과 졸업',
        '한국과학기술원(KAIST) 공학석사'
      ],
      certification: ['변리사'],
      career: [
        '이든특허법률사무소 대표변리사',
        '한국특허전래개발원 전문위원',
        '특허법인(유한) KBK 변리사',
        '두호 특허법인 변리사'
      ],
      experience: [
        'LG전자, SK, 삼성 등 대기업 특허전무',
        '서울대 등 산학협력단 특허업무',
        '한국연구재단 미래소재 사업평가 위원',
        '한국발명진흥회 우선구매 추천사업 평가위원'
      ]
    }
  },
  { 
    name: '김홍범', 
    title: '법무사', 
    image: 김홍범법무사,
    imagePosition: { x: '55%', y: '45%' },
    imageScale: 1,
    profile: {
      certification: ['법무사'],
      career: [
        '선한동법무사 사무소 대표법무사',
        '서울동부지방법무사회',
        '창업경영지원단 단장'
      ],
      약력: [
        '경기도 직장공장새마을회 이사',
        '대한법무사협회 미래등기위원',
        '한국부동산등기법학회 회원',
        '한국민사집행법학회 회원'
      ],
      experience: [
        '한국시험법무사회 사무차장',
        'K-Startup 자문위원'
      ]
    }
  },
  { 
    name: '문초록', 
    title: '세무사', 
    image: 문초록세무사,
    imagePosition: { x: '50%', y: '0%' },
    imageScale: 1.4,
    profile: {
      education: [
        '고려대학교 경영학 학사',
        '고려대학교 법무대학원 조세법 석사과정'
      ],
      certification: ['세무사(CTA)'],
      career: ['세무법인 글로비 대표세무사'],
      experience: [
        '한국세무사회 공로상 수상(2024)',
        '한국세무사회 조세제도 연구위원회 위원',
        '한국세무사회 법제위원회 위원'
      ]
    }
  },
  { 
    name: '손석구', 
    title: '법무사', 
    image: 손석구법무사,
    imagePosition: { x: '50%', y: '50%' },
    imageScale: 0.8,
    profile: {
      education: ['서울대학교 경영학과'],
      certification: ['법무사'],
      career: ['선한동법무사 사무소 대표법무사'],
      experience: [
        '기아자동차',
        '푸르덴셜 생명보험',
        '주식회사 국민벤처 대표이사',
        '(주)SCHTECT 대표이사'
      ]
    }
  },
  { 
    name: '안소윤', 
    title: '변호사', 
    image: 안소윤변호사,
    imagePosition: { x: '0%', y: '25%' },
    imageScale: 1,
    profile: {
      education: ['서울대학교 졸업'],
      certification: ['변호사'],
      career: ['법률사무소 수석 대표변호사'],
      experience: ['<내 돈을 지켜주는 친절한 생활 속 법률 상식>']
    }
  },
  { 
    name: '윤형석', 
    title: '노무사', 
    image: 윤형석노무사,
    imagePosition: { x: '70%', y: '15%' },
    imageScale: 1.3,
    profile: {
      education: ['연세대학교 경영학과 졸업'],
      certification: ['공인노무사(CPLA)'],
      career: [
        '인사노무컨설팅 율 대표 노무사',
        '이랜드그룹 패션사업부 인사노무팀'
      ],
      experience: [
        '삼성전자 삼성리서치 출원 대리',
        '대형법원, 산학협력단 등 출원 대리',
        '중소기업, 스타트업 IP 출원 및 분석'
      ]
    }
  },
  { 
    name: '이제민', 
    title: '변호사', 
    image: 이제민변호사,
    imagePosition: { x: '50%', y: '0%' },
    imageScale: 1.0,
    profile: {
      certification: ['변호사'],
      약력: [
        '법률사무소 더올 변호사',
        '회계법인 더올 회계사'
      ]
    }
  },
  { 
    name: '조승현', 
    title: '변리사', 
    image: 조승현변리사,
    imagePosition: { x: '50%', y: '10%' },
    imageScale: 1.2,
    profile: {
      education: [
        '신목고등학교 졸업',
        '연세대학교 전기전자공학 전공'
      ],
      certification: [
        '변리사',
        '엔젤투자자, 한국엔젤투자협회'
      ],
      career: [
        '특허법인 올림 파트너 변리사',
        '리앤목특허법인 변리사',
        '나우특허법률사무소 변리사'
      ],
      experience: [
        '삼성전자 삼성리서치 출원대리',
        '대형법원, 산학협력단 등 출원대리',
        '중소기업, 스타트업 IP 출원 및 분석'
      ]
    }
  }
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
  position: relative;
}

.expert-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
}

.expert-photo {
  width: 100%;
  height: 100%;
  background-repeat: no-repeat;
  background-size: cover;
  border-radius: 50%;
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
  font-weight: 500;
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