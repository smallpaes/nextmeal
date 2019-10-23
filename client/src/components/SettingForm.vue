<template>
  <form
    class="form-content needs-validation"
    novalidate
    @submit.prevent.stop="getLocation"
  >
    <!--Input data-->
    <div
      v-if="!showMap"
      class="form-content-top rounded-top"
    >
      <h3 class="pt-0 pb-3">
        偏好設定
      </h3>
      <!--Show alert section-->
      <div
        v-if="warningMessage"
        class="alert mb-0 pt-0"
        role="alert"
      >
        {{ warningMessage }}
      </div>
      <div class="form-group">
        <input
          id="address"
          v-model="address"
          type="text"
          class="form-control"
          placeholder="預設所在地址"
          autofocus
          required
        >
        <div class="invalid-feedback">
          {{ validationMsg.address }}
        </div>
      </div>
      <div class="form-group">
        <select
          v-model="prefer"
          class="form-control"
          required
        >
          <option value="">
            偏好餐廳類型
          </option>
          <option
            v-for="category in categories"
            :key="category"
            :value="category"
          >
            {{ category }}
          </option>
        </select>
        <div class="invalid-feedback">
          請選擇一種偏好餐廳
        </div>
      </div>
      <div class="form-group">
        <input
          id="dob"
          v-model="dob"
          type="date"
          class="form-control pr-0"
          :max="Date.now() | dateTransform"
          required
        >
        <small
          id="dob-reminder"
          class="form-text text-left"
        >請選擇出生日</small>
      </div>
      <button
        class="btn mt-1"
        type="submit"
      >
        送出
      </button>
    </div>

    <!--Map sidplay section-->
    <div
      v-if="showMap"
      class="form-content-top rounded-top"
    >
      <GMap
        :center="{lat: userLocation.lat, lng: userLocation.lng}"
        :street-view-control="false"
        :locations="[userLocation]"
        :map-type-control="false"
        :fullscreen-control="true"
        :zoom-control="true"
        :zoom="18"
        class="shadow-sm rounded-sm"
      />
      <div class="form-buttons d-flex mt-3">
        <button
          class="btn"
          @click.stop.prevent="handleSubmit"
        >
          位置正確
        </button>
        <button
          class="btn btn-outline ml-2"
          @click.prevent.stop="showMap = false"
        >
          修改地址
        </button>
      </div>
    </div>
  </form>
</template>

<script>
import { dateTransformFilter } from '../utils/mixins'
import axios from 'axios'
import GMap from '../components/GMap'

export default {
  components: {
    GMap
  },
  mixins: [dateTransformFilter],
  props: {
    categories: {
      type: Array,
      required: true
    }
  },
  data () {
    return {
      warningMessage: '',
      address: '',
      prefer: '',
      dob: '',
      apiKey: process.env.VUE_APP_GOOGLE,
      validationMsg: {
        address: '請輸入地址'
      },
      showMap: false,
      userLocation: {
        name: '您的位置',
        lat: '',
        lng: '',
        location: ''
      }
    }
  },
  methods: {
    async getLocation (e) {
      // Get geocoding location
      try {
        const BASE_URL = 'https://maps.googleapis.com/maps/api/geocode'
        const language = 'zh-TW'
        const postalCode = 'postal_code:110|postal_code:106|postal_code:105|postal_code:104'
        const addressInput = document.getElementById('address')
        const { data } = await axios.get(`${BASE_URL}/json?address=${this.address}&language=${language}&components=country:TW|${postalCode}&key=${this.apiKey}`)

        // validate address
        if (data.status !== 'OK') {
          addressInput.setCustomValidity('invalid')
          this.validationMsg.address = '請確認地址位於信義、松山、大安、中山區'
        } else {
          addressInput.setCustomValidity('')
          this.validationMsg.address = '請輸入地址'
        }

        // Validate form data
        if (e.target.checkValidity() === false) {
          return e.target.classList.add('was-validated')
        }

        // update locaion data
        this.userLocation.lat = data.results[0].geometry.location.lat
        this.userLocation.lng = data.results[0].geometry.location.lng
        this.userLocation.location = data.results[0].address_components[2].long_name
        this.showMap = true
      } catch (error) {
        this.warningMessage = 'Oops！設定時有些狀況，請稍後再試！'
      }
    },
    handleSubmit () {
      // Send data to parents
      this.$emit('after-setting', {
        address: this.address,
        prefer: this.prefer,
        dob: this.dob,
        lat: this.userLocation.lat,
        lng: this.userLocation.lng,
        location: this.userLocation.location
      })
    }
  }
}
</script>

<style lang="scss" scoped>
/deep/ .google-map {
  width: 100%;
  height: 400px;
}

.alert {
    color: color(primary);
}

.btn {
    @include solidButton(200, 1);
}
</style>
