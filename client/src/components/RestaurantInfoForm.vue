<template>
  <form
    ref="form"
    class="form p-3 rounded shadow-sm"
    novalidate
  >
    <!--Show alert section-->
    <div
      v-if="warningMessage"
      class="alert p-1"
      role="alert"
    >
      <i class="fas fa-exclamation-circle" />  {{ warningMessage }}
    </div>
    <div class="form-row">
      <!--Name-->
      <div
        class="form-group col-md-6"
        :class="{invalid: $v.restaurant.name.$error}"
      >
        <label for="name">名稱</label>
        <input
          id="name"
          v-model.trim="restaurant.name"
          :disabled="isProcessing"
          type="text"
          class="form-control"
          name="name"
          autocomplete="organization"
          required
          @blur="$v.restaurant.name.$touch()"
        >
        <small
          v-if="$v.restaurant.name.$error"
          class="form-text"
        >請輸入 1-30 位餐廳名稱</small>
      </div>
      <!--Category-->
      <CustomSelect
        v-model="restaurant.CategoryId"
        class="col-md-6"
        :options="categories"
        :v="$v.restaurant.CategoryId"
        :target="'id'"
        :is-processing="isProcessing"
      >
        <template v-slot:label>
          類別
        </template>
        <template v-slot:option>
          餐廳類別
        </template>
        <template v-slot:invalid>
          請選擇一種餐廳類別
        </template>
      </CustomSelect>
    </div>
    <div class="form-row">
      <!--Opening time-->
      <div
        class="form-group col-md-6"
        :class="{invalid: $v.restaurant.openingHour.$error}"
      >
        <label for="opening-hour">開始營業時間</label>
        <input
          id="opening-hour"
          v-model.trim="restaurant.openingHour"
          type="time"
          disabled
          class="form-control"
          required
          @input="$v.restaurant.openingHour.$touch()"
        >
      </div>
      <!--Closing time-->
      <div
        class="form-group col-md-6"
        :class="{invalid: $v.restaurant.closingHour.$error}"
      >
        <label for="closing-hour">結束營業時間</label>
        <input
          id="closing-hour"
          v-model.trim="restaurant.closingHour"
          disabled
          type="time"
          class="form-control"
          required
          @input="$v.restaurant.closingHour.$touch()"
        >
        <small
          v-if="$v.restaurant.closingHour.$error"
          class="form-text"
        >結束營業時間需晚於開店時間</small>
      </div>
    </div>
    <!--Address-->
    <div
      class="form-group form-address-group"
      :class="{invalid: $v.restaurant.address.$error}"
    >
      <label for="address">地址</label>
      <input
        id="address"
        v-model.trim="restaurant.address"
        :disabled="isProcessing"
        type="text"
        class="form-control"
        placeholder="台北市大安區..."
        required
        @blur="$v.restaurant.address.$touch()"
      >
      <small
        v-if="$v.restaurant.address.$error"
        class="form-text"
      >請輸入地址</small>
      <small
        v-if="validationMsg.address"
        class="form-text"
      >{{ validationMsg.address }}</small>
    </div>
    <!--Phone number-->
    <div
      class="form-group"
      :class="{invalid: $v.restaurant.tel.$error}"
    >
      <label for="tel">電話</label>
      <input
        id="tel"
        v-model.trim="restaurant.tel"
        :disabled="isProcessing"
        type="tel"
        class="form-control"
        placeholder="02-2343-2344"
        required
        @blur="$v.restaurant.tel.$touch()"
      >
      <small
        v-if="!$v.restaurant.tel.required && $v.restaurant.tel.$dirty"
        class="form-text"
      >請輸入電話</small>
      <small
        v-if="!$v.restaurant.tel.telFormat && $v.restaurant.tel.required && $v.restaurant.tel.$dirty"
        class="form-text"
      >請輸入正確的電話格式: 0x-xxxx-xxxx</small>
    </div>
    <!--Description-->
    <div
      class="form-group"
      :class="{invalid: $v.restaurant.description.$error}"
    >
      <label for="description">餐廳介紹</label>
      <textarea
        id="description"
        v-model.trim="restaurant.description"
        :disabled="isProcessing"
        class="form-control"
        minlength="10"
        maxlength="300"
        rows="2"
        required
        @blur="$v.restaurant.description.$touch()"
      />
      <small
        v-if="$v.restaurant.description.$error"
        class="form-text"
      >請輸入餐廳簡介，長度介於 10-300 之間</small>
    </div>
    <!--Image upload-->
    <p class="mb-2">
      上傳餐廳照片
    </p>
    <div
      class="form-group"
      :class="{invalid: !$v.restaurant.image.hasImage}"
    >
      <small
        v-if="!$v.restaurant.image.hasImage"
        class="form-text mb-2"
      >請上傳一張照片&#8595;</small>
      <!--Invisible file upload button-->
      <input
        id="file"
        ref="image"
        type="file"
        class="file-input"
        accept=".png, .jpg, .jpeg"
        @change="handleFileChange($event, 'restaurant')"
        @input="$v.restaurant.image.$touch()"
      >
      <!--Preview image-->
      <div
        v-if="restaurant.image"
        class="file-image-wrapper"
        @click="restaurant.image = ''"
      >
        <img
          v-if="isNewFileUploaded"
          :src="restaurant.image"
          alt="新上傳的餐廳照片"
          class="file-image"
        >
        <ik-image
          v-else
          :path="restaurant.image"
          :lqip="{ active: true }"
          loading="lazy"
          :alt="restaurant.name + '餐廳照片'"
          class="file-image"
        />
        <i class="fa-regular fa-rectangle-xmark" />
      </div>
      <!--Visible file upload button-->
      <label
        v-else
        for="file"
        class="file-label"
      >
        <i class="fas fa-plus" />
      </label>
    </div>
    <div class="btn-container mt-3">
      <ProcessButton
        class="btn"
        :is-processing="isProcessing"
        :v="$v"
        :color="$route.name === 'admin-restaurant-edit' ? 'tertiary' : 'primary'"
        @after-click="getLocation('restaurant')"
      >
        <template #initial>
          更新
        </template>
      </ProcessButton>
      <ProcessButton
        v-if="$route.name ==='admin-restaurant-edit'"
        class="btn"
        :is-processing="isProcessing"
        :v="$v"
        @after-click="$emit('after-delete')"
      >
        <template #initial>
          刪除
        </template>
      </ProcessButton>
    </div>
  </form>
