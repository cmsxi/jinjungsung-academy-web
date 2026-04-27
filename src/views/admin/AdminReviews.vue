<template>
  <div class="admin-reviews">
    <div class="admin-container">
      <div class="admin-header">
        <div class="header-left">
          <h3>수강후기 게시판 관리</h3>
          <div class="post-count">총 {{ reviews.length }}개 후기</div>
        </div>
        <div class="header-right">
          <button @click="goToWrite" class="write-btn">새 후기 작성</button>
        </div>
      </div>

      <div class="admin-content">
        <div class="search-bar">
          <input
            v-model="searchKeyword"
            type="text"
            placeholder="수강생 이름, 과정명, 내용으로 검색..."
            @input="filterReviews"
          />
        </div>

        <div class="reviews-table">
          <table>
            <thead>
              <tr>
                <th>번호</th>
                <th>수강생</th>
                <th>과정명</th>
                <th>내용 미리보기</th>
                <th>작성일</th>
                <th>관리</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(review, index) in filteredReviews" :key="review.id">
                <td>{{ reviews.length - index }}</td>
                <td class="name-cell">{{ review.name }}</td>
                <td class="course-cell">{{ review.course }}</td>
                <td class="content-preview">
                  {{ getContentPreview(review.content) }}
                </td>
                <td class="date-cell">{{ formatDate(review.date) }}</td>
                <td class="actions-cell">
                  <button @click="editReview(review.id)" class="edit-btn">수정</button>
                  <button @click="deleteReview(review.id)" class="delete-btn">삭제</button>
                </td>
              </tr>
            </tbody>
          </table>

          <div v-if="filteredReviews.length === 0" class="no-data">
            <p>{{ searchKeyword ? '검색 결과가 없습니다.' : '등록된 수강후기가 없습니다.' }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AdminReviews',
  data() {
    return {
      searchKeyword: '',
      reviews: []
    }
  },
  computed: {
    filteredReviews() {
      if (!this.searchKeyword.trim()) {
        return this.reviews
      }

      const keyword = this.searchKeyword.toLowerCase()
      return this.reviews.filter(review =>
        review.name.toLowerCase().includes(keyword) ||
        review.course.toLowerCase().includes(keyword) ||
        review.content.toLowerCase().includes(keyword)
      )
    }
  },
  mounted() {
    this.loadReviews()
  },
  methods: {
    async loadReviews() {
      try {
        // TODO: API 호출로 후기 목록 로드
        // const response = await api.getReviews()
        // this.reviews = response.data
      } catch (error) {
        console.error('후기 목록 로드 실패:', error)
      }
    },

    filterReviews() {
      // computed에서 자동으로 처리됨
    },

    goToWrite() {
      this.$router.push('/admin/reviews/write')
    },

    editReview(id) {
      this.$router.push(`/admin/reviews/edit/${id}`)
    },

    async deleteReview(id) {
      if (!confirm('정말로 이 수강후기를 삭제하시겠습니까?')) {
        return
      }

      try {
        // TODO: API 호출로 후기 삭제
        // await api.deleteReview(id)
        this.reviews = this.reviews.filter(review => review.id !== id)
        alert('수강후기가 삭제되었습니다.')
      } catch (error) {
        console.error('후기 삭제 실패:', error)
        alert('후기 삭제에 실패했습니다.')
      }
    },

    getContentPreview(content) {
      return content.length > 50 ? content.substring(0, 50) + '...' : content
    },

    formatDate(dateString) {
      const date = new Date(dateString)
      return date.toLocaleDateString('ko-KR')
    }
  }
}
</script>

<style scoped>
.admin-reviews {
  padding: 20px;
}

.admin-container {
  max-width: 1200px;
  margin: 0 auto;
  background: white;
  border: 1px solid #ddd;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.admin-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 30px;
  border-bottom: 1px solid #ddd;
  background: #f8f9fa;
}

.header-left h3 {
  color: var(--primary-color);
  font-size: 1.5rem;
  margin: 0 0 5px 0;
}

.post-count {
  color: #666;
  font-size: 0.9rem;
}

.write-btn {
  padding: 10px 20px;
  background: var(--primary-color);
  color: white;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.write-btn:hover {
  opacity: 0.9;
}

.admin-content {
  padding: 30px;
}

.search-bar {
  margin-bottom: 20px;
}

.search-bar input {
  width: 100%;
  max-width: 400px;
  padding: 10px 15px;
  border: 1px solid #ddd;
  font-size: 1rem;
}

.search-bar input:focus {
  outline: none;
  border-color: var(--primary-color);
}

.reviews-table {
  overflow-x: auto;
}

.reviews-table table {
  width: 100%;
  border-collapse: collapse;
  background: white;
}

.reviews-table th,
.reviews-table td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

.reviews-table th {
  background: #f8f9fa;
  font-weight: 600;
  color: #333;
}

.name-cell {
  font-weight: 500;
  color: #333;
}

.course-cell {
  color: var(--primary-color);
  font-weight: 500;
}

.content-preview {
  max-width: 300px;
  color: #666;
  line-height: 1.4;
}

.date-cell {
  color: #666;
  font-size: 0.9rem;
  white-space: nowrap;
}

.actions-cell {
  white-space: nowrap;
}

.edit-btn,
.delete-btn {
  padding: 6px 12px;
  border: none;
  cursor: pointer;
  font-size: 0.9rem;
  margin-right: 5px;
}

.edit-btn {
  background: #17a2b8;
  color: white;
}

.edit-btn:hover {
  background: #138496;
}

.delete-btn {
  background: #dc3545;
  color: white;
}

.delete-btn:hover {
  background: #c82333;
}

.no-data {
  text-align: center;
  padding: 40px;
  color: #666;
}

@media (max-width: 768px) {
  .admin-reviews {
    padding: 10px;
  }

  .admin-header {
    flex-direction: column;
    gap: 15px;
    align-items: stretch;
  }

  .admin-content {
    padding: 20px;
  }

  .reviews-table th,
  .reviews-table td {
    padding: 8px;
    font-size: 0.9rem;
  }

  .content-preview {
    max-width: 200px;
  }

  .actions-cell {
    text-align: center;
  }

  .edit-btn,
  .delete-btn {
    padding: 4px 8px;
    font-size: 0.8rem;
    margin: 2px;
  }
}
</style> 