<template>
  <div class="faq-layout">
    
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
  name: 'FAQ',
  components: {
    TabComponent
  },
  data() {
    return {
      tabs: [
        { title: '자주묻는질문', id: 'tab-0' },
        { title: '문의게시판', id: 'tab-1', disabled: true }
      ],
      currentTab: 'tab-0'
    }
  },
  methods: {
    handleTabChange(tabId) {
      // 문의게시판 탭이 비활성화되어 있으면 변경하지 않음
      if (tabId === 'tab-1') return
      
      this.currentTab = tabId
      const index = parseInt(tabId.split('-')[1])
      const routes = ['questions', 'inquiry']
      this.$router.push(`/faq/${routes[index]}`)
    }
  },
  watch: {
    '$route'(to) {
      const routeMap = {
        'questions': 'tab-0',
        'inquiry': 'tab-1'
      }
      const currentRoute = to.path.split('/').pop()
      this.currentTab = routeMap[currentRoute] || 'tab-0'
    }
  },
  created() {
    // 현재 라우트에 따라 탭 선택
    const routeMap = {
      'questions': 'tab-0',
      'inquiry': 'tab-1'
    }
    const currentRoute = this.$route.path.split('/').pop()
    this.currentTab = routeMap[currentRoute] || 'tab-0'
  }
}
</script>

<style scoped>
.faq-layout {
  min-height: 100vh;
  background-color: #f8f9fa;
}

.page-header {
  background-color: var(--primary-color);
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
  padding: 40px 20px;
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