import { apiHelper } from '../utils/helpers'

export default {
  restaurants: {
    getRestaurants ({ name, dist, page }) {
      const searchParams = new URLSearchParams({ name, dist, page })
      return apiHelper.get(`/admin/restaurants?${searchParams.toString()}`)
    },
    getRestaurant ({ restaurantId }) {
      return apiHelper.get(`/admin/restaurants/${restaurantId}`)
    },
    putRestaurant ({ restaurantId }) {
      return apiHelper.put(`/admin/restaurants/${restaurantId}`)
    },
    deleteRestaurant ({ restaurantId }) {
      return apiHelper.delete(`/admin/restaurants/${restaurantId}`)
    }
  },
  users: {
    getUser ({ userId }) {
      return apiHelper.get(`/admin/users/${userId}`)
    },
    getUsers ({ subscriptionStatus, name }) {
      const searchParams = new URLSearchParams({ 'sub_status': subscriptionStatus, name })
      return apiHelper.get(`/admin/users?${searchParams.toString()}`)
    },
    deleteUser ({ userId }) {
      return apiHelper.delete(`/admin/users/${userId}`)
    }
  },
  orders: {
    getOrders ({ id, date, status, page }) {
      const searchParams = new URLSearchParams({ page, 'order_id': id, date, 'order_status': status })
      return apiHelper.get(`/admin/orders?${searchParams.toString()}`)
    },
    putOrder ({ orderId }) {
      return apiHelper.put(`/admin/orders/${orderId}`, {})
    }
  }
}
