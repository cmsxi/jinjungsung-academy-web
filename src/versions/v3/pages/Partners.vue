<template>
  <!--
    협력업체 — 3차 시안(11/13 디자인 규칙)
    - 원본 머리의 '협력업체' 제목은 공통 머리(PageHead)가 이미 보여 주므로, 소개 문장만 본문 맨 위에 둔다
    - 전문가 10인 모두, 원본의 이름·자격·[학력]·[자격]·[이력]·[약력]·[주요 경력] 줄을 하나도 빼지 않고 그대로
    - 규칙 7: 「항목명 : 내용」 한 줄에 하나, 왼쪽 항목명(같은 폭) · 오른쪽 내용 / 규칙 6: 줄마다 옅은 선
    - 규칙 5: 읽기만 하는 정보라 상자(카드 테두리·바탕) 없이
    - 11/12 "흑백으로 표기하지마" → 사진은 원래 색 그대로(사진마다 바탕색이 달라도 맞추지 않는다)
    - 11/13 "이전에 가운데 다 맞춰놨는데 마음대로 자르면 어떡해" → 원본 사진(expert/)과 원본의 사람별 위치·확대값을 그대로 쓴다
  -->
  <div class="jj-container">
    <p class="pt-lead" v-reveal>
      국제명품감정교육원, 진정성 협력점과 함께 사업의 성공을 안전하게 도와줄 최적의 진정성 전문가 그룹을 소개합니다.
    </p>

    <ul class="pt-grid">
      <li v-for="(expert, i) in EXPERTS" :key="expert.name" class="pt" v-reveal="(i % 2) * 100">
        <!-- 원본과 같은 방식: 정사각 틀 + 배경 사진(사람마다 맞춰 둔 위치·크기 그대로) -->
        <div class="pt-photo" role="img" :aria-label="`${expert.name} ${expert.title}`" :style="photoStyle(expert)"></div>

        <h2 class="pt-name">{{ expert.name }} <span>{{ expert.title }}</span></h2>

        <dl class="pt-rows">
          <div v-for="row in rowsOf(expert)" :key="row.label" class="pt-row">
            <dt>{{ row.label }}</dt>
            <dd>
              <ul>
                <li v-for="line in row.lines" :key="line">{{ line }}</li>
              </ul>
            </dd>
          </div>
        </dl>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { vReveal } from '../useReveal.js'
// 원본 협력업체(views/introduction/Partners.vue)와 같은 사진 파일
// 11/13 원본 사진과 가로세로 비율이 같은 축소본(expert-opt/) — 원본 페이지의 위치·확대 값이 그대로 맞는다. 원본 2장이 9~10MB라 휴대폰에서 늦게 떴다
import 이제민변호사 from '@/assets/images/expert-opt/lee-jemin.jpg'
import 공정훈노무사 from '@/assets/images/expert-opt/gong-junghoon.jpg'
import 김상철세무사 from '@/assets/images/expert-opt/kim-sangcheol.jpg'
import 김선우변리사 from '@/assets/images/expert-opt/kim-seonwoo.jpg'
import 김홍범법무사 from '@/assets/images/expert-opt/kim-hongbeom.jpg'
import 문초록세무사 from '@/assets/images/expert-opt/moon-chorok.png'
import 손석구법무사 from '@/assets/images/expert-opt/son-seokgu.png'
import 안소윤변호사 from '@/assets/images/expert-opt/ahn-soyun.jpg'
import 윤형석노무사 from '@/assets/images/expert-opt/yoon-hyungseok.png'
import 조승현변리사 from '@/assets/images/expert-opt/cho-seunghyun.png'

// 사진 틀 맞춤 — 원본과 같은 계산(위치 x y, 크기 = 확대값 × 100%). 퍼센트라 틀 크기가 달라도 같은 모습
const photoStyle = (expert) => ({
  backgroundImage: `url("${expert.image}")`,
  backgroundPosition: `${expert.imagePosition?.x || '50%'} ${expert.imagePosition?.y || '50%'}`,
  backgroundSize: `${(expert.imageScale || 1) * 100}%`,
})

// 항목 순서·이름은 원본 화면 그대로([학력] → [자격] → [이력] → [약력] → [주요 경력]), 대괄호만 뺐다
const SECTIONS = [
  { key: 'education', label: '학력' },
  { key: 'certification', label: '자격' },
  { key: 'career', label: '이력' },
  { key: '약력', label: '약력' },
  { key: 'experience', label: '주요 경력' },
]

// 전문가에게 있는 항목만 줄로 만든다
const rowsOf = (expert) =>
  SECTIONS.filter((s) => expert.profile[s.key]?.length).map((s) => ({ label: s.label, lines: expert.profile[s.key] }))

