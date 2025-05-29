<template>
  <div class="business-page">
    <div class="business-content">
      <!-- 전당포 창업 -->
      <div class="business-item">
        <div class="business-image">
          <img 
            :src="business1Image" 
            alt="전당포 창업" 
            loading="eager"
            fetchpriority="high"
          />
        </div>
        <div class="business-text">
          <h3>전당포 창업</h3>
          <p>
            전당포사업은 담보 대출 이자수익을 통해 연 20%의 안정적인 수익 모델을 제공합니다.<br>
            체계적인 귀금속·명품 감정 실습뿐 아니라 IT,기타 제품등 다양한 교육과 대출 프로세스 교육을 통해 수료 후 바로 전당포를 창업할 수 있습니다. 또한 국제명품감정교육원과 연계된 진정성ERP시스템을 통해 안정적인 전당포 운영이 가능합니다.
          </p>
        </div>
      </div>

      <!-- 금거래소 창업 -->
      <div class="business-item reverse">
        <div class="business-image">
          <img 
            :src="business2Image" 
            alt="금거래소 창업" 
            loading="eager"
            fetchpriority="high"
          />
        </div>
        <div class="business-text">
          <h3>금거래소 창업</h3>
          <p>
            금 매입을 위주로 진행하는 진정성금거래소 창업은 초기 큰 투자 없이 안정적인 시세차익을 거둘 수 있는 아이템입니다.<br>
            국제명품감정교육원의 시세 조회, 매입 실습등의 교육을 마치면 교육 종료와 동시에 금거래소 창업 및 운영이 가능합니다.<br>
            글로벌 금 시세 변동에 따른 시세 차익과 전국 협력점 네트워크 확장으로 안정적 매출 성장이 가능합니다.
          </p>
        </div>
      </div>

      <!-- 중고명품사업 창업 -->
      <div class="business-item">
        <div class="business-image">
          <img 
            :src="business3Image" 
            alt="중고명품사업 창업" 
            loading="eager"
            fetchpriority="auto"
          />
        </div>
        <div class="business-text">
          <h3>중고명품사업 창업</h3>
          <p>
            명품 감정 노하우와 온라인·오프라인 판매 전략을 모두 교육받아, 수료 즉시 중고명품샵을 개설할 수 있습니다.<br>
            전국 협력점 네트워크 연계와 다양한 유통채널을 통해 프리미엄 고객 확보 및 프리미엄 시장 공략으로 수익 극대화를 노릴 수 있습니다.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import business1Image from '@/assets/images/business-1.jpg';
import business2Image from '@/assets/images/business-2.jpg';
import business3Image from '@/assets/images/business-3.jpg';

// 이미지 프리로드
onMounted(() => {
  const preloadImages = [business1Image, business2Image, business3Image];
  
  preloadImages.forEach(src => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = src;
    document.head.appendChild(link);
  });
});
</script>

<style scoped>
.business-page {
  padding: 40px 30px;
  min-height: 100vh;
}

.business-content {
  max-width: 1100px;
  margin: 0 auto;
}

.business-item {
  display: flex;
  align-items: center;
  gap: 50px;
  margin-bottom: 120px;
  padding: 0;
}

.business-item.reverse {
  flex-direction: row-reverse;
}

.business-image {
  flex: 1;
  max-width: 500px;
}

.business-image img {
  width: 100%;
  height: 350px;
  object-fit: cover;
  will-change: transform;
  transform: translateZ(0);
  backface-visibility: hidden;
}

.business-text {
  flex: 1;
  padding: 20px;
  margin-bottom: 20px;

}

.business-text h3 {
  color: var(--primary-color);
  font-size: 2rem;
  margin-bottom: 20px;
  font-weight: 700;
}

.business-text p {
  color: #333;
  font-size: 1.2rem;
  line-height: 1.8;
  margin: 0;
}

@media (max-width: 768px) {
  .business-page {
    padding: 20px 10px;
  }

  .business-item {
    flex-direction: column !important;
    gap: 30px;
    margin-bottom: 60px;
  }

  .business-image {
    max-width: 100%;
  }

  .business-image img {
    height: 250px;
  }

  .business-text {
    padding: 10px 0;
  }

  .business-text h3 {
    font-size: 1.8rem;
    margin-bottom: 20px;
  }

  .business-text p {
    font-size: 1rem;
    line-height: 1.6;
  }
}
</style> 