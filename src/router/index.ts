import { createRouter, createWebHashHistory } from "vue-router";
import AIChat from '@/pages/AIChat.vue'
import StatisticsPage from "@/pages/StatisticsPage.vue";
import HomePage from "@/pages/HomePage.vue";
import LearnPage from "@/pages/LearnPage.vue";
import DetailPage from "@/pages/detail/DetailPage.vue";
const router = createRouter({
    history:createWebHashHistory(),
    routes:[
        {
            path:'/',
            redirect:'/home'
        },
        {
            name: 'aichat',
            path:'/aichat',
            component: AIChat
        },
        {
            name: 'statistics',
            path:'/statistics',
            component: StatisticsPage
        },
        {
            name:'home',
            path:'/home',
            component:HomePage
        },
        {
            name:'learn',
            path:'/learn',
            component:LearnPage
        },
        {
            path: '/detail/:id',
            name: 'detail',
            component: DetailPage,
            props: route => ({ id: route.params.id})
        }
    ]
})

export default router