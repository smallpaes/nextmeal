import { apiHelper } from '../utils/helpers'

export default {
  restaurants: {
    get () {
      return apiHelper.get('/owner')
    },
    post (formData) {
      return apiHelper.post('/owner', formData)
    },
    put (formData) {
      return apiHelper.put('/owner', formData)
    }
  },
  dishes: {
    getDishes () {
      return apiHelper.get('/owner/dishes')
    },
    postNew (formDate) {
      return apiHelper.post('/owner/dishes', formDate)
    },
    getEdit ({ dishId }) {
      return apiHelper.get(`/owner/dishes/${dishId}`)
    },
    putEdit ({ dishId, formData }) {
      return apiHelper.put(`/owner/dishes/${dishId}/edit`, formData)
    },
    deleteDish ({ dishId }) {
      return apiHelper.delete(`/owner/dishes/${dishId}`)
    }
  },
  menu: {
    getMenu ({ ran }) {
      return apiHelper.get(`/owner/menu?ran=${ran}`)
    },
    putMenu (formData) {
      return apiHelper.put('/owner/menu', formData)
    }
  },
  orders: {
    getOrders () {
      return apiHelper.get('/owner/orders')
    }
  },
  dashboard: {
    getDashboard () {
      return apiHelper.get('/owner/dashboard')
    }
  }
}
