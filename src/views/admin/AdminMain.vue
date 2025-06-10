<template>
  <div class="admin-main-page">
    <Block backgroundColor="#f8f9fa">
      <div class="page-container section-container">
        <div class="admin-content">
          <h2 class="section-title">관리자</h2>
          
          <!-- 관리자 인증 -->
          <div v-if="!isAuthenticated" class="auth-section">
            <div class="auth-form">
              <h3>관리자 인증</h3>
              <form @submit.prevent="authenticate">
                <div class="form-group">
                  <label for="password">관리자 비밀번호</label>
                  <input 
                    type="password" 
                    id="password" 
                    v-model="password"
                    required
                    placeholder="비밀번호를 입력하세요"
                    :disabled="isLoading"
                  >
                </div>
                
                <div v-if="authError" class="error-message">
                  <p>❌ {{ authError }}</p>
                </div>

                <button 
                  type="submit" 
                  class="auth-btn"
                  :disabled="!password || isLoading"
                >
                  <span v-if="isLoading">인증 중...</span>
                  <span v-else>인증하기</span>
                </button>
              </form>
            </div>
          </div>

          <!-- 관리자 메뉴 -->
          <div v-if="isAuthenticated" class="admin-menu">
            <div class="welcome-message">
              <h3>관리자님, 환영합니다! 👋</h3>
              <p>관리 시스템입니다.</p>
            </div>

            <div class="menu-grid">
              <router-link to="/admin/status" class="menu-item">
                <div class="menu-icon">📝</div>
                <h4>수강현황 관리</h4>
                <p>수강현황 게시글 작성, 수정, 삭제</p>
              </router-link>

              <router-link to="/admin/reviews" class="menu-item">
                <div class="menu-icon">⭐</div>
                <h4>수강후기 관리</h4>
                <p>수강후기 게시글 작성, 수정, 삭제</p>
              </router-link>

              <div class="menu-item" @click="logout">
                <div class="menu-icon">🚪</div>
                <h4>로그아웃</h4>
                <p>관리자 세션 종료</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Block>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import Block from "@/components/Block.vue";
import { jinjungsungService } from '@/services/jinjungsungService.js';

const router = useRouter();

// 상태 관리
const isAuthenticated = ref(false);
const isLoading = ref(false);
const password = ref('');
const authError = ref('');

// 관리자 인증
const authenticate = async () => {
  if (!password.value || isLoading.value) return;

  isLoading.value = true;
  authError.value = '';

  try {
    const response = await jinjungsungService.verifyAdmin(password.value);
    
    if (response.verified) {
      isAuthenticated.value = true;
      // 세션 스토리지에 인증 상태 저장
      sessionStorage.setItem('admin_authenticated', 'true');
      sessionStorage.setItem('admin_password', password.value);
      password.value = '';
    } else {
      authError.value = '잘못된 비밀번호입니다.';
    }
  } catch (error) {
    authError.value = error.message;
  } finally {
    isLoading.value = false;
  }
};

// 로그아웃
const logout = () => {
  isAuthenticated.value = false;
  sessionStorage.removeItem('admin_authenticated');
  sessionStorage.removeItem('admin_password');
  password.value = '';
  authError.value = '';
};

// 인증 상태 확인
const checkAuthStatus = () => {
  const authenticated = sessionStorage.getItem('admin_authenticated');
  if (authenticated === 'true') {
    isAuthenticated.value = true;
  }
};

// 컴포넌트 마운트 시 인증 상태 확인
onMounted(() => {
  checkAuthStatus();
});
</script>

<style scoped>
.admin-main-page {
  min-height: 100vh;
}

.admin-content {
  max-width: 1000px;
  margin: 0 auto;
  padding: 0 15px;
}

.section-title {
  text-align: center;
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 40px;
  color: #333;
}

/* 인증 섹션 */
.auth-section {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
}

.auth-form {
  background: white;
  padding: 40px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
  border: 1px solid #ddd;
}

.auth-form h3 {
  text-align: center;
  margin-bottom: 30px;
  color: #333;
  font-size: 1.5rem;
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

.form-group input {
  width: 100%;
  padding: 12px 15px;
  border: 2px solid #ddd;
  font-size: 1rem;
  box-sizing: border-box;
  transition: border-color 0.3s ease;
}

.form-group input:focus {
  outline: none;
  border-color: var(--primary-color);
}

.form-group input:disabled {
  background-color: #f5f5f5;
  cursor: not-allowed;
}

.error-message {
  margin-bottom: 20px;
  padding: 10px;
  background-color: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
  text-align: center;
}

.auth-btn {
  width: 100%;
  padding: 12px;
  background-color: var(--primary-color);
  color: white;
  border: none;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.auth-btn:hover:not(:disabled) {
  background-color: #003e80;
}

.auth-btn:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

/* 관리자 메뉴 */
.welcome-message {
  text-align: center;
  margin-bottom: 40px;
  padding: 30px;
  background: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  border: 1px solid #ddd;
}

.welcome-message h3 {
  color: #333;
  margin-bottom: 10px;
  font-size: 1.5rem;
}

.welcome-message p {
  color: #666;
  font-size: 1.1rem;
}

.menu-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.menu-item {
  background: white;
  padding: 30px 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  text-align: center;
  text-decoration: none;
  color: inherit;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid #ddd;
}

.menu-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.menu-icon {
  font-size: 3rem;
  margin-bottom: 15px;
}

.menu-item h4 {
  color: #333;
  margin-bottom: 10px;
  font-size: 1.2rem;
}

.menu-item p {
  color: #666;
  font-size: 0.9rem;
  line-height: 1.4;
}

@media (max-width: 768px) {
  .section-title {
    font-size: 1.5rem;
    margin-bottom: 30px;
  }

  .auth-form {
    padding: 30px 20px;
    margin: 0 15px;
  }

  .auth-form h3 {
    font-size: 1.3rem;
    margin-bottom: 25px;
  }

  .welcome-message {
    padding: 20px;
    margin-bottom: 30px;
  }

  .welcome-message h3 {
    font-size: 1.3rem;
  }

  .welcome-message p {
    font-size: 1rem;
  }

  .menu-grid {
    grid-template-columns: 1fr;
    gap: 15px;
  }

  .menu-item {
    padding: 25px 15px;
  }

  .menu-icon {
    font-size: 2.5rem;
    margin-bottom: 10px;
  }

  .menu-item h4 {
    font-size: 1.1rem;
  }
}
</style> 