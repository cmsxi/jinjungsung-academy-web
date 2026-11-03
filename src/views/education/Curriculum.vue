<template>
  <div class="curriculum-page">
    <div class="curriculum-content">
      <div class="course-switch" role="tablist" aria-label="커리큘럼 선택">
        <button
          v-for="course in COURSES"
          :key="course.id"
          type="button"
          role="tab"
          class="course-switch-btn"
          :class="{ active: selectedCourse === course.id }"
          :aria-selected="selectedCourse === course.id"
          @click="selectedCourse = course.id"
        >
          {{ course.label }}
        </button>
      </div>

      <!-- 전당포 커리큘럼 (기존 이미지) -->
      <div v-if="selectedCourse === 'pawnshop'" class="offline-curriculum">
        <div class="curriculum-image">
          <img :src="eduStepImage" alt="오프라인 커리큘럼" />
        </div>
      </div>

      <!-- 명품창업(명품감정) 커리큘럼 -->
      <div v-else class="offline-curriculum">
        <div class="luxury-curriculum">
          <p class="luxury-eyebrow">offline curriculum</p>
          <h2 class="luxury-title">명품창업(명품감정) 커리큘럼</h2>
          <table class="luxury-table">
            <thead>
              <tr>
                <th scope="col">과목</th>
                <th scope="col">강의 내용</th>
              </tr>
            </thead>
            <tbody v-for="module in LUXURY_MODULES" :key="module.title">
              <tr v-for="(lesson, index) in module.lessons" :key="lesson">
                <th
                  v-if="index === 0"
                  scope="rowgroup"
                  :rowspan="module.lessons.length"
                  class="module-title"
                >{{ module.title }}</th>
                <td>{{ lesson }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <p class="curriculum-notice-text">※ 명품감정 자격증반은 커리큘럼이 달라질 수 있습니다.</p>
    </div>
  </div>
</template>

<script setup>
  import { ref } from 'vue'
  import { useRoute } from 'vue-router'
  import eduStepImage from '@/assets/images/edu-step.png'

  const COURSES = [
    { id: 'pawnshop', label: '전당포 커리큘럼' },
    { id: 'luxury', label: '명품창업(명품감정) 커리큘럼' },
  ]

  // 기존 오프라인 커리큘럼(edu-step.png)에서 전당포 전용 항목을 뺀 감정 과목 (문대표님 확정본 오면 교체)
  const LUXURY_MODULES = [
    {
      title: '귀금속 감정',
      lessons: ['귀금속(금, 은, 다이아몬드) 감정 및 실습'],
    },
    {
      title: '명품시계 감정',
      lessons: [
        '롤렉스 브랜드 개요(모델별 특징)',
        '롤렉스 감정 실습(외부감정)',
        '롤렉스 구성품, 롤렉스 내부감정',
        '롤렉스 내부감정 및 실습, 롤렉스 시세파악 방법',
        '까르띠에, IWC, 오데마피게 감정',
        '내부 무브먼트 감정법',
      ],
    },
    {
      title: '명품가방 감정',
      lessons: [
        '명품가방 감정 및 실습(루이비통, 구찌, 샤넬, 보테가)',
        '명품가방 감정 및 실습(몽클레어, 프라다, 입생로랑, 고야드)',
        '명품가방 실습',
      ],
    },
    {
      title: '기타 고가품 · 시험',
      lessons: ['기타 고가품 감정법(IT기기, 카메라, 주류 등)', '명품감정 시험', '오답정리 및 수료식'],
    },
  ]

  const route = useRoute()
  // /education/curriculum?course=luxury 로 들어오면 명품창업 커리큘럼을 바로 표시
  const selectedCourse = ref(COURSES.some((course) => course.id === route.query.course) ? route.query.course : 'pawnshop')
</script>

<style scoped>
.curriculum-page {
  padding: 20px;
}

.curriculum-content {
  max-width: 1100px;
  margin: 0 auto;
  background: white;
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
  padding: 25px;
  transition: transform 0.3s ease;
  border: 1px solid #ddd;
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
  font-size: 0.9rem;
  border: 1px solid var(--primary-color);
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
  border: 1px solid #ffeaa7;
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
  .curriculum-page {
    padding: 0;
  }

  .curriculum-content {
    padding: 0;
    margin: 0;
    max-width: 100%;
  }

  .curriculum-content h2 {
    font-size: 1.8rem;
    margin-bottom: 30px;
  }

  .curriculum-image {
    margin: 0;
    padding: 0;
    text-align: center;
    overflow: hidden;
  }

  .curriculum-image img {
    width: 120%;
    max-width: 120%;
    transform: scale(1.1);
    transform-origin: center;
    margin: 0 auto;
    display: block;
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

.offline-curriculum {
  margin-bottom: 40px;
}

.curriculum-image {
  text-align: center;
}

.curriculum-image img {
  max-width: 100%;
  height: auto;
}

/* ── 커리큘럼 선택 버튼 ── */
.course-switch {
  display: flex;
  padding: 30px 9.4% 0;
}

.course-switch-btn {
  flex: 1;
  padding: 14px 10px;
  border: 1px solid var(--primary-color);
  background: white;
  color: var(--primary-color);
  font-size: 1.05rem;
  font-weight: 600;
  cursor: pointer;
  word-break: keep-all;
  transition: background-color 0.2s ease, color 0.2s ease;
}

.course-switch-btn + .course-switch-btn {
  border-left: none;
}

.course-switch-btn.active {
  background: var(--primary-color);
  color: white;
}

/* ── 명품창업(명품감정) 커리큘럼: 기존 시간표 이미지와 같은 형식 ── */
.luxury-curriculum {
  padding: 88px 9.4% 60px;
  text-align: left;
}

.luxury-eyebrow {
  font-size: 1rem;
  font-weight: 600;
  color: #f2c200;
  margin: 0 0 10px;
}

.luxury-curriculum .luxury-title {
  font-size: 2.1rem;
  font-weight: 700;
  color: #111;
  text-align: left;
  margin: 0 0 28px;
}

.luxury-table {
  width: 100%;
  border-collapse: collapse;
  border-top: 2px solid #111;
  font-size: 1.05rem;
  font-weight: 500;
  color: #111;
  word-break: keep-all;
}

.luxury-table thead th {
  padding: 15px 10px;
  font-weight: 600;
  text-align: center;
  border-bottom: 1px solid #999;
}

.luxury-table thead th + th {
  border-left: 1px solid #999;
}

.luxury-table td,
.luxury-table .module-title {
  padding: 15px 28px;
  border-bottom: 1px solid #999;
}

.luxury-table .module-title {
  width: 26%;
  text-align: center;
  font-weight: 600;
  border-right: 1px solid #999;
}

.curriculum-notice-text {
  padding: 0 9.4% 40px;
  font-size: 1rem;
  font-weight: 600;
  color: var(--primary-color);
  word-break: keep-all;
}

@media (max-width: 768px) {
  .course-switch {
    padding: 20px 16px 0;
  }

  .course-switch-btn {
    font-size: 0.95rem;
    padding: 12px 8px;
  }

  .luxury-curriculum {
    padding: 40px 16px 40px;
  }

  .luxury-curriculum .luxury-title {
    font-size: 1.5rem;
    margin-bottom: 20px;
  }

  .luxury-table {
    font-size: 0.95rem;
  }

  .luxury-table td,
  .luxury-table .module-title {
    padding: 12px 12px;
  }

  .luxury-table .module-title {
    width: 32%;
  }

  .curriculum-notice-text {
    padding: 0 16px 30px;
    font-size: 0.95rem;
  }
}
</style> 