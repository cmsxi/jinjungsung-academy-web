<template>
  <div class="form-wrapper">
    <div class="form-header">
      <h1 class="main-title">끊임없는 연구로 도출된 절세전략<span class="mobile-only"><br></span><span class="desktop-only">, </span>전문가와의 상담을 통해<span class="mobile-only"><br></span> 확인해보세요.</h1>
    </div>
  
    <div class="consultation-wrapper">
      <div class="consultation-form">
        <h2 class="consultation-title">신청하기</h2>
        <form @submit.prevent="submitForm" class="form">
          <div class="form-items">
            <div class="form-row">
              <div class="form-group">
                <label class="label">상담 유형 *</label>
                <div class="select-wrapper">
                  <select v-model="form.consultationType" required class="input">
                    <option value="" disabled>상담 유형을 선택해주세요</option>
                    <option value="세무기장">세무기장</option>
                    <option value="세무자문">세무자문</option>
                    <option value="세무조사">세무조사</option>
                    <option value="경정청구">경정청구</option>
                    <option value="재산제세">재산제세</option>
                  </select>
                </div>
              </div>
              
              <div class="form-group">
                <label class="label">성함 또는 회사명 *</label>
                <input v-model="form.name" required class="input" type="text" />
              </div>
            </div>
            
            <div class="form-group">
              <label class="label">연락처 *</label>
              <input
                v-model="form.phone"
                required
                class="input"
                type="tel"
                placeholder="전화번호 (예시: 010-0000-0000)"
              />
            </div>
            
            <div class="form-group">
              <label class="label">상담 내용을 자세히 적어주세요.</label>
              <textarea v-model="form.content" rows="4" class="input"></textarea>
            </div>
            
            <div class="form-group checkbox">
              <input
                type="checkbox"
                v-model="form.agreement"
                required
                id="agreement"
              />
              <label for="agreement">개인정보 수집 및 이용에 동의합니다.</label>
            </div>
          </div>
          
          <button type="submit" class="submit-btn" :disabled="isSubmitting">
            {{ isSubmitting ? "전송중..." : "신청서 작성" }}
          </button>
        </form>
      </div>

      <div class="consultation-history">
        <h2 class="consultation-title">실시간 상담 현황</h2>
        <div class="history-container">
          <div class="history-table">
            <div class="table-header">
              <span>날짜</span>
              <span>상담유형</span>
              <span>상담내용</span>
            </div>
            <div class="table-body" ref="tableBody">
              <div
                v-for="(item, index) in consultationHistory"
                :key="index"
                class="table-row"
              >
                <span>{{ formatDate(item.created_at) }}</span>
                <span>{{ item.consultation_type }}</span>
                <span>{{ item.content }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
 
<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";

const form = ref({
  consultation_type: "",
  name: "",
  phone: "",
  content: "",
  agreement: false,
});
const isSubmitting = ref(false);
const tableBody = ref(null);
let scrollInterval;

const consultationHistory = ref([
  {
    created_at: '2025-02-21',
    consultation_type: '세무기장',
    content: '3.3으로 받고 있는데 사업자 낼 수 있나요…'
  },
  {
    created_at: '2025-02-20',
    consultation_type: '세무자문',
    content: '회사 주식을 팔았는데 세금 신고 해야하나…'
  },
  {
    created_at: '2025-02-17',
    consultation_type: '경정청구',
    content: '연구소 설립했었는데 세무 혜택이 어떤게…'
  },
  {
    created_at: '2025-02-14',
    consultation_type: '세무조사',
    content: '상속 세무조사가 나왔다고 하는데 그냥…'
  },
  {
    created_at: '2025-02-13',
    consultation_type: '세무기장',
    content: '스타트업 시드 투자 받았는데, 세무기장을 맡기고 싶습…'
  },
  {
    created_at: '2025-02-13',
    consultation_type: '재산제세',
    content: '지난 1월 아버지가 돌아가셨는데 어디서부터 어떻게…'
  },
  {
    created_at: '2025-02-11',
    consultation_type: '경정청구',
    content: '세금 환급 가능한 지 궁금합니다…'
  },
  {
    created_at: '2025-02-10',
    consultation_type: '세무기장',
    content: '법인으로 사업하고 싶은데 어떻게…'
  },
  {
    created_at: '2025-02-07',
    consultation_type: '세무자문',
    content: '정책자금 대출도 알아봐 주시나요…'
  },
  {
    created_at: '2025-02-04',
    consultation_type: '세무기장',
    content: '가족이 카드를 썼는데 경비 처리가…'
  },
  {
    created_at: '2025-01-31',
    consultation_type: '세무조사',
    content: '주택을 구입했는데 자금출처 소명이 나왔…'
  },
  {
    created_at: '2025-01-29',
    consultation_type: '재산재세',
    content: '부모 자식 간 큰 금액을 계좌이체했는데 어떻게 해야…'
  },
  {
    created_at: '2025-01-29',
    consultation_type: '세무기장',
    content: '개인사업자인데 법인으로 바꾸고 싶습…'
  },
  {
    created_at: '2025-01-27',
    consultation_type: '세무기장',
    content: '세무 기장 상담 부탁드립니다…'
  },
  {
    created_at: '2025-01-26',
    consultation_type: '재산제세',
    content: '어머니로부터 아파트를 증여받으려 하는데 절세가 가능…'
  },
  {
    created_at: '2025-01-26',
    consultation_type: '재산제세',
    content: '아들한테 2,000만원 증여했는데 신고…'
  },
  {
    created_at: '2025-01-23',
    consultation_type: '세무기장',
    content: '매출액 3억 정도 나오는 음식점 기장…'
  }
]);

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return `${String(date.getMonth() + 1).padStart(2, "0")}/${String(
    date.getDate()
  ).padStart(2, "0")}`;
};

