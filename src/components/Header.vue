<template>
  <header 
    :class="{
      'header-hidden': isHidden,
      'header-visible': !isHidden,
      'scrolled': currentSection > 0
    }"
  >
    <div class="header-container">
      <div class="center-logo">
        <router-link to="/">
          <img
            src="@/assets/images/logo.png"
            alt="center Logo"
            class="logo-image desktop-logo"
          />
          <img
            src="@/assets/images/logo.png"
            alt="center Logo"
            class="logo-image mobile-logo"
          />
        </router-link>
      </div>

      <div class="hamburger-menu" @click="toggleMobileMenu">
        <span></span>
        <span></span>
        <span></span>
      </div>

      <nav class="header-menu" :class="{ 'mobile-menu-open': isMobileMenuOpen }">
        <div class="mobile-menu-container">
          <!-- 데스크탑 메뉴 -->
          <ul class="main-menu desktop-only">
            <li @mouseenter="showSubmenu('all')"><router-link to="/introduction" @click="handleNavigation">교육원 소개</router-link></li>
            <li @mouseenter="showSubmenu('all')"><router-link to="/education" @click="handleNavigation">교육안내</router-link></li>
            <li @mouseenter="showSubmenu('all')"><router-link to="/registration" @click="handleNavigation">수강신청문의</router-link></li>
            <li @mouseenter="showSubmenu('all')"><router-link to="/faq" @click="handleNavigation">자주묻는질문</router-link></li>
            <li @mouseenter="showSubmenu('all')"><span @click.prevent>수강후기</span></li>
          </ul>
          
          <!-- 모바일 전용 아코디언 메뉴 -->
          <div class="mobile-menu">
            <div class="accordion-menu">
              <div class="accordion-item">
                <h3><router-link to="/introduction" @click="handleNavigation">교육원 소개</router-link></h3>
                <ul>
                  <li><router-link to="/introduction/greeting" @click="handleNavigation">인사말</router-link></li>
                  <li><router-link to="/introduction/business" @click="handleNavigation">사업영역</router-link></li>
                  <li><router-link to="/introduction/partners" @click="handleNavigation">협력업체</router-link></li>
                </ul>
              </div>
              <div class="accordion-item">
                <h3><router-link to="/education" @click="handleNavigation">교육안내</router-link></h3>
                <ul>
                  <li><router-link to="/education/curriculum" @click="handleNavigation">커리큘럼</router-link></li>
                  <li><router-link to="/education/status" @click="handleNavigation">수강현황</router-link></li>
                </ul>
              </div>
              <div class="accordion-item">
                <h3><router-link to="/registration" @click="handleNavigation">수강신청문의</router-link></h3>
              </div>
              <div class="accordion-item">
                <h3><router-link to="/faq" @click="handleNavigation">자주묻는질문</router-link></h3>
                <ul>
                  <li><router-link to="/faq/questions" @click="handleNavigation">FAQ</router-link></li>
                  <li><span class="disabled-link">문의게시판</span></li>
                </ul>
              </div>
              <div class="accordion-item">
                <h3><span @click.prevent>수강후기</span></h3>
                <ul>
                  <li><span class="disabled-link">수강후기</span></li>
                </ul>
              </div>
            </div>
          </div>
          
          <div class="mobile-apply-button">
            <a href="#" class="consultation-btn" @click.prevent="goToConsultation">수강신청문의</a>
          </div>
        </div>
      </nav>

      <div class="apply-button">
        <a href="#" class="consultation-btn" @click.prevent="goToConsultation">수강신청문의</a>
      </div>
    </div>

    <!-- 데스크탑 전체 메뉴 -->
    <div class="full-menu" v-if="activeSubmenu === 'all' && !isMobile" @mouseleave="hideSubmenu">
      <div class="full-menu-container">
        <div class="submenu-spacer"></div>
        <div class="submenu-grid">
          <div class="submenu-section">
            <ul>
              <li><router-link to="/introduction/greeting">인사말</router-link></li>
              <li><router-link to="/introduction/business">사업영역</router-link></li>
              <li><router-link to="/introduction/partners">협력업체</router-link></li>
            </ul>
          </div>
          <div class="submenu-section">
            <ul>
              <li><router-link to="/education/curriculum">커리큘럼</router-link></li>
              <li><router-link to="/education/status">수강현황</router-link></li>
            </ul>
          </div>
          <div class="submenu-section">
            <ul>
              <li><router-link to="/registration">수강신청문의</router-link></li>
            </ul>
          </div>
          <div class="submenu-section">
            <ul>
              <li><router-link to="/faq/questions">FAQ</router-link></li>
              <li><span class="disabled-link">문의게시판</span></li>
            </ul>
          </div>
          <div class="submenu-section">
            <ul>
              <li><span class="disabled-link">수강후기</span></li>
            </ul>
          </div>
        </div>
        <div class="submenu-spacer"></div>
      </div>
    </div>
  </header>
