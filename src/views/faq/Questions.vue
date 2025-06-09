<template>
  <div class="questions-page">
    <div class="questions-content">
      <div class="questions-list">
        <div 
          v-for="(question, index) in filteredQuestions" 
          :key="index"
          class="question-item"
          :class="{ 'is-open': question.isOpen }"
        >
          <div 
            class="question-header" 
            @click="toggleQuestion(index)" 
            @keydown="handleKeyDown($event, index)"
            :tabindex="0"
            role="button"
            :aria-expanded="question.isOpen"
            :aria-controls="`answer-${index}`"
          >
            <div class="question-number">Q{{ index + 1 }}</div>
            <h3>{{ question.title }}</h3>
            <span class="toggle-icon" :class="{ 'rotated': question.isOpen }">
              {{ question.isOpen ? '−' : '+' }}
            </span>
          </div>
          <transition name="accordion">
            <div 
              v-show="question.isOpen" 
              class="question-content"
              :id="`answer-${index}`"
              role="region"
              :aria-labelledby="`question-${index}`"
            >
              <div class="answer-content" v-html="question.answer"></div>
            </div>
          </transition>
        </div>
      </div>

      <div class="no-results" v-if="filteredQuestions.length === 0">
        <p>검색 결과가 없습니다.<br>다른 검색어로 시도해보세요.</p>
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
      openQuestionIndex: null, // 현재 열린 질문의 인덱스
      questions: [
        {
          title: '교육 과정은 어떤 종류가 있나요?',
          answer: `
            <p><strong>귀금속, 시계, 명품가방, 기타 잡화 및 소품 감정</strong>에 대한 전반적인 교육이 이루어집니다.</p>
            <p>또한 <strong>전당포 창업, 금거래소 운영 실무</strong> 등 각 과정별로 이론·실습·실전 노하우를 제공합니다.</p>
          `,
          isOpen: false
        },
        {
          title: '수강 대상과 전제 조건이 있나요?',
          answer: `
            <p><strong>학력·경력 제한 없이 누구나 수강 가능</strong>합니다.</p>
            <p>특별한 자격증이 없어도 실습 장비와 교재를 제공받아 기초 이론부터 현장 실습을 통해 명품감정 교육을 받으실 수 있습니다.</p>
            <p>다만, 현업에 바로 투입되길 원하는 분들은 교육과정을 수료한 뒤 <span class="highlight">협력점 및 제휴점 가입을 권장</span>드립니다.</p>
          `,
          isOpen: false
        },
        {
          title: '교육 기간과 일정은 어떻게 되나요?',
          answer: `
            <p>과정별로 <strong>4회차(총 16교시)</strong> 내외로 구성되어 운영됩니다.</p>
            <p>개강 일정은 <strong>매월 1회 이상</strong> 진행 중이며 수강신청문의를 통해 자세히 안내받으실 수 있습니다.</p>
          `,
          isOpen: false
        },
        {
          title: '교재나 실습 장비는 별도로 구입해야 하나요?',
          answer: `
            <p>교재 및 실습 장비<strong>(시금액, 시금석, 루페, 타임그래퍼 등)</strong>는 교육원에서 제공됩니다.</p>
            <p>단, <span class="notice">개인용 노트북이나 메모장은 별도 준비</span>가 필요합니다.</p>
          `,
          isOpen: false
        },
        {
          title: '교육비는 얼마인가요?',
          answer: `
            <p>명품 감정 과정(귀금속·명품·시계) 및 전당포 창업, 금거래소 실무등의 교육을 포함하여</p>
            <p class="price"><strong>440만원(부가세 포함)</strong>입니다.</p>
          `,
          isOpen: false
        },
        {
          title: '결제 방법에는 어떤 것이 있나요?',
          answer: `
            <p><strong>신용카드(무이자 할부 불가능), 계좌이체, 무통장 입금</strong> 모두 가능하며,</p>
            <p>법인계약 시에는 <strong>법인카드 또는 전자세금계산서 처리</strong>가 가능합니다.</p>
          `,
          isOpen: false
        },
        {
          title: '수료증과 자격증은 어떻게 발급되나요?',
          answer: `
            <p>이론·실습 과정을 모두 이수하고, 최종 시험에 합격 시,</p>
            <p class="certificate"><strong>국제명품감정사 자격증 취득</strong>이 가능합니다.</p>
          `,
          isOpen: false
        },
        {
          title: '교육 장소는 어디인가요?',
          answer: `
            <p>강의 확정시 <strong>서울시 강남구 인근 교육장</strong>에서 진행 예정입니다.</p>
            <p>상세 주소 및 오시는 길은 별도 안내드립니다.</p>
          `,
          isOpen: false
        },
        {
          title: '교육원 연락처 및 상담 시간은 어떻게 되나요?',
          answer: `
            <div class="contact-info">
              <p><strong>📞 전화:</strong> <a href="tel:010-9255-3721" class="contact-link">010-9255-3721</a></p>
              <p><strong>💬 카카오톡채널:</strong> <a href="http://pf.kakao.com/_FXRwn" target="_blank" class="contact-link">http://pf.kakao.com/_FXRwn</a></p>
              <p><strong>📝 1:1 문의:</strong> 홈페이지 내 수강신청문의를 이용해 주세요.</p>
            </div>
          `,
          isOpen: false
        },
        {
          title: '수강 신청 방법을 알고 싶어요.',
          answer: `
            <div class="registration-steps">
              <ol>
                <li>홈페이지 '<strong>수강 신청 문의</strong>'를 통해 결제링크를 확인</li>
                <li><strong>계약금 결제</strong> 진행하시면 신청 완료</li>
                <li>결제 확인 후, <strong>교육 전 안내 문자 및 카카오톡 채팅방 주소</strong>를 발송</li>
                <li>교육 당일 <strong>교재 및 실습 장비</strong>를 배부</li>
              </ol>
            </div>
          `,
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
      // 아코디언 방식: 하나만 열리게 하기
      const targetQuestion = this.questions[index]
      const isCurrentlyOpen = targetQuestion.isOpen
      
      // 모든 질문 닫기
      this.questions.forEach(q => q.isOpen = false)
      this.openQuestionIndex = null
      
      // 클릭한 질문이 닫혀있었다면 열기
      if (!isCurrentlyOpen) {
        targetQuestion.isOpen = true
        this.openQuestionIndex = index
        
        // 부드럽게 스크롤
        this.$nextTick(() => {
          const questionElement = document.querySelector(`.question-item:nth-child(${index + 1})`)
          if (questionElement) {
            questionElement.scrollIntoView({ 
              behavior: 'smooth', 
              block: 'nearest' 
            })
          }
        })
      }
    },
    filterQuestions() {
      // 검색어 입력 시 모든 질문 닫기
      this.questions.forEach(q => q.isOpen = false)
      this.openQuestionIndex = null
    },
    handleKeyDown(event, index) {
      // 접근성 개선: 키보드 네비게이션
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault()
        this.toggleQuestion(index)
      } else if (event.key === 'ArrowDown') {
        event.preventDefault()
        const nextIndex = Math.min(index + 1, this.filteredQuestions.length - 1)
        const nextElement = document.querySelector(`.question-item:nth-child(${nextIndex + 1}) .question-header`)
        if (nextElement) nextElement.focus()
      } else if (event.key === 'ArrowUp') {
        event.preventDefault()
        const prevIndex = Math.max(index - 1, 0)
        const prevElement = document.querySelector(`.question-item:nth-child(${prevIndex + 1}) .question-header`)
        if (prevElement) prevElement.focus()
      }
    }
  }
}
</script>

