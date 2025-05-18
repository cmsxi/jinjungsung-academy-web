<template>
  <div class="partners-page">
    <div class="partners-content">
      <h2>협력업체</h2>
      <div class="partners-grid">
        <div class="partner-card" v-for="(partner, index) in partners" :key="index">
          <div class="partner-logo">
            <img :src="partner.logo" :alt="partner.name">
          </div>
          <div class="partner-info">
            <h3>{{ partner.name }}</h3>
            <p>{{ partner.description }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Partners',
  data() {
    return {
      partners: [
        {
          name: '교육기관 A',
          logo: '/images/partner1.png',
          description: '전문 교육 프로그램 개발 및 운영'
        },
        {
          name: '기업 B',
          logo: '/images/partner2.png',
          description: '기업 맞춤형 교육 솔루션 제공'
        },
        {
          name: '연구소 C',
          logo: '/images/partner3.png',
          description: '교육 방법론 연구 및 개발'
        },
        {
          name: '기술회사 D',
          logo: '/images/partner4.png',
          description: '교육 플랫폼 기술 지원'
        }
      ]
    }
  }
}
</script>

<style scoped>
.partners-page {
  padding: 20px;
}

.partners-content {
  max-width: 1200px;
  margin: 0 auto;
  background: white;
  padding: 40px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.partners-content h2 {
  color: var(--primary-color);
  font-size: 2rem;
  margin-bottom: 40px;
  text-align: center;
}

.partners-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 30px;
}

.partner-card {
  display: flex;
  align-items: center;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
  transition: transform 0.3s ease;
}

.partner-card:hover {
  transform: translateY(-5px);
}

.partner-logo {
  width: 100px;
  height: 100px;
  margin-right: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.partner-logo img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.partner-info {
  flex: 1;
}

.partner-info h3 {
  color: var(--primary-color);
  font-size: 1.3rem;
  margin-bottom: 10px;
}

.partner-info p {
  color: #666;
  font-size: 1rem;
  line-height: 1.5;
}

@media (max-width: 768px) {
  .partners-content {
    padding: 20px;
  }

  .partners-content h2 {
    font-size: 1.8rem;
    margin-bottom: 30px;
  }

  .partners-grid {
    grid-template-columns: 1fr;
    gap: 20px;
  }

  .partner-card {
    padding: 15px;
  }

  .partner-logo {
    width: 80px;
    height: 80px;
    margin-right: 15px;
  }

  .partner-info h3 {
    font-size: 1.2rem;
  }

  .partner-info p {
    font-size: 0.9rem;
  }
}
</style> 