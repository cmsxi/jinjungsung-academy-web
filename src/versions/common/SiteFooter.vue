<template>
  <!-- 시안 공용 푸터 (임시). 색은 시안과 따로 비교 버튼에서 고른다: theme = dark(차콜) | light(흰색) -->
  <footer class="site-footer" :class="`theme-${theme}`">
    <div class="jj-container">
      <div class="footer-top">
        <img :src="logoSrc" alt="국제명품감정교육원" class="footer-logo" />

        <nav class="footer-nav" aria-label="하단 메뉴">
          <!-- 11/13 헤더와 같은 순서(수강현황 따로) + 수강신청문의 -->
          <router-link to="/introduction/greeting">교육원 소개</router-link>
          <router-link to="/education/curriculum">교육안내</router-link>
          <router-link to="/education/status">수강현황</router-link>
          <router-link to="/reviews">수강후기</router-link>
          <router-link to="/faq/questions">자주묻는질문</router-link>
          <a href="/#inquiry" @click.prevent="goInquiry">수강신청문의</a>
        </nav>
      </div>

      <div class="footer-info">
        <dl class="info-list">
          <div><dt>상호</dt><dd>{{ COMPANY.name }}</dd></div>
          <div><dt>대표자</dt><dd>{{ COMPANY.ceo }}</dd></div>
          <div><dt>사업자등록번호</dt><dd>{{ COMPANY.bizNumber }}</dd></div>
          <div><dt>주소</dt><dd>{{ COMPANY.address }}</dd></div>
        </dl>
        <dl class="info-list">
          <div><dt>대표전화</dt><dd><a :href="PHONE_TEL">{{ PHONE_DISPLAY }}</a></dd></div>
          <div><dt>팩스</dt><dd>{{ COMPANY.fax }}</dd></div>
          <div><dt>이메일</dt><dd>{{ COMPANY.email }}</dd></div>
        </dl>
      </div>

      <p class="footer-copy">© {{ year }}. {{ COMPANY.copyrightHolder }}. All rights reserved</p>
    </div>
  </footer>
</template>

<script setup>
import { computed } from 'vue'
import { COMPANY, PHONE_DISPLAY, PHONE_TEL } from '@/constants/contact.js'
// 11/13 사용자가 준 로고(Group 191/195): 차콜 바탕엔 흰 글자, 흰 바탕엔 검정 글자
import logoTextBlack from '@/assets/images/logo-text-black.svg'
import logoTextWhite from '@/assets/images/logo-text-white.svg'
import { useGoInquiry } from './useGoInquiry.js'

const props = defineProps({
  theme: { type: String, default: 'dark' }, // dark | light
})

const logoSrc = computed(() => (props.theme === 'dark' ? logoTextWhite : logoTextBlack))


const goInquiry = useGoInquiry()

const year = new Date().getFullYear()
</script>

<style scoped>
.site-footer.theme-dark {
  --f-bg: #1b1b1c;
  --f-line: rgba(255, 255, 255, 0.12);
  --f-strong: rgba(255, 255, 255, 0.9);
  --f-text: rgba(255, 255, 255, 0.62);
  --f-label: rgba(255, 255, 255, 0.42);
  --f-hover: #ffffff; /* 11/12 색 정리: 금색 빼고 */
}

.site-footer.theme-light {
  --f-bg: var(--jj-ivory);
  --f-line: var(--jj-line);
  --f-strong: var(--jj-ink);
  --f-text: var(--jj-text-sub);
  --f-label: #8d877d;
  --f-hover: var(--jj-ink);
}

.site-footer {
  padding: 64px 0 40px;
  background: var(--f-bg);
  color: var(--f-text);
  font-size: 14px;
}

.footer-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  padding-bottom: 32px;
  border-bottom: 1px solid var(--f-line);
}

.footer-logo {
  display: block;
  height: 44px;
  width: auto;
}

.footer-nav {
  display: flex;
  flex-wrap: wrap;
  gap: 8px 28px;
}

.footer-nav a {
  font-size: 15px;
  font-weight: 500;
  color: var(--f-strong);
}

.footer-nav a:hover {
  color: var(--f-hover);
}

.footer-info {
  display: grid;
  grid-template-columns: 1.4fr 1fr;
  gap: 24px 48px;
  padding: 32px 0;
}

.info-list {
  display: grid;
  gap: 8px;
}

.info-list div {
  display: flex;
  gap: 14px;
  line-height: 1.6;
}

.info-list dt {
  flex-shrink: 0;
  width: 96px;
  color: var(--f-label);
}

.info-list dd {
  color: var(--f-text);
}

.info-list a:hover {
  color: var(--f-hover);
}

.footer-copy {
  padding-top: 24px;
  border-top: 1px solid var(--f-line);
  font-size: 13px;
  color: var(--f-label);
}

@media (max-width: 768px) {
  .site-footer {
    padding: 48px 0 32px;
  }

  .footer-top {
    flex-direction: column;
    align-items: flex-start;
  }

  .footer-nav {
    gap: 8px 20px;
  }

  .footer-info {
    grid-template-columns: 1fr;
  }

  .info-list dt {
    width: 88px;
  }
}
</style>
