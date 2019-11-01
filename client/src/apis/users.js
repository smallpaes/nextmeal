import { apiHelper } from '../utils/helpers'
const getToken = () => localStorage.getItem('token')

export default {
  getSubscribe () {
    return apiHelper.get('/users/subscribe', {
      headers: { Authorization: `Bearer ${getToken()}` }
    })
  },
  postSubscribe ({ formData }) {
    return apiHelper.post('/users/subscribe', formData, {
      headers: { Authorization: `Bearer ${getToken()}` }
    })
  },
  getOrdersTomorrow () {
    return apiHelper.get('/users/orders/tomorrow', {
      headers: { Authorization: `Bearer ${getToken()}` }
    })
  },
  getOrders ({ status, page }) {
    const searchParams = new URLSearchParams({ page, 'order_status': status })
    return apiHelper.get(`/users/orders?${searchParams}`, {
      headers: { Authorization: `Bearer ${getToken()}` }
    })
  },
  getProfile ({ userId }) {
    return apiHelper.get(`/users/${userId}`, {
      headers: { Authorization: `Bearer ${getToken()}` }
    })
  },
  putProfile ({ userId, formData }) {
    return apiHelper.put(`/users/${userId}/edit`, formData, {
      headers: { Authorization: `Bearer ${getToken()}` }
    })
  }
}
