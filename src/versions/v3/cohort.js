// 기수 — 수강후기 · 수강현황 공용 (11/13 "기수는 DB 에서 관리")
// 두 테이블 모두 cohort(숫자) 칸 하나만 본다. 관리자 작성 · 수정 화면(수강후기 · 수강현황)과 방문자 후기 작성 폼에서 입력.
// 지금 올라가 있는 글의 값은 SQL 로 채운다(globee-web/MultiSite_globee/scripts/jinjungsung_cohort.sql).
export const cohortOf = (item) => {
  const cohort = Number(item?.cohort)
  return Number.isInteger(cohort) && cohort > 0 ? cohort : null
}

// '8기' (기수가 없으면 빈 글자)
export const cohortLabel = (item) => {
  const cohort = cohortOf(item)
  return cohort ? `${cohort}기` : ''
}

// 수강후기 이름: '8기 수강생' — 목록 카드 · 상세 글 제목 · 이전글/다음글 줄
export const reviewCohortLabel = (review) => {
  const label = cohortLabel(review)
  return label ? `${label} 수강생` : ''
}
