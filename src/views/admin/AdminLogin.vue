<template>
  <div class="admin-login-page">
    <div class="login-container">
      <div class="login-form">
        <h2>관리자 로그인</h2>
        <p class="login-subtitle">수강현황 글 관리 위해 로그인하세요</p>
        
        <form @submit.prevent="handleLogin">
          <div class="form-group">
            <label for="password">비밀번호</label>
            <input 
              id="password"
              v-model="password" 
              type="password" 
              placeholder="관리자 비밀번호를 입력하세요"
              required
            />
          </div>
          
          <div v-if="errorMessage" class="error-message">
            {{ errorMessage }}
          </div>
          
          <button type="submit" class="login-btn" :disabled="loading">
            {{ loading ? '로그인 중...' : '로그인' }}
          </button>
        </form>
        
        <div class="back-link">
          <router-link to="/education/status">← 수강현황 목록으로 돌아가기</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const password = ref('');
const errorMessage = ref('');
const loading = ref(false);

// 관리자 비밀번호 (실제 환경에서는 환경변수나 서버에서 관리)
const ADMIN_PASSWORD = 'admin123';

const handleLogin = async () => {
  loading.value = true;
  errorMessage.value = '';
  
  // 간단한 지연 효과
  await new Promise(resolve => setTimeout(resolve, 500));
  
  if (password.value === ADMIN_PASSWORD) {
    // 로그인 성공 - 세션 스토리지에 저장
    sessionStorage.setItem('adminAuth', 'true');
    router.push('/admin/status');
  } else {
    errorMessage.value = '비밀번호가 올바르지 않습니다.';
  }
  
  loading.value = false;
};
</script>

<style scoped>
.admin-login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f8f9fa;
  padding: 20px;
}

.login-container {
  width: 100%;
  max-width: 400px;
}

.login-form {
  background: white;
  padding: 40px;
  border: 2px solid #333;
}

.login-form h2 {
  color: #333;
  font-size: 1.8rem;
  font-weight: 700;
  margin: 0 0 10px 0;
  text-align: center;
}

.login-subtitle {
  color: #666;
  text-align: center;
  margin: 0 0 30px 0;
  font-size: 1rem;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  color: #333;
  font-weight: 600;
  margin-bottom: 8px;
  font-size: 1rem;
}

.form-group input {
  width: 100%;
  padding: 12px 15px;
  border: 2px solid #666;
  font-size: 1rem;
  transition: border-color 0.3s ease;
}

.form-group input:focus {
  outline: none;
  border-color: var(--primary-color);
}

.error-message {
  color: #dc3545;
  font-size: 0.9rem;
  margin-bottom: 20px;
  text-align: center;
  font-weight: 500;
}

.login-btn {
  width: 100%;
  background: #333;
  color: white;
  border: none;
  padding: 15px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.login-btn:hover:not(:disabled) {
  background: var(--primary-color);
}

.login-btn:disabled {
  background: #999;
  cursor: not-allowed;
}

.back-link {
  text-align: center;
  margin-top: 20px;
}

.back-link a {
  color: #666;
  text-decoration: none;
  font-size: 0.9rem;
}

.back-link a:hover {
  color: var(--primary-color);
}

/* 반응형 */
@media (max-width: 768px) {
  .login-form {
    padding: 30px 20px;
  }
  
  .login-form h2 {
    font-size: 1.5rem;
  }
}
</style> 