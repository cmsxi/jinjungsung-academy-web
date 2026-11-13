<template>
  <div id="app" :class="rootClass">
    <component :is="active.header" v-bind="active.themable ? { theme: headerTheme } : {}" />
    <main class="content">
      <router-view />
    </main>
    <component :is="active.footer" v-bind="active.themable ? { theme: footerTheme } : {}" />

    <!-- 시안 공용: 카카오톡 문의 (오른쪽 아래 고정) -->
    <KakaoFloat v-if="currentVersion !== 'original'" />

    <!-- 시안 비교용 임시 버튼 (로컬 개발 화면에서만 보임, 왼쪽 아래) -->
    <VersionSwitcher v-if="switcherEnabled" />
  </div>
</template>

<script setup>
import { computed } from "vue";
import VersionSwitcher from "@/versions/VersionSwitcher.vue";
import KakaoFloat from "@/versions/common/KakaoFloat.vue";
import { VERSION_MAP } from "@/versions/registry.js";
import { currentVersion, headerTheme, footerTheme, palette, switcherEnabled } from "@/versions/useVersion.js";
import "@/versions/shared.css";
import "@/versions/v3/tokens.css";

const active = computed(() => VERSION_MAP[currentVersion.value]);

// 버전 클래스(.ver-*) + 색 구성 클래스(.pal-*, 3차 시안부터)
const rootClass = computed(() => [
  `ver-${currentVersion.value}`,
  active.value.palettes ? `pal-${palette.value}` : "",
]);
</script>

<style>
#app {
  min-height: 100vh;
}

.content {
  min-height: 100vh;
  padding-top: 80px;
}

/* 원본 헤더 높이 */
@media (max-width: 768px) {
  .ver-original .content {
    padding-top: 60px;
  }
}

/* 시안 헤더 높이: PC 100px(11/13), 1080px 이하에서 64px */
.ver-v3 .content {
  padding-top: 100px;
}


@media (max-width: 1080px) {
  .ver-v3 .content {
    padding-top: 64px;
  }
}
</style>
