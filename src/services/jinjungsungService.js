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
      // 기수(선택) — 고른 경우에만 보낸다
      if (reviewData.cohort) formData.append('cohort', String(reviewData.cohort))
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
}