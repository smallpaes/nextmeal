import { apiHelper } from '../utils/helpers'

export default {
  locationCheck (address) {
    const searchParams = new URLSearchParams({ address })
    return apiHelper.get(`/location/validate?${searchParams}`)
  }
}
