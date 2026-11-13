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
import AdminStatus from '../views/admin/AdminStatus.vue'
import AdminStatusDetail from '../views/admin/AdminStatusDetail.vue'
import AdminStatusWrite from '../views/admin/AdminStatusWrite.vue'
import AdminMain from '../views/admin/AdminMain.vue'
import AdminReviews from '../views/admin/AdminReviews.vue'
import AdminReviewWrite from '../views/admin/AdminReviewWrite.vue'

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
    // 관리자
    {
        path: '/admin',
        name: 'AdminMain',
        component: AdminMain
    },
    {
        path: '/admin/status',
        name: 'AdminStatus',
        component: AdminStatus
    },
    {
        path: '/admin/status/write',
        name: 'AdminStatusWrite',
        component: AdminStatusWrite
    },
    {
        path: '/admin/status/:id',
        name: 'AdminStatusEdit',
        component: AdminStatusWrite
    },
    // 수강후기 관리
    {
        path: '/admin/reviews',
        name: 'AdminReviews',
        component: AdminReviews
    },
    {
        path: '/admin/reviews/write',
        name: 'AdminReviewWrite',
        component: AdminReviewWrite
    },
    {
        path: '/admin/reviews/edit/:id',
        name: 'AdminReviewEdit',
        component: AdminReviewWrite
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

export default router;