// 원본 협력업체(views/introduction/Partners.vue) 내용 그대로 — 순서·문구 모두. 새 내용을 추가하지 말 것.
const EXPERTS = [
  {
    name: '공정훈',
    title: '노무사',
    image: 공정훈노무사,
    imagePosition: { x: '57%', y: '10%' },
    imageScale: 1.1,
    profile: {
      education: ['광운대학교 법학, 경영학과 졸업'],
      certification: ['공인노무사(CPLA)'],
      career: ['노무법인 수 서울(광명)지사 대표노무사', '노무법인 파로스 파트너 노무사'],
      experience: [
        '이코노미스트 노동법 칼럼 <공정훈의 공정노무> 위원',
        '대전, 광주 학원연합회 노무자문 위원',
        '삼일인포마인 노동법 전문 칼럼위원',
      ],
    },
  },
  {
    name: '김상철',
    title: '세무사',
    image: 김상철세무사,
    imagePosition: { x: '45%', y: '20%' },
    imageScale: 2,
    profile: {
      education: ['고려대학교 법무대학원 조세법 석사'],
      certification: ['세무사(CTA)'],
      career: ['세무법인 글로비 대표세무사'],
      experience: [
        '한국세무사회지방세제도 연구위원',
        '서울지방세무사회 조세제도연구위원',
        '중소벤처기업부 창업진흥원 평가위원',
      ],
    },
  },
  {
    name: '김선우',
    title: '변리사',
    image: 김선우변리사,
    imagePosition: { x: '45%', y: '20%' },
    imageScale: 1.1,
    profile: {
      education: ['경희대학교 기계공학과 졸업', '한국과학기술원(KAIST) 공학석사'],
      certification: ['변리사'],
      career: [
        '이든특허법률사무소 대표변리사',
        '한국특허전래개발원 전문위원',
        '특허법인(유한) KBK 변리사',
        '두호 특허법인 변리사',
      ],
      experience: [
        'LG전자, SK, 삼성 등 대기업 특허전무',
        '서울대 등 산학협력단 특허업무',
        '한국연구재단 미래소재 사업평가 위원',
        '한국발명진흥회 우선구매 추천사업 평가위원',
      ],
    },
  },
  {
    name: '김홍범',
    title: '법무사',
    image: 김홍범법무사,
    imagePosition: { x: '55%', y: '45%' },
    imageScale: 1,
    profile: {
      certification: ['법무사'],
      career: ['선한동법무사 사무소 대표법무사', '서울동부지방법무사회', '창업경영지원단 단장'],
      약력: [
        '경기도 직장공장새마을회 이사',
        '대한법무사협회 미래등기위원',
        '한국부동산등기법학회 회원',
        '한국민사집행법학회 회원',
      ],
      experience: ['한국시험법무사회 사무차장', 'K-Startup 자문위원'],
    },
  },
  {
    name: '문초록',
    title: '세무사',
    image: 문초록세무사,
    imagePosition: { x: '50%', y: '0%' },
    imageScale: 1.4,
    profile: {
      education: ['고려대학교 경영학 학사', '고려대학교 법무대학원 조세법 석사과정'],
      certification: ['세무사(CTA)'],
      career: ['세무법인 글로비 대표세무사'],
      experience: [
        '한국세무사회 공로상 수상(2024)',
        '한국세무사회 조세제도 연구위원회 위원',
        '한국세무사회 법제위원회 위원',
      ],
    },
  },
  {
    name: '손석구',
    title: '법무사',
    image: 손석구법무사,
    imagePosition: { x: '50%', y: '50%' },
    imageScale: 0.8,
    profile: {
      education: ['서울대학교 경영학과'],
      certification: ['법무사'],
      career: ['선한동법무사 사무소 대표법무사'],
      experience: ['기아자동차', '푸르덴셜 생명보험', '주식회사 국민벤처 대표이사', '(주)SCHTECT 대표이사'],
    },
  },
  {
    name: '안소윤',
    title: '변호사',
    image: 안소윤변호사,
    imagePosition: { x: '0%', y: '25%' },
    imageScale: 1,
    profile: {
      education: ['서울대학교 졸업'],
      certification: ['변호사'],
      career: ['법률사무소 수석 대표변호사'],
      experience: ['<내 돈을 지켜주는 친절한 생활 속 법률 상식>'],
    },
  },
  {
    name: '윤형석',
    title: '노무사',
    image: 윤형석노무사,
    imagePosition: { x: '70%', y: '15%' },
    imageScale: 1.3,
    profile: {
      education: ['연세대학교 경영학과 졸업'],
      certification: ['공인노무사(CPLA)'],
      career: ['인사노무컨설팅 율 대표 노무사', '이랜드그룹 패션사업부 인사노무팀'],
      experience: ['삼성전자 삼성리서치 출원 대리', '대형법원, 산학협력단 등 출원 대리', '중소기업, 스타트업 IP 출원 및 분석'],
    },
  },
  {
    name: '이제민',
    title: '변호사',
    image: 이제민변호사,
    imagePosition: { x: '50%', y: '0%' },
    imageScale: 1.0,
    profile: {
      certification: ['변호사'],
      약력: ['법률사무소 더올 변호사', '회계법인 더올 회계사'],
    },
  },
  {
    name: '조승현',
    title: '변리사',
    image: 조승현변리사,
    imagePosition: { x: '50%', y: '10%' },
    imageScale: 1.2,
    profile: {
      education: ['신목고등학교 졸업', '연세대학교 전기전자공학 전공'],
      certification: ['변리사', '엔젤투자자, 한국엔젤투자협회'],
      career: ['특허법인 올림 파트너 변리사', '리앤목특허법인 변리사', '나우특허법률사무소 변리사'],
      experience: ['삼성전자 삼성리서치 출원대리', '대형법원, 산학협력단 등 출원대리', '중소기업, 스타트업 IP 출원 및 분석'],
    },
  },
]
</script>

