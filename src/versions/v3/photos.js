// 3차 시안 사진 후보 — 11/13 시안 비교 버튼 삭제 후에는 각 자리의 첫 번째 후보만 쓴다(첫 화면 = 실제 사진 3장 넘김)
// - 11/13 교육과정·사업영역 사진은 '지금 사진'으로 확정 → 후보에서 빼고 각 화면 파일에서 바로 불러온다
// - 남은 후보는 첫 화면뿐. 외부 후보(Unsplash)는 주소를 그대로 불러온다(개발 화면 비교용)
// - 배포본(비교 버튼 없음)에서는 항상 첫 번째 후보가 나온다.
import { computed } from 'vue'
import { photoPicks } from '../useVersion.js'
import heroMovement from '@/assets/images/stock/hero-movement.jpg'

const un = (id, w = 1600) => `https://images.unsplash.com/photo-${id}?w=${w}&q=75&auto=format`

// 첫 화면 (11/12): 실제 사진 3장 넘김 / 정물(시계·보석) / 원본 배너 그대로 — 비율은 원본 배너(1925×688, 모바일 400×650)
// - 실제 사진·정물은 문구와 어둡게 깔리는 그라데이션을 화면에서 직접 얹는다(Hero.vue)
// - kind: real(3장 넘김) | still(정물 1장) | banner(문구가 들어간 원본 배너 이미지)
export const PHOTO_SLOTS = [
  {
    id: 'hero',
    label: '첫 화면',
    options: [
      { id: 'real', label: '실제 사진 3장 (넘김)', kind: 'real' },
      { id: 'movement', label: '정물 · 시계 무브먼트', kind: 'still', src: heroMovement, pos: '62% 50%', mobilePos: '70% 50%' },
      {
        id: 'diamond',
        label: '정물 · 다이아몬드 핀셋',
        kind: 'still',
        src: un('1631013636761-c533d81e96a4', 2200),
        pos: '50% 50%',
        mobilePos: '50% 50%',
      },
      { id: 'banner', label: '원본 배너 그대로', kind: 'banner' },
    ],
  },
]

const SLOT_MAP = Object.fromEntries(PHOTO_SLOTS.map((s) => [s.id, s]))

// 자리별로 지금 고른 후보(없으면 '현재')
export const usePhoto = (slotId) =>
  computed(() => {
    const slot = SLOT_MAP[slotId]
    const pickId = photoPicks.value[slotId]
    return slot.options.find((o) => o.id === pickId) || slot.options[0]
  })
