<template>
  <div class="introduction-layout">
   
    <div class="content-container">
      <TabComponent 
        :tabs="tabs" 
        :modelValue="currentTab"
        @update:modelValue="handleTabChange"
      >
        <router-view></router-view>
      </TabComponent>
    </div>
  </div>
</template>

<script>
import TabComponent from '@/components/common/TabComponent.vue'

export default {
  name: 'Introduction',
  components: {
    TabComponent
  },
  data() {
    return {
      tabs: [
        { title: '인사말', id: 'tab-0' },
        { title: '사업 영역', id: 'tab-1' },
        { title: '협력업체', id: 'tab-2' }
      ],
      currentTab: 'tab-0'
    }
  },
  methods: {
    handleTabChange(tabId) {
      this.currentTab = tabId
      const index = parseInt(tabId.split('-')[1])
      const routes = ['greeting', 'business', 'partners']
      this.$router.push(`/introduction/${routes[index]}`)
    }
  },
  watch: {
    '$route'(to) {
      const routeMap = {
        'greeting': 'tab-0',
        'business': 'tab-1',
        'partners': 'tab-2'
      }
      const currentRoute = to.path.split('/').pop()
      this.currentTab = routeMap[currentRoute] || 'tab-0'
    }
  },
  created() {
    // 현재 라우트에 따라 탭 선택
    const routeMap = {
      'greeting': 'tab-0',
      'business': 'tab-1',
      'partners': 'tab-2'
    }
    const currentRoute = this.$route.path.split('/').pop()
    this.currentTab = routeMap[currentRoute] || 'tab-0'
  }
}
</script>

<style scoped>
.introduction-layout {
  min-height: 100vh;
  background-color: #ffffff;
}

.page-header {
  background-color: var(--primary-color);
  color: white;
  padding: 60px 0;
  text-align: center;
}

.page-header h1 {
  font-size: 2.5rem;
  font-weight: 700;
  margin: 0;
}

.content-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px 100px 20px;
}

@media (max-width: 768px) {
  .page-header {
    padding: 40px 0;
  }

  .page-header h1 {
    font-size: 2rem;
  }

  .content-container {
    padding: 40px 20px 20px 20px;
  }
}
</style> 