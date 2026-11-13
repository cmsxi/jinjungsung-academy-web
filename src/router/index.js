import { createRouter, createWebHistory } from 'vue-router'

// 시안 비교 기간 동안 '/'는 고른 시안의 메인을 보여 준다 (원본은 views/Main.vue 그대로)
import Main from '../versions/VersionedMain.vue'
// 11/13 하위 페이지도 시안별로 바꿔 끼운다(원본 버전에서는 항상 원본 페이지)
import { versioned } from '../versions/versionedPage.js'

// 교육원 소개
import Greeting from '../views/introduction/Greeting.vue'
import Business from '../views/introduction/Business.vue'
import Partners from '../views/introduction/Partners.vue'

// 교육안내
import Curriculum from '../views/education/Curriculum.vue'
import Status from '../views/education/Status.vue'
import StatusDetail from '../views/education/StatusDetail.vue'

// 수강신청
import Registration from '../views/Registration.vue'

// 자주묻는질문
import Questions from '../views/faq/Questions.vue'

// 수강후기
import Reviews from '../views/Reviews.vue'
import ReviewDetail from '../views/ReviewDetail.vue'
import ReviewWrite from '../views/ReviewWrite.vue'

// 관리자
import { isLoggedIn } from '../views/admin/adminAuth.js'

import '../assets/styles/global.css';

const routes = [
    { path: '/', name: 'Main', component: Main },
    // 교육원 소개
    {
        path: '/introduction',
        name: 'Introduction',
        component: versioned('Introduction', () => import('../views/introduction/Introduction.vue')),
        redirect: '/introduction/greeting',
        children: [
            { path: 'greeting', name: 'Greeting', component: versioned('Greeting', Greeting) },
            { path: 'business', name: 'Business', component: versioned('Business', Business) },
            { path: 'partners', name: 'Partners', component: versioned('Partners', Partners) }
        ]
    },
    // 교육안내
    {
        path: '/education',
        name: 'Education',
        component: versioned('Education', () => import('../views/education/Education.vue')),
        redirect: '/education/curriculum',
        children: [
            { path: 'curriculum', name: 'Curriculum', component: versioned('Curriculum', Curriculum) },
            { path: 'status', name: 'Status', component: versioned('Status', Status) },
            { path: 'status/:id', name: 'StatusDetail', component: versioned('StatusDetail', StatusDetail) }
        ]
    },
    // 수강신청
    {
        path: '/registration',
        name: 'Registration',
        component: versioned('Registration', Registration)
    },
    // 자주묻는질문
    {
        path: '/faq',
        name: 'FAQ',
        component: versioned('FAQ', () => import('../views/faq/FAQ.vue')),
        redirect: '/faq/questions',
        children: [
            { path: 'questions', name: 'Questions', component: versioned('Questions', Questions) },
            // 11/13 문의게시판 삭제 — 예전 주소로 들어오면 수강신청 문의 페이지로
            { path: 'inquiry', redirect: '/registration' }
        ]
    },
    // 수강후기
    {
        path: '/reviews',
        name: 'Reviews',
        component: versioned('Reviews', Reviews)
    },
    {
        path: '/reviews/write',
        name: 'ReviewWrite',
        component: versioned('ReviewWrite', ReviewWrite)
    },
    {
        path: '/reviews/:id',
        name: 'ReviewDetail',
        component: versioned('ReviewDetail', ReviewDetail)
    },
    // 관리자 (11/13 관리자 전용 화면: 왼쪽 메뉴 틀 AdminLayout, 홈페이지 헤더 · 푸터 없음 — App.vue 에서 meta.admin 으로 구분)
    // 로그인은 비밀번호 → 8시간 토큰(adminAuth.js). 로그인하지 않았으면 /admin/login 으로
    {
        path: '/admin/login',
        name: 'AdminLogin',
        component: () => import('../views/admin/AdminLogin.vue'),
        meta: { admin: true, public: true }
    },
    {
        path: '/admin',
        component: () => import('../views/admin/AdminLayout.vue'),
        meta: { admin: true },
        children: [
            { path: '', redirect: '/admin/inquiries' },
            { path: 'inquiries', name: 'AdminInquiries', component: () => import('../views/admin/AdminInquiries.vue') },
            { path: 'status', name: 'AdminStatus', component: () => import('../views/admin/AdminStatus.vue') },
            { path: 'status/write', name: 'AdminStatusWrite', component: () => import('../views/admin/AdminStatusForm.vue') },
            { path: 'status/:id', name: 'AdminStatusEdit', component: () => import('../views/admin/AdminStatusForm.vue') },
            { path: 'reviews', name: 'AdminReviews', component: () => import('../views/admin/AdminReviews.vue') },
            { path: 'reviews/write', name: 'AdminReviewWrite', component: () => import('../views/admin/AdminReviewForm.vue') },
            { path: 'reviews/edit/:id', name: 'AdminReviewEdit', component: () => import('../views/admin/AdminReviewForm.vue') }
        ]
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes,
    scrollBehavior(to, from, savedPosition) {
        // 11/13 목록에서 쪽만 넘길 때(?page=)는 맨 위로 튀지 않게 — 목록이 알아서 목록 맨 위로 옮긴다
        if (to.path === from.path) return false;
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
        return { top: 0 }
    }
})

// 관리자 화면은 로그인(유효한 토큰)이 있어야 들어간다
router.beforeEach((to) => {
    if (to.matched.some((record) => record.meta.admin) && !to.meta.public && !isLoggedIn()) {
        return { path: '/admin/login', query: { next: to.fullPath } }
    }
    return true
})

export default router;