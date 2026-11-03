const SEOUL_PREFIX = '02'
const SEOUL_MAX_DIGITS = 10
const DEFAULT_MAX_DIGITS = 11

/**
 * 입력값을 하이픈 포함 전화번호 형식으로 변환합니다. (예: 01012345678 → 010-1234-5678)
 * @param {string} value
 * @returns {string}
 */
export function formatPhoneNumber(value) {
  const raw = String(value ?? '').replace(/\D/g, '')

  if (raw.startsWith(SEOUL_PREFIX)) {
    const digits = raw.slice(0, SEOUL_MAX_DIGITS)
    if (digits.length <= 2) return digits
    if (digits.length <= 6) return `${digits.slice(0, 2)}-${digits.slice(2)}`
    const mid = digits.length === SEOUL_MAX_DIGITS ? 6 : 5
    return `${digits.slice(0, 2)}-${digits.slice(2, mid)}-${digits.slice(mid)}`
  }

  const digits = raw.slice(0, DEFAULT_MAX_DIGITS)
  if (digits.length <= 3) return digits
  if (digits.length <= 7) return `${digits.slice(0, 3)}-${digits.slice(3)}`
  return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`
}
