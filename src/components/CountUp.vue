<template>
  <span>{{ formattedNumber }}</span>
</template>

<script setup>
import { ref, onMounted, watch, computed } from "vue";

const props = defineProps({
  endVal: {
    type: Number,
    required: true,
  },
  duration: {
    type: Number,
    default: 1300,
  },
  useComma: {
    type: Boolean,
    default: true,
  }
});

const displayNumber = ref(0);

const formattedNumber = computed(() => {
  if (props.useComma) {
    return displayNumber.value.toLocaleString('ko-KR');
  }
  return displayNumber.value;
});

const animateValue = () => {
  const start = 0;
  const end = props.endVal;
  const steps = 60;
  const stepTime = props.duration / steps;
  let current = start;

  const timer = setInterval(() => {
    current += end / steps;
    if (current > end) {
      current = end;
      clearInterval(timer);
    }
    displayNumber.value = Math.round(current);
  }, stepTime);
};

onMounted(() => {
  const observer = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting) {
        animateValue();
        observer.disconnect();
      }
    },
    { threshold: 0.1 }
  );

  observer.observe(document.getElementsByClassName("stats-grid")[0]);
});

watch(
  () => props.endVal,
  (newVal) => {
    displayNumber.value = 0;
    animateValue();
  }
);
</script>