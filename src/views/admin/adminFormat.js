// 관리자 화면 날짜 표시 — 서버 시각(UTC)을 한국 시각으로
const KST = 'Asia/Seoul'

const parts = (value) => {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return null
  const map = {}
  new Intl.DateTimeFormat('ko-KR', {
    timeZone: KST,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  })
    .formatToParts(date)
    .forEach((p) => {
      map[p.type] = p.value
    })
  return map
}

// 2026-11-13 14:02
export const dateTime = (value) => {
  const p = parts(value)
  return p ? `${p.year}-${p.month}-${p.day} ${p.hour}:${p.minute}` : '—'
}

// 2026-11-13
export const dateOnly = (value) => {
  const p = parts(value)
  return p ? `${p.year}-${p.month}-${p.day}` : '—'
}

// 오늘(한국 날짜)에서 days 일 전 — 기간 조회 빠른 버튼용 YYYY-MM-DD
export const kstDay = (daysAgo = 0) => {
  const p = parts(Date.now() - daysAgo * 24 * 60 * 60 * 1000)
  return `${p.year}-${p.month}-${p.day}`
}
