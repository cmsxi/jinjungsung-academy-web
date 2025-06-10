<template>
  <div class="admin-review-write">
    <div class="write-container">
      <div class="write-header">
        <h2>{{ isEditMode ? '수강후기 수정' : '새 수강후기 작성' }}</h2>
        <div class="header-actions">
          <button @click="goBack" class="back-btn">목록으로</button>
        </div>
      </div>

      <form @submit.prevent="submitReview" class="write-form">
        <div class="form-group">
          <label for="name">수강생 이름 *</label>
          <input
            id="name"
            v-model="formData.name"
            type="text"
            placeholder="수강생 이름을 입력하세요"
            required
          />
        </div>

        <div class="form-group">
          <label for="course">수강 과정 *</label>
          <select id="course" v-model="formData.course" required>
            <option value="">과정을 선택하세요</option>
            <option value="기초 과정">기초 과정</option>
            <option value="중급 과정">중급 과정</option>
            <option value="고급 과정">고급 과정</option>
            <option value="실무 과정">실무 과정</option>
          </select>
        </div>

        <div class="form-group">
          <label>평점 *</label>
          <div class="rating-input">
            <span
              v-for="i in 5"
              :key="i"
              class="star"
              :class="{ active: i <= formData.rating }"
              @click="setRating(i)"
            >
              ★
            </span>
            <span class="rating-text">{{ formData.rating }}점</span>
          </div>
        </div>

        <div class="form-group">
          <label for="content">후기 내용 *</label>
          <textarea
            id="content"
            v-model="formData.content"
            placeholder="수강후기를 상세히 작성해주세요"
            rows="8"
            required
          ></textarea>
          <div class="char-count">{{ formData.content.length }}/500자</div>
        </div>

        <div class="form-group">
          <label for="tags">태그</label>
          <div class="tags-input-container">
            <input
              id="tags"
              v-model="tagInput"
              type="text"
              placeholder="태그를 입력하고 Enter를 누르세요"
              @keyup.enter="addTag"
            />
            <button type="button" @click="addTag" class="add-tag-btn">추가</button>
          </div>
          <div v-if="formData.tags.length > 0" class="tags-list">
            <span
              v-for="(tag, index) in formData.tags"
              :key="index"
              class="tag"
            >
              #{{ tag }}
              <button type="button" @click="removeTag(index)" class="remove-tag">×</button>
            </span>
          </div>
        </div>

        <div class="form-actions">
          <button type="button" @click="resetForm" class="reset-btn">초기화</button>
          <button type="submit" :disabled="!isFormValid" class="submit-btn">
            {{ isEditMode ? '수정하기' : '등록하기' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AdminReviewWrite',
  data() {
    return {
      isEditMode: false,
      tagInput: '',
      formData: {
        name: '',
        course: '',
        rating: 0,
        content: '',
        tags: []
      }
    }
  },
  computed: {
    isFormValid() {
      return (
        this.formData.name.trim() &&
        this.formData.course &&
        this.formData.rating > 0 &&
        this.formData.content.trim() &&
        this.formData.content.length <= 500
      )
    }
  },
  mounted() {
    // 수정 모드인지 확인
    const reviewId = this.$route.params.id
    if (reviewId) {
      this.isEditMode = true
      this.loadReview(reviewId)
    }
  },
  methods: {
    async loadReview(id) {
      try {
        // TODO: API 호출로 후기 데이터 로드
        // const response = await api.getReview(id)
        // this.formData = response.data
        console.log('후기 로드:', id)
      } catch (error) {
        console.error('후기 로드 실패:', error)
        alert('후기를 불러오는데 실패했습니다.')
      }
    },
    
    async submitReview() {
      if (!this.isFormValid) return

      try {
        const reviewData = {
          ...this.formData,
          date: new Date().toISOString().split('T')[0]
        }

        if (this.isEditMode) {
          // TODO: API 호출로 후기 수정
          // await api.updateReview(this.$route.params.id, reviewData)
          console.log('후기 수정:', reviewData)
          alert('수강후기가 수정되었습니다.')
        } else {
          // TODO: API 호출로 후기 등록
          // await api.createReview(reviewData)
          console.log('후기 등록:', reviewData)
          alert('수강후기가 등록되었습니다.')
        }

        this.$router.push('/admin/reviews')
      } catch (error) {
        console.error('후기 저장 실패:', error)
        alert('후기 저장에 실패했습니다.')
      }
    },

    setRating(rating) {
      this.formData.rating = rating
    },

    addTag() {
      const tag = this.tagInput.trim()
      if (tag && !this.formData.tags.includes(tag)) {
        this.formData.tags.push(tag)
        this.tagInput = ''
      }
    },

    removeTag(index) {
      this.formData.tags.splice(index, 1)
    },

    resetForm() {
      if (confirm('작성 중인 내용이 모두 삭제됩니다. 계속하시겠습니까?')) {
        this.formData = {
          name: '',
          course: '',
          rating: 0,
          content: '',
          tags: []
        }
        this.tagInput = ''
      }
    },

    goBack() {
      this.$router.push('/admin/reviews')
    }
  }
}
</script>

<style scoped>
.admin-review-write {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
}

.write-container {
  background: white;
  border: 1px solid #ddd;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.write-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 30px;
  border-bottom: 1px solid #ddd;
  background: #f8f9fa;
}

.write-header h2 {
  color: var(--primary-color);
  font-size: 1.5rem;
  margin: 0;
}

.back-btn {
  padding: 8px 16px;
  background: #6c757d;
  color: white;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.back-btn:hover {
  background: #5a6268;
}

.write-form {
  padding: 30px;
}

.form-group {
  margin-bottom: 25px;
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
  font-size: 1rem;
  box-sizing: border-box;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: var(--primary-color);
}

.rating-input {
  display: flex;
  align-items: center;
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

.rating-input .star:hover {
  color: #ffd700;
}

.rating-text {
  margin-left: 10px;
  color: #666;
  font-weight: 500;
}

.char-count {
  text-align: right;
  color: #666;
  font-size: 0.9rem;
  margin-top: 5px;
}

.tags-input-container {
  display: flex;
  gap: 10px;
}

.tags-input-container input {
  flex: 1;
}

.add-tag-btn {
  padding: 12px 20px;
  background: var(--primary-color);
  color: white;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.add-tag-btn:hover {
  opacity: 0.9;
}

.tags-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 10px;
}

.tag {
  display: flex;
  align-items: center;
  gap: 5px;
  background: var(--primary-color);
  color: white;
  padding: 4px 8px;
  font-size: 0.9rem;
  border: 1px solid var(--primary-color);
}

.remove-tag {
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  padding: 0;
  font-size: 1.2rem;
  line-height: 1;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 15px;
  margin-top: 40px;
  padding-top: 20px;
  border-top: 1px solid #ddd;
}

.reset-btn {
  padding: 12px 24px;
  background: #6c757d;
  color: white;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.reset-btn:hover {
  background: #5a6268;
}

.submit-btn {
  padding: 12px 24px;
  background: var(--primary-color);
  color: white;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
}

.submit-btn:hover:not(:disabled) {
  opacity: 0.9;
}

.submit-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .admin-review-write {
    padding: 10px;
  }

  .write-header {
    flex-direction: column;
    gap: 15px;
    align-items: stretch;
  }

  .write-form {
    padding: 20px;
  }

  .tags-input-container {
    flex-direction: column;
  }

  .form-actions {
    flex-direction: column;
  }
}
</style> 