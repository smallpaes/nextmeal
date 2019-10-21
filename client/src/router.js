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
      path: '/restaurant/:restaurant_id',
      name: 'restaurant',
      component: () => import('./views/Restaurant.vue')
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('./views/Login.vue')
    },
    {
      path: '/signup',
      name: 'signup',
      component: () => import('./views/Signup.vue')
    },
    {
      path: '/owner',
      name: 'owner-info',
      component: () => import('./views/OwnerInfo.vue')
    },
    {
      path: '/owner/dishes',
      name: 'owner-dishes',
      component: () => import('./views/OwnerDishes.vue')
    },
    {
      path: '/owner/dishes/new',
      name: 'owner-dish-new',
      component: () => import('./views/OwnerDishNew.vue')
    }
  ]
})
