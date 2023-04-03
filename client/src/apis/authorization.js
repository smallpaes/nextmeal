import { apiHelper } from '../utils/helpers'

export default {
  logIn ({ email, password }) {
    return apiHelper.post('/users/signin', {
      email,
      password
    })
  },
  postSignup (formData) {
    return apiHelper.post('/users/signup', formData)
  },
  emailcheck ({ email }) {
    return apiHelper.post('/users/emailcheck', { email })
  },
  getSignup () {
    return apiHelper.get('/users/signup')
  }
}
