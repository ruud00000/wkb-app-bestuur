import { createRouter, createWebHistory } from 'vue-router'
import UitslagenView from '../views/UitslagenView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'uitslagen',
      component: UitslagenView
    },
    {
      path: '/informatie',
      name: 'informatie',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/InformatieView.vue')
    },
    {
      path: '/fu',
      name: 'fileupload',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/FileUploadView.vue')
    }
  ]
})

export default router
