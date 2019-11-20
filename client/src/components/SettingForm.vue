<template>
  <form
    class="form-content needs-validation rounded"
    novalidate
    @submit.prevent.stop="getLocation('user')"
  >
    <transition
      appear
      mode="out-in"
      name="fade"
    >
      <!--Input data-->
      <div
        v-if="!showMap"
        key="basic"
        class="form-content-top rounded-top"
      >
        <div class="form-content-top-header mb-4">
          <h3>
            設定
          </h3>
          <h5>
            偏好設定以獲得更好的體驗
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
        <div
          class="form-group form-address-group"
          :class="{invalid: $v.user.address.$error}"
        >
          <input
            id="address"
            v-model="user.address"
            type="text"
            class="form-control"
            placeholder="預設所在地址"
            autofocus
            required
            @blur="$v.user.address.$touch()"
          >
          <small
            v-if="$v.user.address.$error"
            class="form-text"
          >地址必填</small>
          <small
            v-if="validationMsg.address"
            class="form-text"
          >{{ validationMsg.address }}</small>
        </div>
        <!--Prefer-->
        <CustomSelect
          v-model="user.prefer"
          class="p-0"
          :options="categories"
          :v="$v.user.prefer"
          :target="'name'"
        >
          <template v-slot:option>
            偏好餐廳類別
          </template>
          <template v-slot:invalid>
            請選擇一種偏好餐廳類別
          </template>
        </CustomSelect>
        <!--dob-->
        <CustomDatePicker
          v-model="user.dob"
          :has-label="false"
          :v="$v.user.dob"
          :placeholder="'選擇出生年月日'"
        />
        <div class="btn-container text-center">
          <button
            class="btn btn-submit mt-1"
            type="submit"
            :disabled="isProcessing || $v.$invalid"
          >
            送出
          </button>
        </div>
      </div>

      <!--Map sidplay section-->
      <div
        v-if="showMap"
        key="map"
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
            :disabled="isProcessing || $v.$invalid"
            @click.prevent.stop="showMap = false"
          >
            修改地址
          </button>
        </div>
      </div>
    </transition>
  </form>
</template>

<script>
import { dateTransformFilter, getGeoMethods } from '../utils/mixins'
import CustomDatePicker from '../components/CustomDatePicker'
import GMap from '../components/GMap'
import CustomSelect from '../components/CustomSelect'
import { required } from 'vuelidate/lib/validators'

export default {
  components: {
    GMap,
    CustomDatePicker,
    CustomSelect
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
        address: ''
      },
      showMap: false,
      isProcessing: this.initialProcessing
    }
  },
  validations: {
    user: {
      address: {
        required
      },
      prefer: {
        required
      },
      dob: {
        required
      }
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
@include fadeAnimation;

/deep/ .google-map {
  width: 100%;
  height: 400px;
}

.form { @include inputValidation; }
.alert { color: color(primary); }

.btn {
  @include solidButton(200, 1);

  &:not(.btn-submit) {
    min-width: 100px;
  }

  @include response(sm) { min-width: 150px; }
  @include response(md) { min-width: 170px; }

  &-update {
    background-color: color(tertiary);
    &:hover { background-color: darken(color(tertiary), 20%); }
  }
}
</style>
