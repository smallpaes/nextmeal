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

export const dateFormatterFilter = {
  methods: {
    dateFormatter (date) {
      return moment(date).format('LL')
    }
  }
}

export const placeholderImageFilter = {
  filters: {
    placeholderImage (url) {
      if (url) return url
      return 'https://images.pexels.com/photos/1490908/pexels-photo-1490908.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260'
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
      // update processing status
      this.isProcessing = true
      // Get geocoding location
      try {
        const BASE_URL = 'https://maps.googleapis.com/maps/api/geocode'
        const language = 'zh-TW'
        const activeDistricts = ['信義區', '大安區', '中山區', '松山區']
        const addressInput = document.getElementById('address')
        const form = document.querySelector('form')
        const { data } = await axios.get(`${BASE_URL}/json?address=${this[storeLocation].address}&language=${language}&components=country:TW&key=${this.apiKey}`)

        // Retrieve district from data
        const addressComponents = data.results[0].address_components
        const district = addressComponents.filter(item => activeDistricts.includes(item.long_name))

        // validate address
        if (data.status !== 'OK' || !district.length || addressComponents.length <= 4) {
          addressInput.setCustomValidity('invalid')
          this.validationMsg.address = '請確認為台北市信義、松山、大安、中山區的完整地址'
        } else {
          addressInput.setCustomValidity('')
          this.validationMsg.address = '請輸入地址'
        }

        // validate dob
        if ('dob' in this[storeLocation] && !this[storeLocation].dob) {
          document.getElementById('hidden-date-input').setCustomValidity('invalid')
        } else if ('dob' in this[storeLocation] && this[storeLocation].dob) {
          document.getElementById('hidden-date-input').setCustomValidity('')
        }

        // Validate form data
        if (form.checkValidity() === false) {
          form.classList.add('was-validated')
          // update processing status
          this.isProcessing = false
          return false
        }
        // update location data
        this[storeLocation].lat = data.results[0].geometry.location.lat
        this[storeLocation].lng = data.results[0].geometry.location.lng
        this[storeLocation].location = district[0].long_name
        this[storeLocation].address = data.results[0].formatted_address
        this.afterReceiveGeo()
      } catch (error) {
        // update processing status
        this.isProcessing = false
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
