<template>
  <!--
    수강신청 문의 관리 (11/12 결정: 목록 · 검색 · 기간 조회 · 상담 메모 / 처리 상태 · 엑셀 없음)
    - 줄을 누르면 오른쪽에 상세 — 문의 내용 전체, 상담 메모 저장, 삭제(파기 요청 등)
    - 검색 조건 · 쪽은 주소(?q=&from=&to=&page=)에 남겨 새로고침 · 뒤로 가기해도 그대로
    - 접수 후 1년이 지나면 서버가 자동 삭제(문의 폼 개인정보 안내와 같게)
  -->
  <div>
    <header class="adm-head">
      <div>
        <h1>수강신청 문의</h1>
        <p>홈페이지 문의 폼으로 들어온 신청입니다. 접수 후 1년이 지나면 자동으로 삭제됩니다.</p>
      </div>
    </header>

    <section class="adm-card">
      <form class="adm-toolbar" @submit.prevent="search">
        <input
          v-model.trim="form.q"
          class="adm-input inq-q"
          type="search"
          placeholder="성함, 연락처, 지역, 내용, 메모"
          aria-label="검색어"
        />
        <span class="adm-toolbar-label">접수일</span>
        <input v-model="form.from" class="adm-input" type="date" aria-label="시작일" :max="form.to || undefined" />
        <span class="inq-tilde">~</span>
        <input v-model="form.to" class="adm-input" type="date" aria-label="종료일" :min="form.from || undefined" />
        <button
          v-for="p in PERIODS"
          :key="p.label"
          type="button"
          class="adm-btn adm-btn--sm"
          :class="{ 'is-on': isPeriod(p) }"
          @click="setPeriod(p)"
        >
          {{ p.label }}
        </button>
        <button type="submit" class="adm-btn adm-btn--primary">조회</button>
        <button v-if="hasFilter" type="button" class="adm-btn" @click="reset">초기화</button>
      </form>

      <p class="adm-count">
        <template v-if="hasFilter">검색 결과 </template>총 <strong>{{ total }}</strong>건
      </p>

      <p v-if="error" class="adm-empty">
        {{ error }}
        <button type="button" class="adm-link" @click="load">다시 시도</button>
      </p>
      <p v-else-if="loading && !items.length" class="adm-empty">불러오는 중…</p>
      <p v-else-if="!items.length" class="adm-empty">
        {{ hasFilter ? '조건에 맞는 문의가 없습니다.' : '아직 들어온 문의가 없습니다.' }}
      </p>

      <div v-else class="adm-table-wrap">
        <table class="adm-table">
          <thead>
            <tr>
              <th class="num">번호</th>
              <th>접수일시</th>
              <th>성함</th>
              <th>연락처</th>
              <th>거주지역</th>
              <th>알게 된 경로</th>
              <th>문의 내용</th>
              <th>상담 메모</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(item, i) in items"
              :key="item.id"
              class="is-clickable"
              :class="{ 'is-selected': selected && selected.id === item.id }"
              tabindex="0"
              @click="open(item)"
              @keydown.enter="open(item)"
            >
              <td class="num">{{ total - ((page - 1) * SIZE + i) }}</td>
              <td class="nowrap">{{ dateTime(item.created_at) }}</td>
              <td class="nowrap"><strong>{{ item.name }}</strong></td>
              <td class="nowrap">{{ item.phone }}</td>
              <td class="nowrap">{{ item.location }}</td>
              <td class="nowrap" :class="{ muted: !item.referral }">{{ item.referral || '—' }}</td>
              <td class="ellipsis" :class="{ muted: !item.message }">{{ item.message || '—' }}</td>
              <td class="ellipsis inq-memo-cell" :class="{ muted: !item.memo }">{{ item.memo || '—' }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <AdminPager :page="page" :total="total" :size="SIZE" @change="goPage" />
    </section>

    <!-- 상세 -->
    <div v-if="selected" class="inq-backdrop" @click="requestClose"></div>
    <aside v-if="selected" class="inq-panel" role="dialog" aria-modal="true" aria-labelledby="inq-panel-title">
      <header class="inq-panel-head">
        <div>
          <h2 id="inq-panel-title">{{ selected.name }}</h2>
          <p>{{ dateTime(selected.created_at) }} 접수</p>
        </div>
        <button type="button" class="adm-btn adm-btn--sm" @click="requestClose">닫기</button>
      </header>

      <div class="inq-panel-body">
        <dl class="inq-info">
          <div>
            <dt>연락처</dt>
            <dd><a :href="`tel:${selected.phone.replace(/[^0-9+]/g, '')}`">{{ selected.phone }}</a></dd>
          </div>
          <div>
            <dt>거주지역</dt>
            <dd>{{ selected.location }}</dd>
          </div>
          <div>
            <dt>알게 된 경로</dt>
            <dd :class="{ 'inq-none': !selected.referral }">{{ selected.referral || '선택 안 함' }}</dd>
          </div>
        </dl>

        <section class="inq-section">
          <h3>문의 내용</h3>
          <p class="inq-message" :class="{ 'inq-none': !selected.message }">{{ selected.message || '적은 내용 없음' }}</p>
        </section>

        <section class="inq-section">
          <h3><label for="inq-memo">상담 메모</label></h3>
          <textarea
            id="inq-memo"
            v-model="memoDraft"
            class="adm-textarea"
            rows="6"
            maxlength="2000"
            placeholder="통화 내용, 다음 연락 일정 등을 적어 두세요."
            :disabled="memoSaving"
          ></textarea>
          <div class="inq-memo-foot">
            <span class="inq-memo-state">
              <template v-if="memoNotice">{{ memoNotice }}</template>
              <template v-else-if="selected.memo_updated_at">마지막 저장 {{ dateTime(selected.memo_updated_at) }}</template>
            </span>
            <button type="button" class="adm-btn adm-btn--primary adm-btn--sm" :disabled="!memoDirty || memoSaving" @click="saveMemo">
              {{ memoSaving ? '저장 중…' : '메모 저장' }}
            </button>
          </div>
        </section>
      </div>

      <footer class="inq-panel-foot">
        <button type="button" class="adm-btn adm-btn--danger adm-btn--sm" @click="confirm = 'delete'">이 문의 삭제</button>
      </footer>
    </aside>

    <AdminConfirm
      :open="confirm === 'delete'"
      title="이 문의를 삭제할까요?"
      :message="selected ? `${selected.name} 님의 문의와 상담 메모가 모두 지워지고 되돌릴 수 없습니다.` : ''"
      :busy="deleting"
      @cancel="confirm = ''"
      @confirm="remove"
    />
    <AdminConfirm
      :open="confirm === 'close'"
      title="메모를 저장하지 않고 닫을까요?"
      message="저장하지 않은 상담 메모는 사라집니다."
      confirm-label="닫기"
      @cancel="confirm = ''"
      @confirm="close"
    />
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { adminService, errorText } from '@/services/adminService.js'
import { dateTime, kstDay } from './adminFormat.js'
import AdminPager from './AdminPager.vue'
import AdminConfirm from './AdminConfirm.vue'

const SIZE = 20
const PERIODS = [
  { label: '오늘', days: 0 },
  { label: '7일', days: 6 },
  { label: '30일', days: 29 },
  { label: '전체', days: null },
]

const route = useRoute()
const router = useRouter()

const items = ref([])
const total = ref(0)
const loading = ref(false)
const error = ref('')

// 주소에 남는 조건
const page = computed(() => Math.max(1, parseInt(route.query.page, 10) || 1))
const applied = computed(() => ({
  q: typeof route.query.q === 'string' ? route.query.q : '',
  from: typeof route.query.from === 'string' ? route.query.from : '',
  to: typeof route.query.to === 'string' ? route.query.to : '',
}))
const hasFilter = computed(() => Boolean(applied.value.q || applied.value.from || applied.value.to))

// 입력 중인 조건(조회를 눌러야 적용)
const form = reactive({ q: '', from: '', to: '' })
const syncForm = () => Object.assign(form, applied.value)

const isPeriod = (p) => (p.days === null ? !form.from && !form.to : form.from === kstDay(p.days) && form.to === kstDay(0))
const setPeriod = (p) => {
  form.from = p.days === null ? '' : kstDay(p.days)
  form.to = p.days === null ? '' : kstDay(0)
  search()
}

const pushQuery = (next) => {
  const query = {}
  if (next.q) query.q = next.q
  if (next.from) query.from = next.from
  if (next.to) query.to = next.to
  if (next.page > 1) query.page = String(next.page)
  router.replace({ query })
}

const search = () => {
  let { from, to } = form
  if (from && to && from > to) [from, to] = [to, from]
  pushQuery({ q: form.q, from, to, page: 1 })
}
const reset = () => {
  Object.assign(form, { q: '', from: '', to: '' })
  pushQuery({ page: 1 })
}
const goPage = (n) => pushQuery({ ...applied.value, page: n })

const load = async () => {
  loading.value = true
  error.value = ''
  try {
    const data = await adminService.getInquiries({
      page: page.value,
      size: SIZE,
      q: applied.value.q,
      dateFrom: applied.value.from,
      dateTo: applied.value.to,
    })
    items.value = data.items
    total.value = data.total
    // 열려 있던 문의가 목록에서 갱신되면 상세도 같은 값으로
    if (selected.value) {
      const fresh = data.items.find((item) => item.id === selected.value.id)
      if (fresh) selected.value = { ...fresh }
    }
  } catch (e) {
    error.value = errorText(e, '문의 목록을 불러오지 못했습니다.')
  } finally {
    loading.value = false
  }
}

watch(
  () => route.query,
  () => {
    syncForm()
    load()
  },
)

// ── 상세 · 메모 ──
const selected = ref(null)
const memoDraft = ref('')
const memoSaving = ref(false)
const memoNotice = ref('')
const confirm = ref('')
const deleting = ref(false)
const memoDirty = computed(() => selected.value && (memoDraft.value || '') !== (selected.value.memo || ''))

const open = (item) => {
  if (selected.value && selected.value.id !== item.id && memoDirty.value) {
    confirm.value = 'close'
    return
  }
  selected.value = { ...item }
  memoDraft.value = item.memo || ''
  memoNotice.value = ''
}

const close = () => {
  confirm.value = ''
  selected.value = null
}

const requestClose = () => {
  if (memoDirty.value) confirm.value = 'close'
  else close()
}

const saveMemo = async () => {
  if (!selected.value || memoSaving.value) return
  memoSaving.value = true
  memoNotice.value = ''
  try {
    const saved = await adminService.updateInquiryMemo(selected.value.id, memoDraft.value)
    selected.value = { ...selected.value, memo: saved.memo, memo_updated_at: saved.memo_updated_at }
    memoDraft.value = saved.memo || ''
    const row = items.value.find((item) => item.id === saved.id)
    if (row) Object.assign(row, { memo: saved.memo, memo_updated_at: saved.memo_updated_at })
    memoNotice.value = '저장했습니다.'
  } catch (e) {
    memoNotice.value = errorText(e, '메모를 저장하지 못했습니다.')
  } finally {
    memoSaving.value = false
  }
}

const remove = async () => {
  if (!selected.value) return
  deleting.value = true
  try {
    await adminService.deleteInquiry(selected.value.id)
    confirm.value = ''
    selected.value = null
    // 지운 줄이 그 쪽의 마지막이었으면 앞 쪽으로
    if (items.value.length === 1 && page.value > 1) goPage(page.value - 1)
    else load()
  } catch (e) {
    confirm.value = ''
    memoNotice.value = errorText(e, '삭제하지 못했습니다.')
  } finally {
    deleting.value = false
  }
}

const onKey = (event) => {
  if (event.key === 'Escape' && selected.value && !confirm.value) requestClose()
}

onMounted(() => {
  syncForm()
  load()
  window.addEventListener('keydown', onKey)
})
onBeforeUnmount(() => window.removeEventListener('keydown', onKey))
</script>

<style scoped>
.inq-q {
  width: 240px;
}

.inq-tilde {
  color: var(--adm-faint);
}

.inq-memo-cell {
  max-width: 180px;
}

/* ── 상세(오른쪽) ── */
.inq-backdrop {
  position: fixed;
  inset: 0;
  z-index: 40;
  background: rgba(17, 17, 17, 0.18);
}

.inq-panel {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  z-index: 41;
  display: flex;
  flex-direction: column;
  width: min(460px, 100vw);
  border-left: 1px solid var(--adm-line);
  background: var(--adm-panel);
  box-shadow: -6px 0 18px rgba(0, 0, 0, 0.06);
}

.inq-panel-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  padding: 18px 20px 14px;
  border-bottom: 1px solid var(--adm-line);
}

