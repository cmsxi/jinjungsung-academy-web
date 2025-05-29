<template>
  <div class="curriculum-page">
    <div class="curriculum-content">
      <div class="offline-curriculum">
        <div class="curriculum-image">
          <img :src="eduStepImage" alt="오프라인 커리큘럼" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  import eduStepImage from '@/assets/images/edu-step.png'

</script>

<style scoped>
.curriculum-page {
  padding: 20px;
}

.curriculum-content {
  max-width: 1100px;
  margin: 0 auto;
  background: white;
}

.curriculum-content h2 {
  color: var(--primary-color);
  font-size: 2rem;
  margin-bottom: 40px;
  text-align: center;
}

.curriculum-sections {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.curriculum-section {
  background: #f8f9fa;
  padding: 25px;
  transition: transform 0.3s ease;
  border: 1px solid #ddd;
}

.curriculum-section:hover {
  transform: translateY(-5px);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.section-header h3 {
  color: var(--primary-color);
  font-size: 1.4rem;
  margin: 0;
}

.duration {
  background: var(--primary-color);
  color: white;
  padding: 5px 15px;
  font-size: 0.9rem;
  border: 1px solid var(--primary-color);
}

.section-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
}

.section-description p {
  color: #666;
  font-size: 1.1rem;
  line-height: 1.6;
}

.section-topics h4 {
  color: #333;
  font-size: 1.2rem;
  margin-bottom: 15px;
}

.section-topics ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.section-topics ul li {
  margin: 10px 0;
  color: #555;
  font-size: 1rem;
  position: relative;
  padding-left: 20px;
}

.section-topics ul li::before {
  content: "•";
  color: var(--primary-color);
  position: absolute;
  left: 0;
  font-size: 1.2rem;
}

.curriculum-note {
  margin-top: 40px;
  padding: 20px;
  background: #fff3cd;
  border: 1px solid #ffeaa7;
}

.curriculum-note h4 {
  color: #856404;
  font-size: 1.2rem;
  margin-bottom: 15px;
}

.curriculum-note ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.curriculum-note ul li {
  color: #666;
  font-size: 1rem;
  margin: 8px 0;
  position: relative;
  padding-left: 20px;
}

.curriculum-note ul li::before {
  content: "•";
  color: #856404;
  position: absolute;
  left: 0;
}

@media (max-width: 768px) {
  .curriculum-content {
    padding: 20px;
  }

  .curriculum-content h2 {
    font-size: 1.8rem;
    margin-bottom: 30px;
  }

  .section-content {
    grid-template-columns: 1fr;
    gap: 20px;
  }

  .section-header h3 {
    font-size: 1.2rem;
  }

  .section-description p {
    font-size: 1rem;
  }

  .section-topics h4 {
    font-size: 1.1rem;
  }

  .section-topics ul li {
    font-size: 0.9rem;
  }
}

.offline-curriculum {
  margin-bottom: 40px;
}

.curriculum-image {
  text-align: center;
}

.curriculum-image img {
  max-width: 100%;
  height: auto;
}
</style> 