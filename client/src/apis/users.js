import { apiHelper } from '../utils/helpers'
const getToken = () => localStorage.getItem('token')

export default {
  getSubscribe () {
    return apiHelper.get('/users/subscribe', {
      headers: { Authorization: `Bearer ${getToken()}` }
    })
  }
}
