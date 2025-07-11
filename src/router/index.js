import { createRouter, createWebHistory } from 'vue-router'

import Main from '../views/Main.vue'

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
import Inquiry from '../views/faq/Inquiry.vue'

// 수강후기
import Reviews from '../views/Reviews.vue'
import ReviewDetail from '../views/ReviewDetail.vue'

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
        component: () => import('../views/introduction/Introduction.vue'),
        redirect: '/introduction/greeting',
        children: [
            { path: 'greeting', name: 'Greeting', component: Greeting },
            { path: 'business', name: 'Business', component: Business },
            { path: 'partners', name: 'Partners', component: Partners }
        ]
    },
    // 교육안내
    {
        path: '/education',
        name: 'Education',
        component: () => import('../views/education/Education.vue'),
        redirect: '/education/curriculum',
        children: [
            { path: 'curriculum', name: 'Curriculum', component: Curriculum },
            { path: 'status', name: 'Status', component: Status },
            { path: 'status/:id', name: 'StatusDetail', component: StatusDetail }
        ]
    },
    // 수강신청
    {
        path: '/registration',
        name: 'Registration',
        component: Registration
    },
    // 자주묻는질문
    {
        path: '/faq',
        name: 'FAQ',
        component: () => import('../views/faq/FAQ.vue'),
        redirect: '/faq/questions',
        children: [
            { path: 'questions', name: 'Questions', component: Questions },
            { path: 'inquiry', name: 'Inquiry', component: Inquiry }
        ]
    },
    // 수강후기
    {
        path: '/reviews',
        name: 'Reviews',
        component: Reviews
    },
    {
        path: '/reviews/:id',
        name: 'ReviewDetail',
        component: ReviewDetail
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
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
        return { top: 0 }
    }
})

export default router;