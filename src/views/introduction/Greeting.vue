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
  padding-bottom: 100px;
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
  .greeting-page {
    padding: 0;
  }

  .greeting-content {
    padding: 0;
    margin: 0;
    max-width: 100%;
  }

  .profile-section {
    margin: 0;
    padding: 0;
  }

  .profile-image {
    text-align: center;
    overflow: hidden;
  }

  .profile-image img {
    width: 104%;
    max-width: 104%;
    transform: scale(1.05) translateX(0%);
    transform-origin: center;
    margin: 0 auto;
    display: block;
  }
}
</style> 