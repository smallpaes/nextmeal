import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import NotFound from './views/NotFound'
import store from './store'
import multiguard from 'vue-router-multiguard'

Vue.use(Router)

const authentication = {
  isAdmin (to, from, next) {
    const currentUser = store.state.currentUser
    // redirect to 404 if user is not an admin
    if (currentUser && currentUser.role !== 'Admin') {
      next({ name: 'not-found' })
      return
    }
    next()
  },
  isOwner (to, from, next) {
    const currentUser = store.state.currentUser
    // redirect to 404 if user is not an owner
    if (currentUser && currentUser.role !== 'Owner') {
      next({ name: 'not-found' })
      return
    }
    next()
  },
  isUser (to, from, next) {
    const currentUser = store.state.currentUser
    // redirect to 404 if user is not an owner
    if (currentUser && currentUser.role !== 'User') {
      next({ name: 'not-found' })
      return
    }
    // redirect to order tomorrow page if user has already subscribed
    if (to.name === 'subscribe' && currentUser.subscriptionStatus) {
      next({ name: 'order-tomorrow' })
    }
    next()
  },
  isPaidUser (to, from, next) {
    const currentUser = store.state.currentUser
    // redirect to subscribe page
    if (!currentUser.subscriptionStatus) {
      next({ name: 'subscribe' })
      return
    }
    next()
  },
  isPaidUserWithBalance (to, from, next) {
    const currentUser = store.state.currentUser
    // redirect to subscribe page
    if (currentUser.subscriptionBalance === 0) {
      next({ name: 'order-tomorrow' })
      return
    }
    next()
  }
}

const router = new Router({
  linkExactActiveClass: 'active',
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
      path: '/subscribe',
      name: 'subscribe',
      component: () => import('./views/Subscribe.vue'),
      beforeEnter: authentication.isUser
    },
    {
      path: '/order/tomorrow',
      name: 'order-tomorrow',
      component: () => import('./views/OrdersTomorrow.vue'),
      beforeEnter: multiguard([authentication.isUser, authentication.isPaidUser])
    },
    {
      path: '/order/new',
      name: 'order-new',
      component: () => import('./views/OrderNew.vue'),
      beforeEnter: multiguard([authentication.isUser, authentication.isPaidUser, authentication.isPaidUserWithBalance])
    },
    {
      path: '/order/:order_id/edit',
      name: 'order-edit',
      component: () => import('./views/OrderEdit.vue'),
      beforeEnter: multiguard([authentication.isUser, authentication.isPaidUser])
    },
    {
      path: '/order/:order_id/comment',
      name: 'order-comment',
      component: () => import('./views/OrderComment.vue'),
      beforeEnter: authentication.isUser
    },
    {
      path: '/order/:order_id',
      name: 'order',
      component: () => import('./views/Order.vue'),
      beforeEnter: authentication.isUser
    },
    {
      path: '/user',
      name: 'user-profile',
      component: () => import('./views/UserProfile.vue'),
      beforeEnter: authentication.isUser
    },
    {
      path: '/user/orders',
      name: 'user-order',
      component: () => import('./views/UserOrders.vue'),
      beforeEnter: authentication.isUser
    },
    {
      path: '/owner',
      name: 'owner-info',
      component: () => import('./views/OwnerInfo.vue'),
      beforeEnter: authentication.isOwner
    },
    {
      path: '/owner/dishes',
      name: 'owner-dishes',
      component: () => import('./views/OwnerDishes.vue'),
      beforeEnter: authentication.isOwner
    },
    {
      path: '/owner/dishes/new',
      name: 'owner-dish-new',
      component: () => import('./views/OwnerDishNew.vue'),
      beforeEnter: authentication.isOwner
    },
    {
      path: '/owner/dishes/:dish_id',
      name: 'owner-dish-edit',
      component: () => import('./views/OwnerDishEdit.vue'),
      beforeEnter: authentication.isOwner
    },
    {
      path: '/owner/menu',
      name: 'owner-menu',
      component: () => import('./views/OwnerMenu.vue'),
      beforeEnter: authentication.isOwner
    },
    {
      path: '/owner/orders',
      name: 'owner-orders',
      component: () => import('./views/OwnerOrders.vue'),
      beforeEnter: authentication.isOwner
    },
    {
      path: '/admin',
      name: 'admin-panel',
      redirect: '/admin/restaurants'
    },
    {
      path: '/admin/restaurants',
      name: 'admin-restaurants',
      component: () => import('./views/AdminRestaurants.vue'),
      beforeEnter: authentication.isAdmin
    },
    {
      path: '/admin/restaurants/:restaurant_id',
      name: 'admin-restaurant-edit',
      component: () => import('./views/AdminRestaurantEdit.vue'),
      beforeEnter: authentication.isAdmin
    },
    {
      path: '/admin/users',
      name: 'admin-users',
      component: () => import('./views/AdminUsers.vue'),
      beforeEnter: authentication.isAdmin
    },
    {
      path: '/admin/users/:user_id',
      name: 'admin-user-edit',
      component: () => import('./views/AdminUserEdit.vue'),
      beforeEnter: authentication.isAdmin
    },
    {
      path: '/admin/orders',
      name: 'admin-orders',
      component: () => import('./views/AdminOrders.vue'),
      beforeEnter: authentication.isAdmin
    },
    {
      path: '*',
      name: 'not-found',
      component: NotFound
    }
  ]
})

router.beforeEach(async (to, from, next) => {
  // retrieve token from localStorage
  const tokenInLocalStorage = localStorage.getItem('token')
  // retrieve token from store
  const tokenInStore = store.state.token
  let isAuthenticated = store.state.isAuthenticated

  // compare tokens
  if (tokenInLocalStorage && tokenInLocalStorage !== tokenInStore) {
    isAuthenticated = await store.dispatch('fetchCurrentUser')
  }

  // if user is authenticated redirect to respected page
  if (isAuthenticated && (to.name === 'login' || to.name === 'signup')) {
    const routeName = store.getters.controlPanelRouteName
    next(routeName)
  }

  // declare routes without authentication
  const pathWithoutAuth = ['signup', 'home', 'restaurants', 'restaurant', 'not-found']
  if (pathWithoutAuth.includes(to.name)) {
    next()
    return
  }

  // redirect to login page if the user is not authenticated
  if (!isAuthenticated && to.name !== 'login') {
    next('/login')
    return
  }

  next()
})

export default router
