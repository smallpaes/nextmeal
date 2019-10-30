<template>
  <form
    class="form-content needs-validation rounded"
    novalidate
    @submit.prevent.stop="getLocation('user')"
  >
    <!--Input data-->
    <div
      v-if="!showMap"
      class="form-content-top rounded-top"
    >
      <div class="form-content-top-header mb-4">
        <h3>
          設定
        </h3>
        <h5>
          完成偏好設定以獲得更好體驗
        </h5>
      </div>
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
          v-model="user.address"
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
          v-model="user.prefer"
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
      <CustomDatePicker
        v-model="user"
        :has-label="false"
      />
      <div class="btn-container text-center">
        <button
          class="btn mt-1"
          type="submit"
          :disabled="isProcessing"
        >
          送出
        </button>
      </div>
    </div>

    <!--Map sidplay section-->
    <div
      v-if="showMap"
      class="form-content-top rounded-top"
    >
      <GMap
        :center="{lat: user.lat, lng: user.lng}"
        :street-view-control="false"
        :locations="[user]"
        :map-type-control="false"
        :fullscreen-control="true"
        :zoom-control="true"
        :zoom="18"
        class="shadow-sm rounded-sm"
      />
      <div class="form-buttons d-flex justify-content-center mt-3">
        <button
          class="btn btn-update"
          :disabled="isProcessing"
          @click.stop.prevent="handleSubmit"
        >
          位置正確
        </button>
        <button
          class="btn ml-2"
          :disabled="isProcessing"
          @click.prevent.stop="showMap = false"
        >
          修改地址
        </button>
      </div>
    </div>
  </form>
</template>

<script>
import { dateTransformFilter, getGeoMethods } from '../utils/mixins'
import CustomDatePicker from '../components/CustomDatePicker'
import GMap from '../components/GMap'

export default {
  components: {
    GMap,
    CustomDatePicker
  },
  mixins: [dateTransformFilter, getGeoMethods],
  props: {
    categories: {
      type: Array,
      required: true
    },
    initialProcessing: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      user: {
        address: '',
        prefer: '',
        dob: '',
        name: '您的預設位置',
        lat: '',
        lng: '',
        location: ''
      },
      warningMessage: '',

      apiKey: process.env.VUE_APP_GOOGLE,
      validationMsg: {
        address: '請輸入地址'
      },
      showMap: false,
      isProcessing: this.initialProcessing
    }
  },
  watch: {
    initialProcessing (isProcessing) {
      this.isProcessing = isProcessing
    }
  },
  methods: {
    afterReceiveGeo () {
      this.showMap = true
      // update processing status
      this.isProcessing = false
    },
    handleSubmit () {
      // update processing status
      this.isProcessing = true
      // Send data to parents
      this.$emit('after-setting', {
        address: this.user.address,
        prefer: this.user.prefer,
        dob: this.user.dob,
        lat: this.user.lat,
        lng: this.user.lng,
        location: this.user.location
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
    min-width: 100px;

    &-update {
      background-color: color(tertiary);

      &:hover {
        background-color: darken(color(tertiary), 20%);
      }
    }

    @include response(sm) {
      min-width: 150px;
    }

    @include response(md) {
      min-width: 170px;
    }
}
</style>
