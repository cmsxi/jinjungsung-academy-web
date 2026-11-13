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
      // 11/13 '문의게시판' 탭 삭제(실제로 쓰지 않던 게시판) — 문의는 메인 맨 아래 수강신청 문의 폼으로
      tabs: [
        { title: '자주묻는질문', id: 'tab-0' }
      ],
      currentTab: 'tab-0'
    }
  },
  methods: {
    handleTabChange(tabId) {
      this.currentTab = tabId
      this.$router.push('/faq/questions')
    }
  },
  watch: {
    '$route'() {
      this.currentTab = 'tab-0'
    }
  },
  created() {
    this.currentTab = 'tab-0'
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