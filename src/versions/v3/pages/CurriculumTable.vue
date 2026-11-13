<template>
  <!--
    커리큘럼 표 — 11/13 "원래 맨 처음 디자인이 더 잘 보였다" → 원본 이미지(edu-step.png)의 표 구조를 따른다
      위 굵은 선 · 가운데 맞춘 머리줄 · 칸 사이 세로 선 · 회차(과목) 칸은 합쳐서 가운데 · 큼직한 글자
    본문(Curriculum.vue)과 '한눈에 보기' 전체 화면에서 함께 쓴다
  -->
  <table class="ct" :class="`ct--${course}`">
    <caption class="jj-sr-only">{{ caption }}</caption>

    <!-- 전당포: 회차 · 교시 · 강의 내용 -->
    <template v-if="course === 'pawnshop'">
      <colgroup>
        <col class="ct-col-group" />
        <col class="ct-col-period" />
        <col />
      </colgroup>
      <thead>
        <tr>
          <th scope="col">회차</th>
          <th scope="col">교시</th>
          <th scope="col">강의 내용</th>
        </tr>
      </thead>
      <tbody v-for="group in groups" :key="group.title">
        <tr v-for="(lesson, index) in group.lessons" :key="lesson">
          <th v-if="index === 0" scope="rowgroup" :rowspan="group.lessons.length" class="ct-group">{{ group.title }}</th>
          <td class="ct-period">{{ index + 1 }}교시</td>
          <td class="ct-text">{{ lesson }}</td>
        </tr>
      </tbody>
    </template>

    <!-- 명품창업: 과목 · 강의 내용 -->
    <template v-else>
      <colgroup>
        <col class="ct-col-module" />
        <col />
      </colgroup>
      <thead>
        <tr>
          <th scope="col">과목</th>
          <th scope="col">강의 내용</th>
        </tr>
      </thead>
      <tbody v-for="group in groups" :key="group.title">
        <tr v-for="(lesson, index) in group.lessons" :key="lesson">
          <th v-if="index === 0" scope="rowgroup" :rowspan="group.lessons.length" class="ct-group">{{ group.title }}</th>
          <td class="ct-text">{{ lesson }}</td>
        </tr>
      </tbody>
    </template>
  </table>
</template>

<script setup>
defineProps({
  course: { type: String, required: true }, // pawnshop | luxury
  groups: { type: Array, required: true }, // [{ title, lessons: [] }]
  caption: { type: String, default: '' },
})
</script>

<style scoped>
.ct {
  --ct-line: #d4d4d4;
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
  border-top: 2px solid var(--c-text);
  word-break: keep-all;
}

.ct-col-group,
.ct-col-period {
  width: 17%;
}

.ct-col-module {
  width: 26%;
}

.ct th,
.ct td {
  padding: 17px 20px;
  border-bottom: 1px solid var(--ct-line);
  font-size: 18px; /* 원본 표처럼 큼직하게(규칙 16px 의 예외 — 읽기 쉬움 우선) */
  line-height: 1.5;
  color: var(--c-text);
  vertical-align: middle;
}

/* 칸 사이 세로 선 */
.ct th + th,
.ct th + td,
.ct td + td,
.ct tbody tr:not(:first-child) td:first-child {
  border-left: 1px solid var(--ct-line);
}

.ct thead th {
  padding-top: 15px;
  padding-bottom: 15px;
  font-weight: 700;
  text-align: center;
}

.ct-group {
  font-weight: 700;
  text-align: center;
}

.ct-period {
  text-align: center;
  white-space: nowrap;
}

.ct-text {
  padding-left: 28px;
  text-align: left;
}

/* 회차가 바뀌는 줄은 선을 조금 진하게 — 묶음이 눈에 들어오게 */
.ct tbody + tbody tr:first-child th,
.ct tbody + tbody tr:first-child td {
  border-top: 1px solid #a8a8a8;
}

.ct tbody:last-child tr:last-child td,
.ct tbody:last-child tr:last-child th {
  border-bottom: 1px solid #a8a8a8;
}

/* 휴대폰: 같은 표 모양 그대로, 칸과 글자만 줄인다 */
@media (max-width: 640px) {
  .ct-col-group,
  .ct-col-period {
    width: 64px;
  }

  .ct-col-module {
    width: 92px;
  }

  .ct th,
  .ct td {
    padding: 12px 8px;
    font-size: 14px;
  }

  .ct-text {
    padding-left: 12px;
  }
}
</style>