</template>

<script>
export default {
  name: "Header",
  props: {
    currentSection: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      isHidden: false,
      isMobileMenuOpen: false,
      activeSubmenu: null,
      isMobile: false
    };
  },
  created() {
    this.checkMobile();
    window.addEventListener('resize', this.debounce(this.checkMobile, 200));
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.debounce(this.checkMobile, 200));
    document.body.style.overflow = '';
  },
  watch: {
    currentSection: {
      handler(newSection, oldSection) {
        if (newSection === 0) {
          this.isHidden = false;
        } else {
          this.isHidden = newSection > oldSection;
        }
      },
      immediate: true
    },
    $route() {
      window.scrollTo({
        top: 0,
        behavior: 'auto'
      });
      this.closeMobileMenu();
    }
  },
  methods: {
    debounce(func, wait) {
      let timeout;
      return function() {
        const context = this;
        const args = arguments;
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(context, args), wait);
      };
    },
    checkMobile() {
      try {
        this.isMobile = window.innerWidth <= 1000;
        if (!this.isMobile && this.isMobileMenuOpen) {
          this.closeMobileMenu();
        }
      } catch (error) {
        console.error('Error checking mobile status:', error);
      }
    },
    toggleMobileMenu() {
      try {
        this.isMobileMenuOpen = !this.isMobileMenuOpen;
        if (this.isMobileMenuOpen) {
          document.body.style.overflow = 'hidden';
        } else {
          document.body.style.overflow = '';
        }
      } catch (error) {
        console.error('Error toggling mobile menu:', error);
      }
    },
    closeMobileMenu() {
      try {
        if (this.isMobileMenuOpen) {
          this.isMobileMenuOpen = false;
          document.body.style.overflow = '';
        }
      } catch (error) {
        console.error('Error closing mobile menu:', error);
      }
    },
    handleNavigation() {
      try {
        if (this.isMobileMenuOpen) {
          document.body.style.overflow = '';
        }
        this.closeMobileMenu();
        window.scrollTo(0, 0);
      } catch (error) {
        console.error('Error handling navigation:', error);
      }
    },
    goToConsultation() {
      try {
        if (this.isMobileMenuOpen) {
          document.body.style.overflow = '';
        }
        this.closeMobileMenu();
        
        // 수강신청문의 페이지로 라우팅
        this.$router.push('/registration').catch(err => {
          console.error('Navigation error:', err);
        });
      } catch (error) {
        console.error('Error navigating to consultation:', error);
      }
    },
    showSubmenu(menu) {
      try {
        this.activeSubmenu = menu;
      } catch (error) {
        console.error('Error showing submenu:', error);
      }
    },
    hideSubmenu() {
      try {
        this.activeSubmenu = null;
      } catch (error) {
        console.error('Error hiding submenu:', error);
      }
    }
  },
  mounted() {
    try {
      this.$router.afterEach(() => {
        window.scrollTo({
          top: 0,
          behavior: 'auto'
        });
      });
    } catch (error) {
      console.error('Router hook error:', error);
    }
  }
};
</script>

<style scoped>
:root {
  --menu-width: 160px;
  --menu-total-width: 800px;
  --menu-gap: 20px;
}

header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  background-color: var(--secondary-color);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.3s ease-in-out;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  height: 80px;
}

