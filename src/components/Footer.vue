<template>
  <footer>
    <div class="footer-container">
      <div class="footer-content">
        <div class="footer-left">
          <div class="logo-container">
            <img src="@/assets/images/logo.png" alt="..." class="footer-logo" />
          </div>
        </div>
        <div class="footer-right">
          <div class="info-row main-info-row">
            <p><span>대표자 : </span>문초록</p>
            <p><span>대표전화 : </span>010-9255-3721</p>
            <p><span>팩스 : </span>02-2088-0704</p>
            <p><span>사업자등록번호 : </span>409-82-90952</p>
            <p><span>이메일 : </span>eoqn0808@naver.com</p>
          </div>
          <div class="info-row address-row">
            <p><span>본사주소 : </span>서울특별시 강남구 강남대로94길 66 2층 (역삼동, 산돌빌딩)</p>
          </div>
        </div>
      </div>
      <hr class="footer-line" />
      <div class="copyright">
        <p>© 2025. 진정성. All rights reserved</p>
      </div>
    </div>
  </footer>
</template>

<script>
export default {
  name: "Footer",
};
</script>

<style scoped>
footer {
  width: 100%;
  background-color: var(--secondary-color);
  color: rgba(255, 255, 255, 0.9);
  padding: 2.5rem 0 2rem;
  z-index: 1000;
}

.footer-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

.footer-content {
  display: flex;
  flex-direction: column;
  margin-bottom: 1.5rem;
}

.footer-left {
  margin-bottom: 1.5rem;
}

.logo-container {
  display: flex;
  align-items: center;
}

.footer-logo {
  width: 180px;
  height: auto;
}

.company-type {
  font-size: 0.9rem;
  margin-left: 0.5rem;
  line-height: 1.2;
  text-align: center;
  color: rgba(255, 255, 255, 0.85);
}

.footer-right {
  width: 100%;
}

.main-info-row {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 0.8rem;
}

.address-row {
  margin-bottom: 0.5rem;
}

.info-row p {
  margin: 0;
  font-size: 0.9rem;
  line-height: 1.5;
  color: rgba(255, 255, 255, 0.85);
}

.info-row span {
  color: rgba(255, 255, 255, 0.6);
}

.footer-line {
  border: 0;
  height: 1px;
  background: rgba(255, 255, 255, 0.1);
  margin: 0.7rem 0 1rem;
}

.copyright {
  text-align: center;
}

.copyright p {
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.5);
  margin: 0;
}

@media (max-width: 992px) {
  .main-info-row {
    flex-wrap: wrap;
    gap: 0.8rem 1.5rem;
  }
}

@media (max-width: 768px) {
  footer {
    padding: 2rem 0 1.5rem;
  }
  
  .footer-container {
    padding: 0 1.5rem;
  }
  
  .logo-container {
    justify-content: center;
  }
  
  .footer-logo {
    width: 160px;
  }
  
  .main-info-row {
    flex-direction: column;
    gap: 0.5rem;
    text-align: center;
  }
  
  .address-row {
    text-align: center;
  }
  
  .info-row p {
    font-size: 0.85rem;
  }
}
</style>