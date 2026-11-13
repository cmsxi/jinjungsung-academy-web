<template>
  <!--
    카카오톡 문의: 화면 오른쪽 아래 고정 (11/12). 시안 비교 버튼은 왼쪽 아래로 옮겼다.
    11/12 색 정리: 노란 알약 버튼이 화면에서 제일 튀어서 작은 동그라미로 줄였다.
    11/13 마우스를 올리면(키보드로 고르면) 왼쪽에 '카카오톡 문의하기' 글자가 스르륵 나타난다.
  -->
  <a :href="KAKAO_CHANNEL_URL" class="kakao-float" target="_blank" rel="noopener noreferrer" aria-label="카카오톡 문의 (새 창)">
    <svg class="kakao-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path
        fill="currentColor"
        d="M12 3C6.48 3 2 6.48 2 10.8c0 2.78 1.86 5.22 4.66 6.6l-.95 3.48c-.08.3.26.54.52.37l4.15-2.74c.53.07 1.07.1 1.62.1 5.52 0 10-3.48 10-7.8S17.52 3 12 3z"
      />
    </svg>
    <span class="kakao-tip" aria-hidden="true">카카오톡 문의하기</span>
  </a>
</template>

<script setup>
import { KAKAO_CHANNEL_URL } from '@/constants/contact.js'
</script>

<style scoped>
.kakao-float {
  position: fixed;
  right: 24px;
  bottom: 24px;
  z-index: 900;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: #fee500;
  color: #191919;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
  transition: transform 0.5s cubic-bezier(0.37, 0, 0.63, 1);
}

.kakao-float:hover {
  transform: translateY(-2px);
}

.kakao-float:focus-visible {
  outline: 2px solid #191919;
  outline-offset: 3px;
}

.kakao-icon {
  width: 24px;
  height: 24px;
}

/* 왼쪽 말풍선 글자 */
.kakao-tip {
  position: absolute;
  top: 50%;
  right: calc(100% + 12px);
  padding: 9px 14px;
  border-radius: 2px;
  background: #161616;
  font-size: 14px;
  font-weight: 700;
  color: #ffffff;
  white-space: nowrap;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
  opacity: 0;
  visibility: hidden;
  transform: translate(8px, -50%);
  pointer-events: none;
  transition:
    opacity 0.4s cubic-bezier(0.37, 0, 0.63, 1),
    transform 0.4s cubic-bezier(0.37, 0, 0.63, 1),
    visibility 0.4s;
}

.kakao-float:hover .kakao-tip,
.kakao-float:focus-visible .kakao-tip {
  opacity: 1;
  visibility: visible;
  transform: translate(0, -50%);
}

/* 모바일: 화면 아래 '수강신청문의' 막대 위로. 손가락으로 누르는 화면이라 말풍선은 띄우지 않는다 */
@media (max-width: 768px) {
  .kakao-float {
    right: 16px;
    bottom: 88px;
  }

  .kakao-tip {
    display: none;
  }
}
</style>
