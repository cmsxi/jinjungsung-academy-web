// 시안 비교용 버전 목록 (임시 — 시안 확정 후 이 폴더 전체를 정리한다)
// - 시안(3차)은 메인 본문만 다르고, 헤더·푸터는 공용(common/)을 쓴다. 1·2차 시안은 11/13 삭제
//   헤더·푸터 색은 시안과 따로 비교 버튼에서 고른다(11/12 요청).
// - 원본은 운영 화면 그대로 보여야 하므로 기존 헤더·푸터를 쓰고 색 선택을 적용하지 않는다.
// - 새 시안 추가: src/versions/<id>/Main.vue 를 만들고 여기에 한 줄 추가.
import { defineAsyncComponent } from 'vue'
import OriginalHeader from '@/components/Header.vue'
import OriginalFooter from '@/components/Footer.vue'
import OriginalMain from '@/views/Main.vue'

const lazy = (loader) => defineAsyncComponent(loader)

const SiteHeader = lazy(() => import('@/versions/common/SiteHeader.vue'))
const SiteFooter = lazy(() => import('@/versions/common/SiteFooter.vue'))

export const VERSIONS = [
  {
    id: 'original',
    label: '원본',
    desc: '지금 운영 중인 화면 (11/04 커밋)',
    header: OriginalHeader,
    footer: OriginalFooter,
    main: OriginalMain,
    themable: false,
  },
  {
    id: 'v3',
    label: '3차 시안',
    desc: '레퍼런스 보드 결과 반영 · 섹션 8개 (11/12)',
    header: SiteHeader,
    footer: SiteFooter,
    main: lazy(() => import('@/versions/v3/Main.vue')),
    // 11/13 하위 페이지도 메인 규칙으로 — 라우터의 versioned(키, 원본)이 여기서 찾는다(versionedPage.js)
    pages: {
      Introduction: lazy(() => import('@/versions/v3/pages/IntroLayout.vue')),
      Greeting: lazy(() => import('@/versions/v3/pages/Greeting.vue')),
      Business: lazy(() => import('@/versions/v3/pages/Business.vue')),
      Partners: lazy(() => import('@/versions/v3/pages/Partners.vue')),
      Education: lazy(() => import('@/versions/v3/pages/EduLayout.vue')),
      Curriculum: lazy(() => import('@/versions/v3/pages/Curriculum.vue')),
      Status: lazy(() => import('@/versions/v3/pages/Status.vue')),
      StatusDetail: lazy(() => import('@/versions/v3/pages/StatusDetail.vue')),
      FAQ: lazy(() => import('@/versions/v3/pages/FaqLayout.vue')),
      Questions: lazy(() => import('@/versions/v3/pages/Questions.vue')),
      Registration: lazy(() => import('@/versions/v3/pages/Registration.vue')),
      Reviews: lazy(() => import('@/versions/v3/pages/Reviews.vue')),
      ReviewDetail: lazy(() => import('@/versions/v3/pages/ReviewDetail.vue')),
      ReviewWrite: lazy(() => import('@/versions/v3/pages/ReviewWrite.vue')),
    },
    themable: true,
    palettes: true,
    photos: true,
  },
]

// 레이아웃 비교(11/13)는 본문 폭 1440 · 섹션 제목 왼쪽 맞춤으로 확정 — 비교용 코드는 지웠다

// 디자인 규칙 1(전체 인상)은 11/13 '안내서형'으로 확정 — 비교용 잡지형·구역형은 지웠다.

// 수강후기 모양은 11/13 '흐르는 띠'로 확정 — 비교용 액자·넘겨 보기·크게 보기는 지웠다

// 색 구성 (3차 시안부터) — 레퍼런스 보드 D4 "비교 버튼으로 비교할 수 있게"
// 11/13 "미색 싫어" → 미색 뺌. 기본(white)은 이제 아주 연한 회색 바탕
export const PALETTES = [
  { id: 'white', label: '연한 회색' },
  { id: 'dark', label: '어두운' },
]

export const VERSION_MAP = Object.fromEntries(VERSIONS.map((v) => [v.id, v]))

// 헤더·푸터 색 선택지
// 투명: 메인 첫 화면 위에서만 투명, 스크롤하거나 다른 페이지에서는 흰색(11/12 요청)
export const HEADER_THEMES = [
  { id: 'light', label: '흰색' },
  { id: 'dark', label: '차콜' },
  { id: 'transparent', label: '투명' },
]

export const FOOTER_THEMES = [
  { id: 'dark', label: '차콜' },
  { id: 'light', label: '흰색' },
]
