import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../components/Home.vue'
import Demo from '../components/Demo.vue'
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/demo'
  },
  {
    path: '/demo',
    naem: 'Demo',
    component: Demo
  },
  {
    path: '/home',
    name: 'Home',
    // component: resolve => require(['../components/Home.vue'], resolve)
    component: Home
  }

]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
