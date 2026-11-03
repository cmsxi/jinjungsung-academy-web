<template>
  <footer class="site-footer">
    <div class="ui-container">
      <div class="footer-top">
        <div class="footer-brand">
          <img src="@/assets/images/logo.png" alt="국제명품감정교육원" class="footer-logo" />
          <p class="footer-tagline">정확한 감정에서 시작하는 안정적인 창업</p>
        </div>

        <div class="footer-contact">
          <span class="contact-label">상담 문의</span>
          <a :href="PHONE_TEL" class="contact-number">{{ PHONE_DISPLAY }}</a>
          <a
            :href="KAKAO_CHANNEL_URL"
            target="_blank"
            rel="noopener noreferrer"
            class="contact-kakao"
          >카카오톡 채널 상담</a>
        </div>
      </div>

      <dl class="footer-info">
        <div class="info-item">
          <dt>상호</dt>
          <dd>{{ COMPANY.name }}</dd>
        </div>
        <div class="info-item">
          <dt>대표자</dt>
          <dd>{{ COMPANY.ceo }}</dd>
        </div>
        <div class="info-item">
          <dt>사업자등록번호</dt>
          <dd>{{ COMPANY.bizNumber }}</dd>
        </div>
        <div class="info-item">
          <dt>대표전화</dt>
          <dd><a :href="PHONE_TEL">{{ PHONE_DISPLAY }}</a></dd>
        </div>
        <div class="info-item">
          <dt>팩스</dt>
          <dd>{{ COMPANY.fax }}</dd>
        </div>
        <div class="info-item">
          <dt>이메일</dt>
          <dd>{{ COMPANY.email }}</dd>
        </div>
        <div class="info-item info-item--wide">
          <dt>본사주소</dt>
          <dd>{{ COMPANY.address }}</dd>
        </div>
      </dl>

      <p class="copyright">© {{ year }}. {{ COMPANY.copyrightHolder }}. All rights reserved</p>
    </div>
  </footer>
</template>

<script setup>
import { PHONE_DISPLAY, PHONE_TEL, KAKAO_CHANNEL_URL, COMPANY } from '@/constants/contact.js'

const year = new Date().getFullYear()
</script>

<style scoped>
.site-footer {
  background-color: var(--charcoal-deep);
  color: rgba(255, 255, 255, 0.72);
  padding: 56px 0 40px;
}

.footer-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 32px;
  padding-bottom: 32px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.footer-logo {
  width: 190px;
  height: auto;
  display: block;
}

.footer-tagline {
  margin-top: 14px;
  font-size: 0.9375rem;
  color: rgba(255, 255, 255, 0.55);
}

.footer-contact {
  display: grid;
  justify-items: end;
  gap: 4px;
}

.contact-label {
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.55);
}

.contact-number {
  font-size: 1.75rem;
  font-weight: 700;
  color: #fff;
  letter-spacing: 0;
}

.contact-number:hover {
  color: var(--gold-400);
}

.contact-kakao {
  font-size: 0.875rem;
  color: var(--gold-400);
  text-decoration: underline;
  text-underline-offset: 3px;
}

.footer-info {
  display: flex;
  flex-wrap: wrap;
  gap: 10px 28px;
  padding: 28px 0 24px;
  font-size: 0.875rem;
  line-height: 1.6;
}

.info-item {
  display: flex;
  gap: 8px;
}

.info-item--wide {
  flex-basis: 100%;
}

.info-item dt {
  color: rgba(255, 255, 255, 0.45);
}

.info-item dd {
  margin: 0;
  color: rgba(255, 255, 255, 0.78);
}

.info-item dd a:hover {
  color: #fff;
  text-decoration: underline;
}

.copyright {
  font-size: 0.8125rem;
  color: rgba(255, 255, 255, 0.4);
}

@media (max-width: 768px) {
  .site-footer {
    padding: 44px 0 32px;
  }

  .footer-top {
    flex-direction: column;
    gap: 24px;
  }

  .footer-logo {
    width: 160px;
  }

  .footer-contact {
    justify-items: start;
  }

  .contact-number {
    font-size: 1.5rem;
  }

  .footer-info {
    flex-direction: column;
    gap: 6px;
  }

  .info-item dt {
    flex: 0 0 104px;
  }
}
</style>
