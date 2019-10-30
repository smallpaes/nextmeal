import { apiHelper } from '../utils/helpers'
const getToken = () => localStorage.getItem('token')

export default {
  restaurants: {
    get () {
      return apiHelper.get('/owner', {
        headers: { Authorization: `Bearer ${getToken()}` }
      })
    },
    post (formData) {
      return apiHelper.post('/owner', formData, {
        headers: { Authorization: `Bearer ${getToken()}` }
      })
    },
    put (formData) {
      return apiHelper.put('/owner', formData, {
        headers: { Authorization: `Bearer ${getToken()}` }
      })
    }
  },
  dishes: {
    getDishes () {
      return apiHelper.get('/owner/dishes', {
        headers: { Authorization: `Bearer ${getToken()}` }
      })
    },
    postNew (formDate) {
      return apiHelper.post('/owner/dishes', formDate, {
        headers: { Authorization: `Bearer ${getToken()}` }
      })
    },
    getEdit ({ dishId }) {
      return apiHelper.get(`/owner/dishes/${dishId}`, {
        headers: { Authorization: `Bearer ${getToken()}` }
      })
    },
    putEdit ({ dishId, formData }) {
      return apiHelper.put(`/owner/dishes/${dishId}/edit`, formData, {
        headers: { Authorization: `Bearer ${getToken()}` }
      })
    }
  },
  menu: {
    getMenu ({ ran }) {
      return apiHelper.get(`/owner/menu?ran=${ran}`, {
        headers: { Authorization: `Bearer ${getToken()}` }
      })
    },
    putMenu (formData) {
      return apiHelper.put('/owner/menu', formData, {
        headers: { Authorization: `Bearer ${getToken()}` }
      })
    }
  }
}