.header-container {
  width: 100%;
  max-width: 1300px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
}

.header-hidden {
  transform: translateY(-100%);
  pointer-events: none;
}

.header-visible {
  transform: translateY(0);
}

header.scrolled {
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.center-logo {
  display: flex;
  align-items: center;
  padding: 10px 0;
}

.logo-image {
  height: 50px;
  object-fit: contain;
  transition: all 0.3s ease;
  filter: drop-shadow(0 0 10px rgba(0, 0, 0, 0.2));
}

.mobile-logo {
  display: none;
}

.desktop-logo {
  display: block;
}

.header-menu {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}

.main-menu {
  display: flex;
  justify-content: center;
  gap: 30px;
  list-style: none;
  margin: 0;
  padding: 0;
  max-width: 1000px;
  width: 100%;
}

.main-menu li {
  text-align: center;
  color: white;
  font-weight: 500;
  font-size: 16px;
  position: relative;
  width: 100px;
  white-space: nowrap;
  overflow: hidden;
}

.main-menu li a {
  color: white;
  text-decoration: none;
  transition: all 0.2s ease;
  position: relative;
  padding: 5px 0;
  display: block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.main-menu li a::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 0;
  height: 2px;
  background-color: var(--secondary-color);
  transition: width 0.3s ease;
}

.main-menu li:hover a::after {
  width: 100%;
}

.main-menu li a:hover {
  font-weight: 700;
}

.main-menu li span {
  color: white;
  text-decoration: none;
  position: relative;
  padding: 5px 0;
  display: block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  cursor: default;
}

.consultation-btn {
  display: inline-block;
  padding: 13px 50px;
  background-color: var(--secondary-color);
  color: #ffffff;
  text-decoration: none;
  font-size: 18px;
  font-weight: 500;
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.consultation-btn:hover {
  opacity: 0.9;
  transform: translateY(-1px);
}

.hamburger-menu {
  display: none;
  flex-direction: column;
  justify-content: space-between;
  width: 30px;
  height: 21px;
  cursor: pointer;
  padding: 0;
  z-index: 1001;
  margin-right: 30px;
}

.hamburger-menu span {
  width: 100%;
  height: 2px;
  background-color: white;
  transition: all 0.3s ease;
}

.mobile-menu-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
}

.mobile-apply-button {
  display: none;
}

.menu-divider {
  display: none;
}

.desktop-only {
  display: flex;
}

.mobile-menu {
  display: none;
}

.full-menu {
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  background-color: var(--secondary-color);
  opacity: 0.9;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  z-index: 999;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  animation: fadeIn 0.3s ease;
  color: white;
}


@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.full-menu-container {
  width: 100%;
  max-width: 1300px;
  margin: 0 auto;
  padding: 10px 20px 30px 20px;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
}

/* .submenu-spacer {
  flex: 1;
} */

.submenu-grid {
  display: flex;
  justify-content: center;
  gap: 30px;
  width: 720px;
  margin: 0;
}

.submenu-section {
  width: 100px;
  text-align: center;
  padding: 0;
  box-sizing: border-box;
}

.submenu-section h3 {
  color: white;
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 2px solid var(--secondary-color);
  white-space: nowrap;
}

.submenu-section ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.submenu-section ul li {
  margin: 12px 0;
}

.submenu-section ul li a {
  color: white;
  text-decoration: none;
  font-size: 16px;
  transition: all 0.3s ease;
  display: block;
  padding: 5px 0;
}

.submenu-section ul li a:hover {
  color: var(--primary-color);
  transform: translateX(2px);
}

.mobile-menu .accordion-item h3 span {
  color: white;
  text-decoration: none;
  display: block;
  padding: 5px 0;
  cursor: default;
}

.mobile-menu .accordion-item ul li span {
  color: rgba(255, 255, 255, 0.7);
  font-size: 14px;
  padding: 5px 0;
  display: block;
  text-decoration: none;
  border: none;
  cursor: default;
}

.submenu-section ul li span {
  color: white;
  text-decoration: none;
  font-size: 16px;
  display: block;
  padding: 5px 0;
  cursor: default;
}

.disabled-link {
  color: rgba(255, 255, 255, 0.4) !important;
  cursor: not-allowed !important;
}

.mobile-menu .accordion-item ul li .disabled-link {
  color: rgba(255, 255, 255, 0.3) !important;
}

/* 햄버거 메뉴 열림 상태일 때 아이콘 애니메이션 */
.mobile-menu-open + .hamburger-menu span:nth-child(1) {
  transform: translateY(9px) rotate(45deg);
}

.mobile-menu-open + .hamburger-menu span:nth-child(2) {
  opacity: 0;
}

.mobile-menu-open + .hamburger-menu span:nth-child(3) {
  transform: translateY(-9px) rotate(-45deg);
}

@media (max-width: 1000px) {
  header {
    height: 80px;
  }
  
  .mobile-logo {
    display: block;
    padding: 0;
  }

  .logo-image {
    width: 100%;
    height: 100%
  }

  .desktop-logo {
    display: none;
  }
  
  .hamburger-menu {
    display: flex;
  }
  
  .header-menu {
    position: fixed;
    top: 0;
    right: -100%;
    width: 100%;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.95);
    padding: 80px 20px 30px;
    transition: right 0.3s ease;
    margin: 0;
    z-index: 1000;
    overflow-y: auto;
    display: block;
  }
  
  .header-menu.mobile-menu-open {
    right: 0;
  }
  
  .desktop-only {
    display: none;
  }
  
  .mobile-menu {
    display: block;
    width: 100%;
    margin-top: 20px;
  }
  
  .mobile-menu .accordion-menu {
    width: 100%;
  }
  
  .mobile-menu .accordion-item {
    margin-bottom: 15px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    padding-bottom: 10px;
  }
  
  .mobile-menu .accordion-item h3 {
    color: white;
    font-size: 17px;
    margin-bottom: 10px;
    padding-bottom: 5px;
  }
  
  .mobile-menu .accordion-item h3 a {
    color: white;
    text-decoration: none;
    display: block;
    padding: 5px 0;
  }
  
  .mobile-menu .accordion-item ul {
    list-style: none;
    padding: 0;
    margin: 0 0 0 15px;
  }
  
  .mobile-menu .accordion-item ul li {
    margin: 8px 0;
    border: none;
  }
  
  .mobile-menu .accordion-item ul li a {
    color: rgba(255, 255, 255, 0.7);
    font-size: 14px;
    padding: 5px 0;
    display: block;
    text-decoration: none;
    border: none;
  }
  
  .mobile-menu .accordion-item ul li a:hover {
    color: white;
  }
  
  .main-menu li {
    width: 100%;
    text-align: left;
    padding: 0;
    margin: 0;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }
  
  .main-menu li a {
    padding: 12px 0;
    font-size: 17px;
  }
  
  .main-menu li a::after {
    display: none;
  }
  
  .apply-button {
    display: none;
  }
  
  .mobile-apply-button {
    display: block;
    padding: 20px 0;
    text-align: center;
    margin-top: 20px;
  }
  
  .mobile-apply-button .consultation-btn {
    width: 100%;
    max-width: 300px;
    padding: 10px 0;
  }
  
  .logo-image {
    height: 44px;
    margin-left: 10px;
  }
  
  .header-container {
    padding: 0 10px;
  }
}

@media (min-width: 1001px) and (max-width: 1023px) {
  .consultation-btn {
    padding: 12px 30px;
    font-size: 16px;
  }
  
  .main-menu {
    gap: 20px;
  }
  
  .submenu-grid {
    gap: 20px;
  }
}

@media (min-width: 1024px) and (max-width: 1279px) {
  .main-menu {
    gap: 25px;
  }
  
  .submenu-grid {
    gap: 25px;
  }
}

@media (min-width: 1280px) {
  .main-menu {
    gap: 30px;
  }
  
  .submenu-grid {
    gap: 30px;
  }
}

.disabled-menu {
  color: rgba(255, 255, 255, 0.4) !important;
  cursor: not-allowed !important;
}
</style>