const submitForm = async () => {
  if (!form.value.agreement) {
    alert("개인정보 수집 및 이용에 동의해주세요.");
    return;
  }
  
  try {
    isSubmitting.value = true;
  
    const response = await axios.post(`${API_BASE_URL}/consultations/tax`, {
      consultation_type: form.value.consultation_type,
      name: form.value.name,
      phone: form.value.phone,
      content: form.value.content
    });
    
    if (response.data.status === "success" || response.data.status === "partial_success") {
      alert("상담 신청이 접수되었습니다. 빠른 시일 내에 연락드리겠습니다.");
      
      form.value = {
        consultation_type: "",
        name: "",
        phone: "",
        content: "",
        agreement: false,
      };
    } else {
      throw new Error(response.data.message || "알 수 없는 오류가 발생했습니다.");
    }
  } catch (error) {
    console.error("상담 신청 오류:", error);
    
    if (error.response) {
      alert(`신청 처리 중 오류가 발생했습니다: ${error.response.data.detail || error.response.data.message || "알 수 없는 오류"}`);
    } else if (error.request) {
      alert("서버 연결 실패. 인터넷 연결을 확인하거나 잠시 후 다시 시도해주세요.");
    } else {
      alert(`신청 처리 중 오류가 발생했습니다: ${error.message}`);
    }
  } finally {
    isSubmitting.value = false;
  }
};

const startAutoScroll = () => {
  if (scrollInterval) {
    clearInterval(scrollInterval);
    scrollInterval = null;
  }
  
  if (!tableBody.value) return;
  
  const hasEnoughContentToScroll = tableBody.value.scrollHeight > tableBody.value.clientHeight;
  if (!hasEnoughContentToScroll) {
    return;
  }
  
  const isMobile = window.innerWidth <= 768;
  const scrollSpeed = isMobile ? 0.5 : 1;
  const scrollDelay = 30;
  
  scrollInterval = setInterval(() => {
    if (!tableBody.value) return;
    
    const currentScroll = tableBody.value.scrollTop;
    const maxScroll = tableBody.value.scrollHeight - tableBody.value.clientHeight;
    
    if (maxScroll <= 5) {
      setTimeout(() => {
        startAutoScroll();
      }, 500);
      return;
    }
    
    if (currentScroll >= maxScroll - 5) {
      clearInterval(scrollInterval);
      
      tableBody.value.scrollTo({
        top: 0,
        behavior: "smooth"
      });
      
      setTimeout(() => {
        startAutoScroll();
      }, 1000);
      return;
    }
    
    tableBody.value.scrollTop += scrollSpeed;
  }, scrollDelay);
};

