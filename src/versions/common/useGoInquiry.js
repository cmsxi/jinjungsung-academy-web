// '수강신청 문의'는 새 페이지(/registration)로 가지 않고 메인 맨 아래 문의 폼으로 (11/12 — 같은 폼이 여러 곳에 있지 않게)
// 헤더·푸터 공용. 메인이 아니면 메인으로 옮긴 뒤 문의 영역이 생기면 내려간다.
import { useRoute, useRouter } from 'vue-router'

const scrollToInquiry = () => {
  document.getElementById('inquiry')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

export const useGoInquiry = () => {
  const route = useRoute()
  const router = useRouter()

  return async () => {
    if (route.path === '/') {
      scrollToInquiry()
      return
    }
    await router.push('/')
    // 메인 본문은 늦게 불러오므로 문의 영역이 생길 때까지 잠깐 기다린다(최대 약 3초)
    const started = performance.now()
    const wait = () => {
      if (document.getElementById('inquiry')) scrollToInquiry()
      else if (performance.now() - started < 3000) requestAnimationFrame(wait)
    }
    requestAnimationFrame(wait)
  }
}
