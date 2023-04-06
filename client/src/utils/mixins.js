import moment from 'moment-timezone'
import locationAPI from '../apis/location'

export const timeTransformFilter = {
  filters: {
    timeTransform (timestamp) {
      if (!timestamp) return '-'
      return moment(timestamp).format('LL')
    }
  }
}

export const dateFormatterFilter = {
  filters: {
    dateFormatter (date) {
      if (!date) return '-'
      return moment(date).format('LL')
    }
  }
}

export const placeholderAvatarFilter = {
  filters: {
    placeholderAvatar (url) {
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

export const padEndFilter = {
  filters: {
    padEnd (value) {
      if (!value) return '-'
      return value.toString().padEnd(3, '.0')
    }
  }
}

export const textTruncateFilter = {
  filters: {
    textTruncate (content, textLength = 50) {
      if (!content.length) return '無介紹'
      if (content.length <= textLength) return content
      return `${content.slice(0, textLength)}...`
    }
  }
}

export const getGeoMethods = {
  methods: {
    async getLocation (storeLocation) {
      // update processing status
      this.isProcessing = true
      // validate address
      try {
        const address = this[storeLocation].address
        const { data, statusText } = await locationAPI.locationCheck(address)
        // error handling
        if (statusText !== 'OK') throw new Error(data.message)
        const addressGroup = document.querySelector('.form-address-group')
        if (data.status !== 'success') {
          addressGroup.classList.add('invalid')
          this.validationMsg.address = data.message
          this.isProcessing = false
          return
        }

        // clear invalid and warning sign
        addressGroup.classList.remove('invalid')
        this.validationMsg.address = ''

        // update location data
        const { lat, lng, dist, address: formattedAddress } = data.location
        this[storeLocation] = {
          ...this[storeLocation],
          lat,
          lng,
          location: dist,
          address: formattedAddress
        }
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
      this.isNewFileUploaded = true
    }
  }
}
