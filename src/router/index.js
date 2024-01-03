// Composables
import { createRouter, createWebHistory } from 'vue-router'

import Navbar from '@/components/Navbar.vue'

import Login from '@/layouts/LoginPage.vue'
import Register from '@/layouts/Register.vue'
import ForgetPassword from '@/layouts/ForgetPassword.vue'
import Main from '@/views/MainPage.vue'
import Shop from '@/views/ShopPage.vue'
import Cart from '@/views/CartPage.vue'
import Trans from '@/views/Trans/TransPage.vue'
import TransDetail from '@/views/Trans/TransDetail.vue'
import Service from '@/views/ServicePage.vue'
import ServiceList from '@/views/Service/ServiceList.vue'
import ServiceDetail from '@/views/Service/ServiceDetail.vue'
import Profile from '@/views/ProfilePage.vue'
import About from '@/views/AboutPage.vue'

const routes = [
  {
    path: '/',
    component: Navbar,
    children: [
      {
        path: '',
        name: 'main',
        component: Main,
      },
      {
        path: 'shop',
        name: 'shop',
        component: Shop
      },
      {
        path: 'cart',
        name: 'cart',
        component: Cart
      },
      {
        path: 'transaction',
        name: 'transaction',
        component: Trans
      },
      {
        path: 'transaction/:id',
        name:'transactiondetail',
        component: TransDetail
      },
      {
        path: 'services',
        name: 'services',
        component: Service
      },
      {
        path: 'servicelist',
        name: 'servicelist',
        component: ServiceList
      },
      {
        path: 'service/:id',
        name: 'service',
        component: ServiceDetail
      },
      {
        path: 'profile',
        name: 'profile',
        component: Profile
      },
      {
        path: 'about',
        name: 'about',
        component: About
      }
    ],
  },
  {
    path: '/login',
    component: Login
  },
  {
    path: '/register',
    component: Register
  },
  {
    path: '/forget_password',
    component: ForgetPassword
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

export default router
