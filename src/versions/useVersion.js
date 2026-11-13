// 사이트 화면 설정 — 11/13 "3차 시안을 실제 사이트로, 시안 비교 버튼은 없앤다"
// 비교 버튼(VersionSwitcher)으로 고르던 값을 확정값으로 고정한다. 브라우저에 남아 있던 비교용 저장값(jj-preview-*)은 더 이상 읽지 않는다.
// - 시안: 3차 시안(v3) — 하위 페이지도 registry.js 의 v3 pages 로 그려진다(router 의 versioned())
// - 헤더: 투명(메인 맨 위에서만 사진 위 투명, 스크롤 · 메뉴 열림 · 하위 페이지는 흰색 — SiteHeader.vue)
// - 푸터: 차콜 / 색 구성: 연한 회색
// - 첫 화면: 실제 사진 3장 넘김(photos.js 첫 번째 후보)
import { ref } from 'vue'

export const currentVersion = ref('v3')
export const headerTheme = ref('transparent')
export const footerTheme = ref('dark')
export const palette = ref('white')

// 자리별 사진 선택 — 고르지 않음 = 각 자리의 첫 번째 후보(photos.js)
export const photoPicks = ref({})