const setupScrollContainer = () => {
  if (!tableBody.value) return;
  
  const isMobile = window.innerWidth <= 768;
  const isTablet = window.innerWidth <= 1024 && window.innerWidth > 768;
  
  if (isMobile) {
    tableBody.value.style.height = "130px";
    tableBody.value.style.minHeight = "130px";
    tableBody.value.style.maxHeight = "130px";
    tableBody.value.style.overflowY = "scroll";
  } else if (isTablet) {
    tableBody.value.style.height = "320px";
    tableBody.value.style.minHeight = "280px";
    tableBody.value.style.overflowY = "auto";
  } else {
    tableBody.value.style.height = "420px";
    tableBody.value.style.minHeight = "400px";
    tableBody.value.style.overflowY = "auto";
  }
};

const handleResize = () => {
  if (scrollInterval) {
    clearInterval(scrollInterval);
    scrollInterval = null;
  }
  
  setupScrollContainer();
  
  setTimeout(() => {
    startAutoScroll();
  }, 300);
};

onMounted(() => {
  setTimeout(() => {
    setupScrollContainer();
    
    setTimeout(() => {
      startAutoScroll();
      setTimeout(() => {
        if (!scrollInterval) {
          setupScrollContainer();
          startAutoScroll();
        }
      }, 1000);
    }, 500);
  }, 200);
  
  window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
  if (scrollInterval) {
    clearInterval(scrollInterval);
    scrollInterval = null;
  }
  
  window.removeEventListener('resize', handleResize);
});
</script>
  
