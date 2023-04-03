import axios from 'axios'
import Swal from 'sweetalert2'

// const baseURL = 'https://nextmeal.herokuapp.com/api'
const baseURL = 'http://localhost:3000/api'

// config an instance
const axiosInstance = axios.create({
  baseURL
})

// add a request interceptor
axiosInstance.interceptors.request.use(config => {
  // retrieve token from localStorage
  const token = localStorage.getItem('token')
  // set token to header
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
}, error => {
  Promise.reject(error)
})

export const apiHelper = axiosInstance

export const Toast = Swal.mixin({
  position: 'center',
  showConfirmButton: false,
  timer: 3000,
  heightAuto: false
})
