import {createRouter, createWebHashHistory} from "vue-router";
import AIChat from '@/pages/AIChat.vue'
import StudentPersonalPage from "@/pages/StudentPersonalPage.vue";
import HomePage from "@/pages/HomePage.vue";
import LearnPage from "@/pages/LearnPage.vue";
import DetailPage from "@/pages/detail/DetailPage.vue";
import TeacherPersonalPage from "@/pages/TeacherPersonalPage.vue";
import ClassDetail from "@/pages/detail/ClassDetail.vue";

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      redirect: '/home'
    },
    {
      name: 'aichat',
      path: '/aichat',
      component: AIChat
    },
    {
      name: 'studentpersonalpage',
      path: '/studentpersonalpage',
      component: StudentPersonalPage
    },
    {
      name: 'teacherpersonalpage',
      path: '/teacherpersonalpage',
      component: TeacherPersonalPage
    },
    {
      name: 'home',
      path: '/home',
      component: HomePage
    },
    {
      name: 'learn',
      path: '/learn',
      component: LearnPage
    },
    {
      path: '/detail/:id',
      name: 'detail',
      component: DetailPage,
      props: route => ({id: route.params.id})
    },
    {
      path: '/class/:cid',
      name: 'class',
      component:ClassDetail,
      props: route => ({cid:route.params.cid})
    }
  ]
})

export default router