<style scoped>
.form-wrapper {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.form-header {
  margin-bottom: 2.5rem;
  text-align: center;
}

.main-title {
  font-size: 2rem;
  font-weight: 600;
  color: var(--primary-color);
  line-height: 1.4;
}

.consultation-wrapper {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  width: 100%;
  max-width: 1100px;
  margin: 0 auto;
  padding: 2.5rem 2.5rem 4rem 2.5rem;
}

.consultation-title {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1.8rem;
  color: var(--primary-color);
}

.consultation-form, .consultation-history {
  background: white;
  padding: 2rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  height: 580px;
  display: flex;
  flex-direction: column;
}

.form {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.form-items {
  gap: 1.2rem;
  display: flex;
  flex-direction: column;
  flex: 1;
  width: 100%;
}

/* 상단 2열 배치를 위한 스타일 */
.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  width: 100%;
}

.form-group {
  width: 100%;
}

.label {
  display: block;
  margin-bottom: 0.6rem;
  font-weight: 500;
  font-size: 1.05rem;
}

.input {
  width: 100%;
  padding: 0.6rem;
  border: 1px solid #ddd;
  font-size: 1rem;
}

select.input {
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23333' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 1rem center;
  background-size: 1.2em;
  padding-right: 2.5rem;
}
.checkbox {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  font-size: 1rem;
}

.submit-btn {
  width: 100%;
  padding: 1rem;
  margin-top: 1.5rem;
  background: var(--primary-color);
  color: white;
  border: none;
  font-size: 1.1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
}

.submit-btn:hover {
  background: var(--primary-color);
}

.submit-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.history-container {
  height: 490px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  flex: 1;
}

.history-table {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.table-header {
  display: grid;
  grid-template-columns: 80px 110px 1fr;
  padding: 0.9rem 1.2rem;
  background: #f5f5f5;
  font-weight: 600;
  text-align: center;
  font-size: 1rem;
}

.table-body {
  flex: 1;
  overflow-y: scroll !important;
  scrollbar-width: thin;
  scrollbar-color: #ddd #f5f5f5;
  scroll-behavior: smooth;
  font-size: 1rem;
  padding-left: 1.1rem;
  -webkit-overflow-scrolling: touch;
}

.table-body::-webkit-scrollbar {
  width: 6px;
}

.table-body::-webkit-scrollbar-track {
  background: #f5f5f5;
}

.table-body::-webkit-scrollbar-thumb {
  background-color: #ddd;
}

.table-row {
  display: grid;
  grid-template-columns: 80px 100px 1fr;
  padding: 0.9rem 1rem;
  border-bottom: 1px solid #eee;
}

.table-row:last-child {
  border-bottom: none;
}

@media (max-width: 1024px) {
  .consultation-wrapper {
    grid-template-columns: 1fr;
    gap: 2.5rem;
    padding: 2rem 2rem 3rem 2rem;
  }
  
  .consultation-history {
    order: 1;
    min-height: auto;
    height: auto;
  }
  
  .consultation-form {
    order: 2;
    min-height: auto;
    height: auto;
  }

  .consultation-title {
    font-size: 1.4rem;
    margin-bottom: 1.5rem;
  }
  
  .table-header, 
  .table-row {
    padding: 0.8rem 1rem;
  }
  
  .history-container {
    height: 400px;
  }
}

@media (max-width: 768px) {
  .main-title{
    font-size: 1.4rem;
    text-align: left;
    padding: 0 2rem;
    line-height: 1.3;
  }
  
  .desktop-only {
    display: none;
  }
  
  .mobile-only {
    display: inline;
  }

  .form-row {
    grid-template-columns: 1fr;
    gap: 0.8rem;
  }
  
  .consultation-wrapper {
    padding: 1.5rem 1rem 2.5rem 1rem;
    gap: 2rem;
    display: flex;
    flex-direction: column;
  }
  
  .consultation-form, .consultation-history {
    padding: 1rem;
    background: transparent;
    box-shadow: none;
  }
  
  .consultation-title {
    font-size: 1.5rem;
    margin-bottom: 1rem;
    text-align: left;
  }
  
  .form-items {
    gap: 0.8rem;
  }
  
  .label {
    font-size: 1rem;
    margin-bottom: 0.5rem;
  }
  
  .input {
    padding: 0.8rem;
    font-size: 1rem;
    border-radius: 0 !important;
  }
  
  .submit-btn {
    font-size: 1rem;
    padding: 0.9rem;
    margin-top: 1.2rem;
  }

  .table-header,
  .table-row {
    grid-template-columns: 65px 1fr 1fr;
    font-size: 0.95rem;
    padding: 0.6rem 0.8rem;
  }
  
  .table-header {
    background-color: var(--primary-color);
    color: white;
    font-weight: 500;
  }
  
  .table-body {
    padding-left: 0;
    background-color: rgba(255, 255, 255, 0.8);
    border: 1px solid #eee;
    border-top: none;
    overflow-y: scroll !important;
    -webkit-overflow-scrolling: touch;
  }
  
  .table-row {
    padding: 0.5rem 0.8rem;
  }
  
  .history-container {
    height: 400px;
    margin-bottom: 0.5rem;
  }
}

@media (max-width: 480px) {
  .consultation-wrapper {
    padding: 1rem 0.8rem 1.5rem 0.8rem;
    gap: 1rem;
  }
  
  .consultation-form, .consultation-history {
    padding: 0.5rem 0;
  }
  
  .consultation-title {
    font-size: 1.3rem;
    margin-bottom: 0.7rem;
  }
  
  .label {
    font-size: 0.9rem;
    margin-bottom: 0.4rem;
  }
  
  .input {
    padding: 0.7rem;
    border-radius: 0 !important;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    font-size: 0.9rem;
  }
  
  .checkbox {
    font-size: 0.85rem;
  }
  
  .submit-btn {
    padding: 0.8rem;
    margin-top: 1rem;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    font-size: 0.9rem;
  }

  .table-header,
  .table-row {
    grid-template-columns: 50px 1fr 1fr;
    font-size: 0.85rem;
    padding: 0.5rem;
    text-align: center;
  }
  
  .table-row span:first-child {
    font-weight: 600;
  }
  
  .history-container {
    height: 300px;
  }
}

.mobile-only {
  display: none;
}
</style>