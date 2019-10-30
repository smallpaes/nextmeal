import axios from 'axios'
import Swal from 'sweetalert2'

const baseURL = 'http://localhost:3000/api/'

export const apiHelper = axios.create({
  baseURL
})

export const Toast = Swal.mixin({
  position: 'center',
  showConfirmButton: false,
  timer: 3000,
  heightAuto: false
})
