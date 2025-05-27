<template>
  <div class="reviews-page">
    <div class="page-header">
      <h1>수강후기</h1>
    </div>


  </div>
</template>

<script>
export default {
  name: 'Reviews',
  data() {
    return {
      searchQuery: '',
      selectedCourse: '',
      selectedRating: '',
      formData: {
        name: '',
        course: '',
        rating: 0,
        content: '',
        tags: [],
        tagsInput: ''
      },
      reviews: [
        {
          name: '김철수',
          course: '기초 과정',
          rating: 5,
          content: '프로그래밍을 처음 배우는 제게 정말 좋은 기회였습니다. 실습 위주의 교육으로 실제로 코딩하는 능력이 많이 향상되었습니다. 특히 1:1 멘토링이 큰 도움이 되었습니다.',
          date: '2024-03-15',
          tags: ['실습중심', '멘토링', '기초부터']
        },
        {
          name: '이영희',
          course: '중급 과정',
          rating: 5,
          content: '실무 프로젝트를 통해 실제 업무 환경에서 필요한 기술들을 배울 수 있었습니다. 강사님의 실무 경험이 풍부하셔서 많은 도움이 되었습니다.',
          date: '2024-03-14',
          tags: ['실무프로젝트', '취업성공', '실무능력']
        },
        {
          name: '박지민',
          course: '고급 과정',
          rating: 4,
          content: '포트폴리오 작성과 취업 준비까지 도와주셔서 취업에 성공했습니다. 특히 실무에서 바로 활용할 수 있는 기술들을 배울 수 있어 좋았습니다.',
          date: '2024-03-13',
          tags: ['포트폴리오', '취업성공', '실무기술']
        }
      ]
    }
  },
  computed: {
    isFormValid() {
      return this.formData.name && 
             this.formData.course && 
             this.formData.rating > 0 && 
             this.formData.content
    },
    filteredReviews() {
      let filtered = this.reviews

      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase()
        filtered = filtered.filter(r => 
          r.content.toLowerCase().includes(query) ||
          r.tags.some(tag => tag.toLowerCase().includes(query))
        )
      }

      if (this.selectedCourse) {
        filtered = filtered.filter(r => r.course === this.selectedCourse)
      }

      if (this.selectedRating) {
        filtered = filtered.filter(r => r.rating >= parseInt(this.selectedRating))
      }

      return filtered
    }
  },
  methods: {
    filterReviews() {
      // 검색 및 필터링 로직은 computed 속성에서 처리
    },
    submitReview() {
      if (!this.isFormValid) return

      // TODO: API 연동
      console.log('후기 정보:', this.formData)

      alert('후기가 등록되었습니다.')
      this.resetForm()
    },
    resetForm() {
      this.formData = {
        name: '',
        course: '',
        rating: 0,
        content: '',
        tags: [],
        tagsInput: ''
      }
    },
    addTag() {
      const tag = this.formData.tagsInput.trim()
      if (tag && !this.formData.tags.includes(tag)) {
        this.formData.tags.push(tag)
      }
      this.formData.tagsInput = ''
    },
    removeTag(index) {
      this.formData.tags.splice(index, 1)
    }
  }
}
</script>

<style scoped>
.reviews-page {
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

.reviews-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
}

.reviews-summary {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 30px;
  margin-bottom: 40px;
}

.summary-item {
  background: white;
  padding: 30px;
  border-radius: 8px;
  text-align: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.summary-item h3 {
  color: #666;
  font-size: 1.1rem;
  margin-bottom: 15px;
}

.summary-item .number {
  color: var(--primary-color);
  font-size: 2rem;
  font-weight: 700;
  margin: 0;
}

.rating {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
}

.stars {
  color: #ffd700;
  font-size: 1.5rem;
}

.reviews-filter {
  margin-bottom: 30px;
}

.search-box {
  margin-bottom: 15px;
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

.filter-options {
  display: flex;
  gap: 15px;
}

.filter-options select {
  flex: 1;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  background-color: white;
}

.filter-options select:focus {
  outline: none;
  border-color: var(--primary-color);
}

.reviews-list {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 30px;
  margin-bottom: 40px;
}

.review-card {
  background: white;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.review-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
}

.reviewer-info h3 {
  margin: 0 0 5px 0;
  font-size: 1.2rem;
  color: #333;
}

.course {
  color: #666;
  font-size: 0.9rem;
}

.review-rating {
  display: flex;
  align-items: center;
  gap: 10px;
}

.review-rating .stars {
  font-size: 1.2rem;
}

.rating-number {
  color: var(--primary-color);
  font-weight: 600;
}

.review-content {
  margin-bottom: 20px;
}

.review-content p {
  margin: 0;
  color: #666;
  line-height: 1.6;
}

.review-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.date {
  color: #999;
  font-size: 0.9rem;
}

.tags {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.tag {
  background: #f0f0f0;
  color: #666;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.9rem;
}

.write-review {
  background: white;
  padding: 40px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.write-review h2 {
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
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: var(--primary-color);
}

.rating-input {
  display: flex;
  gap: 5px;
}

.rating-input .star {
  font-size: 2rem;
  color: #ddd;
  cursor: pointer;
  transition: color 0.3s ease;
}

.rating-input .star.active {
  color: #ffd700;
}

.tags-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 10px;
}

.tags-list .tag {
  display: flex;
  align-items: center;
  gap: 5px;
}

.remove-tag {
  background: none;
  border: none;
  color: #999;
  cursor: pointer;
  padding: 0;
  font-size: 1.2rem;
  line-height: 1;
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

.no-results {
  text-align: center;
  padding: 40px;
  color: #666;
}

@media (max-width: 768px) {
  .page-header {
    padding: 40px 0;
  }

  .page-header h1 {
    font-size: 2rem;
  }

  .reviews-content {
    padding: 20px;
  }

  .reviews-summary {
    grid-template-columns: 1fr;
    gap: 20px;
  }

  .reviews-list {
    grid-template-columns: 1fr;
    gap: 20px;
  }

  .filter-options {
    flex-direction: column;
  }

  .write-review {
    padding: 20px;
  }

  .write-review h2 {
    font-size: 1.5rem;
  }
}
</style> 