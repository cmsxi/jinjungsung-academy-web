<template>
  <div 
    class="block"
    :class="{ 'has-background-image': background }"
    :style="blockStyle"
  >
    <slot></slot>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  background: {
    type: String,
    default: ''
  },
  backgroundColor: {
    type: String,
    default: ''
  },
  overlay: {
    type: Boolean,
    default: true
  }
});

const blockStyle = computed(() => {
  const style = {};
  
  if (props.background) {
    style.backgroundImage = `url(${props.background})`;
  } else if (props.backgroundColor) {
    style.backgroundColor = props.backgroundColor;
  }
  
  return style;
});
</script>

<style scoped>
.block {
 width: 100%;
 height: fit-content;
 flex-shrink: 0;
 background-size: cover;
 background-position: center;  
 background-repeat: no-repeat;
 display: flex;
 justify-content: center;
 align-items: center;
 position: relative;
 overflow: hidden;
}

.block.has-background-image::before {
 content: '';
 position: absolute;
 top: 0;
 left: 0;
 right: 0;
 bottom: 0;
 background: rgba(0, 0, 0, 0.3);
 z-index: 1;
}

.block :deep(.block-content) {
 position: relative;
 z-index: 2;
 text-align: center;
 width: 100%;
 height: 100%; 
 overflow-y: auto;
 padding: 2rem; 
}

</style>