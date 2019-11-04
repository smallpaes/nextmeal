import { apiHelper } from '../utils/helpers'
const getToken = () => localStorage.getItem('token')

export default {
  restaurants: {
    getRestaurants ({ name, dist }) {
      const searchParams = new URLSearchParams({ name, dist })
      return apiHelper.get(`/admin/restaurants?${searchParams.toString()}`, {
        headers: { Authorization: `Bearer ${getToken()}` }
      })
    },
    getRestaurant ({ restaurantId }) {
      return apiHelper.get(`/admin/restaurants/${restaurantId}`, {
        headers: { Authorization: `Bearer ${getToken()}` }
      })
    },
    putRestaurant ({ restaurantId }) {
      return apiHelper.put(`/admin/restaurants/${restaurantId}`, {
        headers: { Authorization: `Bearer ${getToken()}` }
      })
    },
    deleteRestaurant ({ restaurantId }) {
      return apiHelper.delete(`/admin/restaurants/${restaurantId}`, {
        headers: { Authorization: `Bearer ${getToken()}` }
      })
    }
  },
  users: {
    getUser ({ userId }) {
      return apiHelper.get(`/admin/users/${userId}`, {
        headers: { Authorization: `Bearer ${getToken()}` }
      })
    },
    getUsers ({ subscriptionStatus, name }) {
      const searchParams = new URLSearchParams({ 'sub_status': subscriptionStatus, name })
      return apiHelper.get(`/admin/users?${searchParams.toString()}`, {
        headers: { Authorization: `Bearer ${getToken()}` }
      })
    },
    deleteUser ({ userId }) {
      return apiHelper.delete(`/admin/users/${userId}`, {
        headers: { Authorization: `Bearer ${getToken()}` }
      })
    }
  },
  orders: {
    getOrders ({ id, date, status, page }) {
      const searchParams = new URLSearchParams({ page, 'order_id': id, date, 'order_status': status })
      return apiHelper.get(`/admin/orders?${searchParams.toString()}`, {
        headers: { Authorization: `Bearer ${getToken()}` }
      })
    },
    putOrder ({ orderId }) {
      return apiHelper.put(`/admin/orders/${orderId}`, {}, {
        headers: { Authorization: `Bearer ${getToken()}` }
      })
    }
  }
}
