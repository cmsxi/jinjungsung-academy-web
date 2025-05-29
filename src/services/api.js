import axios from 'axios'

// API 기본 URL 설정 - vite 프록시 사용
const API_BASE_URL = '/api/jinjungsung-academy'

// axios 인스턴스 생성
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  }
})

// 요청 인터셉터
api.interceptors.request.use(
  (config) => {
    console.log('API 요청:', config.method?.toUpperCase(), config.url)
    return config
  },
  (error) => {
    console.error('API 요청 오류:', error)
    return Promise.reject(error)
  }
)

// 응답 인터셉터
api.interceptors.response.use(
  (response) => {
    console.log('API 응답:', response.status, response.config.url)
    return response
  },
  (error) => {
    console.error('API 응답 오류:', error.response?.status, error.response?.data)
    return Promise.reject(error)
  }
)

export default api 