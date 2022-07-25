import Vue from 'vue'
import VueRouter from 'vue-router'
// import Login from '@/views/login'

Vue.use(VueRouter)

const routes = [
  {
    path: '/login',
    component: () => import('@/views/login')
  },
  {
    path: '/',
    component: () => import('@/views/Layout'),
    redirect: '/ ',
    children: [
      {
        path: '/ ',
        component: () => import('@/views/Home')
      },
      {
        path: '/profile',
        component: () => import('@/views/My')
      },
      {
        path: '/qa',
        component: () => import('@/views/QA')
      },
      {
        path: '/video',
        component: () => import('@/views/Video')
      }
    ]
  },
  {
    path: '/search',
    component: () => import('@/views/Search')
  },
  {
    path: '/detail/:article_id',
    component: () => import('@/views/Detail')
  },
  {
    path: '/user/',
    component: () => import('@/views/User')
  }
]

const router = new VueRouter({
  routes
})

export default router
