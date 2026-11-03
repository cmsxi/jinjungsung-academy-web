import { KAKAO_CHANNEL_URL } from './contact.js'

/**
 * 커리큘럼 과정 링크 (/education/curriculum?course=<id>)
 * @param {'pawnshop' | 'luxury'} courseId
 */
export const curriculumLink = (courseId) => ({
  path: '/education/curriculum',
  query: { course: courseId },
})

// 헤더(GNB) · 모바일 메뉴 공통 메뉴 구조
// 하위 항목: `to`는 내부 라우트, `href`는 외부 링크
export const MAIN_MENUS = Object.freeze([
  {
    label: '교육원 소개',
    to: '/introduction',
    children: [
      { label: '인사말', to: '/introduction/greeting' },
      { label: '사업영역', to: '/introduction/business' },
      { label: '협력업체', to: '/introduction/partners' },
    ],
  },
  {
    label: '교육안내',
    to: '/education',
    children: [
      { label: '전당포 창업 과정', to: curriculumLink('pawnshop') },
      { label: '명품창업(감정) 과정', to: curriculumLink('luxury') },
      { label: '수강현황', to: '/education/status' },
    ],
  },
  {
    label: '수강신청문의',
    to: '/registration',
    children: [{ label: '수강신청문의', to: '/registration' }],
  },
  {
    label: '자주묻는질문',
    to: '/faq',
    children: [
      { label: 'FAQ', to: '/faq/questions' },
      { label: '카카오톡 문의', href: KAKAO_CHANNEL_URL },
    ],
  },
  {
    label: '수강후기',
    to: '/reviews',
    children: [{ label: '수강후기', to: '/reviews' }],
  },
])
