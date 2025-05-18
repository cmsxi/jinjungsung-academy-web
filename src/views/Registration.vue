<template>
  <div class="registration-page">
    <div class="page-header">
      <h1>수강신청</h1>
    </div>
    
    <div class="registration-content">

      <div class="registration-form">
        <h2>신청 정보</h2>
        <form @submit.prevent="submitRegistration">
          <div class="form-group">
            <label for="name">이름</label>
            <input 
              type="text" 
              id="name" 
              v-model="formData.name" 
              required
              placeholder="홍길동"
            >
          </div>

          <div class="form-group">
            <label for="phone">연락처</label>
            <input 
              type="tel" 
              id="phone" 
              v-model="formData.phone" 
              required
              placeholder="010-0000-0000"
            >
          </div>

          <div class="form-group">
            <label for="email">이메일</label>
            <input 
              type="email" 
              id="email" 
              v-model="formData.email" 
              required
              placeholder="example@email.com"
            >
          </div>

          <div class="form-group">
            <label for="message">문의사항</label>
            <textarea 
              id="message" 
              v-model="formData.message" 
              rows="4"
              placeholder="수강 관련 문의사항을 입력해주세요."
            ></textarea>
          </div>

          <div class="form-group checkbox-group">
            <label>
              <input 
                type="checkbox" 
                v-model="formData.agreeTerms"
                required
              >
              개인정보 수집 및 이용에 동의합니다.
            </label>
          </div>

          <button 
            type="submit" 
            class="submit-btn"
            :disabled="!isFormValid"
          >
            신청하기
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Registration',
  data() {
    return {
      selectedCourse: null,
      courses: [
        {
          id: 'basic',
          name: '기초 과정',
          duration: '4주',
          price: 800000,
          features: [
            '프로그래밍 기초 개념',
            '실습 중심 교육',
            '1:1 멘토링',
            '수료증 발급'
          ]
        },
        {
          id: 'intermediate',
          name: '중급 과정',
          duration: '4주',
          price: 1000000,
          features: [
            '실무 프로젝트 진행',
            '프레임워크 실습',
            '1:1 멘토링',
            '수료증 발급'
          ]
        },
        {
          id: 'advanced',
          name: '고급 과정',
          duration: '4주',
          price: 1200000,
          features: [
            '실무 프로젝트 진행',
            '포트폴리오 작성',
            '1:1 멘토링',
            '수료증 발급'
          ]
        }
      ],
      formData: {
        name: '',
        phone: '',
        email: '',
        message: '',
        agreeTerms: false
      }
    }
  },
  computed: {
    isFormValid() {
      return this.selectedCourse && 
             this.formData.name && 
             this.formData.phone && 
             this.formData.email && 
             this.formData.agreeTerms
    }
  },
  methods: {
    selectCourse(courseId) {
      this.selectedCourse = courseId
    },
    submitRegistration() {
      if (!this.isFormValid) return

      // TODO: API 연동
      console.log('신청 정보:', {
        courseId: this.selectedCourse,
        ...this.formData
      })

      alert('수강신청이 완료되었습니다. 빠른 시일 내에 연락드리겠습니다.')
      this.resetForm()
    },
    resetForm() {
      this.selectedCourse = null
      this.formData = {
        name: '',
        phone: '',
        email: '',
        message: '',
        agreeTerms: false
      }
    }
  }
}
</script>

<style scoped>
.registration-page {
  min-height: 100vh;
  background-color: #f8f9fa;
}

.page-header {
  background-color: var(--primary-color);
  color: white;
  padding: 60px 0;
  text-align: center;
}

.page-header h1 {
  font-size: 2.5rem;
  font-weight: 700;
  margin: 0;
}

.registration-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
}

.course-selection {
  margin-bottom: 40px;
}

.course-selection h2,
.registration-form h2 {
  color: var(--primary-color);
  font-size: 1.8rem;
  margin-bottom: 30px;
  text-align: center;
}

.course-cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 30px;
  margin-bottom: 40px;
}

.course-card {
  background: white;
  border-radius: 8px;
  padding: 30px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.3s ease;
}

.course-card:hover {
  transform: translateY(-5px);
}

.course-card.selected {
  border: 2px solid var(--primary-color);
}

.course-card h3 {
  color: var(--primary-color);
  font-size: 1.4rem;
  margin-bottom: 20px;
  text-align: center;
}

.course-info {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid #eee;
}

.course-info .duration {
  color: #666;
}

.course-info .price {
  color: var(--primary-color);
  font-weight: 600;
}

.course-features {
  list-style: none;
  padding: 0;
  margin: 0;
}

.course-features li {
  color: #666;
  margin: 10px 0;
  padding-left: 20px;
  position: relative;
}

.course-features li::before {
  content: "•";
  color: var(--primary-color);
  position: absolute;
  left: 0;
}

.registration-form {
  background: white;
  border-radius: 8px;
  padding: 40px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  color: #333;
  font-weight: 500;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: var(--primary-color);
}

.checkbox-group {
  display: flex;
  align-items: center;
}

.checkbox-group label {
  display: flex;
  align-items: center;
  margin: 0;
  cursor: pointer;
}

.checkbox-group input[type="checkbox"] {
  width: auto;
  margin-right: 10px;
}

.submit-btn {
  width: 100%;
  padding: 15px;
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1.1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.submit-btn:hover:not(:disabled) {
  opacity: 0.9;
}

.submit-btn:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .page-header {
    padding: 40px 0;
  }

  .page-header h1 {
    font-size: 2rem;
  }

  .registration-content {
    padding: 20px;
  }

  .course-cards {
    grid-template-columns: 1fr;
    gap: 20px;
  }

  .registration-form {
    padding: 20px;
  }

  .course-selection h2,
  .registration-form h2 {
    font-size: 1.5rem;
  }
}
</style> 