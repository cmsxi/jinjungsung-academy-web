<template>
  <div class="inquiry-page">
    <div class="inquiry-content">
      <div class="inquiry-form">
        <h2>문의하기</h2>
        <form @submit.prevent="submitInquiry">
          <div class="form-group">
            <label for="title">제목</label>
            <input 
              type="text" 
              id="title" 
              v-model="formData.title" 
              required
              placeholder="문의 제목을 입력해주세요"
            >
          </div>

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
            <label for="content">문의내용</label>
            <textarea 
              id="content" 
              v-model="formData.content" 
              rows="6"
              required
              placeholder="문의하실 내용을 자세히 입력해주세요."
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
            문의하기
          </button>
        </form>
      </div>

      <div class="inquiry-list">
        <h2>문의 목록</h2>
        <div class="list-header">
          <div class="search-box">
            <input 
              type="text" 
              v-model="searchQuery" 
              placeholder="검색어를 입력하세요"
              @input="filterInquiries"
            >
          </div>
        </div>

        <div class="inquiry-items">
          <div 
            v-for="(inquiry, index) in filteredInquiries" 
            :key="index"
            class="inquiry-item"
            :class="{ 'is-open': inquiry.isOpen }"
          >
            <div class="inquiry-header" @click="toggleInquiry(index)">
              <div class="inquiry-title">
                <span class="status" :class="inquiry.status">{{ inquiry.status }}</span>
                <h3>{{ inquiry.title }}</h3>
              </div>
              <div class="inquiry-info">
                <span class="date">{{ inquiry.date }}</span>
                <span class="toggle-icon">{{ inquiry.isOpen ? '−' : '+' }}</span>
              </div>
            </div>
            <div class="inquiry-content" v-show="inquiry.isOpen">
              <div class="question">
                <h4>문의내용</h4>
                <p>{{ inquiry.content }}</p>
              </div>
              <div class="answer" v-if="inquiry.answer">
                <h4>답변</h4>
                <p>{{ inquiry.answer }}</p>
              </div>
            </div>
          </div>
        </div>

        <div class="no-results" v-if="filteredInquiries.length === 0">
          <p>검색 결과가 없습니다.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Inquiry',
  data() {
    return {
      searchQuery: '',
      formData: {
        title: '',
        name: '',
        email: '',
        content: '',
        agreeTerms: false
      },
      inquiries: [
        {
          title: '교육 과정 문의',
          content: '기초 과정의 세부 커리큘럼에 대해 알고 싶습니다.',
          date: '2024-03-15',
          status: '답변완료',
          answer: '안녕하세요. 기초 과정은 프로그래밍 기초 개념부터 시작하여 실습 중심으로 진행됩니다. 자세한 커리큘럼은 교육안내 > 커리큘럼 페이지에서 확인하실 수 있습니다.',
          isOpen: false
        },
        {
          title: '수강료 할인 문의',
          content: '조기 등록 할인이 있나요?',
          date: '2024-03-14',
          status: '답변완료',
          answer: '네, 조기 등록 할인이 있습니다. 개강 2주 전까지 등록하시면 10% 할인 혜택을 받으실 수 있습니다.',
          isOpen: false
        },
        {
          title: '교육 일정 문의',
          content: '주말 과정은 없나요?',
          date: '2024-03-13',
          status: '답변대기',
          isOpen: false
        }
      ]
    }
  },
  computed: {
    isFormValid() {
      return this.formData.title && 
             this.formData.name && 
             this.formData.email && 
             this.formData.content && 
             this.formData.agreeTerms
    },
    filteredInquiries() {
      if (!this.searchQuery) return this.inquiries
      
      const query = this.searchQuery.toLowerCase()
      return this.inquiries.filter(i => 
        i.title.toLowerCase().includes(query) || 
        i.content.toLowerCase().includes(query)
      )
    }
  },
  methods: {
    submitInquiry() {
      if (!this.isFormValid) return

      // TODO: API 연동

      alert('문의가 등록되었습니다. 빠른 시일 내에 답변드리겠습니다.')
      this.resetForm()
    },
    resetForm() {
      this.formData = {
        title: '',
        name: '',
        email: '',
        content: '',
        agreeTerms: false
      }
    },
    toggleInquiry(index) {
      this.inquiries[index].isOpen = !this.inquiries[index].isOpen
    },
    filterInquiries() {
      // 검색어 입력 시 모든 문의 닫기
      this.inquiries.forEach(i => i.isOpen = false)
    }
  }
}
</script>

<style scoped>
.inquiry-page {
  padding: 20px;
}

.inquiry-content {
  max-width: 1000px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
}

.inquiry-form,
.inquiry-list {
  background: white;
  padding: 40px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

h2 {
  color: var(--primary-color);
  font-size: 1.8rem;
  margin-bottom: 30px;
  text-align: center;
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

.list-header {
  margin-bottom: 20px;
}

.search-box input {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

.search-box input:focus {
  outline: none;
  border-color: var(--primary-color);
}

.inquiry-items {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.inquiry-item {
  border: 1px solid #eee;
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.3s ease;
}

.inquiry-item:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.inquiry-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background: #f8f9fa;
  cursor: pointer;
}

.inquiry-title {
  display: flex;
  align-items: center;
  gap: 10px;
}

.status {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 500;
}

.status.답변완료 {
  background-color: #e3f2fd;
  color: #1976d2;
}

.status.답변대기 {
  background-color: #fff3e0;
  color: #f57c00;
}

.inquiry-title h3 {
  margin: 0;
  font-size: 1.1rem;
  color: #333;
}

.inquiry-info {
  display: flex;
  align-items: center;
  gap: 15px;
}

.date {
  color: #666;
  font-size: 0.9rem;
}

.toggle-icon {
  font-size: 1.5rem;
  color: var(--primary-color);
  font-weight: bold;
}

.inquiry-content {
  padding: 20px;
  border-top: 1px solid #eee;
  background: white;
}

.question,
.answer {
  margin-bottom: 20px;
}

.question h4,
.answer h4 {
  color: var(--primary-color);
  margin: 0 0 10px 0;
  font-size: 1rem;
}

.question p,
.answer p {
  margin: 0;
  color: #666;
  line-height: 1.6;
}

.answer {
  padding-top: 20px;
  border-top: 1px solid #eee;
}

.no-results {
  text-align: center;
  padding: 40px;
  color: #666;
}

@media (max-width: 768px) {
  .inquiry-content {
    grid-template-columns: 1fr;
    gap: 20px;
  }

  .inquiry-form,
  .inquiry-list {
    padding: 20px;
  }

  h2 {
    font-size: 1.5rem;
  }

  .inquiry-header {
    padding: 15px;
  }

  .inquiry-title h3 {
    font-size: 1rem;
  }

  .inquiry-content {
    padding: 15px;
  }
}
</style> 