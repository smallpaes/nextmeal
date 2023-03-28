const axios = require('axios').default;
const DISTRICT_DATA = require('../location/district.json')
const GEOCODING_API_KEY = process.env.GOOGLE_GEOCODING_API_KEY
const BASE_URL = 'https://maps.googleapis.com'
const COUNTRY_CODE = 'TW'
const LANGUAGE = 'zh-TW'

const locationController = {
  validateLocation: async (req, res) => {
    const { address } = req.query
    const activeDistricts = DISTRICT_DATA.map(district => district.chinese_name)
    if (!address) return res.json({ status: 'error', message: 'Address is required' })
    try {
      const url = new URL('/maps/api/geocode/json', BASE_URL)
      url.search = new URLSearchParams({
        address,
        language: LANGUAGE,
        components: `country:${COUNTRY_CODE}`,
        key: GEOCODING_API_KEY
      })
      
      const { data } = await axios.get(url)
      let addressComponents = []
      let districts = []

      // check if it's not zero result
      if (data.results.length) {
        // Retrieve districts from data
        addressComponents = data.results[0].address_components
        districts = addressComponents.filter(item => activeDistricts.includes(item.long_name))
      }

      // validate address
      if (data.status !== 'OK' || !districts.length || addressComponents.length <= 4) {
        return res.json({ status: 'error', message: '請確認為台北市信義、松山、大安、中山區的完整地址' })
      }

      return res.status(200).json({
        status: 'success',
        location: {
          lat: data.results[0].geometry.location.lat,
          lng: data.results[0].geometry.location.lng,
          dist: districts[0].long_name,
          address: data.results[0].formatted_address
        },
        message: '地址驗證成功'
      })
    } catch(e) {
      return res.json({ status: 'error', message: '目前無法驗證地址' })
    }
  },
}

module.exports = locationController