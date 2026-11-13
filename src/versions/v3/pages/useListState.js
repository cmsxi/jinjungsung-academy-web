// 목록 페이지(수강후기·수강현황) 기억하기 — 11/13 "게시글에 들어갔다 뒤로 가면 원래 있던 페이지에 있어야 하는데 1페이지로 돌아간다"
// - 지금 보는 쪽 번호를 주소(?page=2)에 담는다 → 뒤로 가기·새로고침해도 그 쪽이 열린다
// - 목록을 떠날 때 스크롤 위치를 저장해 두고, '뒤로 가기'로 돌아왔을 때만 그 위치로 되돌린다
// - 상세의 '목록으로 돌아가기'는 목록에서 들어왔으면 뒤로 가기(=보던 쪽·위치 그대로), 아니면 목록 첫 쪽으로
import { nextTick } from 'vue'
import { useRoute, useRouter, onBeforeRouteLeave } from 'vue-router'

const scrollKey = (fullPath) => `jj-list-scroll:${fullPath}`

export const useListState = () => {
  const route = useRoute()
  const router = useRouter()

  // 주소의 ?page= (없거나 이상하면 1)
  const initialPage = () => {
    const n = parseInt(route.query.page, 10)
    return Number.isFinite(n) && n > 0 ? n : 1
  }

  // 쪽을 넘기면 주소만 바꾼다(기록을 쌓지 않음). 1쪽은 주소를 깔끔하게
  const setPageQuery = (page) => {
    const query = { ...route.query }
    if (page > 1) query.page = String(page)
    else delete query.page
    router.replace({ query })
  }

  onBeforeRouteLeave(() => {
    try {
      sessionStorage.setItem(scrollKey(route.fullPath), String(window.scrollY))
    } catch {
      // 저장이 막힌 브라우저에서는 위치만 기억 못 함
    }
  })

  // 뒤로 가기로 돌아온 경우(앞으로 갈 기록이 남아 있음)에만 저장해 둔 위치로
  const restoreScroll = async () => {
    if (!window.history.state?.forward) return
    let y = 0
    try {
      y = Number(sessionStorage.getItem(scrollKey(route.fullPath))) || 0
    } catch {
      return
    }
    if (!y) return
    await nextTick()
    requestAnimationFrame(() => window.scrollTo(0, y))
  }

  return { initialPage, setPageQuery, restoreScroll }
}

// 상세 페이지의 '목록으로 돌아가기'
export const useBackToList = (listPath) => {
  const router = useRouter()
  return () => {
    const back = window.history.state?.back
    if (typeof back === 'string' && back.split('?')[0] === listPath) router.back()
    else router.push(listPath)
  }
}
