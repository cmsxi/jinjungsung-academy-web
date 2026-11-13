// 비교 버튼 상태: 시안 버전 + 헤더 색 + 푸터 색 (임시)
// - 비교 버튼은 로컬 개발 화면(npm run dev)에서만 보인다.
//   배포본에서는 주소 끝에 ?preview 를 붙였을 때만 보이고, 그 외에는 항상 '원본'을 보여 준다.
// - 고른 값은 브라우저(localStorage)에 기억해서 페이지를 옮겨도 유지된다.
import { ref, watch } from 'vue'
import { VERSION_MAP, HEADER_THEMES, FOOTER_THEMES, PALETTES } from './registry.js'

const params = new URLSearchParams(window.location.search)

export const switcherEnabled = import.meta.env.DEV || params.has('preview')

const read = (key) => {
  try {
    return localStorage.getItem(key)
  } catch {
    return null
  }
}

const write = (key, value) => {
  try {
    localStorage.setItem(key, value)
  } catch {
    // 저장이 막힌 브라우저에서는 이번 방문 동안만 유지
  }
}

// 저장된 값 → 주소의 값 → 기본값 순으로 고르고, 바뀌면 저장한다
const persisted = (key, { allowed, fallback, urlParam }) => {
  const fromUrl = urlParam ? params.get(urlParam) : null
  const stored = read(key)
  const initial = [fromUrl, stored].find((value) => value && allowed.includes(value)) || fallback
  const state = ref(initial)
  watch(state, (value) => write(key, value))
  return state
}

export const currentVersion = switcherEnabled
  ? persisted('jj-preview-version', { allowed: Object.keys(VERSION_MAP), fallback: 'v3', urlParam: 'v' })
  : ref('original')

export const headerTheme = persisted('jj-preview-header', {
  allowed: HEADER_THEMES.map((t) => t.id),
  fallback: 'light',
})



export const footerTheme = persisted('jj-preview-footer', {
  allowed: FOOTER_THEMES.map((t) => t.id),
  fallback: 'dark',
})

export const palette = persisted('jj-preview-palette', {
  allowed: PALETTES.map((p) => p.id),
  fallback: 'white',
})

// 3차 시안 자리별 사진 선택 { slotId: optionId } — 비교 버튼이 있을 때만 쓴다(배포본은 항상 '현재')
const readPicks = () => {
  if (!switcherEnabled) return {}
  try {
    return JSON.parse(read('jj-preview-photos') || '{}') || {}
  } catch {
    return {}
  }
}

export const photoPicks = ref(readPicks())

watch(photoPicks, (value) => write('jj-preview-photos', JSON.stringify(value)), { deep: true })
