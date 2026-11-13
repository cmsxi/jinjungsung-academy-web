// v-reveal: 화면에 들어오면 글·사진이 부드럽게 나타난다 (D6 "스크롤하면 부드럽게 나타나는 정도")
// 사용: <div v-reveal> 또는 <div v-reveal="120"> (120ms 늦게 시작)
// '동작 줄이기' 설정을 켠 사용자나 IntersectionObserver 가 없는 브라우저에서는 처음부터 보인다.

const supported = typeof window !== 'undefined' && 'IntersectionObserver' in window
const reduceMotion = () =>
  typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches

const observer = supported
  ? new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          entry.target.classList.add('is-in')
          observer.unobserve(entry.target)
        })
      },
      // 11/13 조금 일찍 시작하도록(화면 아래 끝에 걸리면 바로)
      { rootMargin: '0px 0px -4% 0px', threshold: 0.06 },
    )
  : null

export const vReveal = {
  mounted(el, binding) {
    el.classList.add('rv')
    if (binding.value) el.style.transitionDelay = `${binding.value}ms`
    if (!observer || reduceMotion()) {
      el.classList.add('is-in')
      return
    }
    observer.observe(el)
  },
  unmounted(el) {
    if (observer) observer.unobserve(el)
  },
}
