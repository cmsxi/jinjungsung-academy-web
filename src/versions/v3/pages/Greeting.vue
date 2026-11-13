<template>
  <!--
    인사말 — 3차 시안(11/13 디자인 규칙)
    - 원본은 사진과 글이 한 장의 이미지(profile.png)에 들어 있었다 → 사진과 글을 나눠 왼쪽 사진, 오른쪽 글 두 칸으로
    - 글은 profile.png 안의 문구를 한 글자도 바꾸지 않고 옮겼다(줄바꿈만 화면 폭에 맞게 자연스럽게)
    - 규칙 5: 읽기만 하는 글이라 상자 없이(원본의 회색 글 상자는 뺐다)
    - 규칙 3: 원본에서 굵게 강조한 부분은 굵기 대신 검정 글자로(나머지 본문은 회색)
  -->
  <div class="jj-container">
    <div class="greet">
      <figure class="greet-photo" v-reveal>
        <img :src="ceoImage" alt="국제명품감정교육원 대표 문초록" />
        <figcaption class="greet-sign"><span>대표</span> 문초록</figcaption>
      </figure>

      <div class="greet-body">
        <p class="greet-hello" v-reveal="80">
          안녕하세요. 국제명품감정교육원 원장 문초록입니다.<br class="br-pc" />
          저희 교육원의 홈페이지를 찾아주셔서 진심으로 감사드립니다.
        </p>

        <div class="greet-text" v-reveal="160">
          <p>
            최근 몇 년 사이, 명품에 대한 관심은 어느 때보다 높아졌습니다.
            단순한 소비를 넘어, 명품은 자산이 되기도 하고, 취향과 가치를 표현하는 수단으로 자리잡고 있습니다.
          </p>
          <p>
            그와 함께 <strong>명품을 '제대로 보는 눈'</strong>, 즉 진품과 가품을 구별하고,
            제품의 가치를 정확하게 판단할 수 있는 능력의 중요성도 점점 커지고 있습니다.
            <strong>하지만 아직까지 국내에는 체계적으로 명품 감정을 배울 수 있는 교육기관이 많지 않습니다.</strong>
          </p>
          <p>
            이러한 현실 속에서, 국제명품감정교육원은 <strong>"누구나 명품을 올바르게 감정할 수 있도록"</strong> 돕기 위해
            설립되었습니다. 명품 감정은 눈으로만 배우는 것이 아닙니다. 수많은 경험과 지식, 그리고 윤리적인 태도가
            함께할 때 비로소 완성되는 전문 분야입니다.
          </p>
          <p>
            국제명품감정교육원은 이 모든 요소를 갖춘 교육을 제공하며, 여러분이 신뢰받는 전문가로 거듭날 수 있도록
            끝까지 함께하겠습니다.
          </p>
          <p>
            <strong>지금 이 글을 읽고 계신 여러분이, 바로 다음 세대의 명품 감정 전문가가 되실 수 있습니다.</strong>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { vReveal } from '../useReveal.js'
// 원본 인사말 이미지(profile.png)와 같은 촬영본 — 협력업체 원본 페이지가 쓰는 원장 사진(가로 1026px, 고해상도)
import ceoImage from '@/assets/images/expert-opt/moon-chorok.png' // 원본과 같은 사진의 축소본
</script>

<style scoped>
/* 왼쪽 사진(5) : 오른쪽 글(7) — 메인 인사말과 같은 비율 */
.greet {
  display: grid;
  grid-template-columns: minmax(0, 5fr) minmax(0, 7fr);
  gap: var(--v3-section-y);
  align-items: start;
}

.greet-photo {
  margin: 0;
}

/* 사진 비율 규칙: 1:1, 머리가 잘리지 않게 위쪽 기준 */
.greet-photo img {
  display: block;
  width: 100%;
  aspect-ratio: 1 / 1;
  object-fit: cover;
  object-position: 50% 0;
  background: var(--c-bg);
}

/* 원본 '대표 문초록' — 사진 아래 이름표로 */
.greet-sign {
  margin-top: 16px;
  font-size: var(--fs-body);
  font-weight: 700;
  line-height: 1.5;
  color: var(--c-text);
}

.greet-sign span {
  margin-right: 2px;
  font-weight: 400;
  color: var(--c-sub);
}

/* 원본에서 손글씨로 따로 쓴 첫인사 — 본문보다 한 단계 크게(항목 제목 크기, 굵기는 보통) */
.greet-hello {
  font-size: var(--fs-item);
  font-weight: 400;
  line-height: 1.6;
  letter-spacing: -0.02em;
  color: var(--c-text);
  word-break: keep-all;
}

.greet-text {
  max-width: 680px;
  margin-top: var(--v3-head-gap);
}

.greet-text p {
  font-size: var(--fs-body);
  line-height: 1.85;
  color: var(--c-sub);
  word-break: keep-all;
}

.greet-text p + p {
  margin-top: 20px;
}

/* 원본의 굵은 강조 → 굵기 규칙(본문 400)을 지키고 검정 글자로만 구분 */
.greet-text strong {
  font-weight: 400;
  color: var(--c-text);
}

@media (max-width: 1080px) {
  .greet {
    gap: 56px;
  }

  .br-pc {
    display: none;
  }
}

@media (max-width: 768px) {
  .greet {
    grid-template-columns: minmax(0, 1fr);
    gap: var(--v3-head-gap);
  }

  .greet-photo {
    max-width: 480px;
  }

  .greet-sign {
    margin-top: 12px;
  }

  .greet-text {
    margin-top: 28px;
  }

  .greet-text p + p {
    margin-top: 16px;
  }
}
</style>