.inq-panel-head h2 {
  font-size: 17px;
  font-weight: 700;
}

.inq-panel-head p {
  margin-top: 2px;
  font-size: 13px;
  color: var(--adm-sub);
}

.inq-panel-body {
  flex: 1;
  overflow-y: auto;
  padding: 6px 20px 20px;
}

.inq-info > div {
  display: grid;
  grid-template-columns: 96px minmax(0, 1fr);
  gap: 12px;
  padding: 10px 0;
  border-bottom: 1px solid var(--adm-row-line);
}

.inq-info dt {
  font-size: 13px;
  color: var(--adm-sub);
}

.inq-info dd {
  word-break: keep-all;
}

.inq-info a {
  font-weight: 600;
}

.inq-section {
  margin-top: 20px;
}

.inq-section h3 {
  margin-bottom: 8px;
  font-size: 13px;
  font-weight: 700;
}

.inq-message {
  padding: 12px 14px;
  border-radius: 4px;
  background: #f7f8fa;
  white-space: pre-wrap;
  word-break: keep-all;
  overflow-wrap: anywhere;
}

.inq-none {
  color: var(--adm-faint);
}

.inq-memo-foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-top: 8px;
}

.inq-memo-state {
  font-size: 12px;
  color: var(--adm-faint);
}

.inq-panel-foot {
  padding: 12px 20px;
  border-top: 1px solid var(--adm-line);
}

@media (max-width: 900px) {
  .inq-q {
    width: 100%;
  }
}
</style>
