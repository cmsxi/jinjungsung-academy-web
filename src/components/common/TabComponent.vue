<template>
  <div class="tab-component">
    <div class="tab-header">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        class="tab-button"
        :class="{ 
          active: currentTab === tab.id,
          disabled: tab.disabled 
        }"
        :disabled="tab.disabled"
        @click="changeTab(tab.id)"
      >
        {{ tab.title }}
      </button>
    </div>
    <div class="tab-content">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TabComponent',
  props: {
    tabs: {
      type: Array,
      required: true,
      validator: (value) => {
        return value.every(tab => 
          typeof tab.id === 'string' && 
          typeof tab.title === 'string'
        )
      }
    },
    modelValue: {
      type: String,
      required: true
    }
  },
  emits: ['update:modelValue'],
  computed: {
    currentTab: {
      get() {
        return this.modelValue
      },
      set(value) {
        this.$emit('update:modelValue', value)
      }
    }
  },
  methods: {
    changeTab(tabId) {
      // disabled된 탭은 변경하지 않음
      const tab = this.tabs.find(t => t.id === tabId)
      if (tab && tab.disabled) return
      
      this.currentTab = tabId
    }
  }
}
</script>

<style scoped>
.tab-component {
  width: 100%;
}

.tab-header {
  display: flex;
  gap: 20px;
  border-bottom: 2px solid #eee;
  margin-bottom: 30px;
}

.tab-button {
  padding: 15px 30px;
  font-size: 1.1rem;
  font-weight: 500;
  color: #666;
  background: none;
  border: none;
  border-bottom: 2px solid transparent;
  margin-bottom: -2px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.tab-button:hover:not(.disabled) {
  color: var(--primary-color);
}

.tab-button.active {
  color: var(--primary-color);
  border-bottom-color: var(--primary-color);
}

.tab-button.disabled {
  color: #ccc;
  cursor: not-allowed;
  opacity: 0.5;
}

.tab-button.disabled:hover {
  color: #ccc;
}

.tab-content {
  min-height: 300px;
}

@media (max-width: 768px) {
  .tab-header {
    gap: 10px;
  }

  .tab-button {
    padding: 12px 20px;
    font-size: 1rem;
  }
}
</style> 