<template>
  <div class="education-layout">
 
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
  name: 'Education',
  components: {
    TabComponent
  },
  data() {
    return {
      tabs: [
        { title: '커리큘럼', id: 'tab-0' },
        { title: '수강현황', id: 'tab-1' }
      ],
      currentTab: 'tab-0'
    }
  },
  methods: {
    handleTabChange(tabId) {
      this.currentTab = tabId
      const index = parseInt(tabId.split('-')[1])
      const routes = ['curriculum', 'status']
      this.$router.push(`/education/${routes[index]}`)
    }
  },
  watch: {
    '$route'(to) {
      const routeMap = {
        'curriculum': 'tab-0',
        'status': 'tab-1'
      }
      const currentRoute = to.path.split('/').pop()
      this.currentTab = routeMap[currentRoute] || 'tab-0'
    }
  },
  created() {
    // 현재 라우트에 따라 탭 선택
    const routeMap = {
      'curriculum': 'tab-0',
      'status': 'tab-1'
    }
    const currentRoute = this.$route.path.split('/').pop()
    this.currentTab = routeMap[currentRoute] || 'tab-0'
  }
}
</script>

<style scoped>
.education-layout {
  min-height: 100vh;
  background-color: #f8f9fa;
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
  max-width: 1100px;
  margin: 0 auto;
  padding: 20px 20px;
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