</template>

<script>
import ProcessButton from '../components/Button/ProcessButton'
import { getGeoMethods, handleFileChangeMethod } from '../utils/mixins'
import { required, minLength, maxLength } from 'vuelidate/lib/validators'
import CustomSelect from '../components/CustomSelect'
import moment from 'moment-timezone'

export default {
  components: {
    CustomSelect,
    ProcessButton
  },
  mixins: [getGeoMethods, handleFileChangeMethod],
  props: {
    initialRestaurant: {
      type: Object,
      default: () => ({
        name: '',
        CategoryId: '',
        openingHour: '',
        closingHour: '',
        location: '',
        address: '',
        tel: '',
        description: '',
        image: '',
        lng: '',
        lat: ''
      })
    },
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
      restaurant: {
        name: '',
        CategoryId: '',
        openingHour: '11:00',
        closingHour: '14:00',
        location: '',
        address: '',
        tel: '',
        description: '',
        image: '',
        lng: '',
        lat: ''
      },
      warningMessage: '',
      apiKey: process.env.VUE_APP_GOOGLE,
      validationMsg: {
        address: ''
      },
      formData: {},
      isProcessing: false,
      isNewFileUploaded: false
    }
  },
  validations: {
    restaurant: {
      address: {
        required
      },
      CategoryId: {
        required
      },
      name: {
        required,
        minLength: minLength(1),
        maxLength: maxLength(30)
      },
      image: {
        hasImage: value => {
          if (!value) return false
          return true
        }
      },
      openingHour: {
        required
      },
      closingHour: {
        required,
        isLater: (value, vm) => {
          const closingHour = moment(value, 'HH:mm')
          const openingHour = moment(vm.openingHour, 'HH:mm')
          return closingHour.isAfter(openingHour)
        }
      },
      tel: {
        required,
        telFormat: value => /^0[1-8]-[0-9]{4}-[0-9]{4}$/.test(value)
      },
      description: {
        required,
        minLength: minLength(10),
        maxLength: maxLength(300)
      }
    }
  },
  watch: {
    initialRestaurant (restaurant) {
      this.restaurant = {
        ...this.restaurant,
        ...restaurant
      }
      this.isNewFileUploaded = false
    },
    initialProcessing (isProcessing) {
      this.isProcessing = isProcessing
    }
  },
  created () {
    this.restaurant = {
      ...this.restaurant,
      ...this.initialRestaurant
    }
    this.isProcessing = this.initialProcessing
  },
  methods: {
    afterReceiveGeo () {
      // prepare formData
      const formData = new FormData(this.$refs.form)

      for (const data in this.restaurant) {
        formData.append(data, this.restaurant[data])
      }

      formData.append('opening_hour', this.restaurant.openingHour)
      formData.append('closing_hour', this.restaurant.closingHour)
      formData.delete('geometry')

      if (this.$refs.image.files[0]) {
        formData.append('image', this.$refs.image.files[0])
      } else {
        formData.delete('image')
      }

      // notify parent view
      this.$emit('after-submit', formData)
    }
  }
}
</script>

<style lang="scss" scoped>
.form {
  @include fileUpload;
  @include inputValidation;
  @include formControl;
  color: color(secondary);
  background-color: color(quaternary);
}

.btn-container { @include flexPosition(center, center, row); }

.alert {
  color: color(quaternary);
  background-color: color(tertiary);
}
</style>