<style scoped>
.questions-page {
  padding: 32px 20px;
  min-height: calc(100vh - 160px);
}

.questions-content {
  max-width: 1000px;
  margin: 0 auto;
  background: #ffffff;
  border-radius: 2px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(160, 121, 43, 0.1);
  overflow: hidden;
}

.search-box {
  margin: 0;
  position: relative;
  border-bottom: 1px solid #e2e8f0;
  background: #fafbfc;
}

.search-box input {
  width: 100%;
  padding: 24px 60px 24px 24px;
  border: none;
  background: transparent;
  font-size: 1rem;
  color: #2d3748;
  font-weight: 400;
  transition: all 0.2s ease;
}

.search-box input::placeholder {
  color: #718096;
  font-weight: 400;
}

.search-box input:focus {
  outline: none;
  background: #ffffff;
}

.questions-list {
  display: flex;
  flex-direction: column;
  padding: 0;
}

.question-item {
  border-bottom: 1px solid #e2e8f0;
  transition: all 0.2s ease;
  background: #ffffff;
}

.question-item:last-child {
  border-bottom: none;
}

.question-item:hover {
  background: #f7fafc;
}

.question-item.is-open {
  background: #ffffff;
  border-left: 4px solid var(--primary-color);
}

.question-header {
  display: flex;
  align-items: center;
  padding: 12px 20px;
  cursor: pointer;
  transition: all 0.2s ease;
  gap: 15px;
  outline: none;
  position: relative;
}

.question-header:focus {
  background: #f1f5f9;
  box-shadow: inset 0 0 0 2px var(--primary-color);
}

.question-header:focus-visible {
  outline: 2px solid var(--primary-color);
  outline-offset: 2px;
}

.question-header:active {
  transform: translateY(1px);
}

.question-item.is-open .question-header {
  background: #ffffff;
  border-bottom: 1px solid #e2e8f0;
}

.question-number {
  background: #f1f5f9;
  color: var(--primary-color);
  width: 36px;
  height: 36px;
  border-radius: 2px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 0.875rem;
  flex-shrink: 0;
  border: 1px solid rgba(160, 121, 43, 0.2);
  transition: all 0.3s ease;
}

.question-item.is-open .question-number {
  background: var(--primary-color);
  color: #ffffff;
  border-color: var(--primary-color);
  transform: scale(1.05);
}

.question-header h3 {
  margin: 0;
  font-size: 1rem;
  color: #1a202c;
  flex: 1;
  font-weight: 600;
  line-height: 1.5;
  font-family: 'Noto Sans KR', sans-serif;
  transition: color 0.2s ease;
}

