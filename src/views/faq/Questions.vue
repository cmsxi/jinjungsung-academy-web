<template>
  <div class="questions-page">
    <div class="questions-content">
      <div class="search-box">
        <input 
          type="text" 
          v-model="searchQuery" 
          placeholder="검색어를 입력하세요"
          @input="filterQuestions"
        >
      </div>

      <div class="questions-list">
        <div 
          v-for="(question, index) in filteredQuestions" 
          :key="index"
          class="question-item"
          :class="{ 'is-open': question.isOpen }"
        >
          <div class="question-header" @click="toggleQuestion(index)">
            <h3>{{ question.title }}</h3>
            <span class="toggle-icon">{{ question.isOpen ? '−' : '+' }}</span>
          </div>
          <div class="question-content" v-show="question.isOpen">
            <p>{{ question.answer }}</p>
          </div>
        </div>
      </div>

      <div class="no-results" v-if="filteredQuestions.length === 0">
        <p>검색 결과가 없습니다.</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Questions',
  data() {
    return {
      searchQuery: '',
      questions: [
        {
          title: '수강 신청은 어떻게 하나요?',
          answer: '홈페이지의 수강신청 메뉴에서 원하시는 과정을 선택하고 신청서를 작성하시면 됩니다. 작성하신 내용을 검토 후 빠른 시일 내에 연락드리겠습니다.',
          isOpen: false
        },
        {
          title: '교육 과정의 수강료는 어떻게 되나요?',
          answer: '기초 과정은 80만원, 중급 과정은 100만원, 고급 과정은 120만원입니다. 각 과정은 4주 과정이며, 실습 및 프로젝트가 포함되어 있습니다.',
          isOpen: false
        },
        {
          title: '수강료 결제 방법은 어떻게 되나요?',
          answer: '계좌이체, 신용카드 결제가 가능합니다. 자세한 결제 방법은 수강 신청 후 안내해 드리겠습니다.',
          isOpen: false
        },
        {
          title: '교육 일정은 어떻게 되나요?',
          answer: '평일 오전 10시부터 오후 6시까지 진행됩니다. 주말 및 공휴일은 휴강입니다.',
          isOpen: false
        },
        {
          title: '수료증은 발급되나요?',
          answer: '네, 과정 수료 후 수료증이 발급됩니다. 수료증은 취업이나 이력서 작성 시 활용하실 수 있습니다.',
          isOpen: false
        },
        {
          title: '교육 중 휴강이나 보충 수업은 어떻게 되나요?',
          answer: '강사나 교육원의 사정으로 휴강이 발생할 경우, 보충 수업을 진행합니다. 개인 사정으로 인한 휴강은 사전에 말씀해 주시면 보충 수업을 진행할 수 있습니다.',
          isOpen: false
        }
      ]
    }
  },
  computed: {
    filteredQuestions() {
      if (!this.searchQuery) return this.questions
      
      const query = this.searchQuery.toLowerCase()
      return this.questions.filter(q => 
        q.title.toLowerCase().includes(query) || 
        q.answer.toLowerCase().includes(query)
      )
    }
  },
  methods: {
    toggleQuestion(index) {
      this.questions[index].isOpen = !this.questions[index].isOpen
    },
    filterQuestions() {
      // 검색어 입력 시 모든 질문 닫기
      this.questions.forEach(q => q.isOpen = false)
    }
  }
}
</script>

<style scoped>
.questions-page {
  padding: 20px;
}

.questions-content {
  max-width: 800px;
  margin: 0 auto;
  background: white;
  padding: 40px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.search-box {
  margin-bottom: 30px;
}

.search-box input {
  width: 100%;
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

.search-box input:focus {
  outline: none;
  border-color: var(--primary-color);
}

.questions-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.question-item {
  border: 1px solid #eee;
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.3s ease;
}

.question-item:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.question-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background: #f8f9fa;
  cursor: pointer;
}

.question-header h3 {
  margin: 0;
  font-size: 1.1rem;
  color: #333;
}

.toggle-icon {
  font-size: 1.5rem;
  color: var(--primary-color);
  font-weight: bold;
}

.question-content {
  padding: 20px;
  border-top: 1px solid #eee;
  background: white;
}

.question-content p {
  margin: 0;
  color: #666;
  line-height: 1.6;
}

.no-results {
  text-align: center;
  padding: 40px;
  color: #666;
}

@media (max-width: 768px) {
  .questions-content {
    padding: 20px;
  }

  .question-header {
    padding: 15px;
  }

  .question-header h3 {
    font-size: 1rem;
  }

  .question-content {
    padding: 15px;
  }
}
</style> 