<template>
  <div class="greeting-page">
    <div class="greeting-content">
      <div class="profile-section">
        <div class="profile-image">
          <img :src="profileImage" alt="원장 프로필" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import profileImage from '@/assets/images/profile.png'

export default {
  name: 'Greeting',
  data() {
    return {
      profileImage
    }
  }
}
</script>

<style scoped>
.greeting-page {
  padding: 10px 0;
}

.greeting-content {
  max-width: 1100px;
  margin: 0 auto;
  background: white;
}

.profile-section {
  display: flex;
  justify-content: center;
  align-items: center;
}

.profile-image img {
  max-width: 100%;
  height: auto;
}

@media (max-width: 768px) {
  .greeting-content {
    padding: 20px;
  }
}
</style> 