.question-item.is-open .question-header h3 {
  color: #1a202c;
  font-weight: 700;
}

.toggle-icon {
  font-size: 1.25rem;
  color: #718096;
  font-weight: 400;
  transition: all 0.3s ease;
  flex-shrink: 0;
  width: 24px;
  text-align: center;
}

.question-item.is-open .toggle-icon {
  color: var(--primary-color);
}

.toggle-icon.rotated {
  transform: rotate(180deg);
}

/* 아코디언 애니메이션 */
.accordion-enter-active,
.accordion-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
}

.accordion-enter-from,
.accordion-leave-to {
  opacity: 0;
  max-height: 0;
  padding-top: 0;
  padding-bottom: 0;
}

.accordion-enter-to,
.accordion-leave-from {
  opacity: 1;
  max-height: 1000px;
}

.question-content {
  padding: 20px 32px 24px 72px;
  background: #fafbfc;
  border-top: none;
  overflow: hidden;
}

.answer-content {
  color: #4a5568;
  line-height: 1.75;
  font-size: 1rem;
  font-weight: 400;
}

.answer-content p {
  margin-bottom: 16px;
}

.answer-content p:last-child {
  margin-bottom: 0;
}

.answer-content strong {
  color: #2d3748;
  font-weight: 600;
}

.highlight {
  background: rgba(160, 121, 43, 0.08);
  padding: 2px 6px;
  border-radius: 2px;
  color: var(--primary-color);
  font-weight: 500;
  border: 1px solid rgba(160, 121, 43, 0.15);
}

.notice {
  color: #e53e3e;
  font-weight: 500;
}

.price {
  background: linear-gradient(135deg, #fffbf0 0%, #fef5e7 100%);
  padding: 20px;
  border-radius: 2px;
  border-left: 4px solid var(--primary-color);
  font-size: 1.1rem;
  text-align: center;
  margin: 20px 0 !important;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(160, 121, 43, 0.15);
}

.certificate {
  background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
  padding: 20px;
  border-radius: 2px;
  border-left: 4px solid #0284c7;
  text-align: center;
  margin: 20px 0 !important;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(2, 132, 199, 0.15);
}

.contact-info {
  background: #f8fafc;
  padding: 24px;
  border-radius: 2px;
  border: 1px solid #e2e8f0;
}

.contact-info p {
  margin-bottom: 12px;
  padding: 8px 0;
  font-size: 1rem;
}

.contact-link {
  color: var(--primary-color);
  text-decoration: none;
  font-weight: 500;
  transition: all 0.2s ease;
  border-bottom: 1px solid transparent;
}

.contact-link:hover {
  color: #8a6c24;
  border-bottom-color: #8a6c24;
}

.registration-steps {
  background: #f8fafc;
  padding: 24px;
  border-radius: 2px;
  border-left: 4px solid var(--primary-color);
  border: 1px solid #e2e8f0;
}

.registration-steps ol {
  margin: 0;
  padding-left: 24px;
  counter-reset: step-counter;
}

.registration-steps li {
  margin-bottom: 12px;
  line-height: 1.6;
  position: relative;
  counter-increment: step-counter;
  font-size: 1rem;
}

.registration-steps li:last-child {
  margin-bottom: 0;
}

.registration-steps li::marker {
  font-weight: 600;
  color: var(--primary-color);
}

.no-results {
  text-align: center;
  padding: 80px 40px;
  color: #718096;
  background: #f8fafc;
  border-top: 1px solid #e2e8f0;
}

.no-results p {
  font-size: 1rem;
  margin: 0;
  font-weight: 400;
}

@media (max-width: 768px) {
  .questions-page {
    padding: 20px 15px;
  }

  .questions-content {
    margin: 0;
    border-radius: 0;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  }

  .question-header {
    padding: 20px 16px;
    gap: 12px;
  }

  .question-number {
    width: 32px;
    height: 32px;
    font-size: 0.75rem;
  }

  .question-header h3 {
    font-size: 1rem;
    line-height: 1.4;
  }

  .toggle-icon {
    font-size: 1.125rem;
  }

  .question-content {
    padding: 0 16px 24px 60px;
  }

  .answer-content {
    font-size: 0.9rem;
  }

  .search-box input {
    padding: 20px 50px 20px 16px;
  }

  .search-icon {
    right: 16px;
  }

  .registration-steps,
  .contact-info {
    padding: 16px;
  }

  .price, .certificate {
    padding: 16px;
    font-size: 1rem;
  }
}

@media (max-width: 480px) {
  .questions-content {
    margin: 0 -5px;
  }

  .question-header {
    padding: 16px 12px;
    gap: 10px;
  }

  .question-header h3 {
    font-size: 0.95rem;
    line-height: 1.3;
  }

  .question-content {
    padding: 0 12px 20px 54px;
  }

  .search-box input {
    padding: 18px 45px 18px 12px;
    font-size: 0.9rem;
  }

  .answer-content {
    font-size: 0.875rem;
    line-height: 1.6;
  }
}
</style> 