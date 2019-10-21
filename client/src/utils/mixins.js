import axios from 'axios'
import moment from 'moment'
import 'moment/locale/zh-tw'

export const timeTransformFilter = {
  filters: {
    timeTransform (timestamp) {
      if (!timestamp) return '-'
      return moment(timestamp).format('LL')
    }
  }
}

export const dateTransformFilter = {
  filters: {
    dateTransform (timestamp) {
      if (!timestamp) return '-'
      return moment(timestamp).format('YYYY-MM-DD')
    }
  }
}

export const getGeoMethods = {
  methods: {
    async getLocation (storeLocation) {
      // Get geocoding location
      try {
        const BASE_URL = 'https://maps.googleapis.com/maps/api/geocode'
        const language = 'zh-TW'
        const activeDistricts = ['信義區', '大安區', '中山區', '松山區']
        const addressInput = document.getElementById('address')
        const form = document.querySelector('form')
        const { data } = await axios.get(`${BASE_URL}/json?address=${this[storeLocation].address}&language=${language}&components=country:TW&key=${this.apiKey}`)

        // Retrieve district from data
        const district = data.results[0].address_components[2] || null

        // validate address
        if (data.status !== 'OK' || !district || !activeDistricts.includes(district.long_name)) {
          addressInput.setCustomValidity('invalid')
          this.validationMsg.address = '請確認地址位於台北市信義、松山、大安、中山區'
        } else {
          addressInput.setCustomValidity('')
          this.validationMsg.address = '請輸入地址'
        }
        // Validate form data
        if (form.checkValidity() === false) {
          form.classList.add('was-validated')
          return false
        }
        // update location data
        this[storeLocation].lat = data.results[0].geometry.location.lat
        this[storeLocation].lng = data.results[0].geometry.location.lng
        this[storeLocation].location = data.results[0].address_components[2].long_name
        this.afterReceiveGeo()
      } catch (error) {
        this.warningMessage = 'Oops！設定時有些狀況，請稍後再試！'
      }
    }
  }
}

export const handleFileChangeMethod = {
  methods: {
    handleFileChange (event, targetName) {
      const files = event.target.files
      if (!files.length) return
      const imageURL = window.URL.createObjectURL(files[0])
      this[targetName].image = imageURL
    }
  }
}
