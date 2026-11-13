// 하위 페이지 바꿔 끼우기 (11/13 "메인 규칙에 맞춰서 전체 페이지 업데이트")
// - 라우터의 각 페이지를 이 함수로 감싸면, 지금 고른 시안에 그 페이지가 있으면 시안 페이지를, 없으면 원본 페이지를 그린다.
// - 원본 버전(배포본 기본)에서는 항상 원본 페이지 → 운영 화면은 그대로.
// - 시안 페이지 목록: registry.js 의 각 시안 pages: { 라우트키: 컴포넌트 }
import { h, computed, defineAsyncComponent } from 'vue'
import { VERSION_MAP } from './registry.js'
import { currentVersion } from './useVersion.js'

// () => import(...) 처럼 늦게 불러오는 페이지도 받는다
const toComponent = (comp) => (typeof comp === 'function' ? defineAsyncComponent(comp) : comp)

export const versioned = (key, original) => {
  const Original = toComponent(original)
  return {
    name: `Versioned${key}`,
    inheritAttrs: false,
    setup(_, { attrs }) {
      const active = computed(() => VERSION_MAP[currentVersion.value]?.pages?.[key] || Original)
      return () => h(active.value, attrs)
    },
  }
}
