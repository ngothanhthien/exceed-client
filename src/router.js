import { createRouter, createWebHistory } from 'vue-router'

import HomeView from '@/pages/HomeView.vue'

const routes = [
  { path: '/', component: HomeView },
  { path: '/room', component: lazyLoad('RoomView') }
]

function lazyLoad(view) {
  return () => import(`@/pages/${view}.vue`)
}

export default createRouter({
  history: createWebHistory(),
  routes
})
