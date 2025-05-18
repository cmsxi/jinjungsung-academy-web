<template>
  <div class="business-page">
    <div class="business-content">
      <h2>사업 영역</h2>
      <div class="business-sections">
        <div class="business-section">
          <h3>교육 사업</h3>
          <ul>
            <li>전문 교육 프로그램 운영</li>
            <li>맞춤형 교육 컨설팅</li>
            <li>온라인/오프라인 교육 서비스</li>
          </ul>
        </div>
        
        <div class="business-section">
          <h3>컨설팅 사업</h3>
          <ul>
            <li>기업 맞춤형 교육 솔루션</li>
            <li>교육 프로그램 개발</li>
            <li>교육 시스템 구축</li>
          </ul>
        </div>
        
        <div class="business-section">
          <h3>연구 개발</h3>
          <ul>
            <li>교육 방법론 연구</li>
            <li>교육 콘텐츠 개발</li>
            <li>교육 플랫폼 개발</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Business'
}
</script>

<style scoped>
.business-page {
  padding: 20px;
}

.business-content {
  max-width: 1000px;
  margin: 0 auto;
  background: white;
  padding: 40px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.business-content h2 {
  color: var(--primary-color);
  font-size: 2rem;
  margin-bottom: 40px;
  text-align: center;
}

.business-sections {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 30px;
}

.business-section {
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
  transition: transform 0.3s ease;
}

.business-section:hover {
  transform: translateY(-5px);
}

.business-section h3 {
  color: var(--primary-color);
  font-size: 1.3rem;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 2px solid var(--primary-color);
}

.business-section ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.business-section ul li {
  margin: 12px 0;
  color: #333;
  font-size: 1.1rem;
  position: relative;
  padding-left: 20px;
}

.business-section ul li::before {
  content: "•";
  color: var(--primary-color);
  position: absolute;
  left: 0;
  font-size: 1.2rem;
}

@media (max-width: 768px) {
  .business-content {
    padding: 20px;
  }

  .business-content h2 {
    font-size: 1.8rem;
    margin-bottom: 30px;
  }

  .business-sections {
    grid-template-columns: 1fr;
    gap: 20px;
  }

  .business-section {
    padding: 15px;
  }

  .business-section h3 {
    font-size: 1.2rem;
  }

  .business-section ul li {
    font-size: 1rem;
  }
}
</style> 