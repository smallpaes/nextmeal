import { apiHelper } from '../utils/helpers'

export default {
  getSubscribe () {
    return apiHelper.get('/users/subscribe')
  },
  postSubscribe ({ formData }) {
    return apiHelper.post('/users/subscribe', formData)
  },
  getOrdersTomorrow () {
    return apiHelper.get('/users/orders/tomorrow')
  },
  getOrders ({ status, page }) {
    const searchParams = new URLSearchParams({ page, 'order_status': status })
    return apiHelper.get(`/users/orders?${searchParams}`)
  },
  getProfile ({ userId }) {
    return apiHelper.get(`/users/${userId}`)
  },
  putProfile ({ userId, formData }) {
    return apiHelper.put(`/users/${userId}/edit`, formData)
  },
  getCurrentUser () {
    return apiHelper.get('/users/current_user')
  }
}
