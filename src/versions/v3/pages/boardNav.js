// 게시판 상세(수강현황 · 수강후기) 공용 — 11/13 "일반적인 게시판처럼" (기본 게시판형: 제목 · 작성일 / 사진 / 이전글 · 다음글 / 목록)

// 날짜를 게시판 모양으로: 2026.07.28
export const boardDate = (value) => {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  const pad = (n) => String(n).padStart(2, '0')
  return `${date.getFullYear()}.${pad(date.getMonth() + 1)}.${pad(date.getDate())}`
}

// 목록은 최신 글이 먼저(번호 큰 순). 이전글 = 바로 아래(더 오래된 글), 다음글 = 바로 위(더 최근 글)
// 이미 가진 목록(개발 화면 미리보기)에서 찾기
export const neighborsIn = (list, id) => {
  const index = list.findIndex((item) => String(item.id) === String(id))
  if (index < 0) return { older: null, newer: null }
  return { older: list[index + 1] || null, newer: list[index - 1] || null }
}

// 서버 목록을 앞에서부터 한 쪽씩 읽어 찾기(게시글 API는 한 쪽 최대 20개 — 수강현황 46건이면 많아야 3번)
// fetchPage(page, size) → { items, total }
export const findNeighbors = async (fetchPage, id, size = 20) => {
  let lastOfPrevPage = null
  for (let page = 1; page <= 50; page += 1) {
    const response = await fetchPage(page, size)
    const items = Array.isArray(response?.items) ? response.items : []
    const total = response?.total || 0
    const index = items.findIndex((item) => String(item.id) === String(id))
    if (index >= 0) {
      const newer = index > 0 ? items[index - 1] : lastOfPrevPage
      let older = items[index + 1] || null
      // 쪽의 마지막 글이면 다음 쪽 첫 글이 이전글
      if (!older && page * size < total) {
        const next = await fetchPage(page + 1, size)
        older = (Array.isArray(next?.items) && next.items[0]) || null
      }
      return { older, newer }
    }
    if (!items.length || page * size >= total) break
    lastOfPrevPage = items[items.length - 1]
  }
  return { older: null, newer: null }
}
