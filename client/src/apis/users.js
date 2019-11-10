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
  getProfile () {
    return apiHelper.get('/users/profile')
  },
  putProfile ({ formData }) {
    return apiHelper.put('/users/profile', formData)
  },
  getCurrentUser () {
    return apiHelper.get('/users/current_user')
  }
}
