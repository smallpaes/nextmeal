import { apiHelper } from '../utils/helpers'

export default {
  logIn ({ email, password }) {
    return apiHelper.post('/users/signin', {
      email,
      password
    })
  },
  signup (formData) {
    return apiHelper.post('/users/signup', formData)
  },
  emailcheck ({ email }) {
    return apiHelper.post('/users/emailcheck', { email })
  }
}
