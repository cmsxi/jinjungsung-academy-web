<template>
  <div class="curriculum-page">
    <div class="curriculum-content">
      <h2>교육 커리큘럼</h2>
      
      <div class="curriculum-sections">
        <div class="curriculum-section" v-for="(section, index) in curriculumSections" :key="index">
          <div class="section-header">
            <h3>{{ section.title }}</h3>
            <span class="duration">{{ section.duration }}</span>
          </div>
          
          <div class="section-content">
            <div class="section-description">
              <p>{{ section.description }}</p>
            </div>
            
            <div class="section-topics">
              <h4>주요 학습 내용</h4>
              <ul>
                <li v-for="(topic, topicIndex) in section.topics" :key="topicIndex">
                  {{ topic }}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div class="curriculum-note">
        <h4>참고사항</h4>
        <ul>
          <li>교육 일정은 상황에 따라 조정될 수 있습니다.</li>
          <li>각 과정은 기본 4주 과정이며, 수강생의 수준에 따라 조정될 수 있습니다.</li>
          <li>실습 및 프로젝트는 교육 과정에 포함되어 있습니다.</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Curriculum',
  data() {
    return {
      curriculumSections: [
        {
          title: '기초 과정',
          duration: '4주',
          description: '프로그래밍의 기초 개념과 기본 문법을 학습합니다.',
          topics: [
            '프로그래밍 기초 개념',
            '변수와 데이터 타입',
            '제어문과 반복문',
            '함수와 모듈',
            '기본 알고리즘'
          ]
        },
        {
          title: '중급 과정',
          duration: '4주',
          description: '실무에서 필요한 핵심 기술과 프레임워크를 학습합니다.',
          topics: [
            '객체지향 프로그래밍',
            '데이터베이스 기초',
            'API 개발과 활용',
            '프레임워크 실습',
            '프로젝트 기획과 설계'
          ]
        },
        {
          title: '고급 과정',
          duration: '4주',
          description: '실무 프로젝트를 통한 심화 학습과 최신 기술 트렌드를 다룹니다.',
          topics: [
            '고급 알고리즘과 자료구조',
            '클라우드 서비스 활용',
            '보안과 성능 최적화',
            '실무 프로젝트 진행',
            '포트폴리오 작성'
          ]
        }
      ]
    }
  }
}
</script>

<style scoped>
.curriculum-page {
  padding: 20px;
}

.curriculum-content {
  max-width: 1000px;
  margin: 0 auto;
  background: white;
  padding: 40px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.curriculum-content h2 {
  color: var(--primary-color);
  font-size: 2rem;
  margin-bottom: 40px;
  text-align: center;
}

.curriculum-sections {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.curriculum-section {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 25px;
  transition: transform 0.3s ease;
}

.curriculum-section:hover {
  transform: translateY(-5px);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.section-header h3 {
  color: var(--primary-color);
  font-size: 1.4rem;
  margin: 0;
}

.duration {
  background: var(--primary-color);
  color: white;
  padding: 5px 15px;
  border-radius: 20px;
  font-size: 0.9rem;
}

.section-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
}

.section-description p {
  color: #666;
  font-size: 1.1rem;
  line-height: 1.6;
}

.section-topics h4 {
  color: #333;
  font-size: 1.2rem;
  margin-bottom: 15px;
}

.section-topics ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.section-topics ul li {
  margin: 10px 0;
  color: #555;
  font-size: 1rem;
  position: relative;
  padding-left: 20px;
}

.section-topics ul li::before {
  content: "•";
  color: var(--primary-color);
  position: absolute;
  left: 0;
  font-size: 1.2rem;
}

.curriculum-note {
  margin-top: 40px;
  padding: 20px;
  background: #fff3cd;
  border-radius: 8px;
}

.curriculum-note h4 {
  color: #856404;
  font-size: 1.2rem;
  margin-bottom: 15px;
}

.curriculum-note ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.curriculum-note ul li {
  color: #666;
  font-size: 1rem;
  margin: 8px 0;
  position: relative;
  padding-left: 20px;
}

.curriculum-note ul li::before {
  content: "•";
  color: #856404;
  position: absolute;
  left: 0;
}

@media (max-width: 768px) {
  .curriculum-content {
    padding: 20px;
  }

  .curriculum-content h2 {
    font-size: 1.8rem;
    margin-bottom: 30px;
  }

  .section-content {
    grid-template-columns: 1fr;
    gap: 20px;
  }

  .section-header h3 {
    font-size: 1.2rem;
  }

  .section-description p {
    font-size: 1rem;
  }

  .section-topics h4 {
    font-size: 1.1rem;
  }

  .section-topics ul li {
    font-size: 0.9rem;
  }
}
</style> 