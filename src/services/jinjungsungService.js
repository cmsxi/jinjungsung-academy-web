import api from './api.js'

/**
 * API 서비스
 */
export const jinjungsungService = {
  
  /**
   * 수강신청 메일 발송
   * @param {Object} registrationData - 수강신청 데이터
   * @param {string} registrationData.name - 이름
   * @param {string} registrationData.phone - 전화번호
   * @param {string} registrationData.location - 거주지역
   */
  async submitCourseRegistration(registrationData) {
    try {
      const response = await api.post('/course-registration', registrationData)
      return response.data
    } catch (error) {
      console.error('수강신청 오류:', error)
      throw new Error(error.response?.data?.detail || '수강신청 처리 중 오류가 발생했습니다.')
    }
  },

  /**
   * 게시글 목록 조회
   * @param {number} page - 페이지 번호 (기본값: 1)
   * @param {number} itemsPerPage - 페이지당 항목 수 (기본값: 10)
   */
  async getPosts(page = 1, itemsPerPage = 10) {
    try {
      const response = await api.get('/posts', {
        params: {
          page,
          items_per_page: itemsPerPage
        }
      })
      return response.data
    } catch (error) {
      console.error('게시글 목록 조회 오류:', error)
      throw new Error(error.response?.data?.detail || '게시글 목록을 불러오는 중 오류가 발생했습니다.')
    }
  },

  /**
   * 게시글 상세 조회
   * @param {number} postId - 게시글 ID
   */
  async getPost(postId) {
    try {
      const response = await api.get(`/posts/${postId}`)
      return response.data
    } catch (error) {
      console.error('게시글 상세 조회 오류:', error)
      throw new Error(error.response?.data?.detail || '게시글을 불러오는 중 오류가 발생했습니다.')
    }
  },

  /**
   * 관리자 비밀번호 검증
   * @param {string} password - 관리자 비밀번호
   */
  async verifyAdmin(password) {
    try {
      const response = await api.post('/admin/verify', { password })
      return response.data
    } catch (error) {
      console.error('관리자 인증 오류:', error)
      throw new Error(error.response?.data?.detail || '관리자 인증 중 오류가 발생했습니다.')
    }
  },

  /**
   * 게시글 생성
   * @param {Object} postData - 게시글 데이터
   * @param {string} postData.title - 제목
   * @param {string} postData.content - 내용
   * @param {string} postData.adminPassword - 관리자 비밀번호
   * @param {File} postData.image - 이미지 파일 (선택사항)
   */
  async createPost(postData) {
    try {
      const formData = new FormData()
      formData.append('title', postData.title)
      formData.append('content', postData.content)
      formData.append('admin_password', postData.adminPassword)
      
      if (postData.image) {
        formData.append('image', postData.image)
      }

      const response = await api.post('/posts', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      return response.data
    } catch (error) {
      console.error('게시글 생성 오류:', error)
      throw new Error(error.response?.data?.detail || '게시글 생성 중 오류가 발생했습니다.')
    }
  },

  /**
   * 게시글 수정
   * @param {number} postId - 게시글 ID
   * @param {Object} postData - 수정할 게시글 데이터
   * @param {string} postData.title - 제목
   * @param {string} postData.content - 내용
   * @param {string} postData.adminPassword - 관리자 비밀번호
   * @param {File} postData.image - 이미지 파일 (선택사항)
   */
  async updatePost(postId, postData) {
    try {
      const formData = new FormData()
      formData.append('title', postData.title)
      formData.append('content', postData.content)
      formData.append('admin_password', postData.adminPassword)
      
      if (postData.image) {
        formData.append('image', postData.image)
      }

      const response = await api.put(`/posts/${postId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      return response.data
    } catch (error) {
      console.error('게시글 수정 오류:', error)
      throw new Error(error.response?.data?.detail || '게시글 수정 중 오류가 발생했습니다.')
    }
  },

  /**
   * 게시글 삭제
   * @param {number} postId - 게시글 ID
   * @param {string} adminPassword - 관리자 비밀번호
   */
  async deletePost(postId, adminPassword) {
    try {
      const response = await api.delete(`/posts/${postId}`, {
        data: { password: adminPassword }
      })
      return response.data
    } catch (error) {
      console.error('게시글 삭제 오류:', error)
      throw new Error(error.response?.data?.detail || '게시글 삭제 중 오류가 발생했습니다.')
    }
  },

  /**
   * 이미지 URL 생성
   * @param {string} filename - 이미지 파일명
   */
  getImageUrl(filename) {
    if (!filename) return null
    return `/uploads/${filename}`
  },

  /**
   * 수강후기 목록 조회
   */
  async getReviews(page = 1, itemsPerPage = 10) {
    try {
      const response = await api.get('/reviews', {
        params: {
          page,
          items_per_page: itemsPerPage
        }
      })
      return response.data
    } catch (error) {
      console.error('수강후기 목록 조회 오류:', error)
      throw new Error(error.response?.data?.detail || '수강후기 목록을 불러오는 중 오류가 발생했습니다.')
    }
  },

  /**
   * 수강후기 상세 조회
   */
  async getReview(reviewId) {
    try {
      const response = await api.get(`/reviews/${reviewId}`)
      return response.data
    } catch (error) {
      console.error('수강후기 상세 조회 오류:', error)
      throw new Error(error.response?.data?.detail || '수강후기를 불러오는 중 오류가 발생했습니다.')
    }
  },

  /**
   * 수강후기 사용자 작성 (공개 엔드포인트, 미게시 상태로 저장)
   */
  async submitReview(reviewData) {
    try {
      const formData = new FormData()
      formData.append('username', reviewData.username)
      formData.append('title', reviewData.title)
      formData.append('content', reviewData.content)
      // honeypot
      formData.append('_botcheck', reviewData.botcheck || '')

      if (reviewData.image) {
        formData.append('image', reviewData.image)
      }

      const response = await api.post('/reviews/submit', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      return response.data
    } catch (error) {
      console.error('수강후기 접수 오류:', error)
      if (error.response?.status === 429) {
        throw new Error('짧은 시간 내에 너무 많이 작성하셨습니다. 잠시 후 다시 시도해 주세요.')
      }
      throw new Error(error.response?.data?.detail || '후기 접수 중 오류가 발생했습니다.')
    }
  },

  /**
   * 관리자: 전체 후기 목록 (미게시 포함)
   */
  async getReviewsAdmin(page = 1, itemsPerPage = 10, adminPassword) {
    try {
      const formData = new FormData()
      formData.append('page', page)
      formData.append('items_per_page', itemsPerPage)
      formData.append('admin_password', adminPassword)

      const response = await api.post('/reviews/admin/list', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      return response.data
    } catch (error) {
      console.error('관리자 후기 목록 조회 오류:', error)
      throw new Error(error.response?.data?.detail || '후기 목록을 불러오는 중 오류가 발생했습니다.')
    }
  },

  /**
   * 관리자: 공개 여부 토글
   */
  async setReviewPublished(reviewId, isPublished, adminPassword) {
    try {
      const response = await api.patch(`/reviews/${reviewId}/publish`, {
        admin_password: adminPassword,
        is_published: isPublished
      })
      return response.data
    } catch (error) {
      console.error('공개 여부 변경 오류:', error)
      throw new Error(error.response?.data?.detail || '공개 여부 변경 중 오류가 발생했습니다.')
    }
  },

  /**
   * 관리자: 후기 생성 (즉시 공개)
   */
  async createReview(reviewData) {
    try {
      const formData = new FormData()
      formData.append('username', reviewData.username || '관리자')
      formData.append('title', reviewData.title)
      formData.append('content', reviewData.content)
      formData.append('admin_password', reviewData.adminPassword)

      if (reviewData.image) {
        formData.append('image', reviewData.image)
      }

      const response = await api.post('/reviews', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      return response.data
    } catch (error) {
      console.error('수강후기 생성 오류:', error)
      throw new Error(error.response?.data?.detail || '수강후기 생성 중 오류가 발생했습니다.')
    }
  },

  /**
   * 관리자: 후기 수정
   */
  async updateReview(reviewId, reviewData) {
    try {
      const formData = new FormData()
      formData.append('username', reviewData.username || '관리자')
      formData.append('title', reviewData.title)
      formData.append('content', reviewData.content)
      formData.append('admin_password', reviewData.adminPassword)

      if (reviewData.image) {
        formData.append('image', reviewData.image)
      }

      const response = await api.put(`/reviews/${reviewId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      return response.data
    } catch (error) {
      console.error('수강후기 수정 오류:', error)
      throw new Error(error.response?.data?.detail || '수강후기 수정 중 오류가 발생했습니다.')
    }
  },

  /**
   * 관리자: 후기 삭제
   */
  async deleteReview(reviewId, adminPassword) {
    try {
      const response = await api.delete(`/reviews/${reviewId}`, {
        data: { password: adminPassword }
      })
      return response.data
    } catch (error) {
      console.error('수강후기 삭제 오류:', error)
      throw new Error(error.response?.data?.detail || '수강후기 삭제 중 오류가 발생했습니다.')
    }
  }
}