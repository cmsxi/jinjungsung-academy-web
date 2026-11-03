// 교육 과정 커리큘럼 데이터
//
// ⚠️ 초안: 문초록 대표님께 두 과정의 확정 커리큘럼을 다시 요청드린 상태입니다.
//    현재 내용은 기존에 게시되어 있던 '오프라인 커리큘럼'(4회차 · 16교시) 이미지를 기준으로 정리했습니다.
//    확정본을 받으면 이 파일의 `sessions`(회차표) 또는 `modules`(과목 구성)만 교체하면
//    커리큘럼 페이지와 메인 페이지에 함께 반영됩니다.

export const COURSE_IDS = Object.freeze({
  PAWNSHOP: 'pawnshop',
  LUXURY: 'luxury',
})

export const DEFAULT_COURSE_ID = COURSE_IDS.PAWNSHOP

export const CURRICULUM_NOTICE = '명품감정 자격증반은 커리큘럼이 달라질 수 있습니다.'

/**
 * @typedef {{ round: number, lessons: string[] }} CurriculumSession  회차별 교시 목록(1교시부터 순서대로)
 * @typedef {{ title: string, items: string[] }} CurriculumModule  과목 묶음
 * @typedef {{
 *   id: string,
 *   label: string,
 *   name: string,
 *   badge: string,
 *   summary: string,
 *   facts: string[],
 *   highlights: string[],
 *   sessions?: CurriculumSession[],
 *   modules?: CurriculumModule[],
 *   footnote?: string,
 * }} Course
 */

/** @type {ReadonlyArray<Course>} */
export const COURSES = Object.freeze([
  {
    id: COURSE_IDS.PAWNSHOP,
    label: '전당포 창업 과정',
    name: '전당포 창업 과정',
    badge: '대표 과정',
    summary:
      '담보물 감정 실습부터 전당포 실무와 세무 처리까지, 수료 후 바로 전당포를 창업하고 운영할 수 있도록 준비하는 과정입니다.',
    facts: ['4회차 · 총 16교시', '오프라인 실습', '수료 시험'],
    highlights: [
      '전당포 창업 개요 (시장성·사업성·주고객층)',
      '귀금속·명품시계·명품가방 담보물 감정 실습',
      '전당포 실무 및 세무 처리',
      '명품감정 시험 및 수료',
    ],
    sessions: [
      {
        round: 1,
        lessons: [
          '전당포 창업 개요 (시장성, 사업성, 주고객층 등)',
          '귀금속(금, 은, 다이아몬드) 감정 및 실습',
          '롤렉스 브랜드 개요 (모델별 특징)',
          '롤렉스 감정 실습 (외부감정)',
        ],
      },
      {
        round: 2,
        lessons: [
          '롤렉스 구성품, 롤렉스 내부감정',
          '롤렉스 내부감정 및 실습, 롤렉스 시세파악 방법',
          '까르띠에, IWC, 오데마피게 감정',
          '내부 무브먼트 감정법',
        ],
      },
      {
        round: 3,
        lessons: [
          '명품가방 감정 및 실습 (루이비통, 구찌, 샤넬, 보테가)',
          '명품가방 감정 및 실습 (몽클레어, 프라다, 입생로랑, 고야드)',
          '명품가방 실습',
          '기타 고가품 감정법 (IT기기, 카메라, 주류 등)',
        ],
      },
      {
        round: 4,
        lessons: ['전당포 실무', '전당포 세무처리', '명품감정 시험', '오답정리 및 수료식'],
      },
    ],
  },
  {
    id: COURSE_IDS.LUXURY,
    label: '명품창업(명품감정) 과정',
    name: '명품창업(명품감정) 과정',
    badge: '감정 전문',
    summary:
      '귀금속·명품시계·명품가방 감정 역량을 깊이 있게 다지고, 중고명품 매장·명품 수출 등 명품 관련 사업으로 이어갈 수 있도록 준비하는 과정입니다.',
    facts: ['감정 실습 중심', '오프라인 실습', '국제명품감정사 자격'],
    highlights: [
      '귀금속(금·은·다이아몬드) 감정',
      '롤렉스·까르띠에·IWC·오데마피게 시계 감정',
      '루이비통·샤넬·고야드 등 명품가방 감정',
      '명품감정 시험 및 자격 취득',
    ],
    modules: [
      {
        title: '귀금속 감정',
        items: ['금·은·다이아몬드 감정 이론', '귀금속 감정 실습'],
      },
      {
        title: '명품시계 감정',
        items: [
          '롤렉스 브랜드 개요 (모델별 특징)',
          '롤렉스 외부·내부 감정 및 구성품 확인',
          '롤렉스 시세파악 방법',
          '까르띠에, IWC, 오데마피게 감정',
          '내부 무브먼트 감정법',
        ],
      },
      {
        title: '명품가방 감정',
        items: [
          '루이비통, 구찌, 샤넬, 보테가',
          '몽클레어, 프라다, 입생로랑, 고야드',
          '명품가방 실습',
        ],
      },
      {
        title: '기타 고가품 · 평가',
        items: ['IT기기, 카메라, 주류 등 기타 고가품 감정법', '명품감정 시험, 오답정리 및 수료'],
      },
    ],
    footnote: '세부 회차 구성과 일정은 상담 시 안내해 드립니다.',
  },
])

/**
 * @param {string | undefined} courseId
 * @returns {Course}
 */
export const findCourse = (courseId) =>
  COURSES.find((course) => course.id === courseId) ?? COURSES[0]
