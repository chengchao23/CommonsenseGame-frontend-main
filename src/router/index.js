import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import main_page from '../components/mainpage.vue'
import Login_page from '../components/login.vue'
import startPage from '../components/startGame.vue'
import personPage from '../components/personalInfo.vue'
Vue.use(Router)


const router = new Router({
    mode: 'history',
    routes: [{
            path: '/helloworld',
            name: 'HelloWorld',
            component: HelloWorld
        },
        {
            path: '/main',
            name: 'mainpage',
            component: main_page
        },
        {
            path: '/login',
            name: 'login',
            component: Login_page
        },
        {
            path: '/startGame',
            name: 'startGame',
            component: startPage
        },
        {
            path: '/personInfo',
            name: 'personInfo',
            component: personPage
        },
        {
            path: '/',
            redirect: '/login'
        }
    ]
})

export default router