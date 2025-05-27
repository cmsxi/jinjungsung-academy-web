<template>
  <div class="greeting-page">
    <div class="greeting-content">
      <h2>인사말</h2>
      <div class="greeting-text">
        <p>안녕하세요, 진정성 아카데미입니다.</p>
        <p>저희 아카데미는 최고의 교육 서비스를 제공하기 위해 노력하고 있습니다.</p>
        <p>학생들의 성장과 발전을 위해 항상 최선을 다하겠습니다.</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Greeting'
}
</script>

<style scoped>
.greeting-page {
  padding: 20px;
}

.greeting-content {
  max-width: 800px;
  margin: 0 auto;
  background: white;
  padding: 40px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.greeting-content h2 {
  color: var(--primary-color);
  font-size: 2rem;
  margin-bottom: 30px;
  text-align: center;
}

.greeting-text {
  line-height: 1.8;
}

.greeting-text p {
  margin-bottom: 20px;
  font-size: 1.1rem;
  color: #333;
}

@media (max-width: 768px) {
  .greeting-content {
    padding: 20px;
  }

  .greeting-content h2 {
    font-size: 1.8rem;
  }

  .greeting-text p {
    font-size: 1rem;
  }
}
</style> 