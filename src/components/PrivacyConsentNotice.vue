<template>
  <div class="privacy-notice" role="region" aria-labelledby="privacy-notice-title">
    <p id="privacy-notice-title" class="privacy-title">개인정보 수집 및 이용 안내</p>
    <p class="privacy-intro">
      {{ COMPANY.name }}은(는) 수강 상담을 위해 아래와 같이 개인정보를 수집·이용합니다.
    </p>
    <dl class="privacy-list">
      <div class="privacy-row">
        <dt>수집 항목</dt>
        <dd>{{ items.join(', ') }}</dd>
      </div>
      <div class="privacy-row">
        <dt>수집·이용 목적</dt>
        <dd>수강 상담, 교육과정 및 개강 일정 안내</dd>
      </div>
      <div class="privacy-row">
        <dt>보유·이용 기간</dt>
        <dd>수집일로부터 1년간 보관 후 파기 (삭제를 요청하시면 즉시 파기합니다)</dd>
      </div>
    </dl>
    <p class="privacy-refuse">
      개인정보 수집·이용에 동의하지 않으실 수 있으며, 동의하지 않으시면 수강 상담 신청이 제한됩니다.
    </p>
    <p class="privacy-contact">
      개인정보 관련 문의: {{ PHONE_DISPLAY }} · {{ COMPANY.email }}
    </p>
  </div>
</template>

<script setup>
import { COMPANY, PHONE_DISPLAY } from '@/constants/contact.js'

// 개인정보 보호법 제15조 제2항: 수집·이용 목적, 수집 항목, 보유·이용 기간, 동의 거부 권리 및 불이익 고지
defineProps({
  items: {
    type: Array,
    default: () => ['성함', '연락처', '거주지역'],
  },
})
</script>

<style scoped>
.privacy-notice {
  margin-bottom: 20px;
  padding: 18px 22px;
  border: 1px solid #ddd;
  background: #fafafa;
  text-align: left;
  font-size: 0.9rem;
  line-height: 1.7;
  color: #555;
  word-break: keep-all;
}

.privacy-title {
  font-size: 0.95rem;
  font-weight: 700;
  color: #222;
  margin-bottom: 6px;
}

.privacy-list {
  margin: 10px 0;
  padding: 10px 0;
  border-top: 1px solid #e5e5e5;
  border-bottom: 1px solid #e5e5e5;
}

.privacy-row {
  display: flex;
  gap: 12px;
  padding: 3px 0;
}

.privacy-row dt {
  flex: 0 0 110px;
  font-weight: 600;
  color: #333;
}

.privacy-row dd {
  margin: 0;
}

.privacy-contact {
  margin-top: 4px;
  color: #777;
}

@media (max-width: 768px) {
  .privacy-notice {
    padding: 14px 14px;
    font-size: 0.85rem;
  }

  .privacy-row {
    flex-direction: column;
    gap: 0;
  }

  .privacy-row dt {
    flex: none;
  }
}
</style>
