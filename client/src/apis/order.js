import { apiHelper } from '../utils/helpers'
const getToken = () => localStorage.getItem('token')

export default {
  getNewOrder () {
    return apiHelper.get('/order/new', {
      headers: { Authorization: `Bearer ${getToken()}` }
    })
  },
  postNewOrder (formData) {
    return apiHelper.post('/order/new', formData, {
      headers: { Authorization: `Bearer ${getToken()}` }
    })
  },
  getOrder ({ orderId }) {
    return apiHelper.get(`/order/${orderId}`, {
      headers: { Authorization: `Bearer ${getToken()}` }
    })
  },
  getEditOrder ({ orderId }) {
    return apiHelper.get(`/order/${orderId}/edit`, {
      headers: { Authorization: `Bearer ${getToken()}` }
    })
  },
  putEditOrder ({ orderId, formData }) {
    return apiHelper.put(`/order/${orderId}`, formData, {
      headers: { Authorization: `Bearer ${getToken()}` }
    })
  },
  putCancelOrder ({ orderId }) {
    return apiHelper.put(`/order/${orderId}/cancel`, {}, {
      headers: { Authorization: `Bearer ${getToken()}` }
    })
  }
}