<style scoped>
/* 원본 머리의 소개 문장 — 공통 머리 설명(page-desc)과 같은 모양 */
.pt-lead {
  max-width: 720px;
  margin-bottom: var(--v3-head-gap);
  font-size: var(--fs-body);
  line-height: 1.7;
  color: var(--c-sub);
  word-break: keep-all;
}

/* 두 칸 목록 — 모두 같은 틀(사진 · 이름 · 항목 줄) */
.pt-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: calc(var(--v3-gap) * 2);
  align-items: start;
}

/* 넓은 화면: 왼쪽 사진 · 오른쪽 이름과 항목 줄 */
.pt {
  display: grid;
  grid-template-columns: 160px minmax(0, 1fr);
  grid-template-areas:
    'photo name'
    'photo rows';
  grid-template-rows: auto 1fr;
  column-gap: var(--v3-gap);
  align-items: start;
}

/* 사진 비율 규칙: 1:1 정사각 틀. 맞춤(위치·크기)은 사람별 원본 값을 인라인으로 받는다(photoStyle).
   확대값이 1보다 작은 사진(손석구)은 좌우가 비는데, 원본처럼 흰 바탕이 보이도록 틀 바탕은 비워 둔다 */
.pt-photo {
  grid-area: photo;
  aspect-ratio: 1 / 1;
  background-repeat: no-repeat;
}

.pt-name {
  grid-area: name;
  margin-bottom: 16px;
  font-size: var(--fs-item);
  font-weight: 700;
  line-height: 1.4;
  letter-spacing: -0.025em;
  color: var(--c-text);
}

.pt-name span {
  margin-left: 2px;
  font-size: var(--fs-body);
  font-weight: 400;
  letter-spacing: 0;
  color: var(--c-sub);
}

/* 규칙 7·6: 메인 교육 안내(Info.vue)와 같은 줄 모양 */
.pt-rows {
  grid-area: rows;
  border-top: 1px solid var(--c-line);
}

.pt-row {
  display: grid;
  grid-template-columns: 80px minmax(0, 1fr);
  gap: 16px;
  padding: 12px 0;
  border-bottom: 1px solid var(--c-line);
}

.pt-row dt {
  font-size: var(--fs-body);
  font-weight: 700;
  line-height: 1.6;
  color: var(--c-text);
}

.pt-row dd {
  font-size: var(--fs-body);
  line-height: 1.6;
  color: var(--c-sub);
  word-break: keep-all;
}

.pt-row li + li {
  margin-top: 2px;
}

/* 중간 폭: 칸이 좁아지면 사진 옆에 이름, 항목 줄은 아래로 넓게 */
@media (max-width: 1200px) {
  .pt {
    grid-template-columns: 104px minmax(0, 1fr);
    grid-template-areas:
      'photo name'
      'rows rows';
    grid-template-rows: auto auto;
    column-gap: 20px;
  }

  .pt-name {
    align-self: center;
    margin-bottom: 0;
  }

  .pt-rows {
    margin-top: 20px;
  }
}

/* 휴대폰: 한 칸 */
@media (max-width: 680px) {
  .pt-grid {
    grid-template-columns: minmax(0, 1fr);
  }
}

@media (max-width: 560px) {
  .pt {
    grid-template-columns: 88px minmax(0, 1fr);
    column-gap: 16px;
  }

  .pt-row {
    grid-template-columns: 72px minmax(0, 1fr);
    gap: 12px;
  }
}
</style>
