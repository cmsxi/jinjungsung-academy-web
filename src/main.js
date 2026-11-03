import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { createHead } from '@unhead/vue/client'

const app = createApp(App);
const head = createHead();

app.use(router);
app.use(head);
// 첫 라우트가 확정된 뒤 마운트 (관리자 페이지 첫 진입 시 전화 버튼이 잠깐 보이는 현상 방지)
router.isReady().then(() => app.mount('#app'));