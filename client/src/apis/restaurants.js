import { apiHelper } from '../utils/helpers'

export default {
  getHome () {
    return apiHelper.get('/')
  },
  getRestaurants ({ dist, page }) {
    const searchParams = new URLSearchParams({ dist, page })
    console.log(searchParams)
    return apiHelper.get(`/restaurants?${searchParams}`)
  },
  getRestaurant ({ restaurantId, page }) {
    const searchParams = new URLSearchParams({ page })
    return apiHelper.get(`/restaurants/${restaurantId}?${searchParams}`)
  }
}
