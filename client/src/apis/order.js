import { apiHelper } from '../utils/helpers'

export default {
  getNewOrder () {
    return apiHelper.get('/order/new')
  },
  postNewOrder (formData) {
    return apiHelper.post('/order/new', formData)
  },
  getOrder ({ orderId }) {
    return apiHelper.get(`/order/${orderId}`)
  },
  getEditOrder ({ orderId }) {
    return apiHelper.get(`/order/${orderId}/edit`)
  },
  putEditOrder ({ orderId, formData }) {
    return apiHelper.put(`/order/${orderId}`, formData)
  },
  putCancelOrder ({ orderId }) {
    return apiHelper.put(`/order/${orderId}/cancel`, {})
  },
  getComment ({ orderId }) {
    return apiHelper.get(`/order/${orderId}/comment`)
  },
  postComment ({ orderId, formData }) {
    return apiHelper.post(`/order/${orderId}/comment`, formData)
  }
}
