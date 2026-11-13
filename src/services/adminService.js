// 관리자 API — 로그인 토큰을 요청마다 붙인다(Authorization: Bearer). 로그인이 풀리면(401) 로그인 화면으로
import axios from 'axios'
import { getToken, clearSession, notifyUnauthorized } from '@/views/admin/adminAuth.js'

const adminApi = axios.create({
  baseURL: '/api/jinjungsung-academy',
  timeout: 30000,
})

adminApi.interceptors.request.use((config) => {
  const token = getToken()
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

adminApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && !error.config?.isLogin) {
      clearSession()
      notifyUnauthorized()
    }
    return Promise.reject(error)
  },
)

// 서버 오류 문구를 사람이 읽을 수 있는 한 줄로
export const errorText = (error, fallback = '처리하지 못했습니다. 잠시 후 다시 시도해 주세요.') => {
  const status = error?.response?.status
  if (status === 429) return '시도가 너무 많습니다. 잠시 후 다시 시도해 주세요.'
  const detail = error?.response?.data?.detail
  if (typeof detail === 'string') return detail
  if (Array.isArray(detail) && detail[0]?.msg) return '입력값을 확인해 주세요.'
  if (!error?.response) return '서버에 연결하지 못했습니다. 인터넷 연결을 확인해 주세요.'
  return fallback
}

// 글 작성 · 수정 폼 데이터(사진이 있으면 함께)
const toFormData = (fields) => {
  const form = new FormData()
  Object.entries(fields).forEach(([key, value]) => {
    if (value === undefined) return
    if (key === 'image') {
      if (value) form.append('image', value)
      return
    }
    form.append(key, value === null ? '' : String(value))
  })
  return form
}

export const adminService = {
  // ── 로그인 ──
  async login(password) {
    const { data } = await adminApi.post('/admin/login', { password }, { isLogin: true })
    return data // { token, expires_at }
  },

  // ── 수강신청 문의 ──
  async getInquiries({ page = 1, size = 20, q = '', dateFrom = '', dateTo = '' } = {}) {
    const params = { page, size }
    if (q) params.q = q
    if (dateFrom) params.date_from = dateFrom
    if (dateTo) params.date_to = dateTo
    const { data } = await adminApi.get('/admin/inquiries', { params })
    return data // { items, total }
  },
  async updateInquiryMemo(id, memo) {
    const { data } = await adminApi.patch(`/admin/inquiries/${id}/memo`, { memo })
    return data
  },
  async deleteInquiry(id) {
    await adminApi.delete(`/admin/inquiries/${id}`)
  },

  // ── 수강현황 ──
  async getPosts(page = 1, size = 20) {
    const { data } = await adminApi.get('/posts', { params: { page, items_per_page: size } })
    return data
  },
  async getPost(id) {
    const { data } = await adminApi.get(`/posts/${id}`)
    return data
  },
  async savePost(id, { title, content, cohort, image }) {
    const form = toFormData({ title, content, cohort, image })
    const { data } = id ? await adminApi.put(`/posts/${id}`, form) : await adminApi.post('/posts', form)
    return data
  },
  async deletePost(id) {
    await adminApi.delete(`/posts/${id}`)
  },

  // ── 수강후기 ──
  async getReviews({ page = 1, size = 20, status = '' } = {}) {
    const form = new FormData()
    form.append('page', page)
    form.append('items_per_page', size)
    if (status) form.append('status', status)
    const { data } = await adminApi.post('/reviews/admin/list', form)
    return data
  },
  async getReview(id) {
    const { data } = await adminApi.get(`/reviews/admin/${id}`)
    return data
  },
  async setReviewPublished(id, isPublished) {
    const { data } = await adminApi.patch(`/reviews/${id}/publish`, { is_published: isPublished })
    return data
  },
  async saveReview(id, { username, title, content, cohort, image }) {
    const form = toFormData({ username, title, content, cohort, image })
    const { data } = id ? await adminApi.put(`/reviews/${id}`, form) : await adminApi.post('/reviews', form)
    return data
  },
  async deleteReview(id) {
    await adminApi.delete(`/reviews/${id}`)
  },

  imageUrl(filename) {
    return filename ? `/uploads/${filename}` : ''
  },
}
