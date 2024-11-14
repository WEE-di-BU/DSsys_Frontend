import { createRouter, createWebHashHistory } from "vue-router";
import AIChat from '@/pages/AIChat.vue'
import StatisticsPage from "@/pages/StatisticsPage.vue";
import HomePage from "@/pages/HomePage.vue";
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
        }
    ]
})

export default router