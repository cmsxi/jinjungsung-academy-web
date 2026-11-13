// 관리자 로그인 상태 — 11/12 결정: 비밀번호는 브라우저에 두지 않고, 로그인 때 받은 만료 시간이 있는 토큰만 둔다(8시간)
// - 토큰은 localStorage(같은 브라우저의 다른 탭에서도 로그인 유지). 만료되면 자동으로 지운다
// - 예전 관리자 화면이 sessionStorage 에 평문으로 두던 비밀번호(admin_password)는 보이면 지운다
const KEY = 'jj-admin-session'

const removeLegacy = () => {
  try {
    sessionStorage.removeItem('admin_password')
    sessionStorage.removeItem('admin_authenticated')
  } catch {
    // 저장소를 쓸 수 없는 브라우저
  }
}

export const getSession = () => {
  try {
    const session = JSON.parse(localStorage.getItem(KEY) || 'null')
    if (!session?.token || !session?.expiresAt) return null
    if (Date.parse(session.expiresAt) <= Date.now()) {
      localStorage.removeItem(KEY)
      return null
    }
    return session
  } catch {
    return null
  }
}

export const getToken = () => getSession()?.token || null
export const isLoggedIn = () => Boolean(getSession())

export const saveSession = (token, expiresAt) => {
  removeLegacy()
  try {
    localStorage.setItem(KEY, JSON.stringify({ token, expiresAt }))
  } catch {
    // 저장이 막힌 브라우저 — 이번 화면에서만 로그인
  }
}

export const clearSession = () => {
  removeLegacy()
  try {
    localStorage.removeItem(KEY)
  } catch {
    // 무시
  }
}

// 요청 중 로그인이 풀렸을 때(401) 할 일 — 관리자 틀(AdminLayout)이 로그인 화면으로 보내도록 등록한다
let unauthorizedHandler = null
export const onUnauthorized = (handler) => {
  unauthorizedHandler = handler
}
export const notifyUnauthorized = () => {
  if (unauthorizedHandler) unauthorizedHandler()
}
