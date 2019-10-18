import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/restaurants',
      name: 'restaurants',
      component: () => import('./views/Restaurants.vue')
    },
    {
      path: '/restaurant',
      name: 'restaurant',
      component: () => import('./views/Restaurant.vue')
    }
  ]
})
